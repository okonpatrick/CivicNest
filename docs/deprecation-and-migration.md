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
3. **Preserve the existing token-name type contract.** When adding a replacement
   token, do not expand the existing public `CivicNestTokenName` union. Introduce
   the replacement name in a separate export (`civicNestSemanticTokens` and
   `CivicNestSemanticTokenName`) so exhaustive consumers of the original union
   continue to compile without modification during the deprecation window.
4. **Provide visible developer-facing warnings and documentation.**
   - Mark deprecated TypeScript symbols, properties, and token keys with a
     `@deprecated` JSDoc tag naming the replacement and removal condition.
   - Where runtime code executes in development (such as a deprecated token
     getter, component prop, or utility), emit a concise, once-per-session
     development-only `console.warn` naming the package, deprecated symbol,
     and replacement, guarded so production builds stay clean.
   - Update the [public contract policy](./public-contracts.md) export table
     and migration notes so consumers can inspect the status without reading
     implementation files.
5. **Publish an ordered migration path with recovery steps.** Give each affected
   service team explicit, independent steps to adopt the replacement and verify
   its own module without waiting for other services, including a documented
   recovery path if adoption causes a problem.
6. **Remove only after verification in a major release.** Delete the
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

`@civicnest/design-tokens` exported `colorAccent` (`"#39765c"`) used ambiguously
for both card borders and emphasized status text. To clarify its semantic role
without changing visual presentation or contrast, `civicNestSemanticTokens` is
introduced as a new, separately-named export alongside the preserved legacy
`civicNestTokens`:

- **Consumer example:** Import both names from the supported package root.
  Existing code reads `civicNestTokens.colorAccent`; migrated code reads
  `civicNestSemanticTokens.colorEmphasis`:

  ```ts
  import {
    civicNestSemanticTokens,
    civicNestTokens,
  } from "@civicnest/design-tokens";

  const existingAccent = civicNestTokens.colorAccent;
  const replacementEmphasis = civicNestSemanticTokens.colorEmphasis;
  ```

- **Replacement added:** `civicNestSemanticTokens.colorEmphasis` (`"#39765c"`)
  is exported from `@civicnest/design-tokens` via the new
  `civicNestSemanticTokens` object. Exhaustive consumers of the original
  five-name `CivicNestTokenName` union are unaffected because `colorEmphasis`
  only appears in the new `CivicNestSemanticTokenName` union.
- **Backward compatibility preserved:** `civicNestTokens` retains its original
  five keys — including deprecated `colorAccent` — with the identical value
  `"#39765c"` (5.36:1 contrast against `colorSurface` `#ffffff`). The
  `CivicNestTokenName` union is unchanged so exhaustive TypeScript consumers
  compile without modification.
- **Developer-facing warnings:** `CivicNestTokens.colorAccent` carries a
  TypeScript `@deprecated` JSDoc notice, and accessing
  `civicNestTokens.colorAccent` in development mode logs a one-time
  `console.warn` pointing to `civicNestSemanticTokens.colorEmphasis`
  (tree-shaken from production bundles via `import.meta.env.DEV`).
- **Independent service status (proving separate schedules):**
  - All three service modules and `@civicnest/ui` now consume
    `civicNestSemanticTokenTaxonomy.color.emphasis.primary`.
  - The earlier flat `civicNestSemanticTokens.colorEmphasis` remains available
    for existing consumers, while `civicNestTokens.colorAccent` remains as the
    deprecated five-key compatibility contract.
  - The original independent migration steps below document the adoption path;
    Permits and Community Services have since completed it using the
    hierarchical taxonomy.

### Ordered migration path per service team

Each service team executes these steps independently on its own schedule within
the deprecation window:

The original flat-token migration is complete. New service code should use the
hierarchical semantic taxonomy documented in
[design-token taxonomy](./design-token-taxonomy.md); the prior flat semantic
alias remains available for compatibility during consumer migration.

If a migration regresses, restore only the token import and property
references in that service to the previously verified `civicNestTokens`
properties (use `.colorAccent` for `.colorEmphasis`). Keep unrelated markup,
keyboard handling, status/error semantics, and tests intact. The legacy token
properties remain supported during the deprecation window. Then run
`pnpm check`, confirm the service's accessible behavior below, record the
failure and verified commit in the team's issue, and retry only after its cause
is understood.

