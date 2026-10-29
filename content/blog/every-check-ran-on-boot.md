---
title: "Every check ran on boot. The change shipped to running servers."
description: "A correct fix moved a data disk's mount point, and cameras across a fleet went offline while still recording. Every check of the change had tested a server that was booting; it shipped to servers that were already running."
section: "operations"
date: "2026-10-28"
draft: false
tags: ["Docker", "Linux", "systemd", "Incident analysis", "Testing"]
---

One morning, cameras showed up offline across most of a fleet of edge servers,
the boxes that record video at each customer site. Support was overwhelmed.

**The cameras had never stopped recording.** They were writing video,
successfully, to a directory no other process on the box could see. Someone on
the incident call called it a dangling pointer, which is exactly what it was.

The change behind it was correct. It fixed a real problem, it had been reviewed
twice, it had a smoke test, and it even guarded against the obvious race. I was
one of the two reviewers. I approved it.

## The fix that was right

Each box has a small disk for the operating system and a large one for video.
An `ext4` filesystem has two budgets, bytes and inodes, and the inode count is
fixed at format time. Thumbnails are millions of tiny files, and they lived on
the small disk, so on sites with a long history the inodes ran out with space to
spare. The kernel calls that `ENOSPC`, "No space left on device", which is the
wrong message and sent diagnosis the wrong way.

The fix moved the large disk's mount point up from `/data/history` to `/data`,
with a migration to copy up the data the new mount would hide. It even
anticipated a race: the mount service became `Type=notify`, so systemd would
hold back the units that start containers until the migration finished. **That
safeguard assumes the containers are not running yet.** Remember that.

## How the change actually arrives

Nobody deploys to these boxes. An auto-update agent runs every ten minutes
through a nightly window and, if the installer bundle changed, runs it. The
installer does this for every systemd unit it ships:

```bash
if unit_needs_update "$unit"; then
    unit_install "$unit"
    if systemctl is-active --quiet "$unit"; then
        if [[ "$unit" != "$AUTOUPDATE_UNIT" ]]; then   # don't kill ourselves
            systemctl daemon-reload
            systemctl restart "$unit"
        fi
    fi
fi
```

The change had edited the mount unit, and the unit was active. So that night,
on every box, the mount service restarted with Docker running and every
container already up. Note the one exception: the agent won't restart itself.
The hazard of restarting an active unit was already understood, for one unit.

## Docker had already looked

A bind mount is resolved once, by the Docker daemon, when the container
starts. The container gets the directory that was at that path *at that
moment*, and keeps it. And the default propagation is `rprivate`, which means
nothing the host mounts afterwards ever reaches inside:

```bash
docker run -d --rm -v /tmp/x:/mnt busybox:1.36 sleep 20
docker inspect <cid> --format '{{range .Mounts}}{{.Propagation}}{{end}}'
# rprivate
```

So the large disk landed on `/data`, on top of directories the containers were
writing to. The host looked at the new top layer, the containers kept writing
to the buried one, and both views looked healthy. **There was no error in any
log, on any box.** Every write the containers made succeeded.

The part that stings: the agent runs `docker compose up -d` right after the
installer, after the mount had moved. It did nothing. `compose up` means "make
what's running match what's declared", and the compose file hadn't changed,
only a script and a unit file that compose never reads.

The fleet-wide remedy was `systemctl restart docker`, which made the daemon
resolve every bind again. That brought the cameras back.

## Two paths, opposite order

A change to this installer reaches a box in one of two ways, and they run the
same code in opposite orders:

```text
PATH A: boot (or a re-image, which reboots)
  the data disk is mounted
  Docker starts
  containers resolve their binds        <- the disk is already there   OK

PATH B: live update
  Docker is already running
  containers have ALREADY resolved their binds
  the installer restarts the mount unit
  the data disk is mounted              <- nobody tells Docker         FAILS
```

Same code, same disk, same command. The only difference is the state of the
system when the code runs, and that alone decides the outcome.

Now line up the three checks the change passed. The author's smoke test was a
full install including a re-image: path A. The first review looked at the
systemd handshake and data clobbering: path A. Mine covered readiness
signalling, a missing `return` and `&&` precedence: path A. All three found
real bugs. One of my findings was even about that exact `systemctl restart`,
framed as "does the migration resume?" instead of "what do the containers that
are already running see?" I was one question away.

## The fix that caused its own damage

Live video segments and JPEG snapshots were written to a tmpfs at `/data/ram`,
in RAM on purpose, so the disk didn't take a constant stream of tiny writes.
It sat under `/data`, so it got buried too.

When Docker restarted, the containers resolved `/data/ram/...` again, this time
on the large disk, where those directories didn't exist. Docker's answer to a
missing bind source is to create it, without a word:

