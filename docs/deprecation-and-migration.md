# Public contract deprecation and migration policy

## Decision record

- **Status:** Accepted for CivicNest shared package contracts
- **Decision date:** 2026-11-26
- **Scope:** Controlled deprecation, consumer migration, and removal of public
  APIs exported from shared packages (`@civicnest/design-tokens`, `@civicnest/ui`,
  `@civicnest/utils`, and future shared contracts). The current workspace is a
  single Vite build with no package registry or publishing automation
  configured; these rules govern shared-package contracts in source today and
  package releases if independent publishing is introduced.

## Purpose

Deprecation keeps a supported public contract working temporarily while
giving consuming services a documented, verified path to a replacement. This
prevents abrupt breakage when service teams adopt changes on separate schedules.

## Controlled deprecation process

1. **Introduce the replacement first.** Publish or merge the replacement API
   before or in the same change that marks the old contract deprecated. Never
   schedule removal without a working, documented replacement (except under an
   approved emergency exception).
2. **Preserve backward behavior.** Keep the deprecated contract returning the
   same documented behavior, types, visual contrast, and accessible semantics
   for existing consumers throughout the deprecation window. Do not alter both
   visual presentation and functional behavior in the same deprecation step.
3. **Provide visible developer-facing warnings and documentation.**
   - Mark deprecated TypeScript symbols, properties, and token keys with a
     `@deprecated` JSDoc tag naming the replacement and removal condition.
   - Where runtime code executes in development (such as a deprecated token
     getter, component prop, or utility), emit a concise, once-per-session
     development-only `console.warn` naming the package, deprecated symbol,
     and replacement, guarded so production builds stay clean.
   - Update the [public contract policy](./public-contracts.md) export table
     and migration notes so consumers can inspect the status without reading
     implementation files.
4. **Publish an ordered migration path.** Give each affected service team
   explicit, independent steps to adopt the replacement and verify its own
   module without waiting for other services.
5. **Remove only after verification in a major release.** Delete the
   deprecated contract only in a subsequent major version once the minimum
   window and pre-removal evidence requirements are satisfied.

## Minimum deprecation window

A deprecated public contract must remain supported for **at least one full
minor-release cycle and 90 calendar days, whichever is longer**, starting from
the date the replacement and deprecation notice are available to consumers.

- When the workspace operates as a single build without independently published
  minor releases, the 90-day calendar minimum still applies alongside at least
  one completed sprint/release review cycle after the deprecation notice.
- If an affected service team cannot complete migration within 90 days due to a
  documented dependency conflict, the package owner and service owner record a
  revised target removal date before proceeding.

## Ownership and approval expectations

| Role                                                                                                     | Responsibilities                                                                                                                                                           | Required approvals                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Shared package owner** (Frontend Platform team; Platform Contract Steward for cross-service contracts) | Proposes the deprecation, supplies the replacement and backward-compatible alias, adds warnings and docs, verifies platform checks, and executes removal after gates pass. | Approves the replacement design, deprecation notice, and final removal release record.                                |
| **Affected service owner** (Resident Support, Permits, Community Services teams)                         | Reviews compatibility and migration impact, schedules migration within the service's own cadence inside the window, and verifies service checks after migrating.           | Approves the deprecation plan and signs off that their service no longer depends on the deprecated contract.          |
| **Accessibility / security reviewer** (when affected)                                                    | Verifies contrast, semantics, keyboard/focus behavior, or security posture is preserved across both old and new contracts.                                                 | Required when deprecation touches visual contrast, component semantics, interactive behavior, or security boundaries. |

No single team may silently drop a public contract used by another owned
module.

## Conditions for an emergency exception

Shortening or waiving the minimum deprecation window is permitted **only** when
keeping the deprecated contract available creates an active, unmitigated risk
that cannot be repaired safely through the backward-compatible alias:

- **Security vulnerability:** Exploitable injection, unsafe HTML rendering,
  authorization bypass, or credential/data exposure inherent to the old API.
- **Accessibility harm:** Severe barrier (such as keyboard trap, missing
  accessible name, broken assistive-technology announcement, or failing color
  contrast) that cannot be fixed while maintaining the old contract shape.
- **Critical runtime or data-integrity failure:** Crash or data corruption in
  supported browsers/runtimes with no safe compatible fallback.

Emergency exceptions **must not** be used for naming cleanup, code style, or
routine API modernization. When invoked:

1. The package owner and affected service owners (with security or
   accessibility review as applicable) explicitly approve the shortened window.
2. The [release record](./release-record-template.md) documents the concrete
   risk, why a compatible fix or alias is insufficient, affected consumers,
   immediate migration steps, and a follow-up verification owner and date.

## Evidence required before removal

Before removing a deprecated contract in a major release, the package owner must
attach the following evidence to the release record:

1. **Window elapsed:** Confirmation that at least one minor-release cycle and
   90 days have passed since the deprecation took effect (or link to an
   approved emergency exception).
2. **Consumer migration completed:** Source search and dependency review
   confirming zero remaining references to the deprecated symbol in
   `services/`, `packages/`, `src/`, and documentation examples.
3. **Automated verification:** Passing results after removing the deprecated
   contract for `pnpm typecheck`, `pnpm lint`, `pnpm boundaries`, `pnpm test`,
   `pnpm format:check`, and `pnpm build` (`pnpm check`).
4. **Accessibility and behavior preservation:** Evidence from component/consumer
   tests and manual inspection showing accessible roles, names, heading and
   description associations, keyboard operation, focus visibility, contrast,
   and status/alert announcements remain intact.
5. **Sign-off:** Recorded approvals from the package owner and every affected
   service owner.

## Accessibility preservation rules

- Never remove, weaken, or alter accessible behavior (roles, accessible names,
  `aria-labelledby`/`aria-describedby` relationships, keyboard interaction,
  visible focus indicators, live status/alert announcements, or WCAG 2.2 AA
  contrast ratios) solely because a visual token or presentation API is being
  renamed or modernized.
- During the deprecation window, both the deprecated contract and its
  replacement must meet the same accessibility requirements.
- Verify both unmigrated and migrated consumers with Testing Library role,
  accessible-name, accessible-description, status/alert, and keyboard checks.

## Implemented example: `colorAccent` to `colorEmphasis`

`@civicnest/design-tokens` previously exported `colorAccent` (`"#39765c"`), which
was used ambiguously for both card borders and emphasized status text. To clarify
its semantic role without changing visual presentation or contrast:

- **Replacement added:** `civicNestTokens.colorEmphasis` (`"#39765c"`) is
  exported from `@civicnest/design-tokens`.
- **Backward compatibility preserved:** `civicNestTokens.colorAccent` remains
  exported with the identical value `"#39765c"` (maintaining the same 5.36:1
  contrast against `colorSurface` `#ffffff`).
- **Developer-facing warnings:** `CivicNestTokens.colorAccent` carries a
  TypeScript `@deprecated` JSDoc notice, and accessing
  `civicNestTokens.colorAccent` in development mode logs a one-time
  `console.warn` pointing to `colorEmphasis` (tree-shaken from production
  bundles via `import.meta.env.DEV`).
- **Independent service status (proving separate schedules):**
  - `@civicnest/ui` (`ServiceCard`) and `@civicnest/resident-support`
    (`ResidentSupportModule`) have migrated to `civicNestTokens.colorEmphasis`.
  - `@civicnest/permits` (`PermitsModule`) and `@civicnest/community-services`
    (`CommunityServicesModule`) intentionally remain on
    `civicNestTokens.colorAccent` during the deprecation window to demonstrate
    uninterrupted backward compatibility.

### Ordered migration path per service team

Each service team executes these steps independently on its own schedule within
the deprecation window:

1. **Frontend Platform (`@civicnest/design-tokens` and `@civicnest/ui`) —
   completed:**
   - Export `colorEmphasis: "#39765c"` alongside deprecated
     `colorAccent: "#39765c"` and document the deprecation.
   - Migrate `ServiceCard` in `packages/ui/index.tsx` to `colorEmphasis` while
     keeping `<article>`, `<h2>`, `<p>`, `aria-labelledby`, and
     `aria-describedby` unchanged.
2. **Resident Support Service team (`services/resident-support/`) — completed:**
   - Replace `civicNestTokens.colorAccent` with `civicNestTokens.colorEmphasis`
     in `services/resident-support/index.tsx`.
   - Verify `ResidentSupportModule` preserves `role="status"`, accessible card
     name/description, and `#39765c` emphasis color, with zero deprecation
     warnings when rendered independently.
3. **Permits Service team (`services/permits/`) — scheduled within window:**
   - Replace `civicNestTokens.colorAccent` with `civicNestTokens.colorEmphasis`
     in `services/permits/index.tsx`.
   - Run `pnpm check` and verify keyboard interaction (`Show sample appointment
options` -> `Refresh sample appointment options`), `role="status"`,
     `aria-live="polite"`, and `#39765c` styling remain intact.
4. **Community Services team (`services/community-services/`) — scheduled within
   window:**
   - Replace `civicNestTokens.colorAccent` with `civicNestTokens.colorEmphasis`
     in `services/community-services/index.tsx`.
   - Run `pnpm check` and verify error-alert and retry-to-status recovery
     semantics and `#39765c` styling remain intact.
5. **Major release removal (`@civicnest/design-tokens` next major version) —
   gated:**
   - Once at least one minor-release cycle and 90 days have passed and steps
     1–4 are complete and verified, remove `colorAccent` from
     `CivicNestTokens` and `civicNestTokens`, run `pnpm check`, and record the
     major release in a completed release record.