1. **Frontend Platform (`@civicnest/design-tokens` and `@civicnest/ui`) —
   completed:**
   - Add `civicNestSemanticTokens` with `colorEmphasis: "#39765c"` alongside
     the preserved `civicNestTokens` (unchanged five-key shape) and document
     the deprecation.
   - Migrate `ServiceCard` in `packages/ui/index.tsx` to
     `civicNestSemanticTokenTaxonomy.color.border.emphasis` and related
     semantic family paths while keeping `<article>`,
     `<h2>`, `<p>`, `aria-labelledby`, and `aria-describedby` unchanged.
   - **Recovery path:** If migration causes a build or test failure, revert
     `packages/ui/index.tsx` to the `civicNestTokens.*` calls it used before,
     run `pnpm check`, confirm all tests pass, and file an issue with the
     failure details before retrying.
2. **Resident Support Service team (`services/resident-support/`) — completed:**
   - Replace `civicNestTokens.colorAccent` with
     `civicNestSemanticTokenTaxonomy.color.emphasis.primary` in
     `services/resident-support/index.tsx`.
   - Verify `ResidentSupportModule` preserves `role="status"`, accessible card
     name/description, and `#39765c` emphasis color, with zero deprecation
     warnings when rendered independently.
   - **Recovery path:** If the semantic taxonomy path is
     unavailable or causes a build failure, revert `services/resident-support/index.tsx`
     to `civicNestTokens.colorAccent` (identical `"#39765c"` value, guaranteed
     available throughout the window). Run `pnpm check`, confirm the module
     passes, record the error details in a team issue, and reattempt once the
     root cause is resolved.
3. **Permits Service team (`services/permits/`) — completed:**
   - Replace `civicNestTokens.colorAccent` with
     `civicNestSemanticTokenTaxonomy.color.emphasis.primary` in
     `services/permits/index.tsx`.
   - Run `pnpm check` and verify keyboard interaction (`Show sample appointment
options` → `Refresh sample appointment options`), `role="status"`,
     `aria-live="polite"`, and `#39765c` styling remain intact.
   - **Recovery path:** If migration causes a build or test failure, revert
     `services/permits/index.tsx` to `civicNestTokens.colorAccent`, run
     `pnpm check` to confirm the permits module still passes all checks, and
     verify keyboard focus and status semantics are intact before filing an
     issue. The deprecated `colorAccent` is guaranteed to remain at `"#39765c"`
     throughout the window; no user-visible or accessible behavior changes
     while the team resolves the issue.
4. **Community Services team (`services/community-services/`) — completed:**
   - Replace `civicNestTokens.colorAccent` with
     `civicNestSemanticTokenTaxonomy.color.emphasis.primary` in
     `services/community-services/index.tsx`.
   - Run `pnpm check` and verify error-alert and retry-to-status recovery
     semantics and `#39765c` styling remain intact.
   - **Recovery path:** If migration causes a build or test failure, revert
     `services/community-services/index.tsx` to `civicNestTokens.colorAccent`,
     run `pnpm check`, confirm that the error-alert and retry behavior pass,
     and file a team issue with details before retrying.
5. **Major release removal (`@civicnest/design-tokens` next major version) —
   gated:**
   - Once at least one minor-release cycle and 90 days have passed and steps
     1–4 are complete and verified, remove `colorAccent` from
     `CivicNestTokens` and `civicNestTokens`, run `pnpm check`, and record the
     major release in a completed release record.

### Accessibility verification record

The following checks were performed for the deprecation example on
`sprint/month-02-2-7f6b839e` with Node.js 22.19.0 and pnpm 10.17.1.

#### Token and type contract checks (automated)

