/**
 * Trims leading and trailing JavaScript whitespace and collapses internal
 * whitespace runs to one ASCII space, without applying service-specific rules.
 */
export function normalizeDisplayText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
