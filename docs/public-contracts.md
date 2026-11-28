# Shared package public contracts

## Decision record

- **Status:** Accepted for the initial single-Vite application
- **Decision date:** 2026-11-25
- **Scope:** Consumer-visible APIs of shared platform packages; this does not
  introduce independently deployed packages.

### Context

Service modules need dependable shared capabilities without becoming coupled
to package internals or service-specific behavior. The current application is
a single Vite build, so this policy defines compatibility and verification
expectations for package APIs without assuming a separate publishing platform.
See the [workspace boundary decision](./workspace-design.md) for package
ownership and dependency direction.

### Decision

Keep the public surface small and intentional. Each shared package documents
one supported package-root import. Consumers import from that entry point only:

```ts
import {
  civicNestSemanticTokenTaxonomy,
  civicNestSemanticTokens,
  civicNestTokens,
} from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

const existingAccent = civicNestTokens.colorAccent;
const replacementEmphasis = civicNestSemanticTokens.colorEmphasis;
const primaryText = civicNestSemanticTokenTaxonomy.color.text.primary;
```

Do not treat internal paths (for example, `@civicnest/ui/internal`) as public.
Do not add wildcard exports for internal folders. A symbol becomes public only when
it is deliberately exported at the package entry point and documented with
its purpose, inputs, behavior, and compatibility expectations. Service modules
may import these public APIs and stable shared contracts; shared packages
remain independent of service modules.
The [semantic token taxonomy](./design-token-taxonomy.md) documents the token
families, primitive/semantic separation, ownership, and supported consumer scope.

### Initial export contracts

The following are the complete initial shared exports. The supported import
paths are the package roots shown below; files under `packages/` are not
supported consumer import paths.

