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
import { civicNestTokens } from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
```

Do not treat internal paths (for example, `@civicnest/ui/internal`) as public.
Do not add wildcard exports for internal folders. A symbol becomes public only when
it is deliberately exported at the package entry point and documented with
its purpose, inputs, behavior, and compatibility expectations. Service modules
may import these public APIs and stable shared contracts; shared packages
remain independent of service modules.

### Initial export contracts

The following are the complete initial shared exports. The supported import
paths are the package roots shown below; files under `packages/` are not
supported consumer import paths.

| Supported import           | Export                 | Intended use and input                                                                                                                          | Output or rendered behavior                                                                                                                                                                                               | Compatibility commitment and limitations                                                                                                                                                                                                                          |
| -------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@civicnest/design-tokens` | `civicNestTokens`      | Read shared visual values by the documented semantic property names: `colorAccent`, `colorSurface`, `colorText`, `radiusCard`, and `spaceCard`. | A readonly object of string literal values. `colorAccent` is the shared accent emphasis; the other names denote the default surface, text, card radius, and card spacing.                                                 | Property names, value formats, and documented roles are stable. Consumers should use the role, not assume a token's exact literal value. These are starter values, not a complete theme or a guarantee of contrast for every combination.                         |
| `@civicnest/design-tokens` | `CivicNestTokenName`   | Use as a TypeScript type when a consumer needs to store or accept one of the token property names.                                              | Union of the five `civicNestTokens` property names.                                                                                                                                                                       | Adding names is compatible; removing or changing a name is breaking. It does not validate values received from untyped runtime input.                                                                                                                             |
| `@civicnest/design-tokens` | `CivicNestTokenValue`  | Use as a TypeScript type for a value read from the token object.                                                                                | Union of the current token string literal values.                                                                                                                                                                         | The type follows the current values; consumers should not encode literal values in place of token roles. It is not a general CSS value type.                                                                                                                      |
| `@civicnest/ui`            | `ServiceCard`          | Render a non-interactive service-content container. Requires string `title` and `description`; optionally accepts React `children`.             | A styled semantic `<article>` with an `<h2>` title and paragraph description. Its accessible name comes from the title, and its accessible description comes from the description. Children render after the description. | These props, semantic elements, accessible name/description, and visual token roles are stable. The component does not provide service navigation, data, loading states, or an interactive control.                                                               |
| `@civicnest/ui`            | `ServiceCardProps`     | Type a consumer's `ServiceCard` props: required `title: string`, required `description: string`, and optional `children?: ReactNode`.           | Describes the component's supported inputs; it intentionally does not expose internal styling or arbitrary article attributes.                                                                                            | Additive optional props may be compatible; changing required props or their meaning is breaking. It relies on React's public `ReactNode` type.                                                                                                                    |
| `@civicnest/utils`         | `normalizeDisplayText` | Accept a string of display text.                                                                                                                | Returns the text with leading/trailing JavaScript whitespace removed and each internal run of JavaScript whitespace replaced with one ASCII space. Whitespace-only input returns an empty string.                         | The input and output remain strings and this normalization behavior is stable. It does not localize, alter punctuation, normalize Unicode composition, or enforce non-empty text; callers retain responsibility for validation and context-appropriate rendering. |

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
version after the deprecation period and consumer review.

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

### Verification requirements

Protect contracts with executable checks, not release notes alone. When the
first shared package is introduced:

- Add a consumer contract test that imports representative public symbols
  from the package entry point and type-checks a minimal consumer. This catches
  accidental export removal and invalid documented usage.
- Run TypeScript checks and the production build against consumer imports.
  Add a boundary check that rejects deep imports into package internals.
- Test design tokens for required public names, documented aliases during
  deprecation, and their specified semantic/contrast constraints.
- Test shared components through user-observable behavior: accessible role
  and name, keyboard interaction, focus, and announced state where applicable.
  Avoid tests coupled only to private implementation details.
- Require the package owner and affected consumers to review contract changes
  and migration notes; review supplements, but never replaces, automated
  checks.

The initial consumer contract test in `src/workspace.test.tsx` imports from
the approved package roots, type-checks representative token and component
types, and verifies the card's accessible name and description. Run
`pnpm typecheck` and `pnpm test` for the targeted contract check. For broader
validation, `pnpm lint`, `pnpm format:check`, and `pnpm build` are the
repository's additional baseline gates. No deep-import paths or wildcard
exports are configured for shared packages.

### Verification

- Check that each export in the initial export table is present only at its
  documented package root and that no internal path is supported.
- For a proposed release, check the version decision against the highest
  applicable change class, and record each affected service's compatible
  dependency range and tested resolved version.
- Run `pnpm typecheck` and `pnpm test` to verify consumer imports and
  accessible component behavior.
- Run `pnpm format:check` to verify this policy follows repository formatting.
