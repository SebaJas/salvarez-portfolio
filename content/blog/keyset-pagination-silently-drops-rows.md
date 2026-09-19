---
title: "Keyset pagination drops rows when the sort field is NULL"
description: "A pagination bug that returns an empty page with hasMore false and no error, so the caller believes it received everything. The cause is three-valued logic, and the fix is a null-aware predicate."
date: "2026-09-18"
tags: ["Pagination", "SQL", "N1QL", "Data integrity"]
---

Page one comes back with ten rows and `hasMore: true`. You send the cursor back.
Page two comes back empty, `hasMore: false`, HTTP 200, no error anywhere.

The caller does the only reasonable thing: it stops, and treats the ten rows it
has as the complete result. There were ninety more.

This is the worst shape a bug can take. It does not crash, it does not log, and
it does not fail a health check — it quietly answers a different question than
the one you asked, and it hides the evidence. I hit it while rolling out keyset
pagination across a set of services, and the cause turned out to be something
more general than pagination: **SQL's three-valued logic, meeting a column that
is allowed to be empty.**

## How keyset pagination works

Offset pagination says "skip 90 rows, give me 10". It gets slower as the offset
grows, and it skips or repeats rows when the underlying data changes between
requests.

Keyset pagination — sometimes called cursor or seek pagination — says "give me
the rows *after* the last one I saw". You remember the sort field's value from
the final row of the page and ask for everything greater than it:

```sql
SELECT * FROM facts
WHERE created_at > '2026-08-01T10:15:00Z'
ORDER BY created_at
LIMIT 10
```

Because the sort field is rarely unique, you need a tiebreaker — a second,
guaranteed-unique field — or rows that share a value can be skipped or repeated
at the page boundary. So the cursor holds two values, `[sortValue, id]`, and the
predicate becomes:

```sql
WHERE (F > :fLast) OR (F = :fLast AND id > :idLast)
```

That predicate is correct, fast, and index-friendly. It also has a hole in it.

## The hole

Look at what happens when `:fLast` is `NULL`.

```sql
WHERE (F > NULL) OR (F = NULL AND id > :idLast)
```

In SQL's three-valued logic, comparing anything to `NULL` does not produce
`FALSE` — it produces `NULL`, the third value, meaning "unknown". And a `WHERE`
clause keeps only the rows for which the predicate evaluates to **`TRUE`**.
Unknown is not true. So both branches evaluate to unknown, every row is
discarded, and the query returns nothing at all.

Not an error. Not a partial result. An empty set, which the pagination layer
faithfully reports as `hasMore: false`.

When does the cursor hold a `NULL`? Whenever the last row of a page happens to
be a document where the sort field is empty. If you sort by a column that is
optional — `created_by`, `assigned_to`, `closed_at`, any nullable column — then
a page boundary landing on a row without that value silently truncates the
result set. In the dataset where I found this, 4,099 of 7,463 documents had no
`created_by`. The odds of hitting the bug were not small. They were close to
certain.

This is the version that matters, because nullable columns are everywhere and
nobody thinks of them as an edge case.

## The second trigger: a computed alias

There is a rarer cousin. Sort by a field that does not exist in the table but is
computed in the `SELECT` list:

```sql
SELECT TOSTRING(meta().cas) AS cas, * FROM facts ORDER BY cas
```

Page two builds `WHERE cas > 'x'`. But `cas` is a projection alias, and the
engine evaluates `WHERE` **before** it evaluates the select list. At the moment
the predicate runs, `cas` is not a column, not a value, not even null — it is
missing. Comparing against it yields unknown again, and again every row is
discarded.

Same empty page, same silent truncation, different reason: the first trigger is
a field that exists with an empty *value*, the second is a *field* that does not
exist yet.

## Fixing the null case

The instinct is to write `COALESCE(F, '')` and move on. Resist it: you have
changed the sort order, you are comparing a sentinel against real data, and you
will get duplicates at the boundary.

The real fix uses the tiebreaker that is already in the cursor. Nulls sort
first in ascending order, so when the cursor's sort value is null, everything
you still owe the caller is either a real value (which sorts after all the
nulls) or another null with a higher id:

```sql
WHERE (F IS VALUED) OR (F IS NOT VALUED AND id > :idLast)
```

`IS VALUED` means "has a real, non-null value"; `IS NOT VALUED` covers both null
and missing. The comparison against the null value is gone. Nothing is dropped.

Walk it through. Sorting by `created_by` ascending, page size 2, over five
documents: `A(null)`, `B(null)`, `C(null)`, `D(alice)`, `E(bob)`. Page one
returns `[A, B]` and the cursor is `[null, B]`. The broken predicate asks for
`created_by > null` and returns nothing, losing C, D and E. The null-aware
predicate asks for everything with a real value — D and E — plus the nulls whose
id is greater than B's — C. Page two is `[C, D]`. Nothing lost, nothing
duplicated.

Descending order needs its own handling, because there the nulls sort *last*.
Which surfaces a third bug in the same family: if you sort descending on a
sparse column and the page boundary lands on the **last non-null value**, the
cursor is not null, so none of the above triggers — and `(F < :v)` still drops
every trailing null, because null is not less than anything. The descending
predicate has to explicitly include them:

```sql
WHERE (F < :v OR F IS NOT VALUED)
```

## Fixing the alias case

Null-awareness does not help here, because the alias fails whether or not it has
a value. The fix is to compare against the **expression the alias stands for**,
not the alias name:

```sql
WHERE TOSTRING(meta().cas) > 'x'   -- not: WHERE cas > 'x'
```

The expression is evaluable in a `WHERE` clause even though the alias is not.
The `ORDER BY` keeps using the alias, where it is perfectly valid. This means
the query builder has to parse the select list, map each alias to its
expression, and substitute before building the predicate — respecting nested
parentheses, so that `TOSTRING(FOO(a, b)) AS x` does not get split at the wrong
comma.

## What I would take from this

**Any predicate built from data can inherit a null from that data.** The
pagination builder was correct for every value it was designed for and wrong for
the absence of one. Comparison operators are total functions on values and
partial functions on the absence of values, and three-valued logic resolves that
gap by discarding rows rather than complaining.

**Silent wrong answers deserve louder tests than crashes do.** A crash tells you
where it happened. This returned HTTP 200 with a well-formed body. The
regression test that actually protects against it is not a unit test of the
predicate — it is an end-to-end test that paginates a real, *sparse* dataset to
exhaustion and asserts that the number of rows returned equals the number of
rows in the table, with zero duplicates and zero skips. If your fixtures are
fully populated, they will pass against the broken code.

**Look for the duplicate implementation.** The same query builder had been
copied into a second service with a different parameter-binding style. Fixing
one and shipping it would have left the other quietly losing rows.