```bash
S=$(mktemp -d)
docker run --rm -v "$S/does-not-exist/hls:/data/seg" alpine \
    sh -c 'echo data > /data/seg/test.txt'
find "$S"    # Docker created the directory. No error, no warning.
```

So live video ran on disk instead of memory, and sites with many cameras got
slow. The remediation caused that, not the bug. Reverting wasn't an option
either: a revert moves the mount point again, and moving it is the trigger.

## What I got wrong before I measured

Would propagation flags have saved it? I read Docker's docs and said probably
not: they describe mounts nested *within* a bind, and this one landed *on top
of* the bind source.

A colleague measured it instead, and I re-ran it with mount namespaces on a
workstation, no root needed. With the host mount `rshared` and the bind
`rslave`, a mount over the bind source **does** propagate, as long as the path
lives inside the shared mount. The real boundary is elsewhere: if the shared
mount is unmounted entirely, the container's bind keeps the old filesystem
alive. In that run the host's `findmnt` looked perfect throughout, while the
container wrote somewhere the host could no longer see. My reading was an
inference, and it was wrong.

## The fix that landed

The structural fix moved the tmpfs out to `/ram`, outside `/data`, so nothing
mounted on `/data` can bury it again, whatever the order. The binds now say what
they need instead of relying on defaults:

```yaml
volumes:
  - type: bind
    source: /ram/hls
    target: /data/archive/segment
    bind:
      propagation: rslave
      create_host_path: false
```

`create_host_path: false` turns the silent directory creation into a hard
failure. I measured it: the daemon refuses with `bind source path does not
exist`, and one bad bind aborts the whole `up`. A freshly mounted tmpfs is
empty, so the tmpfs mount script now creates the subdirectories right away,
or the flag would fail every boot. A container that refuses to start is still an
outage, but a diagnosable one, and the cameras went offline that day anyway.

And this change edits the compose file, so `compose up -d` recreates the
containers by itself. **Two changes that move a mount point, one catastrophic
and one self-healing, differing only in whether a compose file changed.**
Nothing in a diff review points you at that.

## What is still open

A test-bench reproduction brought the failure back: four cameras' segments
inside the container, nothing at that path on the host, every bind `rprivate`.
But there, restarting just the writing container was enough, which contradicts
what we saw during the incident. Two candidate explanations, neither measured:
the incident-night "container restart" may have been the same no-op `compose
up`, or the daemon runs in its own mount namespace on one generation and not the other
(comparing `readlink` of `/proc/1/ns/mnt` and the daemon's settles it). The
bench was also an older generation, so the failure still hasn't been
reproduced on the one that broke.

Nobody knows how many sites were actually offline. The remediation went to every
box without checking which were affected, so the number was never captured.

## The proposal, and what I'd want pushed back on

I wrote up five measures. The cheapest is a required PR-template section for
any change to the installer or its units: *what happens if this arrives through
the live update instead of a boot?* If the answer isn't "the same thing", it
needs a plan for running servers, and for a mount move, which step tells Docker
and not just the kernel.

The one I'd least want postponed is an end-state check, and the measurements
shaped it. It can't inspect the host alone, since the host looked fine
throughout. It has to compare both views, a sentinel or `stat -c %d` on each
side, and run on a schedule rather than at boot, because this happened with no
reboot at all.

The costs, honestly:

**The canary isn't free.** A box can already be pinned to a branch build, so a
manual canary needs no code. A real tiered rollout needs CI changes, a
per-server configuration channel and reporting on what runs where, none of which
exists. A colleague objected that long-lived release branches ask every engineer
to carry a deployment model only one person holds today. We agreed to start with
two tiers and build the reporting alongside the pipeline, not later.

**A canary can be blind to the failure it exists to catch.** One generation of
the fleet doesn't run containers, and it was untouched that morning. A canary
made only of those boxes, or only of clean test machines, can't see this class
of failure at all.

**Restarting Docker inside the mount script is tempting, and wrong.** That unit
restarts on every update that touches it, so every future change would drop
every camera on every box. A rare silent failure becomes a routine visible one.

## What I take from it

**A safeguard encodes an assumption about state, and the deploy path chooses
the state.** `Type=notify` was correct for a box that was booting. The only path
that ever ran it in production was a box that was already running. Reading the
diff can't show you that. You have to ask what is true about the system at the
moment the code runs.

**Test the path changes actually take, not the one that's easy to test.**
Re-imaging got tested because it's frightening, booting because it's trivial.
The live update, the path every change takes, got tested by nobody, because it
needs a server that is already running. What was missing wasn't rigour, it was
a scenario, and a missing scenario doesn't show up anywhere.

**When two systems each think they're healthy, check them against each other.**
The host's mount table was right. The containers' writes succeeded. Both were
true, and the cameras were still offline, because the problem only existed in
the gap between the two views.