| Check                                                                  | Command                             | Result                                                                                                                                                                       |
| ---------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing five-key `CivicNestTokenName` exhaustive consumer type-checks | `pnpm typecheck`                    | Passed — `assertUnreachableToken` switch covering the original five names compiles without error; `colorEmphasis` is in the separate `CivicNestSemanticTokenName` union only |
| Legacy `colorAccent` returns `"#39765c"` (same as `colorEmphasis`)     | `pnpm test`                         | Passed — `expect(civicNestTokens.colorAccent).toBe(civicNestSemanticTokens.colorEmphasis)`                                                                                   |
| Deprecation warning fires once in dev, not for `colorEmphasis`         | `pnpm test`                         | Passed — `warnSpy.toHaveBeenCalledTimes(1)` and message contains `"civicNestSemanticTokens.colorEmphasis"`                                                                   |
| Resident Support uses the semantic taxonomy emphasis role              | `pnpm test`                         | Passed — `toHaveStyle({ color: civicNestSemanticTokenTaxonomy.color.emphasis.primary })`                                                                                     |
| Permits uses the semantic taxonomy emphasis role                       | `pnpm test`                         | Passed — status uses the same emphasis role while preserving keyboard/status behavior                                                                                        |
| `ServiceCard` article, `aria-labelledby`, `aria-describedby` unchanged | `pnpm test`                         | Passed — `getByRole("article", { name })`, `toHaveAccessibleDescription`                                                                                                     |
| `role="status"` and `role="alert"` preserved                           | `pnpm test`                         | Passed — `getByRole("status")`, `getByRole("alert")`                                                                                                                         |
| Lint and format                                                        | `pnpm lint` and `pnpm format:check` | Passed                                                                                                                                                                       |
| Production build                                                       | `pnpm build`                        | Passed — 39 modules                                                                                                                                                          |

Latest full verification on 2026-11-26: `pnpm check` passed lint, dependency
boundaries (21 source files), all 18 tests in 5 files, formatting, TypeScript,
and the 39-module production build. Standalone `pnpm typecheck` also passed.

#### Keyboard focus and visible focus indicator

The `.service-card :focus-visible` rule in `src/styles.css` defines the visible
focus indicator for controls inside the shared card. `ServiceCard` supplies
focus token values through inherited CSS custom properties:

```css
.service-card :focus-visible {
  outline: var(--cn-focus-ring-width) solid var(--cn-focus-ring-color);
  outline-offset: var(--cn-focus-ring-offset);
}
```

Measured properties:

- **Outline color:** `#183229` (`focus.ring.color`)
- **Outline style:** `solid`
- **Outline width/offset:** `3px` / `3px` (`focus.ring.width` /
  `focus.ring.offset`; indicator is not clipped by the card)
- **Contrast of `#183229` outline against white card surface (`#ffffff`):**
  13.75:1 (above the 3:1 minimum for non-text focus indicators in WCAG 2.2
  SC 2.4.11)
- **Contrast on action hover and active surfaces:** 12.39:1 and 11.14:1.
- **Obstruction:** None — action buttons are not inside a sticky or clipping
  container

The automated keyboard test tabs to the Permits action, verifies it receives
focus, and confirms the stylesheet binds a solid outline to the documented
focus-token values. Browser inspection remains necessary to verify actual
rendering in supported browsers, high-contrast mode, and zoom.

| Keyboard check                                                                       | Automated test                                            | Result                                                                                                |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Tab moves focus to "Show sample appointment options"                                 | `lets a keyboard user reveal sample permit options`       | Passed — `expect(action).toHaveFocus()`                                                               |
| Enter reveals permit options and moves focus to "Refresh sample appointment options" | Same test                                                 | Passed — status contains "Example option A"/"Example option B"; `expect(refreshButton).toHaveFocus()` |
| `role="button"` with correct accessible name throughout                              | All keyboard tests                                        | Passed                                                                                                |
| Community services alert visible before retry; status visible after retry            | `recovers from the community services error when retried` | Passed                                                                                                |

Both migrated (`ResidentSupportModule`) and unmigrated (`PermitsModule`,
`CommunityServicesModule`) consumers preserve identical visual token values,
accessible roles and names, keyboard operation, focus indicator class, and
status/alert semantics throughout the deprecation window.

#### Prior manual browser keyboard check

On 2026-11-26, before semantic visual-state tokens were wired to the shared
card, the Vite app was opened in the integrated browser. Pressing Tab
focused "Show sample appointment options"; its active element matched
`:focus-visible` and computed outline was `rgb(24, 50, 41) solid 3px` with a
`3px` offset. Pressing Enter updated the permit status and moved focus to
"Refresh sample appointment options", which retained the visible outline.
Tab then focused "Retry sample request" with the same visible outline; Enter
replaced the community-services alert with the service status and moved focus
to "Refresh community services", again with the visible outline. The migrated
Resident Support, Permits, and Community Services now consume the semantic
taxonomy while preserving accessible names, descriptions, headings, and
status/alert semantics. This is historical browser evidence, not a manual
inspection of the current CSS-variable wiring; repeat the browser check before
release as noted above.
