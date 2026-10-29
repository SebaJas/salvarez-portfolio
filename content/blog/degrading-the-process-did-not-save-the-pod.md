---
title: "The service degraded gracefully. Login went down anyway."
description: "A gateway crashlooped because a VPN to one customer's database was down, and took login with it. Making the process degrade instead of die was the easy half. The hard half was everything Kubernetes decides about the pod."
section: "architecture"
date: "2026-10-28"
draft: false
tags: ["Kubernetes", "Go", "Resilience", "Observability"]
---

Users signed in, and the identity provider said everything went fine: policy
evaluated, tokens granted, single sign-on to the app. Then, immediately, a
logout. No error anywhere in the provider's logs, because from its point of
view nothing had failed.

What had failed was a step after that. When the app picks up a session, it
resolves the user's organization, roles and rights through the platform's data
gateway — the service that sits in front of every database. That gateway was in
`CrashLoopBackOff`, a few hundred restarts deep. No gateway, no rights, no
session.

And the gateway was down because of a database that login never touches.

## A credential we did not own

One customer keeps its data in a SQL Server in its own datacenter. To reach it,
the gateway's pod carries a sidecar container that opens a VPN tunnel into the
customer's network and forwards `localhost:1433` to their database. The gateway
connects to `localhost` and knows nothing about VPNs.

The VPN authenticates with a credential the customer issues. It had expired.
The sidecar's log said so in one line, and the mitigation was to delete the
sidecar from the deployment: login came back, and every feature reading the
on-prem data went dark until the credential was rotated.

What turned this into a design problem was that it was not the first time. The
team had already kept the gateway alive by hand on four separate occasions that
year, each time by repointing its connection settings at a placeholder database
so the process would start.

The system had exactly two states: everything working, or everything down. And
the switch between them was a secret on someone else's side of a firewall.

## Two ways to die, stacked

When I traced it, there were two crash mechanisms, either one enough alone.

**The sidecar's probes.** It had a liveness and a readiness probe, both a
`tcpSocket` check on port 1433. Tunnel down, nothing listening on 1433, probes
fail. The liveness probe restarts the container in a loop; the readiness probe
marks it not ready — and a pod is only `Ready` when *all* its containers are.

**The gateway's startup.** At boot it opened every database connection and
pinged it. If any SQL connection failed, the error bubbled up to this:

```go
pool, err := GetTenantPool(ctx, dbContext, "system")
if err != nil {
    log.Fatal("Failed to create default tenant pool")
}
```

`log.Fatal` is `os.Exit(1)`. No retry, no backoff. The process died before its
HTTP servers started, and since login's queries go through the same process, a
missing customer database became a missing login.

## The design: classify every dependency

The fix I proposed was "degrade instead of crash", and the core of it is a
question most services never answer explicitly: **which of my dependencies are
required to serve anything at all, and which are only required to serve some
things?**

For this gateway the answer was clean. The document database holds users, orgs
and rights; without it nothing works, so it stays fatal. The SQL connections
back specific features, and the code already treated tenants with no SQL host
as valid. So with SQL failing at startup, the gateway now logs a warning, leaves
that connection `nil`, sets a marker on the pool, and keeps going.

The second decision was what to do with requests that need the missing
database. Queue them until it comes back, or fail them? I argued for failing
fast with a clear error. A queue in front of a database that may be gone for
days is an unbounded backlog that delays the failure instead of reporting it.

That decision exposed a latent bug. The resolvers that hand out SQL connections
returned the global connection with no nil check, so in degraded mode they would
return `(nil, nil)`, and the caller would panic on first use. Now they return a
sentinel:

```go
var ErrSQLUnavailable = errors.New(
    "SQL database unavailable: running in SQL-degraded mode")

func ResolveTenantSQLDB(pool *TenantConnectionPool) (*sql.DB, error) {
    if pool.sqlDB == nil {
        return nil, ErrSQLUnavailable
    }
    return pool.sqlDB, nil
}
```

That check is unconditional: a nil connection should never be a panic. The
risky part — changing startup behaviour in a service every environment
depends on — went behind a flag that defaults to off. Off means exactly the old
behaviour. It is enabled per environment, only where someone opts in.

## The reviewer who made it per-connection

My first version marked the whole pool degraded if any SQL connection failed. A
colleague asked in review whether optimizations would keep working during a VPN
outage. They would not have, and they should have: that environment has one SQL
connection to a cloud database and one through the tunnel, and optimizations
only use the cloud one. So the degrade became per-connection, each with its own
marker, and a test pins the case where the cloud connection is alive and the
on-prem one is not. "Degraded" turns out not to be a state of the service. It is
a state of each dependency, and collapsing those into one boolean throws away
exactly the information that decides what can still run.

## Surviving the process is not surviving the pod

With the gateway no longer dying, the sidecar's probes would still take the pod
out of service on every tunnel drop. Removing them was easy to argue: a
`tcpSocket` probe on 1433 does not measure whether the proxy is healthy. It
measures whether the *remote* is reachable. That is the wrong question for a
liveness probe, and asking it on a readiness probe hands the customer's network
a veto over our login.

