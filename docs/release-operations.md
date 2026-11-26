# Service release isolation and operations

## Decision record

- **Status:** Initial operational design; deployment automation is not
  implemented
- **Decision date:** 2026-11-25
- **Scope:** Future independently owned CivicNest service modules and the
  current single-build demonstration environment.

### Context and release model

The current frontend is a single Vite application and does not deploy service
modules independently. This record defines the release boundary to implement
if and when independent module deployment is introduced; it does not claim
that runtime federation, artifact promotion, monitoring, or automated rollback
already exists. Until then, changes ship with the host as one release and
should follow the same ownership, compatibility, and recovery practices.

### What may ship independently

An independently deployable service release may change only that service's
public entry point, implementation, tests, and service-owned assets. Its
artifact is an immutable build identified by service name, semantic version,
and source revision. The host selects an explicit compatible service artifact
and records which one it serves. Rollback changes that service's selected
artifact only.

Shared packages are separate dependency artifacts, not part of a service
team's private release. A shared package change requires the package owner's
compatibility review and automated contract/build checks. A compatible
additive release can be adopted by consumers on their planned cadence only
after each affected consumer verifies it. A breaking change requires the
version and deprecation/migration process in the [public contract
policy](./public-contracts.md), plus coordinated adoption by affected
consumers before the old contract is removed. Do not silently substitute a
new shared-package version underneath independently deployed services.

The current repository does not independently version or publish packages
and has no registry or release automation configured. The version policy and
[release-record template](./release-record-template.md) describe the evidence
to require if that model is introduced; they are not claims that a package
release or independent deployment can be performed today. See the
[illustrative release record](./release-record-example.md) for a sample
compatibility decision.

The initial isolation boundary is a versioned service artifact loaded by a
host that pins a compatible version. The host remains responsible for
integration compatibility and a safe fallback if a module cannot load. This
keeps rollback scope small, but independent release is not safe unless host
compatibility has been verified for both the new and previous module version.

### Identifying the version serving a resident

Every release artifact exposes a non-sensitive build manifest containing:

- service identifier and semantic version;
- immutable source revision (short commit hash);
- build timestamp in UTC;
- compatible host and shared-contract version range.

The host makes the selected service identifier and version available in a
support/about view and through a read-only diagnostic endpoint or page, for
example `/__build`, with no authentication bypass or operational secrets. A
synthetic service route can display `permits 1.4.2 (a1b2c3d)` in its support
panel. The manifest contains no user, resident, request, environment-secret,
or personal information. If the manifest is unavailable or invalid, report
the version as unknown; do not infer it from a cached label or conceal the
diagnostic failure.

### Deployment health and client-error signals

These are initial operational hypotheses for the demonstration environment,
not established service-level objectives. Thresholds should be validated
after representative usage and measurement exist. Signals and example
dimensions must never include query strings, form values, request/response
bodies, names, addresses, identifiers, credentials, or other personal or
sensitive data.

| Signal                             | Initial review threshold / trigger                                                                                                                                                                                                                                                                                        | Accountable investigator                                                                                | Safe evidence to capture                                                                                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deployment smoke check             | A released module fails its synthetic health route or cannot render its expected initial state once after deployment; stop promotion and investigate.                                                                                                                                                                     | Releasing service team; Frontend Platform team for host integration.                                    | Service ID/version/revision, host version, timestamp, environment, health-check result, and sanitized failure category.                                                                                                     |
| Module load and route availability | Any repeated module-load failure in a 5-minute window, or 2 consecutive failed synthetic checks, triggers review; keep the prior version selected until resolved.                                                                                                                                                         | Releasing service team.                                                                                 | Module ID/version, route template (for example `/services/permits` without query), time window, count, browser/runtime family at coarse level, and error category.                                                          |
| Client error rate                  | Review when sanitized unexpected client errors exceed 1% of page sessions for a service over 15 minutes with at least 100 synthetic/demo sessions, or when 5 similar errors occur in 5 minutes. With lower volume, treat any reproducible release-related error as a review trigger, not a statistically meaningful rate. | Service owner investigates its module; Frontend Platform team investigates host or shared-shell errors. | Service and host versions, source revision, error type and stack fingerprint with paths/values scrubbed, route template, coarse browser family, timestamp/window, count, and correlation ID generated without user linkage. |
| Recovery verification              | After rollback, two consecutive synthetic checks pass and no recurrence is seen during a 15-minute observation window.                                                                                                                                                                                                    | Incident lead from releasing service team; host owner confirms integration.                             | Selected and previous versions, check times/results, error counts before/after, and explicit unrelated-module check results.                                                                                                |

