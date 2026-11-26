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

| Supported import           | Export                                | Intended use and input                                                                                                                                                                                                     | Output or rendered behavior                                                                                                                                                                                               | Compatibility commitment and limitations                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@civicnest/design-tokens` | `civicNestTokens`                     | Read the original five shared visual values: deprecated `colorAccent`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`. Use `civicNestSemanticTokenTaxonomy` for new code.                                          | A readonly object whose five keys include deprecated `colorAccent` returning `"#39765c"` during its deprecation window via a dev-warning getter; the other four keys are stable.                                          | The original five-key shape and `CivicNestTokenName` union are preserved throughout the deprecation window so exhaustive consumers compile without change. `colorAccent` is scheduled for removal only in the next major version after migration is complete. These are starter values, not a complete theme or a guarantee of contrast for every combination. |
| `@civicnest/design-tokens` | `CivicNestTokens`                     | TypeScript interface describing the five-key `civicNestTokens` shape (with `@deprecated` JSDoc on `colorAccent`).                                                                                                          | Readonly interface with five properties; `colorAccent` is marked `@deprecated` and types-checks identically during the window.                                                                                            | The interface shape is unchanged from the pre-deprecation contract; exhaustive consumers of its keys continue to compile. Removing `colorAccent` from the interface is deferred to the next major version.                                                                                                                                                     |
| `@civicnest/design-tokens` | `CivicNestTokenName`                  | Use as a TypeScript type when a consumer needs to store or accept one of the original token property names.                                                                                                                | Union of the original five `civicNestTokens` property names (`colorAccent`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`). Unchanged from the pre-deprecation contract.                                         | The union is stable; exhaustive consumers of the five names compile without modification. Removing `colorAccent` from the union is a breaking change deferred to the next major version. It does not validate values received from untyped runtime input.                                                                                                      |
| `@civicnest/design-tokens` | `CivicNestTokenValue`                 | Use as a TypeScript type for a value read from `civicNestTokens`.                                                                                                                                                          | Union of the current token string literal values.                                                                                                                                                                         | The type follows the current values; consumers should not encode literal values in place of token roles. It is not a general CSS value type.                                                                                                                                                                                                                   |
| `@civicnest/design-tokens` | `civicNestSemanticTokens`             | Read the flat compatibility aliases: `colorEmphasis`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`. Prefer `civicNestSemanticTokenTaxonomy` for new code.                                                        | A readonly object of string literal values. `colorEmphasis` (`"#39765c"`) is the clearly-named accent emphasis token. Values alias the hierarchical semantic taxonomy.                                                    | Retained for consumers of the earlier semantic export. Adding or removing names requires type and consumer compatibility review; use the hierarchical taxonomy for new shared roles.                                                                                                                                                                           |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenName`          | Use as a TypeScript type for a property name from `civicNestSemanticTokens`.                                                                                                                                               | Union of the five semantic token names (`colorEmphasis`, `colorSurface`, `colorText`, `radiusCard`, `spaceCard`).                                                                                                         | A separate union from `CivicNestTokenName`; expanding it may affect exhaustive consumers and must be checked before merging.                                                                                                                                                                                                                                   |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenValue`         | Use as a TypeScript type for a value read from `civicNestSemanticTokens`.                                                                                                                                                  | Union of the current semantic token string literal values.                                                                                                                                                                | The type follows the current values; consumers should not encode literal values in place of token roles.                                                                                                                                                                                                                                                       |
| `@civicnest/design-tokens` | `CivicNestSemanticTokens`             | Use as a TypeScript type for the complete `civicNestSemanticTokens` object.                                                                                                                                                | Readonly type inferred from the five semantic token properties.                                                                                                                                                           | The type tracks the semantic token object; changing or removing a property is subject to the same compatibility review as the value export.                                                                                                                                                                                                                    |
| `@civicnest/design-tokens` | `civicNestSemanticTokenTaxonomy`      | Read nested semantic roles for readable text, surfaces, action/control states, focus, validation, and status alongside typography, spacing, sizing, and responsive layout. Primitive palette and scale values are private. | Readonly typed object. Includes distinct normal, hover, active, disabled, focus-visible, success, warning, and error values.                                                                                              | Family and leaf names are public contract. Additions are additive; renaming/removing a supported path is breaking. New or changed color values require documented WCAG 2.2 AA contrast review on each intended surface and preserved non-color status communication.                                                                                           |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenTaxonomy`      | TypeScript shape of the hierarchical semantic token object.                                                                                                                                                                | Readonly nested interface describing all supported semantic families and leaves.                                                                                                                                          | Consumers can use this type for package-root token contracts; primitive scale types are not exported.                                                                                                                                                                                                                                                          |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenPath`          | Union of supported dotted semantic token paths such as `color.text.primary`, `spacing.inset.card`, and `focus.ring.color`.                                                                                                 | Compile-time path names for semantic leaves.                                                                                                                                                                              | Adding paths is additive; removing or renaming an existing path is breaking.                                                                                                                                                                                                                                                                                   |
| `@civicnest/design-tokens` | `CivicNestSemanticTokenTaxonomyValue` | Union of leaf value types in the semantic taxonomy.                                                                                                                                                                        | Compile-time value type for semantic token leaf values.                                                                                                                                                                   | Values are token values, not arbitrary CSS values or a general validation type.                                                                                                                                                                                                                                                                                |
| `@civicnest/ui`            | `ServiceCard`                         | Render a non-interactive service-content container. Requires string `title` and `description`; optionally accepts React `children`.                                                                                        | A styled semantic `<article>` with an `<h2>` title and paragraph description. Its accessible name comes from the title, and its accessible description comes from the description. Children render after the description. | These props, semantic elements, accessible name/description, and visual token roles are stable. The component does not provide service navigation, data, loading states, or an interactive control.                                                                                                                                                            |
| `@civicnest/ui`            | `ServiceCardProps`                    | Type a consumer's `ServiceCard` props: required `title: string`, required `description: string`, and optional `children?: ReactNode`.                                                                                      | Describes the component's supported inputs; it intentionally does not expose internal styling or arbitrary article attributes.                                                                                            | Additive optional props may be compatible; changing required props or their meaning is breaking. It relies on React's public `ReactNode` type.                                                                                                                                                                                                                 |
| `@civicnest/utils`         | `normalizeDisplayText`                | Accept a string of display text.                                                                                                                                                                                           | Returns the text with leading/trailing JavaScript whitespace removed and each internal run of JavaScript whitespace replaced with one ASCII space. Whitespace-only input returns an empty string.                         | The input and output remain strings and this normalization behavior is stable. It does not localize, alter punctuation, normalize Unicode composition, or enforce non-empty text; callers retain responsibility for validation and context-appropriate rendering.                                                                                              |

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

`pnpm contracts` runs `scripts/check-public-contracts.cjs` and type-checks
`consumer-fixtures/` with `tsconfig.consumers.json`. The export check reads the
documented package/export pairs in the table above and compares them with the
actual TypeScript exports from each package root. It also checks that consumer
fixtures use only the approved shared-package entry points and that every
documented shared package is exercised. TypeScript then checks those fixtures
with the workspace's strict compiler settings.

The fixtures are small downstream-style modules for Resident Support, Permits,
and Community Services. Each imports tokens, `ServiceCard`, and
`normalizeDisplayText` from `@civicnest/design-tokens`, `@civicnest/ui`, and
`@civicnest/utils`; none imports a `packages/` implementation path. The
fixtures compile against the currently checked-in package contracts and the
dependency versions pinned by the workspace lockfile. Shared packages are not
independently published yet, so there is no separate package-version range to
resolve.

The contract tests in `src/workspace.test.tsx` and the shared component test
exercise package-root imports through Testing Library. They check a card's
accessible article role, name and description, plus an action that reveals a
status message. The tests assert user-observable contract behavior rather than
private component structure.

To prove the guard catches a breaking change before release:

1. Temporarily remove or rename an export listed in the table, for example
   `ServiceCard` in `packages/ui/index.tsx`.
2. Run `pnpm contracts`. The export check must fail with
   `@civicnest/ui is missing documented export "ServiceCard"`; if only its
   props or type contract is broken, TypeScript must report the affected
   consumer fixture and incompatible type.
3. Restore the API or update the public contract and migration/versioning plan
   intentionally. Re-run `pnpm contracts` and `pnpm check` before proceeding.

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

### Verification

- Check that each export in the initial export table is present only at its
  documented package root and that no internal path is supported.
- For a proposed release, check the version decision against the highest
  applicable change class, and record each affected service's compatible
  dependency range and tested resolved version.
- Run `pnpm contracts` and `pnpm test` to verify consumer imports and
  accessible component behavior.
- Run `pnpm format:check` to verify this policy follows repository formatting.
