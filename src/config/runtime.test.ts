import { describe, expect, it } from "vitest";
import { loadRuntimeConfig, RuntimeConfigError } from "./runtime";

describe("loadRuntimeConfig", () => {
  it("accepts a configured public app name", () => {
    expect(
      loadRuntimeConfig({
        VITE_CIVICNEST_APP_NAME: "CivicNest Test Demo",
      }),
    ).toEqual({ appName: "CivicNest Test Demo" });
  });

  it("reports missing required configuration", () => {
    expect(() => loadRuntimeConfig({})).toThrowError(
      new RuntimeConfigError(
        "is required. Set a public display name in your local environment file.",
      ),
    );
  });

  it("rejects malformed configuration instead of applying a fallback", () => {
    expect(() =>
      loadRuntimeConfig({
        VITE_CIVICNEST_APP_NAME: `Invalid\nName`,
      }),
    ).toThrowError(
      /must be at most 80 characters and contain no control characters/,
    );
  });
});
