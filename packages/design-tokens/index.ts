let warnedDeprecatedColorAccent = false;

const sharedTokenValues = {
  emphasis: "#39765c",
  surface: "#ffffff",
  text: "#183229",
  radiusCard: "0.75rem",
  spaceCard: "1.25rem",
} as const;

export interface CivicNestTokens {
  /**
   * @deprecated Use `civicNestSemanticTokens.colorEmphasis` instead. Remains
   * supported with identical value and contrast during the minimum deprecation
   * window (one full minor-release cycle and 90 days) before removal in a
   * future major release.
   */
  readonly colorAccent: typeof sharedTokenValues.emphasis;
  readonly colorSurface: typeof sharedTokenValues.surface;
  readonly colorText: typeof sharedTokenValues.text;
  readonly radiusCard: typeof sharedTokenValues.radiusCard;
  readonly spaceCard: typeof sharedTokenValues.spaceCard;
}

/**
 * Legacy starter token object preserved with its original five keys during the
 * `colorAccent` deprecation window so exhaustive consumers of
 * `CivicNestTokenName` continue to type-check without modification.
 */
export const civicNestTokens: CivicNestTokens = {
  get colorAccent() {
    if (import.meta.env.DEV && !warnedDeprecatedColorAccent) {
      warnedDeprecatedColorAccent = true;
      console.warn(
        "[CivicNest/@civicnest/design-tokens] `civicNestTokens.colorAccent` is deprecated. Migrate to `civicNestSemanticTokens.colorEmphasis`; `civicNestTokens.colorAccent` remains supported during the deprecation window and will only be removed in a future major release.",
      );
    }
    return sharedTokenValues.emphasis;
  },
  colorSurface: sharedTokenValues.surface,
  colorText: sharedTokenValues.text,
  radiusCard: sharedTokenValues.radiusCard,
  spaceCard: sharedTokenValues.spaceCard,
};

export type CivicNestTokenName = keyof CivicNestTokens;
export type CivicNestTokenValue = CivicNestTokens[CivicNestTokenName];

/**
 * Replacement semantic token contract introducing `colorEmphasis` without
 * expanding the legacy `CivicNestTokenName` union for existing exhaustive
 * consumers.
 */
export const civicNestSemanticTokens = {
  colorEmphasis: sharedTokenValues.emphasis,
  colorSurface: sharedTokenValues.surface,
  colorText: sharedTokenValues.text,
  radiusCard: sharedTokenValues.radiusCard,
  spaceCard: sharedTokenValues.spaceCard,
} as const;

export type CivicNestSemanticTokens = typeof civicNestSemanticTokens;
export type CivicNestSemanticTokenName = keyof CivicNestSemanticTokens;
export type CivicNestSemanticTokenValue =
  CivicNestSemanticTokens[CivicNestSemanticTokenName];