| Supported import           | Export                                | Intended use and input                                                                                                                                                                                             | Output or rendered behavior                                                                                                                                                                                               | Compatibility commitment and limitations                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@civicnest/design-tokens` | `civicNestTokens`                     | Read the original five shared visual values: deprecated `colorAccent`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`. Use `civicNestSemanticTokenTaxonomy` for new code.                                  | A readonly object whose five keys include deprecated `colorAccent` returning `"#39765c"` during its deprecation window via a dev-warning getter; the other four keys are stable.                                          | The original five-key shape and `CivicNestTokenName` union are preserved throughout the deprecation window so exhaustive consumers compile without change. `colorAccent` is scheduled for removal only in the next major version after migration is complete. These are starter values, not a complete theme or a guarantee of contrast for every combination. |
| `@civicnest/design-tokens` | `CivicNestTokens`                     | TypeScript interface describing the five-key `civicNestTokens` shape (with `@deprecated` JSDoc on `colorAccent`).                                                                                                  | Readonly interface with five properties; `colorAccent` is marked `@deprecated` and types-checks identically during the window.                                                                                            | The interface shape is unchanged from the pre-deprecation contract; exhaustive consumers of its keys continue to compile. Removing `colorAccent` from the interface is deferred to the next major version.                                                                                                                                                     |
| `@civicnest/design-tokens` | `CivicNestTokenName`                  | Use as a TypeScript type when a consumer needs to store or accept one of the original token property names.                                                                                                        | Union of the original five `civicNestTokens` property names (`colorAccent`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`). Unchanged from the pre-deprecation contract.                                         | The union is stable; exhaustive consumers of the five names compile without modification. Removing `colorAccent` from the union is a breaking change deferred to the next major version. It does not validate values received from untyped runtime input.                                                                                                      |
| `@civicnest/design-tokens` | `CivicNestTokenValue`                 | Use as a TypeScript type for a value read from `civicNestTokens`.                                                                                                                                                  | Union of the current token string literal values.                                                                                                                                                                         | The type follows the current values; consumers should not encode literal values in place of token roles. It is not a general CSS value type.                                                                                                                                                                                                                   |
| `@civicnest/design-tokens` | `civicNestSemanticTokens`             | Read the flat compatibility aliases: `colorEmphasis`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`. Prefer `civicNestSemanticTokenTaxonomy` for new code.                                                | A readonly object of string literal values. `colorEmphasis` (`"#39765c"`) is the clearly-named accent emphasis token. Values alias the hierarchical semantic taxonomy.                                                    | Retained for consumers of the earlier semantic export. Adding or removing names requires type and consumer compatibility review; use the hierarchical taxonomy for new shared roles.                                                                                                                                                                           |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenName`          | Use as a TypeScript type for a property name from `civicNestSemanticTokens`.                                                                                                                                       | Union of the five semantic token names (`colorEmphasis`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`).                                                                                                         | A separate union from `CivicNestTokenName`; expanding it may affect exhaustive consumers and must be checked before merging.                                                                                                                                                                                                                                   |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenValue`         | Use as a TypeScript type for a value read from `civicNestSemanticTokens`.                                                                                                                                          | Union of the current semantic token string literal values.                                                                                                                                                                | The type follows the current values; consumers should not encode literal values in place of token roles.                                                                                                                                                                                                                                                       |
| `@civicnest/design-tokens` | `CivicNestSemanticTokens`             | Use as a TypeScript type for the complete `civicNestSemanticTokens` object.                                                                                                                                        | Readonly type inferred from the five semantic token properties.                                                                                                                                                           | The type tracks the semantic token object; changing or removing a property is subject to the same compatibility review as the value export.                                                                                                                                                                                                                    |
| `@civicnest/design-tokens` | `civicNestSemanticTokenTaxonomy`      | Read nested semantic roles for readable text, surfaces, action/control states, focus, validation, status, and responsive spacing/sizing. Primitive palette, scale, and breakpoint values originate in the package. | Readonly typed object. Includes distinct normal, hover, active, disabled, focus-visible, success, warning, error, and responsive layout tokens.                                                                           | Family and leaf names are public contract. Additions are additive; renaming/removing a supported path is breaking. New or changed color values require documented WCAG 2.2 AA contrast review; responsive values require review across the documented viewport ranges without consumer breakpoint copies.                                                      |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenTaxonomy`      | TypeScript shape of the hierarchical semantic token object.                                                                                                                                                        | Readonly nested interface describing all supported semantic families and leaves.                                                                                                                                          | Consumers can use this type for package-root token contracts; primitive scale types are not exported.                                                                                                                                                                                                                                                          |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenPath`          | Union of supported dotted semantic token paths such as `color.text.primary`, `spacing.inset.card`, and `focus.ring.color`.                                                                                         | Compile-time path names for semantic leaves.                                                                                                                                                                              | Adding paths is additive; removing or renaming an existing path is breaking.                                                                                                                                                                                                                                                                                   |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenTaxonomyValue` | Union of leaf value types in the semantic taxonomy.                                                                                                                                                                | Compile-time value type for semantic token leaf values.                                                                                                                                                                   | Values are token values, not arbitrary CSS values or a general validation type.                                                                                                                                                                                                                                                                                |
| `@civicnest/ui`            | `ServiceCard`                         | Render a non-interactive service-content container. Requires string `title` and `description`; optionally accepts React `children`.                                                                                | A styled semantic `<article>` with an `<h2>` title and paragraph description. Its accessible name comes from the title, and its accessible description comes from the description. Children render after the description. | These props, semantic elements, accessible name/description, and visual token roles are stable. The component does not provide service navigation, data, loading states, or an interactive control.                                                                                                                                                            |
| `@civicnest/ui`            | `ServiceCardProps`                    | Type a consumer's `ServiceCard` props: required `title: string`, required `description: string`, and optional `children?: ReactNode`.                                                                              | Describes the component's supported inputs; it intentionally does not expose internal styling or arbitrary article attributes.                                                                                            | Additive optional props may be compatible; changing required props or their meaning is breaking. It relies on React's public `ReactNode` type.                                                                                                                                                                                                                 |
| `@civicnest/utils`         | `normalizeDisplayText`                | Accept a string of display text.                                                                                                                                                                                   | Returns the text with leading/trailing JavaScript whitespace removed and each internal run of JavaScript whitespace replaced with one ASCII space. Whitespace-only input returns an empty string.                         | The input and output remain strings and this normalization behavior is stable. It does not localize, alter punctuation, normalize Unicode composition, or enforce non-empty text; callers retain responsibility for validation and context-appropriate rendering.                                                                                              |

#### Accessibility responsibilities

`ServiceCard` supplies the article semantics and programmatically associates
its heading and description. Consuming services remain responsible for
providing meaningful, non-empty title and description text, placing the
`<h2>` in a logical heading hierarchy, and ensuring any interactive children
are independently keyboard-operable, named, and correctly focused. The card
does not make child controls accessible automatically.

### Cross-package demonstration decision

