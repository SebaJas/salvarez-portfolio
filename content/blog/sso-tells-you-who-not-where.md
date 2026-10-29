---
title: "SSO tells you who the user is. Where they belong is your problem."
description: "Three single sign-on incidents on a multi-tenant platform. In every one the identity provider got the user right, and our own code guessed wrong about which organization they belonged to — then fell back to a default without saying a word."
section: "architecture"
date: "2026-10-28"
draft: false
tags: ["SAML", "SSO", "Okta", "Multi-tenancy"]
---

An admin console lists the users of each organization on the platform. For one
customer, a handful of rows looked wrong: their corporate email addresses, sitting
under the platform's own internal organization instead of the customer's.

They had a second tell. Their display name was their email address. That is the
signature of just-in-time provisioning: the first time someone signs in through
SAML, the platform creates their account on the spot, and when the assertion
carries no display name, the email gets used instead.

So these people had logged in successfully. Okta had authenticated them, the
assertion was valid, the account was created. Everything about *who* they were
was correct. The platform had simply filed them in the wrong place.

Over the next three weeks I saw that same split three times, in three different
forms. The identity provider answered "who" every time. "Where" was always our
code, and every time it guessed.

## Guess one: the first row of a filtered query

When a JIT user is created, the login service needs a folder to put them in. It
asks the database for the organizations in the tenant's scope and takes the first
one:

```sql
SELECT node_id, use_as, ...
FROM organizations
WHERE node_type = 'organization'
  AND value.scope = $scope
ORDER BY CASE WHEN use_as = 'root' THEN 1 ELSE 0 END, created_at
```

```go
org := results[0]
```

Every customer scope holds two organizations: the customer's own, and the
platform's root organization, which is replicated into every scope. The
`ORDER BY` puts the customer's organization ahead of the root. It looked like
the obvious suspect, and it was fine.

The problem was the `WHERE`. The customer's organization had been created by
cloning it from another environment about ten months earlier, and that clone path
never wrote the `scope` field into the document. So the filter excluded it. The
only organization left in the result was the root, `results[0]` was the root, and
every first-time SAML user since onboarding had been filed there.

It only hit JIT users because they are the only ones who go through that query.
People invited by hand or imported in bulk get placed explicitly, which is why most
of the customer's users looked fine and nobody noticed for most of a year.

The fix was one `UPDATE` setting the missing field — stage first, then production,
re-running the resolution query each time to confirm the customer's organization
now came back first. The few users already filed in the wrong place were a
separate cleanup; my recommendation was to delete them and let JIT re-create them
correctly on their next login, rather than hand-move the documents.

That fixed the instance. It was clear it was not the class: any organization
created by that clone path had the same hole, on any environment.

## Guess two: the URL

A few weeks later, a different customer could not sign in at all. They lived on
the platform's multi-tenant environment, where several customers share one
deployment — and one login URL.

The login service decides which tenant you are from the URL you arrived on. It
reads the `Origin` header (or the `Referer`), checks it against an allow-list, and
looks it up in a tenant registry with an exact string match. Simplified:

```go
origin := originFrom(c) // Origin, else session, else Referer
if !isAllowedOrigin(origin) {
    c.Next() // no tenant set
    return
}
org, ok := registry.FindOrgByOrigin(origin) // exact match
if !ok {
    c.Next() // no tenant set
    return
}
```

Every early return continues the request with no tenant on it, and downstream the
identity provider config and the database scope quietly fall back to the
deployment's default. On that environment, the default was the *first* customer.

With one URL shared by two customers, there is nothing to distinguish them. The
second customer's users, correctly assigned in Okta, were routed into the first
customer's configuration. It had never broken before because, in practice, only
one tenant had ever lived on that URL. Origin-only resolution is flawless with one
tenant. It fails on the second.

There was a decoy on top. The logs showed the origin arriving with an explicit
`:443` and being rejected as "not in allowed origins". Someone reasonably added
the `:443` variant to the registry — but the check that was failing read a
*different* list, an environment variable, and ran before the registry was ever
consulted. Two lists of origins, one error message, and the obvious edit went to
the wrong one.

The band-aid was configuration only: give the customer its own subdomain, pointed
at the same deployment, and wire that origin through the allow-list, the registry
and the per-tenant secret.

## The symptom does not tell you which layer

That should have been the end of it. Instead "can't log in" kept coming back, and
each time it was a different layer.

