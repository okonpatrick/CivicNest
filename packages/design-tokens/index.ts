export const civicNestTokens = {
  colorAccent: "#39765c",
  colorSurface: "#ffffff",
  colorText: "#183229",
  radiusCard: "0.75rem",
  spaceCard: "1.25rem",
} as const;

export type CivicNestTokenName = keyof typeof civicNestTokens;
export type CivicNestTokenValue = (typeof civicNestTokens)[CivicNestTokenName];
