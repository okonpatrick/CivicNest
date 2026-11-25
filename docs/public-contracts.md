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
one supported entry point, such as `packages/design-system/index.ts`. Consumers
import from that entry point only:

```ts
import { Button, tokens } from "@civicnest/design-system";
```

Do not treat internal paths (for example,
`@civicnest/design-system/src/components/Button/internal`) as public. Do not
add wildcard exports for internal folders. A symbol becomes public only when
it is deliberately exported at the package entry point and documented with
its purpose, inputs, behavior, and compatibility expectations. Service modules
may import these public APIs and stable shared contracts; shared packages
remain independent of service modules.

For the current single-build workspace, package versions are compatibility
signals recorded in the package manifest when real packages are introduced;
they do not imply independent deployment. The PR adding a contract change
states the affected package and its intended semantic-version impact. Apply
Semantic Versioning to the public API:

| Change                       | Version impact | Examples                                                                                                                                                     |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Patch                        | Patch version  | Internal fix that preserves documented output, token meaning, and accessible behavior.                                                                       |
| Backward-compatible addition | Minor version  | Add an optional component property, a new token, or a new utility export without changing existing defaults.                                                 |
| Incompatible change          | Major version  | Remove or rename a public export/token, change a documented token's meaning, or alter required component behavior in a way existing consumers must adapt to. |

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

For the existing repository, `pnpm typecheck`, `pnpm test`, `pnpm lint`,
`pnpm format:check`, and `pnpm build` are the available baseline gates. The
package-specific consumer, token, and component contract tests become required
alongside those gates when the corresponding real package is added; no empty
package or publishing infrastructure is required now.

### Verification

- Confirm each shared package has one documented public entry point and no
  wildcard exposure of internal folders.
- Check the versioning, deprecation, and breaking-change rules against the
  token migration example above.
- Confirm automated consumer, token, accessibility, and build-time checks are
  required before a real package contract is adopted.
- Run `pnpm format:check` to verify this policy follows repository formatting.
