---
title: "GitOps would have caught the typo — and missed the real problem"
description: "A one-character typo in a hand-made cloud resource crashed a service. Putting those resources in Git was the obvious fix, and it only addressed half of what was broken."
section: "architecture"
date: "2026-09-19"
tags: ["Kubernetes", "GitOps", "Azure", "Architecture"]
---

Two services in one environment went into `CrashLoopBackOff` after a routine
version bump. Not a full outage — an older, healthy pod of each stayed up, so it
was a stuck rollout rather than downtime. Every other environment running the
same images was fine.

The pods were failing at startup, on authentication to the database. That
database uses a managed identity: instead of a password, the pod asks the cloud
platform "who am I", gets a token, and presents that. If the identity is not
attached where the pod expects it, the token request fails and the process
exits.

Two things turned out to be true at once, and it needed both to break.

**One:** the cluster autoscaler provisions nodes dynamically, and each node is
its own scale set — born without the environment's identity attached to it.

**Two:** the resource that tells the controller which identity to attach had a
typo in it. One character, in the middle of a cloud resource ID:

```
userAssignedIdenties     ← what was there
userAssignedIdentities   ← what it should have been
```

An invalid resource ID, so the controller that is supposed to attach the
identity to new nodes could not resolve it, and silently did nothing. One of
roughly fifty such resources across the platform had it. The one belonging to
the environment that broke.

So: a new node appears without the identity, the controller that would have
fixed that is pointed at an address that does not exist, the pod lands there,
asks for a token, and dies.

## The obvious conclusion

These identity resources were being created and assigned **by hand**. No
infrastructure-as-code, no onboarding automation, no review. Dozens of them,
unversioned, each one typed by a person at some point over several years.

So the conclusion writes itself: put them in Git. Let the GitOps controller
reconcile them. Then a typo is caught in review, the state is versioned, drift
is corrected automatically, and this specific incident cannot recur.

All of that is true. I still think it is the wrong place to stop, and working
out why was the actual value in the investigation.

## Two failure classes, not one

Versioning the resources removes the **human-error** class. A typo has to get
past a pull request now. Good.

It does nothing about the **churn** class.

Look again at the first factor: nodes are created and destroyed continuously by
the autoscaler, and each new one arrives without the identity. That is not a
mistake anybody made. It is the normal, correct behaviour of two systems that
were designed independently — an autoscaler whose job is to churn nodes, and an
identity mechanism that attaches identities to nodes.

The assignment is fragile because of *where it lives*, not because of who typed
it. Git does not change where it lives.

## Why you cannot out-declare the churn

Here the problem splits into two layers, and they are not managed by the same
tools:

- **The Kubernetes objects.** These are custom resources in the cluster. The
  GitOps controller reconciles them natively — this is exactly what it is for.
- **The cloud resources.** Attaching an identity to a node's scale set is an
  operation on the cloud provider, not on Kubernetes. A Kubernetes-native GitOps
  controller cannot do it at all. You need something cloud-aware: a cloud
  operator, Terraform, Crossplane.

Layer two is the crux, and it is where the plan gets interesting. Suppose you do
reach for Terraform and declare the assignment. What exactly do you declare?

> Identity `X` is attached to scale set `Y`.

But `Y` is created by an autoscaler, lives for an unpredictable amount of time,
and is replaced by `Y'` when load changes. Your declaration is about a resource
whose identity is ephemeral by design. You would be writing a reconciliation
loop that races another reconciliation loop, each authoritative about a
different thing, and the autoscaler is going to keep winning because churning is
its entire purpose.

**When a fix has to fight an autoscaler, the fix is at the wrong layer.**

## The move: delete the dependency

The alternative is not to automate the attachment. It is to stop needing one.

The platform offers a newer mechanism — workload identity — where the pod's
identity does not come from the node at all. The pod gets a short-lived token
from its own service account, and exchanges it with the identity provider
through a **federated credential** configured once on the identity itself.

Read what disappears:

- No attachment to a node. **The churn class is gone** — not mitigated, gone,
  because nothing about the node is involved any more.
- No hand-written resource ID in the middle of a cluster object. **The typo
  class is gone** too, and the little that remains is versioned.
- The cloud-side surface stops being "every scale set, forever" and becomes
  "one federated credential per identity, created once". It is still layer two,
  but it is now *small and stable* instead of large and churning — which is the
  difference between something you can declare and something you cannot.

It also retires two deprecated dependencies in the same pass: the pod-identity
mechanism itself, and the old authentication library the services still used on
the database path.

That last detail is what makes the change tractable rather than heroic. The
newer authentication library was **already vendored and in use** in those same
services, for a different purpose. Only one code path was still on the old one.
The migration is bounded: fix it once per service, and it propagates everywhere
through the image.

## Before any of it: make the failure visible

There is a phase zero, and it ships independently of the whole plan.

When the token acquisition failed, the error was discarded. What reached the
logs was a generic connection failure — the equivalent of being told the phone
call did not go through, with no indication that the problem was the number.
Capturing and logging the underlying error turns that into "failed to acquire
a token: …", which names the class outright.

That is a few lines in three services, and it is worth doing *even if the rest
of the plan is never approved*. It makes this category of failure instantly
diagnosable, and it makes every later phase observable while it rolls out. It is
the same lesson I ran into in [a different
incident](/blog/your-error-handler-is-deleting-the-evidence): you cannot debug
what the process already threw away.

There is a sequencing argument too. If you remove a failure class without first
making it visible, you have no way to confirm you removed it. You just stop
seeing something you were never able to see.

## What I would want a reviewer to push back on

This is a design proposal, not a shipped migration — it is waiting on a decision
and it may well get reshaped. The honest costs:

**It introduces a capability the platform does not have.** Nothing manages cloud
resources declaratively there today. Phase two means adopting a cloud operator
or Terraform, which is a real one-time cost and a real new thing to operate.

**The interim step is a trap worth naming.** "Just put the current resources in
Git" is cheaper and removes the typo class immediately. It is also an investment
in a deprecated mechanism, and it leaves the churn class untouched — so it
should be chosen deliberately as a safety net while the real migration is
planned, not as the destination.

**Shared identities concentrate blast radius.** A dozen or so environments share
a single identity, which means one bad character takes down everything that uses
it — which is precisely what happened. Those have to migrate as a group, or you
get a split brain.

**It has to roll out per environment, not at once.** Both mechanisms can run
side by side, so the order is: enable the prerequisite, migrate one low-risk
internal environment end to end, validate token acquisition and a node
replacement, then fan out — staging before production — and only decommission
the old mechanism once nothing depends on it.

## The general shape

The thing I keep taking from this one:

**Versioning a fragile thing makes it auditable, not robust.** Putting the
resources in Git would have caught the typo in review, and it would have left
the system exactly as dependent on a node-level attachment that an autoscaler
destroys on a schedule. Audit and resilience are different properties, and "put
it in Git" only delivers the first.

**An incident usually has one cause you can name and one you have to look for.**
The typo was findable, satisfying and fixable in a minute. The churn was
structural, nobody's fault, and the actual reason the fix would have kept coming
back. Stopping at the nameable one is how a class of failure survives being
fixed several times.