The customer's own identity provider was Microsoft Entra, federated into Okta.
Their enterprise app still had placeholder values in its SAML configuration — a
reply URL and entity ID on a `myapp.test` domain, never replaced — so assertions
were being posted somewhere that was not Okta. Okta saw no login attempts at all.
After they fixed that, one user still could not get through because their
Okta account was in a local password state instead of being federated.

Then the federation worked end to end, the user arrived on the right subdomain —
and the new account landed in a demo organization, not the customer's.

It was guess one again. None of the organizations on that environment had the
`scope` field populated, and the customer shared its scope with the demo
organization. This time I did not apply the same one-line `UPDATE`, and the reason
why is the most useful thing that came out of the whole episode.

## The fix I had shipped was the thing to remove

Mapping the full chain — subdomain to registry to tenant secret to scope to
organization query — turned up an uncomfortable fact. Storing the scope name inside
organization documents, and filtering on it, was the design flaw, not a missing
detail. The scope is an internal database name; it was sitting in records
reachable through the authenticated API, and other code was *computing* scopes from
environment names. Our stage-and-production `UPDATE` had made the problem go away by
doing more of the thing that should not exist.

The direction we landed on is subtraction:

```text
single-tenant:               scope from the deployment config
multi-tenant:                scope from the tenant's secret
multi-tenant, no tenant:     error — never a default
```

Resolve the organization *within* that authoritative scope, stop storing scope in
records, and derive the tenant from the subdomain by convention, with a small
explicit fallback in the tenant secret for the cases that break the convention.

We also tested the tempting alternative — derive the organization from the email
domain — against real data, and it failed. Internal and test domains appear in
several organizations, and internal staff belong to many organizations by design.
An email domain says something about who you are. It does not say where you are
going.

And one constraint stays explicit: the subdomain is a routing hint before
authentication, never proof of membership. Authorization still comes afterwards,
from the identity provider's claims and groups.

For the customer in question, the interim answer was to move them to a dedicated
single-tenant deployment, and to go live with username and password rather than
SAML — because turning SAML on before provisioning is fixed means users who log in
successfully and see nothing. When I last worked on it, the durable fix was an
agreed design broken into tickets, not shipped code.

## Guess three: a parameter someone else controls

The third one never touched our code at all, which was the point.

Another customer's users reach the app through a widget embedded on a third-party
site. Clicking it starts a SAML login against Okta, and Okta's app config carries
a RelayState: the URL to send the user to afterwards, which is our login page with
one specific query parameter attached. That parameter is the *only* thing that
tells our login service to turn the existing Okta session into an app session and
drop the user on their home page:

```go
if q.Get("external_sso") != "" { // simplified name
    // start an authorize request against the existing IdP session
}
```

We never parse SAML's RelayState. We read a query parameter that happens to be
inside a URL that someone else configured. There is no default and no fallback.

One day users started landing on Okta's dashboard instead. The login service had
not changed — same image, same pod, running for weeks, last config change long
before. In about six hours of login logs, the branch that handles that parameter
fired zero times. The trigger simply was not arriving. The third party's own
diagnosis was a backend change on their side that dropped the RelayState; we could
confirm the effect, not the cause. The fix was theirs to make, and in the
meantime, typing the app's URL directly worked.

It had happened before. When the integration was first set up, the RelayState was
missing and users had to type their email a second time. The same configuration,
in a system we cannot see, had now broken twice. The resilience options — a
per-environment setting that implies the external flow, an alert when that log
line stops appearing — are code changes waiting on a decision, not done.

## What I take from it

**SSO answers who. Deciding where is still your code.** SAML and OIDC solve
authentication, not provisioning or routing. In all three incidents the identity
provider was right, and the failure lived in how we turned a valid identity into an
organization: a filter on a field one provisioning path forgot, a URL shared by two
tenants, a parameter in someone else's config.

**In a multi-tenant system, a fallback tenant is a silent misroute.** Each guess
had a default — the root organization, the first customer, the identity provider's
dashboard — and the default is what hid the bug. Nothing errored; users "logged in
successfully". No tenant context should be an error you can see, not a tenant you
did not mean.

**Every input to routing is a dependency, including the ones you do not own.** A
RelayState in a third party's admin panel was as load-bearing as any line of our
code, with no versioning, no review and no alert. If something outside your system
decides where users land, at minimum make its absence loud in your own logs — it
is the only part you control.
