import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { civicNestSemanticTokenTaxonomy as tokens } from "@civicnest/design-tokens";
import { CommunityServicesModule } from "@civicnest/community-services";
import { PermitsModule } from "@civicnest/permits";
import { publicTokenValues } from "../consumer-fixtures/design-tokens";

function getStylesheetRule(selector: string): string | undefined {
  return Array.from(document.styleSheets)
    .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
    .map((rule) => rule.cssText)
    .find((rule) => rule.includes(selector));
}

function resolveToken(path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      tokens,
    );

  if (typeof value !== "string") {
    throw new Error(`Expected public token "${path}" to be a string.`);
  }
  return value;
}

describe("public design-token contracts", () => {
  it("uses structurally valid values for every categorized semantic token", () => {
    const colorPattern = /^#[\da-f]{6}$/i;
    const dimensionPattern = /^(?:\d+(?:\.\d+)?)(?:px|rem|em)$/;
    const numericPattern = /^\d+(?:\.\d+)?$/;

    for (const [path, value] of Object.entries(publicTokenValues)) {
      expect(value, path).toEqual(resolveToken(path));

      if (
        path.startsWith("color.") ||
        path === "focus.ring.color" ||
        /^interaction\.(?:hover|active|disabled)\.(?:text|surface)$/.test(path)
      ) {
        expect(value, path).toMatch(colorPattern);
      } else if (path === "typography.family.body") {
        expect(value.trim(), path).not.toBe("");
        expect(value, path).toMatch(/(?:system-ui|sans-serif)/);
      } else if (path.startsWith("typography.weight.")) {
        expect(value, path).toMatch(numericPattern);
        expect(Number(value), path).toBeGreaterThanOrEqual(100);
        expect(Number(value), path).toBeLessThanOrEqual(900);
      } else if (
        path.startsWith("typography.lineHeight.") ||
        path.endsWith(".opacity")
      ) {
        expect(value, path).toMatch(numericPattern);
        expect(Number(value), path).toBeGreaterThan(0);
        if (path.endsWith(".opacity")) {
          expect(Number(value), path).toBeLessThanOrEqual(1);
        }
      } else {
        expect(value, path).toMatch(dimensionPattern);
        expect(Number.parseFloat(value), path).toBeGreaterThan(0);
      }
    }

    expect(
      Number.parseFloat(tokens.responsive.breakpoint.compact),
    ).toBeLessThan(Number.parseFloat(tokens.responsive.breakpoint.wide));
  });

  it("applies the public focus token to a keyboard-focused service action", async () => {
    const user = userEvent.setup();
    render(<PermitsModule />);

    await user.tab();
    const action = screen.getByRole("button", {
      name: "Show sample appointment options",
    });
    expect(action).toHaveFocus();

    const permits = screen.getByRole("article", { name: "Permits" });
    expect(permits).toHaveStyle({
      "--cn-focus-ring-color": tokens.focus.ring.color,
      "--cn-focus-ring-width": tokens.focus.ring.width,
      "--cn-focus-ring-offset": tokens.focus.ring.offset,
    });
    expect(getStylesheetRule(".service-card :focus-visible")).toContain(
      "outline: var(--cn-focus-ring-width) solid var(--cn-focus-ring-color)",
    );
  });

  it("communicates token-backed request errors through an accessible alert", () => {
    render(<CommunityServicesModule />);

    const card = screen.getByRole("article", { name: "Community services" });
    const alert = within(card).getByRole("alert");
    expect(alert).toHaveTextContent("The synthetic sample request failed.");
    expect(card).toHaveStyle({
      "--cn-color-error-text": tokens.color.state.error,
      "--cn-color-error-surface": tokens.color.state.errorSurface,
      "--cn-color-error-border": tokens.color.state.errorBorder,
    });
    expect(getStylesheetRule(".service-demo__error")).toContain(
      "var(--cn-color-error-text)",
    );
  });
});
