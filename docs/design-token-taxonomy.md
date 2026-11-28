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

| Family             | Example paths                                                                                                                                                                                                                                                                                                                                  | Intended meaning                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Color              | `color.text.primary`, `color.text.muted`, `color.surface.canvas`, `color.surface.card`, `color.action.text`, `color.action.surface`, `color.border.emphasis`, `color.state.success`, `color.state.successBorder`, `color.state.warning`, `color.state.warningBorder`, `color.state.error`, `color.state.errorBorder`, `color.validation.error` | Content, action, surface, border, status, and validation roles; names describe purpose, not hue or palette index.               |
| Typography         | `typography.family.body`, `typography.size.body`, `typography.size.heading`, `typography.weight.semibold`, `typography.lineHeight.body`                                                                                                                                                                                                        | Shared text family, scale, weight, and line-height roles.                                                                       |
| Spacing            | `spacing.inline.regular`, `spacing.stack.relaxed`, `spacing.inset.card`                                                                                                                                                                                                                                                                        | Distances by relationship and density, independent of primitive scale numbers.                                                  |
| Sizing             | `sizing.icon.default`, `sizing.control.minHeight`, `sizing.content.maxWidth`, `sizing.radius.card`                                                                                                                                                                                                                                             | Shared component and content dimensions.                                                                                        |
| Responsive layout  | `responsive.breakpoint.compact`, `responsive.breakpoint.wide`, `responsive.gutter.pageCompact`, `responsive.gutter.pageWide`, `responsive.inset.cardCompact`, `responsive.inset.cardWide`, `responsive.sizing.cardMinimum`, `responsive.sizing.contentMaxWidth`                                                                                | Shared viewport steps, page gutters, card insets, minimum card width, and content cap. Service modules compose their own pages. |
| Focus              | `focus.ring.color`, `focus.ring.width`, `focus.ring.offset`                                                                                                                                                                                                                                                                                    | Visible keyboard focus indicator properties and contrast-tested supported surfaces.                                             |
| Interaction states | `interaction.hover.surface`, `interaction.active.surface`, `interaction.disabled.text`, `interaction.disabled.surface`                                                                                                                                                                                                                         | Distinct normal, hover, focus-visible, active, and disabled treatments. Disabled colors retain readable contrast.               |

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
consumer type impact. Public names and documented meanings are consumer
contracts, including visual and accessibility behavior. Use the
[token evolution rules and release checklist](./public-contracts.md#public-design-token-evolution)
to classify value, semantic, responsive, focus, and interaction changes.
Renaming or removing an existing public path is a breaking contract change and
follows the [deprecation and migration](./deprecation-and-migration.md)
policies. Verify public exports and representative consumers with
`pnpm contracts`; run `pnpm check` before review. Automated checks do not
replace human review of semantic meaning, visual risk, accessibility impact,
or release classification.

## Accessible visual states and contrast

The visual system targets **WCAG 2.2 Level AA** for its supported component
combinations; this token-level target is not a claim that the whole application
or every consumer is certified. Normal text is designed for at least 4.5:1
contrast (SC 1.4.3). Control boundaries and state graphics target at least
3:1 against adjacent colors (SC 1.4.11). Keyboard focus uses a solid 3 CSS-pixel
outline with a 3-pixel offset, exceeding the 2-pixel perimeter area in the
minimum focus appearance criterion, and has at least 3:1 contrast against
each supported action surface (SC 2.4.11).

Ratios below use the WCAG sRGB relative-luminance formula and the foreground
and adjacent background named in each row. The same calculation is exercised
by the `meets documented text, state, border, and focus contrast thresholds`
test in `src/workspace.test.tsx`.

| Use                           | Foreground / indicator | Intended surface                         |                  Contrast | Expectation                                                                       |
| ----------------------------- | ---------------------- | ---------------------------------------- | ------------------------: | --------------------------------------------------------------------------------- |
| Primary text and action label | `#183229`              | Card/action white `#ffffff`              |                   13.75:1 | 4.5:1 minimum                                                                     |
| Muted text                    | `#53665d`              | White `#ffffff`                          |                    6.13:1 | 4.5:1 minimum                                                                     |
| Action border                 | `#39765c`              | White `#ffffff`                          |                    5.36:1 | 3:1 minimum                                                                       |
| Action label and border       | `#183229` / `#39765c`  | Hover `#edf5f0`                          |          12.39:1 / 4.83:1 | 4.5:1 text / 3:1 boundary                                                         |
| Action label and border       | `#183229` / `#39765c`  | Active `#dcebe1`                         |          11.14:1 / 4.34:1 | 4.5:1 text / 3:1 boundary                                                         |
| Disabled action text          | `#53665d`              | Disabled surface `#e0e5e1`               |                    4.81:1 | Kept readable, although disabled controls are exempt from these contrast criteria |
| Success text/border           | `#39765c`              | Success surface `#eaf5ee`                |                    4.79:1 | 4.5:1 text / 3:1 boundary                                                         |
| Warning text/border           | `#684500`              | Warning surface `#fff5d6`                |                    7.90:1 | 4.5:1 text / 3:1 boundary                                                         |
| Error status text/border      | `#702424` / `#8b2e2e`  | Error surface `#fff4f3`                  |           9.91:1 / 7.71:1 | 4.5:1 text / 3:1 boundary                                                         |
| Validation text/border        | `#702424` / `#8b2e2e`  | Validation surface `#fff4f3`             |           9.91:1 / 7.71:1 | 4.5:1 text / 3:1 boundary                                                         |
| Focus outline                 | `#183229`              | White, hover `#edf5f0`, active `#dcebe1` | 13.75:1, 12.39:1, 11.14:1 | At least 3:1 on each                                                              |

`ServiceCard` supplies the semantic token values as CSS custom properties to
its content. Shared service action styles use separate normal, hover, active,
disabled, and `:focus-visible` rules; no reset removes the outline. A
forced-colors rule allows the system `CanvasText` focus color. Tests tab to a
service action and check that the focused control has a solid 3-pixel outline.
Visual review is still required in supported browsers, including high-contrast
mode and zoom.

Status color is supplementary, never the only cue: success and loading use
visible text in a `role="status"` region, failures use readable text in a
`role="alert"` region, validation consumers must associate an error message
with its field using `aria-invalid` and `aria-describedby`, and cautionary
content retains its wording with note semantics. Icons may reinforce a state but must not replace its text or
semantic structure. Token definitions alone do not prove screen-reader
behavior; rendered role, name, and state tests are separate compatibility
evidence. The palette and aliases remain service-neutral and contain no
business wording or request data.

## Responsive layout contract

The shared demonstration supports **narrow viewports from 320px to 639px**,
**intermediate viewports from 640px to 1023px**, and **wide viewports from
1024px upward**. The design tokens express the steps as
`responsive.breakpoint.compact` (`40rem`) and
`responsive.breakpoint.wide` (`64rem`) so implementation follows the user's
root font size. Below 40rem, the page uses a 1rem gutter and cards use a
0.75rem inset; at and above 40rem these become 2rem and 1.25rem. At 64rem, the
shared service list switches to three equal columns. Content remains capped at
64rem and each grid item has a 16rem preferred minimum that shrinks to the
available width rather than causing horizontal scrolling.

Token names describe layout roles, not device models: `breakpoint.compact` and
`breakpoint.wide` govern shared viewport transitions;
`gutter.pageCompact/pageWide` and `inset.cardCompact/cardWide` provide spacing
values; `sizing.cardMinimum/contentMaxWidth` describe constraints. The
`src/styles.css` responsive adapter is the single place that translates the
breakpoints into CSS media rules (CSS media queries cannot consume custom
properties); a contract test compares each media threshold to the public
breakpoint token. Service modules consume the shared `ServiceCard` and
portfolio layout, and must not copy breakpoint numbers or redefine shared
card sizing. They retain ownership of page composition, content density, and
service-specific responsive decisions inside those boundaries.

The fixed two-step strategy is easier to document, govern, and test across
independently released modules, and makes visual regression review predictable.
Highly fluid rules can fit unusual content and intermediate widths more
precisely, but add design and testing combinations and increase visual
regression risk. The shared grid still uses fluid available-width sizing within
the governed steps; only additional step changes are deliberately limited.

The representative synthetic content intentionally includes long guidance,
appointment labels, status descriptions, validation feedback, and resource
summaries. Cards and text allow shrinking and wrapping, action controls keep a
minimum operable height while allowing multi-line labels, and focus styling
remains present at both steps. Verify with `pnpm test` and inspect the app at
320px, 768px, and 1280px widths before release. Browser pixel geometry must
be reviewed in a real browser; JSDOM tests verify token-to-CSS wiring and
semantic behavior, not actual rendered widths.

### Browser verification record

On 2026-11-26, the synthetic app was checked in the integrated browser at
320px, 375px, 639px, 640px, 768px, 1023px, 1024px, and 1280px. At every width,
`document.documentElement.scrollWidth` was no greater than the viewport width,
each service card's content width contained its scroll width, and every
rendered action stayed within its card. The 320px view used one column, 639px
and 768px used two, and 1023px through 1280px used three; the page gutter/card
inset changed from 16px/12px below 40rem to 32px/20px at and above 40rem.
The long Permits and Community Services success fixtures were opened before
measurement to exercise the content wrap. Keyboard focus remained
`:focus-visible` with a computed `rgb(24, 50, 41) solid 3px` outline at all
checked widths. Tests also render a long fictional validation message with
`aria-invalid`/`aria-describedby` and verify its wrap rule and accessible
description.

The long validation fragment from
`associates readable validation feedback with its field` was additionally
mounted in a Resident Support card in the same browser, using the exact test
label, input attributes, message, CSS classes, and shared-card token values.
At **320px**, the input measured 262×44px and the validation message 262×102px;
at **1280px**, they measured 289×44px and 289×81px. The message wrapped to fit
its container at both sizes, with no field/message or message/button overlap.
`document.documentElement.scrollWidth` measured 320px and 1265px respectively,
both no greater than the viewport (`innerWidth`) and with no horizontal
overflow. Pressing Tab focused the field at each width; it matched
`:focus-visible` and showed a computed `rgb(24, 50, 41) solid 3px` outline.
The following action remained visible and operable below the message. These
checks confirmed the field sizing rule (`width: 100%`, `min-height: 2.75rem`)
keeps the input usable and its validation text readable in the actual browser.
