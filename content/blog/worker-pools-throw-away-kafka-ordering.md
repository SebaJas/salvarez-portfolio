---
title: "Your worker pool just threw away Kafka's ordering guarantee"
description: "Kafka orders messages within a partition. The moment you fan them out to a pool of goroutines, that ordering is gone — and the fix is not a mutex."
section: "debugging"
date: "2026-09-19"
tags: ["Go", "Kafka", "Concurrency", "Distributed systems"]
---

A camera publishes frame metadata to Kafka. Frame 1 crosses a threshold and
opens an event. Frame 2, a moment later, closes it. The consumer reads both,
hands them to a pool of goroutines for throughput, and then — occasionally, under
load, never on your laptop — frame 2 gets processed first and fails, because it
is trying to close an event that does not exist yet.

The tempting diagnosis is "Kafka delivered them out of order". Kafka did not.
Kafka is keeping its promise; the promise was broken one layer down, by code I
wrote, the instant I optimized for throughput.

## Where the ordering actually goes

Kafka's ordering guarantee is narrow and precise: **messages within a single
partition are delivered in the order they were produced**. Not across
partitions, not across topics. Within one partition, in order.

If you key your messages by camera, every frame from `cam-123` lands in the same
partition, and a consumer reading that partition sees them in order. So far so
good.

Then you need throughput. A single goroutine calling your handler synchronously
gets you a few hundred messages a second and falls behind. So you do the obvious
thing:

```go
for msg := range claim.Messages() {
    go handle(msg)   // the bug
}
```

Or the slightly less obvious version, a pool of N workers all reading from one
shared channel:

```go
jobs := make(chan []byte, queueSize)

for i := 0; i < workerCount; i++ {
    go func() {
        for msg := range jobs {
            handle(msg)
        }
    }()
}
```

Both are correct for throughput and both destroy ordering. In the second one,
`jobs` is a single channel and N workers race to receive from it. Frame 1 and
frame 2 go to whichever workers happen to be free, and from that point on their
relative order is decided by the Go scheduler, by how long each handler blocks
on Redis, and by luck.

The partition kept the messages in order right up to the channel. The fan-out
is where the order died.

## Why a mutex does not fix it

The first instinct is to reach for a lock — a mutex per camera, so two frames
from the same camera cannot be processed at the same time.

That does prevent the data race. It does **not** fix the bug.

A mutex gives you mutual exclusion, not ordering. If frames 1 and 2 are sitting
in two different workers, the lock decides only that they will not run
*simultaneously* — whichever worker grabs it first goes first, and that is still
a coin flip. You have converted a race condition into a *sequential execution in
the wrong order*, which is harder to debug because it no longer looks like a
concurrency bug.

Idempotency and retries do not fix it either. They make the failure survivable:
frame 2 fails, goes back on the queue, and maybe by the time it is retried frame
1 has landed. That is not ordering, that is hoping, and it costs a round trip
and a DLQ entry every time.

Ordering has to come from **where the work is routed**, before any of it starts.

## Sticky routing: one channel per worker

The fix is to stop sharing one channel. Give every worker its own buffered
channel, and choose the channel deterministically from the message's partition
key:

```go
// One buffered channel per worker, instead of one shared by all of them.
workerChans := make([]chan []byte, workerCount)

for i := 0; i < workerCount; i++ {
    ch := make(chan []byte, jobQueueSize)
    workerChans[i] = ch

    wg.Add(1)
    go worker(ctx, i, ch, &wg)   // each worker drains only its own channel
}
```

```go
// Same key -> same worker, every time.
func partitionKeyToWorker(key string, workerCount int) int {
    h := fnv.New32a()
    h.Write([]byte(key))
    return int(h.Sum32() % uint32(workerCount))
}
```

The dispatcher builds the key from whatever defines a serial stream in your
domain — for a camera pipeline, something like `site:zone:camera` — hashes it,
and pushes the message onto that worker's channel:

```go
idx := partitionKeyToWorker(key, workerCount)
workerChans[idx] <- msg
```

Now every frame from a given camera goes to exactly one worker, and that worker
drains its channel in FIFO order. Ordering is not enforced by a lock or checked
by a retry — it is a property of the structure. Two frames from the same camera
*cannot* be processed concurrently or out of order, because there is only one
goroutine that will ever touch them and it handles them one at a time.

Meanwhile frames from different cameras hash to different workers and run fully
in parallel. You keep the throughput. The shared mutable state in Redis stops
needing a lock, because it is no longer shared between workers.

