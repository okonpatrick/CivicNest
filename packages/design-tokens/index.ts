let warnedDeprecatedColorAccent = false;

const stableTokens = {
  colorEmphasis: "#39765c",
  colorSurface: "#ffffff",
  colorText: "#183229",
  radiusCard: "0.75rem",
  spaceCard: "1.25rem",
} as const;

export interface CivicNestTokens {
  /**
   * @deprecated Use `colorEmphasis` instead. Remains supported with identical
   * value and contrast during the minimum deprecation window (one full
   * minor-release cycle and 90 days) before removal in a future major release.
   */
  readonly colorAccent: typeof stableTokens.colorEmphasis;
  readonly colorEmphasis: typeof stableTokens.colorEmphasis;
  readonly colorSurface: typeof stableTokens.colorSurface;
  readonly colorText: typeof stableTokens.colorText;
  readonly radiusCard: typeof stableTokens.radiusCard;
  readonly spaceCard: typeof stableTokens.spaceCard;
}

export const civicNestTokens: CivicNestTokens = {
  get colorAccent() {
    if (import.meta.env.DEV && !warnedDeprecatedColorAccent) {
      warnedDeprecatedColorAccent = true;
      console.warn(
        "[CivicNest/@civicnest/design-tokens] `civicNestTokens.colorAccent` is deprecated. Migrate to `civicNestTokens.colorEmphasis`; `colorAccent` remains supported during the deprecation window and will only be removed in a future major release.",
      );
    }
    return stableTokens.colorEmphasis;
  },
  colorEmphasis: stableTokens.colorEmphasis,
  colorSurface: stableTokens.colorSurface,
  colorText: stableTokens.colorText,
  radiusCard: stableTokens.radiusCard,
  spaceCard: stableTokens.spaceCard,
};

export type CivicNestTokenName = keyof CivicNestTokens;
export type CivicNestTokenValue = CivicNestTokens[CivicNestTokenName];