These thresholds generate a human review or promotion hold in the initial
design; they do not imply pager coverage or automated alerting exists. Do not
retain session identifiers or fingerprint residents to calculate page-session
rates. In the demonstration environment, derive denominators from aggregate
synthetic checks or privacy-preserving aggregate counters. If a safe denominator
is unavailable, use absolute reproducible error counts instead of collecting
identifying telemetry.

### Incident evidence and privacy

The incident lead records only:

- incident ID, UTC start/end times, environment, affected service and route
  template;
- host, service, and relevant shared-package versions/revisions before and
  after the change;
- deployment and rollback timestamps, actors by role, and actions taken;
- synthetic check definitions, aggregate results, error categories, and
  sanitized stack fingerprints;
- impact summary, recovery confirmation, root-cause hypothesis, and follow-up
  owner/date.

Do not capture screenshots or copied browser-console output containing
resident data. Do not attach request payloads, response bodies, session
replay, user-level identifiers, raw URLs with query strings, or secrets.
Sanitize diagnostics at collection time and restrict access to the incident
record using the project's normal workspace permissions.

### Rollback drill: faulty permits module

Run this drill with synthetic data in a non-production demonstration
environment. Example: `permits` version `1.4.3` is released and its initial
route fails a render smoke check. Resident-support and community-services
modules are pinned to their own versions and must remain unchanged.

1. **Prepare the baseline.** Record the host version, `permits` version
   `1.4.2` and revision, the unrelated service versions, and the synthetic
   smoke checks for all three routes. Confirm the prior permits artifact is
   immutable and available.
2. **Deploy the faulty candidate.** Select `permits` `1.4.3` only. Do not
   change the host selection or unrelated module artifacts.
3. **Detect and hold.** Run the permits smoke check twice. On failure, stop
   promotion, record the threshold trigger and privacy-safe evidence, and
   appoint the permits service lead as incident lead.
4. **Restore only the affected module.** Change the host's permits artifact
   selection back to `1.4.2` and its recorded revision. Leave
   resident-support, community-services, host, and shared-package versions
   untouched. If the host cannot select the prior artifact independently,
   this design's isolation assumption is not met; restore the last known-good
   host release through the documented host rollback and record that the
   blast radius included the host.
5. **Verify recovery.** Run the permits route smoke check twice, then observe
   for 15 minutes. Confirm no repeat of the triggering error and that the
   support/build view reports permits `1.4.2` with the expected revision.
6. **Verify blast-radius containment.** Run the same synthetic smoke checks
   for resident-support and community-services. Compare their selected
   versions and revisions with step 1 and confirm their routes remain
   available; record both results explicitly.
7. **Close and learn.** Record timestamps, selected versions, pass/fail
   evidence, and follow-up owner/date. Keep `1.4.3` withdrawn pending a
   corrected artifact and repeat the release checks before redeployment.

The drill passes only if the faulty service is detected, the permits route
recovers on the prior version, the reported version matches the selected
artifact, and both unrelated modules stay on their original revisions and
remain available. If artifact selection cannot isolate permits, document the
actual rollback blast radius and revise the deployment model before claiming
independent rollback.

### Limitations and revisit decision

This design assumes immutable artifacts, host-side per-module version
selection, compatible public contracts, and independent route smoke checks.
The current single Vite build does not provide these capabilities; a build or
host failure can still affect all routes, and shared-package adoption can
require coordinated consumer releases. Runtime federation or another
deployment platform would add operational, security, accessibility, and
compatibility costs.

Revisit the isolation model before the first real independent deployment, or
when a team requires a separate release cadence, rollback repeatedly affects
unrelated services, or measurements show that coordinated host releases are
causing material delivery risk. The review must include concrete release
frequency, dependency/contract graph, measured failure blast radius, support
ownership, artifact/rollback capability, and security and performance tests.

### Simple verification

- Confirm the release rules distinguish module artifacts from shared-package
  adoption and name the host compatibility requirement.
- Walk the rollback drill and verify it records the prior version and leaves
  unrelated module selections untouched.
- Check that each signal lists a threshold/trigger, investigator, and
  non-sensitive evidence.
- Run `pnpm format:check` to verify documentation formatting.