FNV is a good choice here: it is fast, non-cryptographic, and has decent
distribution over short strings. You are not defending against an adversary
picking keys to collide; you just need cheap and well-spread.

## This is not consistent hashing

It gets called consistent hashing a lot — including in the comment above this
exact function, in my own codebase, for about a year. It is not. `hash(key) % N`
is **modulo hashing**, and the difference is worth knowing.

The confusion is built into the name. "Consistent" sounds like it means
*deterministic*: the same key consistently reaching the same worker. That is the
property we want here, so the label feels right.

But that cannot be what the term names, because `% N` is deterministic too. The
same key always lands on the same worker. If determinism were the criterion,
every hash-based routing scheme would qualify and the phrase would distinguish
nothing.

What "consistent" actually refers to, in the 1997 paper the term comes from, is
consistency **across changes to the set of nodes**. The hash keeps returning the
same answer even when nodes are added or removed. The difference is easy to
measure — go from 8 workers to 9:

- **Modulo:** `h % 8` and `h % 9` disagree for almost every key. About 89% of
  them move.
- **A ring:** only the keys that belong to the newly inserted node move. About
  11%.

That gap is the entire reason the ring exists. In a distributed cache every
remapped key is a cache miss; in a sharded datastore it is a data migration. At
that scale, 89% versus 11% is the difference between a working system and an
outage.

Inside a worker pool it buys you nothing. `workerCount` is read from config at
startup and never changes while the process runs, so there is no resize to
survive. And the state those workers own does not live in the workers — it lives
in Redis. A reshuffle on the next deploy costs exactly nothing, because no
worker is holding anything that a different worker could not pick up.

So the name for what this actually is: **sticky routing**, or partition
affinity. Reach for a real hash ring when the node count changes at runtime
*and* remapping is expensive. Neither is true inside a single process.

## What you inherit along with it

Sticky routing is the right call here, but it is not free, and the costs are
worth knowing before you ship it.

**Hot keys.** Work is distributed by key, not by load. One camera producing ten
times the traffic of the others means one worker at ten times the load while its
neighbours idle. A shared channel self-balances — whoever is free takes the next
message — and you have just given that up in exchange for ordering. If your key
space is badly skewed, you will see it as one saturated worker and a growing
lag on one partition.

**Per-worker backpressure.** Each channel is buffered. When a worker falls
behind and its buffer fills, the dispatcher blocks on that send — which stops it
reading from Kafka at all, including for the workers that are idle. That sounds
like a flaw and is mostly a feature: it is backpressure, and it keeps you from
accumulating unbounded in-memory work you have already acknowledged. Just size
the buffer deliberately and know that head-of-line blocking is the trade.

**Changing the worker count reshuffles everything.** Scale from 8 workers to 12
and almost every key moves to a different worker. Within one process that is
harmless — it happens at startup, when there is no in-flight state. It is only
dangerous if you ever persist something keyed by worker index. Do not.

## The rest of the pool

Three things that turned out to matter as much as the routing:

**Graceful shutdown that actually drains.** On SIGTERM, cancel the context so
the dispatcher stops reading from Kafka, then close each worker channel, then
`wg.Wait()` before returning from `main`. Skipping the wait means killing
handlers mid-write — and with at-least-once delivery those messages come back
later, partially applied.

**Panic isolation per worker.** One malformed message that panics an unprotected
worker takes down that goroutine and, if you did not recover, the process. Wrap
each worker's loop body in `defer`/`recover` so a bad message kills one message,
not the pool. Note it has to wrap the *loop body*, not the goroutine: a
`defer recover()` at the top of the goroutine function catches the panic and
then the worker exits anyway, silently, and its channel backs up forever. That
one took a while to find.

**`sync.Pool` for the hot decode path.** Every message allocates a struct to
decode into, and at thousands of messages a second that is real GC pressure.
Pooling those structs measurably reduced pause times. Reset the struct on
release — a pooled object with leftover fields is a data leak across messages.

## The general shape

The thing I keep coming back to is that the ordering guarantee was never lost in
the infrastructure. Kafka held up its end. The guarantee was discarded in my own
code, in a three-line change made for throughput, and nothing anywhere warned
that a property I depended on had evaporated.

Any time you fan work out to a pool, ask what invariant the sequential version
was quietly providing. If the answer is "ordering between related messages",
then routing — not locking, not retrying — is where it has to be restored.
