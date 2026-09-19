---
title: "Your error handler is deleting the evidence"
description: "A production list went empty with no deploy behind it. The database had sent a precise diagnostic; one line of error handling threw it away, and the team spent the morning ranking suspects that were all wrong."
date: "2026-09-19"
tags: ["Debugging", "Observability", "Couchbase", "SQL"]
---

An admin console has a tab that lists the users who can access a planning model.
One morning, in a customer's production environment, it came up empty. Highest
severity: it blocked that customer's people from getting into the tool.

Nothing had been deployed. The component rendering that list had not been
touched since 2022.

Here is what the API logs had to say about it:

```
parsing failure
```

That is the whole message. Two words, no statement, no position, no detail. We
spent the first part of that morning building a ranked list of suspects from
those two words, and every single one of them was wrong.

## Guessing, expensively

With nothing but "parsing failure", the theories came from whatever had changed
recently in the layers we owned. An automatic index hint the query builder had
started injecting. A new pagination mode. A `LIMIT`/`OFFSET` interaction.

All plausible. All backend. All wrong.

Notice what the reasoning was doing: in the absence of evidence, it substituted
*recency*. What changed lately? That is an excellent heuristic and it is the
correct thing to do — when you have no error message. The cost is that it
produces theories with real confidence behind them, and confident wrong theories
are expensive. People get assigned to them.

The frontend was ruled out early, and for a perfectly sound reason: that
component had not changed in three years. That conclusion was even *correct*, as
far as it went — the frontend was not what changed. It was still where the fix
had to go.

## The message existed the whole time

The database driver had not been vague. It had returned this:

```
code 3000, "syntax error - line 1, column 70, near '...d as email, `value`.',
at: roles (reserved word)"
```

Plus the entire statement that produced it. A line number, a column, the exact
token, and the reason. Everything needed to end the investigation in under a
minute.

It never reached the API, because of a line like this in the gateway service's
error path:

```go
return strings.Split(err.Error(), "|")[0]
```

The driver formats its errors as several pipe-separated sections: a short
summary, then the statement, then the engine's detail. Taking `[0]` keeps the
summary — "parsing failure" — and discards the rest. Permanently. By the time
the error was serialized into a 500 and relayed upstream, the diagnostic no
longer existed anywhere in the request path.

We only got it because a different function, deeper in, happened to log the
full error before that truncation ran. Pulling the logs from that pod directly,
and reproducing the request, gave us the statement. That was luck dressed up as
process.

## What had actually broken

`roles` became a **reserved word** in Couchbase 8.x. The query used it
unquoted — both as a field accessor and as an alias:

```sql
SELECT nodeitem_id, title, `value`.user_id as email, `value`.roles as roles
FROM ...
```

The customer's database had been upgraded. The query had not changed. The
*language it was written in* changed underneath it, and a statement that had
been valid for three years became a syntax error.

Both halves of a union were hitting it, so the list came back completely empty
rather than partially — which, perversely, made it look more like an
authorization problem than a syntax one.

The fix is backticks:

```sql
SELECT nodeitem_id, title, `value`.user_id as email, `value`.`roles` as `roles`
FROM ...
```

Verified against the real engine, in both directions, before shipping anything:
`SELECT 1 as roles` returns error 3000; `SELECT 1 as \`roles\`` succeeds. Ninety
seconds of work that turns "I think this is the cause" into "this is the cause".

## Two fixes, and only one of them is the important one

Backticking that identifier fixed the incident. It fixed exactly one query.

**The class of bug is that the set of reserved words is not fixed.** It grows
with database versions. Every unquoted identifier in every query in the system
is a bet that no future version of the engine will claim that word — and you
lose that bet silently, at upgrade time, in whichever environment upgrades
first. Somewhere there are more queries with `status`, `type`, `value`, `scope`
in them, already written, already deployed, waiting for a version bump.

So the real fix lives in the query builder: **quote identifiers and aliases
when generating SQL, always, by default.** Not because a word is reserved today,
but because quoting is the only thing that stays correct when the reserved list
changes. It costs nothing at runtime and it removes the entire category.

And the second fix, the one that would have saved the morning:

**Never let an error path discard a diagnostic.** `strings.Split(err.Error(),
"|")[0]` was written to make error messages tidier for whoever read them next.
It is a reasonable-looking line of code. It also meant that when the system
failed in a way nobody anticipated, the one artifact that explained the failure
had already been deleted before any human saw it.

Errors should be wrapped, not truncated. If a layer needs a short summary for a
UI, it can compute one *and* keep the full text underneath — `%w`, a structured
field, a `details` attribute, anything. The moment you return a `string` built
by cutting up another error, the original is gone and no amount of log level
will bring it back.

## The part that generalizes

Two things I carry out of this one.

**Your dependencies' grammar is a dependency.** We version-pin libraries and
review their changelogs, and then write SQL as a string against an engine whose
parser has its own release notes. A database upgrade is a language upgrade.
Working, untouched, well-tested code can become invalid because something else
moved.

**The quality of your error messages sets the floor on your debugging speed.**
Not the ceiling — the floor. No amount of experience or dashboards recovers
information the process already threw away. Before the next incident, it is
worth grepping your own codebase for the places where an error becomes a
shortened string, because that is where your next outage will hide its cause.
