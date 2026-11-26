# Service team shared-package guide

This guide helps a service team consume CivicNest's shared platform contracts
without giving up ownership of its own service behavior. Commands are run from
the repository root.

## What is shared and what stays service-owned

Import shared capabilities from their documented package roots:

| Contract         | Approved import            | Use it for                                                     |
| ---------------- | -------------------------- | -------------------------------------------------------------- |
| Design tokens    | `@civicnest/design-tokens` | Stable semantic visual roles and token types                   |
| Accessible UI    | `@civicnest/ui`            | Shared components such as `ServiceCard`                        |
| Shared utilities | `@civicnest/utils`         | Service-neutral transformations such as `normalizeDisplayText` |

Do not import implementation paths such as
`packages/ui/index.tsx`, `@civicnest/ui/internal`, or another service's files.
The [boundary check](./workspace-design.md#automated-dependency-boundary-check)
rejects package deep imports, cross-service imports, and service dependencies
from shared packages. The [public contract table](./public-contracts.md#initial-export-contracts)
is the authority for supported names and behavior.

Shared packages reduce duplicated maintenance and let platform owners improve
accessible behavior consistently. The trade-off is that changes to shared
contracts need compatibility evidence and coordination with every affected
consumer. Service teams keep ownership of their routes and route wording,
request/domain models, user-facing service copy, synthetic fixtures, service
tests, and the decision about when to adopt a compatible shared release.
Service-specific data and behavior must not be moved into a shared package just
to make reuse easier.

See the [workspace ownership decision](./workspace-design.md) for dependency
direction and repository layout.

## Worked example: permit appointment status

The following service-owned component uses a semantic token, shared accessible
card, and shared text utility. The heading and message are owned by Permits;
its demo fixture remains in `services/permits/demo-fixtures.ts`. A host may
choose a route for `PermitsModule`, but the route and any request model remain
the service/host's responsibility rather than becoming part of `ServiceCard`.

```tsx
import { civicNestSemanticTokens } from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { permitsSuccessDemoFixture } from "./demo-fixtures";

export function PermitsSummary() {
  const message = normalizeDisplayText(
    permitsSuccessDemoFixture.options
      .map((option) => `${option.label}: ${option.detail}`)
      .join(". "),
  );

  return (
    <ServiceCard
      title="Permits"
      description={normalizeDisplayText("Example permit appointment options.")}
    >
      <p role="status" style={{ color: civicNestSemanticTokens.colorEmphasis }}>
        {message}
      </p>
    </ServiceCard>
  );
}
```

`ServiceCard` supplies an article with an accessible name from its title and
description from its description prop. The `status` role announces the
service-owned result; the semantic token supplies its visual emphasis without
hard-coding a color. For interactive loading, retry, or error behavior, keep
the state machine and copy in the service module, expose native keyboard
controls and appropriate `status`/`alert` semantics, and verify those states
through Testing Library. Do not treat styling as a substitute for meaning or
accessible structure.

The checked-in `services/permits/index.tsx` is a complete example with a
service-local loading/success fixture and keyboard-operable action. It currently
uses the deprecated `civicNestTokens.colorAccent` to demonstrate the supported
compatibility window; new or migrating code should use
`civicNestSemanticTokens.colorEmphasis`. See the
[token migration guide](./deprecation-and-migration.md#implemented-example-coloraccent-to-coloremphasis).

## Dependency ranges, upgrades, and release evidence

Today, CivicNest is a single Vite build: packages and services are source
directories mapped through TypeScript and Vite aliases. They do not have
separate `package.json` files, registry versions, or independently resolved
dependency ranges. The root `package.json` version (`0.1.0`) describes the
application, not a separately released service or shared package. The
`pnpm-lock.yaml` pins third-party dependencies; the current shared package
contract is the source revision used by the build.

If a service later consumes independently published packages:

1. Declare the compatible shared-package range in that service's manifest
   (or its release record until service manifests exist). Use the range only
   when its full compatibility promise has been verified; for example,
   `@civicnest/ui: ^1.3.0` accepts compatible `1.x` releases from `1.3.0`,
   not a major `2.x` release.
2. Record the exact resolved package version, compatible host range, and
   service/module source revision that were tested. A range is not evidence
   that every release inside it was exercised. Use an exact pin or narrower
   range when the wider range has not been verified. Make pre-1.0 compatibility
   explicit.
3. Before upgrading, read the package's public contract and release record.
   Update the dependency and lockfile intentionally, then run the checks below
   and review the service's rendered/interactive behavior. Do not silently
   substitute a new shared-package version underneath a deployed service.
4. For a regression, restore the last known compatible dependency range and
   exact lockfile resolution together, rebuild/redeploy the service artifact,
   and repeat the synthetic smoke/accessibility checks. Keep the failing
   revision and sanitized diagnostics for investigation; do not revert a
   shared package for every consumer unless the package owner confirms it is
   the source of the regression.

Apply the [versioning and compatibility policy](./public-contracts.md#version-policy-and-package-dependencies)
and, for a deprecated API, the [deprecation and migration process](./deprecation-and-migration.md).
Record proposals using the [release record template](./release-record-template.md).

## Quality checks and evidence

Before asking for review or adopting a shared package change, run:

```powershell
pnpm boundaries
pnpm contracts
pnpm test
pnpm typecheck
pnpm check
```

`pnpm check` is the complete gate (lint, boundaries, public contracts and
consumer type-checking, tests, formatting, TypeScript, and production build).
The standalone commands help isolate a failure. Consumer fixtures under
`consumer-fixtures/` model downstream service imports from public package
roots. Update or add a fixture when a proposed public contract needs new
consumer evidence; never make a fixture compile by importing package internals.

Include in the change or release record: the shared package and service
revision/version tested, compatible range when applicable, exact commands and
results, affected consumers, accessible roles/names/keyboard/state checks,
token role and contrast review, visual review, rollback target, and release
classification. See the [compatibility checks and their limits](./public-contracts.md#compatibility-verification).
The [clean-checkout verification record](./service-consumption-verification.md)
shows the worked Permits fixture and full gate succeeding from a fresh worktree.
Automated checks prove export presence, TypeScript compatibility for covered
fixtures, and the user-visible behavior actually asserted by tests. They do not
decide accessibility in every browser/assistive technology, token semantics,
visual regression risk, or whether the change is patch/minor/major; those need
the relevant human owners and reviewers.

## Demonstration version identification

In the current single-build demonstration, a service module and its imported
shared packages come from the same repository revision; there is no separate
deployed service/package version or public version endpoint. In a checkout,
record the branch and exact source revision with:

```powershell
git branch --show-current
git rev-parse HEAD
```

The root `package.json` version is the CivicNest application version only.
Do not present it as a service or package version. For a deployed demo, ask its
release owner for the immutable deployment/source revision associated with the
environment and compare it with the commit and release record. If the demo
does not expose or provide that signal, mark the serving revision as **unknown**,
capture the environment and time, and request the deployment manifest/build
record from its owner; do not infer a version from a browser title, cached UI,
or local branch.

When independent deployment is introduced, follow
[release operations](./release-operations.md#identifying-the-version-serving-a-resident):
the service manifest should identify the service, semantic version, immutable
source revision, build time, and compatible host/shared-contract range. Never
put secrets, resident/request data, or production endpoints in a public
diagnostic manifest.

## Troubleshooting

### Boundary check fails

Run `pnpm boundaries` and read the reported source, line, and target. Replace
deep imports with the documented `@civicnest/<package>` root. If the import is
to another service or a shared package depends on service code, move the
shared behavior to a genuinely service-neutral contract or keep it local.
Do not disable the rule or add an informal allow-list; follow the
[boundary exception process](./workspace-design.md#requesting-a-boundary-exception)
if a real exception is necessary.

### Compatibility check fails

Run `pnpm contracts`. For a missing/undocumented export, compare the entry-point
exports to the [public contract table](./public-contracts.md#initial-export-contracts)
and decide whether the API or documentation is intended to change. For a
consumer type error, read the fixture diagnostic, correct the consumer against
the supported public type, or revise the proposed package contract with the
owners. A deep import in a fixture is not a workaround. Re-run
`pnpm contracts`, then `pnpm check`.

### Upgrade causes a regression

Stop promotion. Identify the last verified package resolution/service build
from the lockfile or deployment manifest, restore that exact compatible
resolution (and its range/lockfile together), rebuild and redeploy the
service, then run `pnpm check` and the service's synthetic keyboard, status,
error/retry, and visual checks. Record the failing and restored revisions and
sanitized results; notify both service and package owners before retrying.
Current source packages ship together, so revert the consuming service change
to its verified source revision rather than pretending there is an independent
package artifact to roll back.

### Deployed-version signal is missing

Do not guess from the root application version or page title. Mark the served
version unknown, capture only the environment name and observation time, and
ask the deployment owner for the immutable build/source revision and manifest.
Compare that revision with the service release record. If the owner cannot
provide it, treat this as a release-observability gap and request the manifest
described in [release operations](./release-operations.md#identifying-the-version-serving-a-resident)
before making a compatibility claim.
