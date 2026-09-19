---
title: "Your first row is not your schema"
description: "Importing a table produced a dataset with no columns. The schema was being inferred from a sampled row of data, while the authoritative column metadata sat unused two functions away."
section: "debugging"
date: "2026-09-19"
tags: ["Go", "Data pipelines", "SQL", "API design"]
---

Import a table into the platform with the "Schema Only" option and you get a
dataset definition: the column names and their types, no rows. It worked for
every table anyone had tried.

Then someone pointed it at a view and got a dataset with **no columns at all**.
A warning, an empty definition, and an onboarding blocked behind it.

The difference between that view and every other one turned out to be a single
nullable integer column that happened to contain a `NULL`.

## The schema came from the data

The import ran a query against the source, collected the rows into
`[]map[string]interface{}`, and then did this:

```go
scheme := inferTypes(resRows[0])   // the first sampled row
```

`inferTypes` walks the map: the key becomes the column name, and the type is
derived from the **value**, by inspecting what that particular cell happens to
hold.

Which means the schema is not read. It is *guessed*, from one row, chosen for no
better reason than being first.

That works for as long as every cell in that row carries an unambiguous example
of its column's type. The instant one does not, the guess has nothing to work
from — and a `NULL` is precisely a cell with nothing to work from.

## The part that made it worse

Inference from a missing value could have failed loudly. Instead it succeeded,
with the wrong answer.

The SQL scanner underneath had its own convention: when a column came back
`NULL`, it wrote an **empty string** into the map.

```go
row[col] = ""   // a NULL integer, now indistinguishable from a text column
```

So by the time `inferTypes` looked at that cell, there was no `NULL` left to
detect. There was a `""`, which is a perfectly good value — of type string. The
integer column was confidently typed as text, the definition came out
inconsistent, and the import fell over.

Two separate decisions, each defensible alone, that compose into a silent wrong
answer:

1. Derive the type from a value rather than from the column.
2. Represent "no value" as a value of a different type.

The first makes the system dependent on which row it sampled. The second
destroys the only signal that would have told it to be careful.

And it did not stop at the schema. The same `""` substitution travelled into the
data rows themselves, so loading actual data into numeric columns broke too —
same root cause, a completely different-looking bug, reported separately by
someone else.

## The answer was already in the room

Here is the part I keep thinking about. The code was already asking the database
for the real schema. Every Go `database/sql` scanner does:

```go
cols, _     := rows.Columns()       // the actual column names
colTypes, _ := rows.ColumnTypes()   // the actual column types
```

Both were being fetched. `ColumnTypes()` was even being used —
`colTypes[k].DatabaseTypeName()` was read on every scan to decide how to parse
each value.

The authoritative names and types were in hand, one function away, already
loaded, already used for something else. And then the schema was built by
guessing at a row instead.

Nobody chose that. It is what happens when two features grow at different times:
the scanner learned about column metadata because it needed it to parse, and the
schema import was written against the shape it had handy, which was the decoded
rows. The pipeline had the right answer and the wrong plumbing.

## The bug it also had, that nobody had reported yet

Once you see that the schema comes from `resRows[0]`, a second failure falls out
immediately: **what happens when the query returns no rows?**

There is no `resRows[0]`. A source table that is legitimately empty produces a
dataset with zero columns — not an error, just a definition of nothing, created
successfully.

I found a commented-out block right around there, guarding for exactly this.
Someone had seen it, patched around it, and left the shape of the problem in the
file like a fossil.

## The fix

Build the schema from `cols` and `colTypes`, mapping each SQL type to the
platform's own type system, and delete the inference entirely. That is robust to
a `NULL` in the sample, robust to *which* row was sampled, and robust to there
being no rows at all — because it no longer depends on data in any way.

Then separately: map `NULL` to a typed zero or a real `null` in the decoded
rows, never to `""`. An absent value has to stay distinguishable from a present
empty one, all the way down. That fixes the data-loading half.

## The epilogue nobody writes down

While this was being diagnosed, two different people had already worked around
it — independently, without coordinating — by editing the **source data**. One
replaced the `NULL`s with `0`. The other set them to `-1`.

Both worked. Both made the bug disappear from their environment. And together
they meant that the broken code path now had no input that triggered it
anywhere, which is a genuinely dangerous state to be in: the system looks
healthy, the ticket looks stale, and when the real fix ships there is no way to
tell whether it worked, because the data that used to break it no longer exists.

So those edits went into the ticket as explicit, owned, *revert-when-fixed*
items. A data edit made to unblock someone is a debt with no ledger unless you
write it down. It changes the input instead of the code, which means it is
invisible to every diff, every test and every deploy, and the only record that
it happened is whatever a human chose to note.

## What I take from it

**Sampling is inference; metadata is fact.** When a system can ask for the
authoritative answer, deriving it from an example is a downgrade — and the
failure mode is not "no answer", it is "a confident wrong answer that depends on
which example you drew".

**The absence of a value is not a value.** Every place that flattens `NULL` into
`""`, `0` or `-1` destroys information that something downstream will need.
`NULL` means "unknown"; `""` means "known, and empty". If they arrive at the same
place looking identical, the code that needed to tell them apart has already
lost.

**When you find a bug caused by sampling row zero, ask what happens at row
count zero.** They are the same bug wearing different clothes, and you will
almost always find the second one has been there the whole time, unreported.