But reading the sidecar's image showed that dropping the probes would not be
enough. Its entrypoint had its own watchdog — check the tunnel every few
seconds, reconnect if it drops — and if reconnecting failed for 60 seconds, it
did this:

```sh
echo "Exiting for K8s restart"
exit 1
```

In a sustained outage, that is a crashloop with no probe involved at all. And a
container in `CrashLoopBackOff` is not ready, so the pod is not ready, probes or
no probes. That reclassified the image change from "optional" to required: on
failure it now stays up, logs, and goes back to retrying.

On staging we broke the VPN credential on purpose and recycled the pod. It
stayed `Ready`, login worked, optimizations ran, and on-prem queries failed
immediately with `connection refused` instead of hanging. In production, where
nobody on our side could break the customer's VPN, I induced the condition by
removing the sidecar. The gateway stayed up and login was fine.

That production check had a blind spot I only appreciated later. Removing the
sidecar tests what the *gateway* does when the database is unreachable. It
cannot test what the *sidecar* does when the credential is rejected, because
there is no sidecar.

## The recurrence

About seven weeks after the first outage, the credential expired again, and
users could not sign in. This time the gateway container had zero restarts —
the degrade held exactly as designed. The login service's logs showed why login
went down anyway:

```
dial tcp: lookup <gateway-service> on <cluster-dns>:53: no such host
```

The gateway ran a single replica behind a headless Service. A headless Service
publishes DNS records only for ready pods. The sidecar was crashlooping, so the
pod was not ready, so the Service had zero ready endpoints, so the gateway's name
stopped resolving. A healthy process, unreachable by name.

And the sidecar was crashlooping because production never got the fixed image.
It was referenced as `:latest`, shared between environments, built by hand with
no CI. Staging had been pinned to the fixed tag for testing; production's
`:latest` was still a build from months earlier. Retagging at promotion time was
the plan, and it had not happened.

The permanent fix was a one-line pin of production's sidecar to the fixed tag.
With the credential still expired, the pod came up fully ready, the sidecar idled
in its retry loop, and login worked.

## Make the degradation visible — without touching readiness

A service that degrades quietly has traded an outage for a mystery. The tempting
place for that signal is the readiness endpoint, and it is precisely the wrong
one. Readiness decides whether a pod receives traffic. Make
it reflect an optional dependency and "degraded" becomes "removed from service",
which is the outage we had just spent a month removing.

So the signal went out of band: a Prometheus gauge, one series per connection,
1 when available and 0 when degraded, scraped from a `/metrics` endpoint and
never consulted by the kubelet.

```
gateway_sql_available{database="default"} 1
gateway_sql_available{database="assistant"} 0
```

Three small decisions were worth more than the code. Labels name the
connection's *role*, not where it lives — in another environment that database
might be in the cloud. On environments where a connection is not configured, the
series is omitted rather than reported as 0, or it would alert forever. And
nothing is emitted until the first check has run, so a pod that is still booting
does not page anyone.

The alerting rule belongs to a teammate who owns platform alerting: any series
at 0 for two minutes. The service produces a fact; alerting decides who to wake.

## What I would want a reviewer to push back on

Most of this shipped: the degrade is running in production behind its flag, and
so is the sidecar that no longer exits. The metric is merged but not yet
deployed, and its alert is not wired, so today a degradation is still found by a
customer report or by someone looking. The honest list of what is still weak:

**Recovery needs a restart.** Reconnecting was out of scope: the degrade is
decided at startup, so the gauge reflects the pod at boot and will not flip on
its own. After the credential is rotated, someone has to delete the pod.

**Not every caller goes through the gateway.** During the production check, a
data-preparation step hung instead of failing fast, and the gateway logged no
SQL attempt at all: that flow reaches the data by another path. Degrading one
service only makes promises for the requests that pass through it.

**An idle sidecar hides a dead tunnel.** Keeping the pod ready is the point, and
it also removes the loud symptom that used to announce the problem. Without the
metric and its alert, "nothing is crashlooping" can now coexist with "a
customer's data has been unreachable for days".

**Nobody owns the credential.** This is the actual root cause, and none of the
above touches it. An owner and an expiry alert were requested after the first
incident. They did not exist when it happened again.

## The general shape

**A dependency that is optional at runtime must be optional at startup.** If a
feature can live without a database once it is running, refusing to boot
without it turns a partial outage into a total one. Decide per dependency, not
per service, and let only the truly required ones be fatal.

**Readiness means "send me traffic", not "everything I touch is healthy".** A
probe that measures a remote system gives that system a veto over your pod, and
every container in the pod shares that veto. Degraded state belongs in a signal
that nothing routes on.

**Verify the artifact, not the repository.** The fix was correct, reviewed and
proven on staging, and production ran a different binary under a shared,
mutable tag. "Did the process crash?" had stopped being the useful question. The
one that mattered was whether the service's name still resolved.