The service demonstration consumes the existing public `ServiceCard`, token,
and text-normalization APIs from each approved package root. The current card
contract is sufficient for these independently owned fragments, so the
demonstration does not add a service-specific status, error, fixture, or action
export to a shared package. Each service retains its own typed synthetic data
and loading/recovery behavior. Services remain responsible for status and
error semantics, accessible action names, keyboard operation, and visible
keyboard focus; shared `ServiceCard` supplies only the documented article,
heading, and description relationships.

### Version policy and package dependencies

The current single-build workspace does not independently publish or version
its shared packages, and has no package registry or release automation
configured. The rules below define the compatibility policy to use if
independent package versions are introduced; they do not claim that publishing
infrastructure exists. Each shared package receives and advances its own
Semantic Versioning version. A release of one package does not change the
version of another package unless that package's own public contract changes.
Service-module versions are likewise independent of shared-package versions.

Classify changes by their effect on consumers of the documented package-root
entry points. Choose the highest impact that applies to any change in a
release:

| Change class | Version impact                                                                                                                                                                                                                                                                              | Public-contract examples                                                                                                                                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Patch        | Increment patch for a backward-compatible bug fix that restores documented behavior, or a correction to consumer-facing package documentation that does not change the API or behavior. An editorial correction to internal project documentation alone does not require a package release. | Fix a utility implementation to match its documented whitespace behavior; correct a typo in published usage instructions.                                                                                                                                                                                   |
| Minor        | Increment minor for an opt-in, backward-compatible public addition that preserves existing defaults and valid consumer behavior.                                                                                                                                                            | Add a semantic token; add an optional component property; add an exported type or utility; add a documented package-root entry point. Type additions must still be checked for consumer source compatibility, such as exhaustive unions.                                                                    |
| Major        | Increment major when an existing valid consumer must change code, configuration, or assumptions to build or retain the documented behavior.                                                                                                                                                 | Remove or rename a token, export, type, utility, or package entry point; make a prop required or narrow its accepted type; change documented utility behavior incompatibly; change a token's documented role/value format; or alter component semantics, defaults, accessibility, or behavior incompatibly. |

An addition is minor only if it preserves existing consumer source
compatibility. For example, expanding an exported union can break a consumer
that exhaustively handles every member; if contract tests show that impact,
classify the change as major or redesign the addition so existing consumers
remain valid.

Changing the literal value of a design token is not automatically breaking:
the documented semantic role and format are the contract, not an undocumented
literal. Treat a value change as a minor design update only when its role,
format, contrast intent, and existing consumer behavior remain compatible.
Changing those guarantees, or changing a component's existing default
behavior, is major. A bug fix that restores the published contract is patch;
an intentional change to that contract is classified by its compatibility
impact, even if described as a fix.

#### Public design-token evolution

For `@civicnest/design-tokens`, each public semantic path and its documented
meaning are contracts for independently released service teams. The contract
includes the role, supported value format, contrast intent, supported
responsive behavior, and documented focus and interaction guarantees. It is
not limited to the exported TypeScript shape: a change can be breaking even
when every consumer still compiles if it changes contrast, layout, interaction
visibility, or resident-facing meaning in a way consumers reasonably rely on.
Classify the highest impact in a release; do not call a change compatible
solely because type checks pass.

