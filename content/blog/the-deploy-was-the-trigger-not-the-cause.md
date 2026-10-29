---
title: "The deploy was the trigger, not the cause"
description: "Apache refused to start on a slice of a server fleet with 'No space left on device'. The disks were fine: the kernel had run out of semaphore sets, leaked one unclean stop at a time for years, and a routine rollout only collected the bill."
section: "operations"
date: "2026-10-28"
draft: false
tags: ["Linux", "Apache", "systemd", "Incident response"]
---

One morning a customer reported a list of locations offline. On the edge servers
behind them, Apache was not running, and it would not start. A little over 2% of
the fleet, all at once, the morning after a deploy.

`systemctl status httpd` said `failed (Result: exit-code)` and nothing else. The
journal had only old, unrelated warnings. We lost the first stretch of the call
staring at `journalctl -xe` before someone opened Apache's own `error_log`:

```
[core:emerg] (28)No space left on device: AH00023: Couldn't create the proxy mutex
[proxy:crit] (28)No space left on device: AH02478: failed to create proxy mutex
AH00016: Configuration Failed
```

The disks had plenty of space. And the deploy from the night before was the
obvious suspect, so the obvious story was ready before anyone had read a line of
it.

The deploy did push those servers over. It did not break them. They had been
breaking, quietly, for years.

## "No space" is just an errno

Error 28 is `ENOSPC`. Most syscalls that return it are talking about a
filesystem, which is why the message reads "on device". But `semget()`, the call
that creates a System V semaphore set, returns the same code when the kernel's
table of semaphore sets is full.

That is what was happening. Apache on this platform's OS (CentOS 7, Apache
2.4.6) implements its internal mutexes with SysV semaphores by default; `httpd
-V` shows `-D APR_USE_SYSVSEM_SERIALIZE`. If it cannot create one at startup, it
refuses to start. A full table looks, from the outside, exactly like a full
disk.

The kernel's limit is the fourth number in `/proc/sys/kernel/sem`. On that
kernel the default is:

```
250   32000   32   128
```

128 sets, for the whole machine.

## Measuring the leak

I had no shell on the affected servers, so I built a lab: a CentOS 7.9 container
with the same Apache package and the platform's real Apache config, run with
`--ipc=private` so the semaphore table was its own. Then I counted the sets owned
by `apache` after each thing I did to it.

| What was done to Apache       | `apache` sets afterwards |
| ----------------------------- | ------------------------ |
| start                         | 6                        |
| 5 graceful restarts           | 6                        |
| 5 full restarts               | 6                        |
| 3 stop/start cycles           | 6                        |
| 1 SIGKILL, then start         | 12                       |
| 2 SIGKILLs, then start        | 18                       |

Every start takes 6 sets. Every clean stop gives them back. Only a parent process
that dies without the chance to clean up leaves them behind, and once they are
left behind nothing ever reclaims them: not the next start, not any number of
restarts. Only `ipcrm` or a reboot.

Apache's own documentation says as much, in the `Mutex` directive: *"It is
possible to "leak" SysV semaphores if processes crash before the semaphore is
removed."*

At 6 sets per start and 128 in the table, a server survives 21 unclean stops
since its last reboot. The 22nd is invisible. The start after it fails.

## Who sends the SIGKILL

Nothing in the platform's code kills Apache. So where do unclean stops come from
on a server that only ever gets `systemctl restart`?

From the stock systemd unit that ships with the package:

```ini
ExecStop=/bin/kill -WINCH ${MAINPID}
# We want systemd to give httpd some time to finish gracefully, but still want
# it to kill httpd after TimeoutStopSec if something went wrong during the
# graceful stop. ...
```

`WINCH` is Apache's graceful stop: stop accepting, let in-flight requests
finish. If they have not finished by `TimeoutStopSec` (90 seconds by systemd's
default), systemd kills what is left with SIGKILL.

These servers proxy long-lived connections: video streams and websockets. So I
put a slow backend behind the proxy in the lab, held one stream open, and sent
`WINCH`:

```
running: sets=6
t+5s after WINCH: master alive=2 sets=6
t+30s after WINCH: master alive=2 sets=6
t+60s after WINCH: master alive=2 sets=6
after SIGKILL (what systemd does at TimeoutStopSec): sets=6
```

One open stream, and a graceful stop that is still waiting a minute later. When
the timeout runs out, the SIGKILL leaves all 6 sets in the table.

Put the pieces together. An ordinary `restart`, issued by an ordinary deploy, on
a server where someone happens to be watching video, becomes an unclean stop.
It costs 6 sets. Nobody notices, because Apache comes back up fine. It always
comes back up fine, right up until the restart where it does not.

## The trigger

The rollout that night was a correct change, and its only relevant property was
that it restarted Apache twice instead of once, on most of the fleet, within
about twenty minutes.

