import {
  civicNestSemanticTokenTaxonomy as tokens,
  type CivicNestSemanticTokenPath,
  type CivicNestSemanticTokenTaxonomy,
} from "@civicnest/design-tokens";

type HexColor = `#${string}`;
type CssDimension = `${number}px` | `${number}rem` | `${number}em`;
type NumericString = `${number}`;

type LeafPaths<Value, Prefix extends string = ""> = {
  [Key in keyof Value & string]: Value[Key] extends string
    ? `${Prefix}${Key}`
    : LeafPaths<Value[Key], `${Prefix}${Key}.`>;
}[keyof Value & string];
type IsEqual<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false;
type Assert<Condition extends true> = Condition;

type TaxonomyPathsMatchPublicContract = Assert<
  IsEqual<LeafPaths<CivicNestSemanticTokenTaxonomy>, CivicNestSemanticTokenPath>
>;
export const taxonomyPathsMatchPublicContract: TaxonomyPathsMatchPublicContract = true;

type TokenValueFor<Path extends CivicNestSemanticTokenPath> = Path extends
  | `color.${string}`
  | "focus.ring.color"
  | `interaction.${string}.text`
  | `interaction.${string}.surface`
  ? HexColor
  : Path extends `typography.family.${string}`
    ? string
    : Path extends
          | `typography.weight.${string}`
          | `typography.lineHeight.${string}`
          | `interaction.${string}.opacity`
      ? NumericString
      : CssDimension;

export const publicTokenValues = {
  "color.text.primary": tokens.color.text.primary,
  "color.text.muted": tokens.color.text.muted,
  "color.text.inverse": tokens.color.text.inverse,
  "color.surface.canvas": tokens.color.surface.canvas,
  "color.surface.card": tokens.color.surface.card,
  "color.surface.interactiveHover": tokens.color.surface.interactiveHover,
  "color.surface.interactiveActive": tokens.color.surface.interactiveActive,
  "color.surface.disabled": tokens.color.surface.disabled,
  "color.action.text": tokens.color.action.text,
  "color.action.surface": tokens.color.action.surface,
  "color.action.border": tokens.color.action.border,
  "color.emphasis.primary": tokens.color.emphasis.primary,
  "color.border.subtle": tokens.color.border.subtle,
  "color.border.emphasis": tokens.color.border.emphasis,
  "color.state.success": tokens.color.state.success,
  "color.state.successSurface": tokens.color.state.successSurface,
  "color.state.successBorder": tokens.color.state.successBorder,
  "color.state.warning": tokens.color.state.warning,
  "color.state.warningSurface": tokens.color.state.warningSurface,
  "color.state.warningBorder": tokens.color.state.warningBorder,
  "color.state.error": tokens.color.state.error,
  "color.state.errorSurface": tokens.color.state.errorSurface,
  "color.state.errorBorder": tokens.color.state.errorBorder,
  "color.disabled.text": tokens.color.disabled.text,
  "color.disabled.surface": tokens.color.disabled.surface,
  "color.disabled.border": tokens.color.disabled.border,
  "color.validation.error": tokens.color.validation.error,
  "color.validation.errorSurface": tokens.color.validation.errorSurface,
  "color.validation.errorBorder": tokens.color.validation.errorBorder,
  "typography.family.body": tokens.typography.family.body,
  "typography.size.caption": tokens.typography.size.caption,
  "typography.size.body": tokens.typography.size.body,
  "typography.size.heading": tokens.typography.size.heading,
  "typography.weight.regular": tokens.typography.weight.regular,
  "typography.weight.semibold": tokens.typography.weight.semibold,
  "typography.weight.bold": tokens.typography.weight.bold,
  "typography.lineHeight.body": tokens.typography.lineHeight.body,
  "typography.lineHeight.compact": tokens.typography.lineHeight.compact,
  "spacing.inline.compact": tokens.spacing.inline.compact,
  "spacing.inline.regular": tokens.spacing.inline.regular,
  "spacing.inline.relaxed": tokens.spacing.inline.relaxed,
  "spacing.stack.compact": tokens.spacing.stack.compact,
  "spacing.stack.regular": tokens.spacing.stack.regular,
  "spacing.stack.relaxed": tokens.spacing.stack.relaxed,
  "spacing.inset.card": tokens.spacing.inset.card,
  "sizing.icon.default": tokens.sizing.icon.default,
  "sizing.control.minHeight": tokens.sizing.control.minHeight,
  "sizing.content.maxWidth": tokens.sizing.content.maxWidth,
  "sizing.radius.card": tokens.sizing.radius.card,
  "responsive.breakpoint.compact": tokens.responsive.breakpoint.compact,
  "responsive.breakpoint.wide": tokens.responsive.breakpoint.wide,
  "responsive.gutter.page": tokens.responsive.gutter.page,
  "responsive.gutter.pageCompact": tokens.responsive.gutter.pageCompact,
  "responsive.gutter.pageWide": tokens.responsive.gutter.pageWide,
  "responsive.inset.cardCompact": tokens.responsive.inset.cardCompact,
  "responsive.inset.cardWide": tokens.responsive.inset.cardWide,
  "responsive.sizing.cardMinimum": tokens.responsive.sizing.cardMinimum,
  "responsive.sizing.contentMaxWidth": tokens.responsive.sizing.contentMaxWidth,
  "focus.ring.color": tokens.focus.ring.color,
  "focus.ring.width": tokens.focus.ring.width,
  "focus.ring.offset": tokens.focus.ring.offset,
  "interaction.hover.surface": tokens.interaction.hover.surface,
  "interaction.active.surface": tokens.interaction.active.surface,
  "interaction.disabled.opacity": tokens.interaction.disabled.opacity,
  "interaction.disabled.text": tokens.interaction.disabled.text,
  "interaction.disabled.surface": tokens.interaction.disabled.surface,
  "interaction.active.opacity": tokens.interaction.active.opacity,
} satisfies {
  readonly [Path in CivicNestSemanticTokenPath]: TokenValueFor<Path>;
};

export const supportedTaxonomyShape: CivicNestSemanticTokenTaxonomy = tokens;