| Token change                               | Patch                                                                                                                                                                                                                       | Minor                                                                                                                                                                                                                              | Major                                                                                                                                                                                                                                                                                                               | Simple check                                                                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Add a semantic token                       | Not normally a patch.                                                                                                                                                                                                       | Add a new optional path, such as a genuinely shared `color.state.info` role, without changing existing defaults or breaking consumers that inspect or exhaustively handle the public shape.                                        | If adding it breaks a valid consumer, such as by widening a closed union used in exhaustive handling, redesign the addition or classify the incompatible change as major.                                                                                                                                           | Run `pnpm contracts`; add a representative consumer and ensure existing consumer fixtures still type-check.                              |
| Correct an unintended value                | Correct a demonstrated defect against the existing documented contract (for example, restore the documented `focus.ring.width` or `color.validation.error` treatment) without breaking a consumer or changing the contract. | If the correction is a compatible design update rather than restoration of a published guarantee, use minor.                                                                                                                       | If the correction changes a behavior or guarantee existing consumers reasonably rely on, use major despite calling it a fix; document the migration and impact.                                                                                                                                                     | Compare the current value and its role with the written contract; run `pnpm check` and the relevant contrast test.                       |
| Change an existing token's value           | Only when the value is wrong relative to an explicit published requirement and the correction restores that requirement without consumer breakage.                                                                          | Tune a value while preserving its semantic role, format, contrast intent, supported surfaces, and existing consumer behavior. For example, adjust `interaction.hover.surface` while retaining a distinct, perceivable hover state. | Change the value in a way that violates documented contrast or format, changes a relied-on visual outcome, hides an interaction state, or requires consumers to change assumptions or implementation.                                                                                                               | Run relevant contrast checks and compare affected states in a browser; record the visual reviewer and consumer impact.                   |
| Change semantic meaning                    | A wording correction that clarifies the same meaning and has no behavior impact.                                                                                                                                            | Add a separate token for a new role; do not repurpose the existing path.                                                                                                                                                           | Repurpose an existing name or materially change its documented meaning, such as turning `color.state.error` into a neutral color or changing `responsive.breakpoint.wide` to mean a different layout mode, even if its type and value format are unchanged.                                                         | Search all consumer uses and have the package owner and affected service owners approve the unchanged or changed meaning.                |
| Rename or remove a token                   | No: the public name remains part of the contract.                                                                                                                                                                           | Introduce a replacement as an additive path, retaining the old path as a deprecated alias with the same meaning and behavior.                                                                                                      | Remove or rename the old path only under the deprecation and migration policy; a rename without a working compatibility alias is major.                                                                                                                                                                             | Run `pnpm contracts` against the alias/replacement and confirm the migration guide and deprecation period.                               |
| Change responsive behavior                 | Correct a defect that violates the documented viewport or reflow contract without breaking existing layouts.                                                                                                                | Make a compatible refinement that preserves supported viewport ranges and consumer behavior, or add an opt-in responsive capability.                                                                                               | Change documented breakpoints, sizing, reflow, or defaults such that supported layouts or consumer assumptions must change.                                                                                                                                                                                         | Run `pnpm check` and inspect the affected consumers at documented narrow, intermediate, and wide widths.                                 |
| Change focus or interaction-state behavior | Fix a defect by restoring a documented guarantee, such as visible keyboard focus or distinct active/disabled treatment, without removing another guarantee.                                                                 | Add a compatible improvement or optional state while preserving keyboard operation, focus visibility, contrast intent, and existing state distinctions.                                                                            | Weaken or remove a documented focus, keyboard, contrast, or state-visibility guarantee, or change behavior consumers rely on. Accessibility regressions are not an acceptable release outcome; a required breaking improvement needs a major-version migration plan and must still meet accessibility requirements. | Run relevant `pnpm test` checks, then manually inspect keyboard focus and affected states; include accessibility review when applicable. |

#### Token release checklist and evidence limits

Complete this checklist for every proposed public token change in the shared
package release record:

- [ ] **Affected consumers:** list each public path changed and search/document
      every consuming service and shared UI use; identify affected defaults,
      surfaces, states, and migration needs.
- [ ] **Automated verification:** run `pnpm contracts` and `pnpm check`;
      record exact results and revision. Add or update tests for documented
      contrast thresholds, responsive contracts, and interaction guarantees when
      affected.
- [ ] **Accessibility review:** where color, sizing, responsive behavior,
      focus, or interaction changes, review applicable WCAG contrast and reflow
      expectations, keyboard visibility/operation, forced-colors behavior, and
      relevant status semantics. Record why a review is not applicable when none
      of these are affected.
- [ ] **Visual-risk assessment:** identify affected components, viewports,
      surfaces, and states; inspect visual diffs or browser renderings and record
      the reviewer and any accepted risk.
- [ ] **Version classification:** apply the table above and the package
      Semantic Versioning rules; record the highest impact and human reviewer.
- [ ] **Release notes:** state token paths, old and new values where relevant,
      documented meanings, visible/accessibility effects, compatibility decision,
      and consumer migration or deprecation steps.
- [ ] **Rollback decision:** record go/no-go, the rollback target or forward-fix
      plan, observable rollback triggers, responsible owner, and how consumers
      already migrated will remain compatible.

Automated checks can establish documented exports, type compatibility for
covered consumers, lint/build/test results, and numeric assertions for the
specific contrast combinations or responsive thresholds they exercise. They
cannot determine whether a token's semantic meaning remains appropriate,
whether an untested visual change harms a consumer's interface, whether
assistive technology communicates the changed state adequately, or which
version impact is justified. Those decisions require human review: the package
owner and affected service owners review semantic meaning and consumer impact;
design and accessibility reviewers assess visual and accessibility risk; and
the release owner records and approves the version classification. A passing
automated check is evidence for its stated scope, not approval of those
judgments.