Over a hundred fleet-wide deploys had gone out since early 2023, each
one with at least one Apache restart. A server with long uptime and an open
stream during enough of them would sit at 20 leaked stops with no symptom at all.
That night it got two more tries.

That also explains the shape of the outage. Not every server, not a random
scatter over weeks: a couple of percent, the ones already near the edge, all on
the same morning, because they were all rolled at the same time.

I had reviewed that change. I had noticed the extra restart, and treated it as a
cost (each restart drops live video for a moment), not as a risk. My lab for the
review proved quickly that no clean restart leaked anything with the new config,
and that was true. It had no systemd and no long connections, which were the two
things that mattered.

## Mitigation, and what it does not fix

Servers were brought back one by one by stopping the services and deleting every
semaphore set owned by `apache`:

```bash
ipcs -s | awk '$3=="apache" {print $2}' | xargs -r -n1 ipcrm -s
```

That is only safe with Apache down, when every remaining set is a leaked one. Run
it against a live Apache and it deletes the sets in use too, which a colleague
pointed out on the call. A reboot does the same thing more slowly, since the
table lives in kernel memory.

Two other mitigations were discussed and deliberately not taken: raising
`kernel.sem`, which only moves the threshold, and running that `ipcrm` from the
deploy script, which only cleans up at deploy time and is dangerous whenever
Apache happens to be up. Both leave the leak exactly where it was.

## The fix is one line, and it is not shipped

The leak exists because the lock lives in a kernel table that only the dying
process could have cleaned. So take the lock out of that table. Apache lets you
pick the mechanism:

```apache
Mutex fcntl:/run/httpd default
```

`fcntl()` locks live on a file, and the kernel releases them when the process
holding them dies, however it dies. `default` applies it to every mutex Apache
registers, including the proxy one from the error.

To prove it, I shrank the table in the lab to 12 sets, room for two starts, with
`--sysctl kernel.sem="250 32000 32 12"`, and killed Apache after each start:

| Start           | Default (sysvsem)                    | `Mutex fcntl`        |
| --------------- | ------------------------------------ | -------------------- |
| 1, then SIGKILL | 6 processes, 6 sets                  | 6 processes, 0 sets  |
| 2, then SIGKILL | 6 processes, 12 sets                 | 6 processes, 0 sets  |
| 3               | **0 processes**, `AH00023`           | 6 processes, 0 sets  |

The default column reproduces the fleet's error code exactly. The other column
never touches the semaphore table at all.

Two alternatives came up on the call and do not fit. `posixsem` does not recover
a lock held by a child that dies, which can hang the server. And putting the lock
files in `/dev/shm` is something the Apache docs warn against: it is
world-writable, so anyone can create a file with the lock's name and keep the
server from starting. `/run/httpd` is not.

It is a proposal, waiting on a decision. The honest costs: `fcntl` is slower than
a semaphore under heavy concurrency, and these servers see modest load, but I did
not measure throughput. The lab has no systemd, so the SIGKILL is sent by hand.
It is not one of the real servers, and the next step is one real server before
the fleet. Until then, every deploy still restarts Apache everywhere, and the
servers that were not cleaned that morning carry a leaked count nobody has
measured.

## What still does not add up

The one server we had logs from stopped writing its access logs around 05:30,
eight hours after the deploy, not during it. If the deploy's restart had filled
the table, Apache would have failed to start that night.

The scheduled jobs on those servers do not explain it: log rotation and a
periodic health check both do a graceful reload, and in the lab a graceful with
a full table leaves Apache running. So something stopped or killed Apache
around 05:30, and the start after it found no room. I do not know what it was.

I also cannot check, because the evidence is gone. Every broken server was
cleaned or rebooted before anyone captured its semaphore table or its journal.
There was a request to leave one or two untouched, and it lost to getting the
customer back online, which was the right call. But it means the mechanism is
measured and the timeline of that one server is not explained, and I would
rather say that than paper over it.

My own first hypotheses did not survive either. I suspected the deploy's retry
loop was multiplying restarts on failing servers; a fleet-wide check found one
server with a pending deploy, and it was not one of the affected ones. I also
read the 09:18 errors as the start of the failure. They were somebody's manual
start attempts, hours after Apache had gone down.

## What I take from it

**A resource that leaks per event fails at a threshold, and the event that
crosses it gets the blame.** Every restart cost something that was never paid
back, and the system looked perfectly healthy until the one start that could not
find room. The change in front of you on the morning of an outage is the last
straw, which is worth knowing before anyone reverts it and calls it fixed.

**Read the error the program wrote, not the one the supervisor summarized.**
systemd knew Apache exited with status 1. Apache knew exactly why. And the
message it wrote was itself misleading, because an errno is a number with a
filesystem-shaped string attached.

**Capture before you clean.** The mitigation that brings the customer back also
destroys the only evidence of how it broke. A script that dumps `ipcs`, the
journal and the limits before running `ipcrm`, in the same command, would have
cost nothing that morning and answered the question I still cannot answer.
