export function normalizeDisplayText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
