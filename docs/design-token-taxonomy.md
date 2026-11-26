# Semantic design-token taxonomy

## Decision and ownership

`@civicnest/design-tokens` owns the shared visual vocabulary used across
CivicNest. The public semantic object is
`civicNestSemanticTokenTaxonomy`, imported only from the package root:

```ts
import { civicNestSemanticTokenTaxonomy } from "@civicnest/design-tokens";

const textColor = civicNestSemanticTokenTaxonomy.color.text.primary;
const focusColor = civicNestSemanticTokenTaxonomy.focus.ring.color;
```

Services and shared UI depend on the semantic role and its type, not a raw
palette slot or spacing scale index. Primitive values in
`packages/design-tokens/index.ts` are implementation details and are not
exported. The existing flat `civicNestSemanticTokens` and deprecated
`civicNestTokens` exports remain available for compatibility; new work should
prefer this taxonomy. The approved export surface and compatibility rules are
listed in [public contracts](./public-contracts.md#initial-export-contracts).

## Initial families

The initial taxonomy is intentionally small and supports the current shared
card and synthetic service modules. Add a token only for a demonstrated shared
need, with an owner and reviewed semantic meaning; do not pre-build a complete
design catalog.

| Family             | Example paths                                                                                                                                                                         | Intended meaning                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Color              | `color.text.primary`, `color.text.muted`, `color.surface.canvas`, `color.surface.card`, `color.emphasis.primary`, `color.border.emphasis`, `color.state.success`, `color.state.error` | Foreground, surface, emphasis, border, and state roles; names describe purpose, not hue or palette index.             |
| Typography         | `typography.family.body`, `typography.size.body`, `typography.size.heading`, `typography.weight.semibold`, `typography.lineHeight.body`                                               | Shared text family, scale, weight, and line-height roles.                                                             |
| Spacing            | `spacing.inline.regular`, `spacing.stack.relaxed`, `spacing.inset.card`                                                                                                               | Distances by relationship and density, independent of primitive scale numbers.                                        |
| Sizing             | `sizing.icon.default`, `sizing.control.minHeight`, `sizing.content.maxWidth`, `sizing.radius.card`                                                                                    | Shared component and content dimensions.                                                                              |
| Responsive layout  | `responsive.breakpoint.compact`, `responsive.breakpoint.wide`, `responsive.gutter.page`                                                                                               | Breakpoint and page-gutter roles for responsive composition.                                                          |
| Focus              | `focus.ring.color`, `focus.ring.width`, `focus.ring.offset`                                                                                                                           | Visible keyboard focus indicator properties.                                                                          |
| Interaction states | `interaction.hover.surface`, `interaction.disabled.opacity`, `interaction.active.opacity`                                                                                             | Shared visual response to pointer and control states. These do not replace disabled semantics or state announcements. |

`CivicNestSemanticTokenTaxonomy` types the nested readonly shape.
`CivicNestSemanticTokenPath` is the union of supported dotted leaf paths, and
`CivicNestSemanticTokenTaxonomyValue` is the corresponding leaf-value union.
All three types and the object are exported from the approved
`@civicnest/design-tokens` entry point. The package does not export a primitive
palette or raw scale.

## Consumer scope and boundaries

The Frontend Platform team owns primitive foundations, semantic definitions,
the public names, and compatibility review. Shared UI components may consume
semantic tokens through the package root. Service teams may consume supported
semantic names through the same root, but retain ownership of their service
routes, route wording, request/domain models, user-facing service copy, and
synthetic fixtures.

The token package must never contain Resident Support, Permits, or Community
Services routes, wording, request models, or fixtures. A service-specific
color/spacing need is not automatically a shared token: first establish that
the role is genuinely shared. The
[workspace decision](./workspace-design.md) defines dependency direction; the
[service-consumption guide](./service-consumption.md) shows a service example
and required checks.

Additive token paths require review for semantic clarity, contrast intent, and
consumer type impact. Renaming or removing an existing public path is a
breaking contract change and follows the
[versioning](./public-contracts.md#version-policy-and-package-dependencies)
and [deprecation](./deprecation-and-migration.md) policies. Verify public
exports and representative consumers with `pnpm contracts`; run `pnpm check`
before review.