Services record a compatible dependency range for every shared package they
consume in the service package manifest or, until such manifests exist, in
the release record. For example, `@civicnest/design-tokens: ^1.3.0` declares
acceptance of compatible stable 1.x releases starting at 1.3.0; it does not
prove that a particular resolved release has been tested. Record the exact
resolved package version used for verification and test the service against
that version before adoption. Use a narrower range or exact pin when the
service has not verified the broader range, and make pre-1.0 ranges explicit
because their compatibility expectations differ. A major package release
must not be adopted under an old-major range; affected services update their
range and complete migration and compatibility checks before relying on it.

Use the [release-record template](./release-record-template.md) for a
proposed package release. The [example release record](./release-record-example.md)
shows a compatible token addition and its version decision.

### Compatibility and deprecation

A change is compatible when every existing valid consumer continues to build
and the documented behavior is preserved. Additive optional capabilities are
compatible if defaults do not change. Design-token names and documented
semantics are stable: retain their meaning and supported value format. Changes
to color values must preserve the documented contrast intent and usage role;
consumers must not depend on undocumented implementation values.

Accessible component behavior is part of the public contract, not an
implementation detail. Preserve documented roles, accessible names,
keyboard operation, focus behavior, and state announcements. Improvements
that keep those guarantees are compatible. Removing or changing a guarantee
that requires a consumer change is breaking; accessibility regressions are
not acceptable compatibility changes.

Before removing or renaming a public item, publish its replacement and a
migration guide, mark the old API deprecated in documentation and, for
TypeScript symbols, with `@deprecated`. Keep the old API working for at least
one full minor-release cycle and 90 days, whichever is longer, unless retaining
it creates a material security or accessibility risk. Notify affected service
owners and include a migration issue or checklist. Remove it only in a major
version after the deprecation period and consumer review. See the full
[deprecation and migration policy](./deprecation-and-migration.md) for ownership,
emergency exception criteria, pre-removal evidence requirements, and the live
`colorAccent` to `colorEmphasis` migration plan.

A major change is justified only when the old contract cannot reasonably be
maintained or safely extended, such as correcting a materially misleading
contract, retiring an obsolete API, or addressing a security/accessibility
risk. The change proposal must explain why additive evolution or an alias is
insufficient, identify affected consumers, provide a migration path, and
receive approval from the package owner and affected service owners. Urgent
security or accessibility corrections may shorten the deprecation period;
record the reason and migration impact explicitly.

### Example: renaming a design token

Suppose the public token `--color-action-primary` is being renamed to
`--color-action`. The new token is introduced with the same documented role
and value, while the old name remains an alias:

```css
:root {
  --color-action: #2457a7;
  --color-action-primary: var(--color-action);
}
```

Document `--color-action-primary` as deprecated and give consuming services
the migration instruction to replace it with `--color-action`. The alias
preserves existing builds and visual behavior during migration. Verify both
names resolve to the same value and that the replacement meets the design
system's documented contrast requirement. Remove the alias only in a major
release after the deprecation period and consumer review.

### Compatibility verification

`pnpm contracts` runs `scripts/check-public-contracts.cjs`, type-checks
`consumer-fixtures/` with `tsconfig.consumers.json`, and runs
`src/design-token-contract.test.tsx`. The export check reads the documented
package/export pairs in the table above and compares them with the actual
TypeScript exports from each package root. It also checks that consumer
fixtures use only the approved shared-package entry points and that every
documented shared package is exercised. The design-token consumer fixture
imports the public taxonomy from `@civicnest/design-tokens` only; its exhaustive
path map ties every `CivicNestSemanticTokenPath` to a structural category
(hex color, CSS dimension, font family, numeric weight/line-height, or opacity).
This makes removed paths, unlisted additions, and wrong category types fail
the strict consumer type check. The focused runtime test validates actual token
values against those categories and exercises token-backed accessible focus
and error behavior. No fixture imports `packages/` implementation paths.

The fixtures are small downstream-style modules for Resident Support, Permits,
and Community Services. Each imports tokens, `ServiceCard`, and
`normalizeDisplayText` from `@civicnest/design-tokens`, `@civicnest/ui`, and
`@civicnest/utils`; none imports a `packages/` implementation path. The
fixtures compile against the currently checked-in package contracts and the
dependency versions pinned by the workspace lockfile. Shared packages are not
independently published yet, so there is no separate package-version range to
resolve.

The contract tests in `src/workspace.test.tsx`,
`src/design-token-contract.test.tsx`, and the shared component tests exercise
package-root imports through Testing Library. They check user-observable
accessible roles, names, descriptions, keyboard focus, error announcement,
and state changes rather than relying solely on private implementation
structure.

#### Negative token-contract check

To prove the guard catches a token category break before release:

1. Temporarily change the declared type for `color.text.primary` in
   `CivicNestSemanticTokenTaxonomy` (`packages/design-tokens/index.ts`) from
   its color type to `"3px"`.
2. Run `pnpm contracts`. It must fail TypeScript validation because the
   implementation's color value and the public consumer fixture's expected
   hex-color category no longer match the declared contract.
3. Restore the declaration immediately, then run `pnpm contracts` and
   `pnpm check` again. Do not commit the intentional break.

This token negative check was exercised on 2026-11-28: changing the declared
`color.text.primary` type to `"3px"` made `pnpm contracts` fail with
TS2322 in `consumer-fixtures/design-tokens/index.ts`: the value did not satisfy
its hex-color category. It also reported the matching implementation/type
mismatch in `packages/design-tokens/index.ts`. The declaration was restored
immediately; the rerun passed all three focused token-contract tests and the
consumer type-check.

The export guard also has a negative check: temporarily rename `ServiceCard`
in `packages/ui/index.tsx`; `pnpm contracts` must report
`@civicnest/ui is missing documented export "ServiceCard"`. Restore it
immediately and verify the normal command passes.

This negative check was exercised on 2026-11-26 by temporarily renaming
`ServiceCard` in `packages/ui/index.tsx`. `pnpm contracts` failed before
type-checking with `@civicnest/ui is missing documented export "ServiceCard"`
and identified the unlisted `ServiceCardBreakingChange`. The original export
was restored immediately. The rerun passed with 11 documented exports across
three shared packages, and `pnpm check` passed boundaries, all 13 tests in
five files, formatting, type checks, and the production build.

The command proves that documented names are exported, that representative
consumers type-check through approved roots, and that covered accessible
behaviors pass in the test environment. It cannot decide whether a token's
meaning is still appropriate, a visual change creates regression risk, an
interaction remains usable in every assistive technology/browser, or which
release classification a proposal deserves. The package owner and affected
service owners must review semantic token meaning and migration impact;
accessibility review must assess semantic and keyboard effects; design review
must assess visual/contrast risk; and release owners must classify the change
under this policy. Automated results do not replace those human approvals.

Run `pnpm contracts` for the targeted export/type guard and `pnpm check` for
the complete release gate, including Testing Library behavior, boundaries,
formatting, and production build. No deep-import paths or wildcard exports are
configured for shared packages.

#### Manual visual and accessibility review

Automation verifies structural categories, documented exports, type
compatibility for covered consumers, selected numeric contrast thresholds,
stylesheet token wiring, and user-observable states in the test environment.
It cannot establish subjective visual quality, detect every cross-service
regression, or prove assistive-technology behavior. For every token change
affecting rendering, reviewers must manually:

1. Identify each affected consumer and state from the token path, then run the
   app with synthetic data.
2. Compare before/after screenshots or browser inspection at the documented
   narrow (320px), intermediate (768px), and wide (1280px) viewports; inspect
   wrapping, clipping, reflow, affected surfaces, and state distinction.
3. Use the keyboard to reach every affected action and verify the focus
   indicator remains visible and distinguishable in normal, hover, active,
   disabled, and forced-colors modes where applicable.
4. Review relevant text and non-text contrast against the token taxonomy's
   documented thresholds; have accessibility review assess changed semantics,
   focus, reflow, and announcements with the supported assistive-technology
   matrix where applicable.
5. Record the source revision, consumers, viewports/states inspected,
   accessibility and visual reviewers, findings, and disposition in the
   release record. Human reviewers—not unit tests—approve semantic meaning,
   visual-regression risk, accessibility impact, and release classification.

### Verification

- Check that each export in the initial export table is present only at its
  documented package root and that no internal path is supported.
- Run `pnpm contracts` to verify the complete curated token path/category
  contract, public package exports, and downstream fixture type checks.
- For a proposed release, check the version decision against the highest
  applicable change class, and record each affected service's compatible
  dependency range and tested resolved version.
- Run `pnpm contracts` and `pnpm test` to verify consumer imports and
  accessible component behavior.
- Run `pnpm format:check` to verify this policy follows repository formatting.
