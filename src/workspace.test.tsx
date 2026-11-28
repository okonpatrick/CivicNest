import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  civicNestSemanticTokens,
  civicNestSemanticTokenTaxonomy,
  civicNestTokens,
  type CivicNestSemanticTokenPath,
  type CivicNestSemanticTokenName,
  type CivicNestSemanticTokens,
  type CivicNestSemanticTokenValue,
  type CivicNestTokenName,
  type CivicNestTokens,
  type CivicNestTokenValue,
} from "@civicnest/design-tokens";
import { ServiceCard, type ServiceCardProps } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { CommunityServicesModule } from "@civicnest/community-services";
import { PermitsModule } from "@civicnest/permits";
import { ResidentSupportModule } from "@civicnest/resident-support";
import { ResidentSupportConsumerFixture } from "../consumer-fixtures/resident-support";
import App from "./app/App";

function contrastRatio(foreground: string, background: string): number {
  function luminance(color: string): number {
    const channels = color.match(/[0-9a-f]{2}/gi);

    if (!channels || channels.length !== 3) {
      throw new Error(`Expected a six-digit hex color, received ${color}.`);
    }

    const linearChannel = (channel: string | undefined) => {
      if (!channel) {
        throw new Error(`Missing color channel in ${color}.`);
      }

      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    };

    return (
      0.2126 * linearChannel(channels[0]) +
      0.7152 * linearChannel(channels[1]) +
      0.0722 * linearChannel(channels[2])
    );
  }

  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function getStylesheetRule(selector: string): string | undefined {
  return Array.from(document.styleSheets)
    .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
    .map((rule) => rule.cssText)
    .find((rule) => rule.includes(selector));
}

function assertUnreachableToken(token: never): never {
  throw new Error(`Unexpected token name: ${String(token)}`);
}

function describeLegacyTokenExhaustively(name: CivicNestTokenName): string {
  switch (name) {
    case "colorAccent":
      return "Accent emphasis";
    case "colorSurface":
      return "Surface background";
    case "colorText":
      return "Primary text";
    case "radiusCard":
      return "Card corner radius";
    case "spaceCard":
      return "Card padding";
    default:
      return assertUnreachableToken(name);
  }
}

describe("governed workspace public APIs", () => {
  it("exports shared tokens, components, and service-neutral utilities", () => {
    const legacyAccentToken: CivicNestTokenName = "colorAccent";
    const legacyAccentValue: CivicNestTokenValue =
      civicNestTokens[legacyAccentToken];
    const legacyShape: CivicNestTokens = civicNestTokens;
    const semanticToken: CivicNestSemanticTokenName = "colorEmphasis";
    const semanticValue: CivicNestSemanticTokenValue =
      civicNestSemanticTokens[semanticToken];
    const semanticShape: CivicNestSemanticTokens = civicNestSemanticTokens;
    const cardProps: ServiceCardProps = {
      title: "Example service",
      description: "Synthetic example",
    };

    expect(Object.keys(legacyShape)).toEqual([
      "colorAccent",
      "colorSurface",
      "colorText",
      "radiusCard",
      "spaceCard",
    ]);
    expect(Object.keys(semanticShape)).toEqual([
      "colorEmphasis",
      "colorSurface",
      "colorText",
      "radiusCard",
      "spaceCard",
    ]);
    expect(describeLegacyTokenExhaustively(legacyAccentToken)).toBe(
      "Accent emphasis",
    );
    expect(legacyAccentValue).toBe("#39765c");
    expect(semanticValue).toBe("#39765c");
    expect(civicNestTokens.colorAccent).toBe(
      civicNestSemanticTokens.colorEmphasis,
    );
    expect(normalizeDisplayText("  local \n services  ")).toBe(
      "local services",
    );
    expect(normalizeDisplayText(" \t\n ")).toBe("");

    render(<ServiceCard {...cardProps} />);

    const card = screen.getByRole("article", { name: "Example service" });
    expect(card).toHaveAccessibleDescription("Synthetic example");
    expect(card).toHaveStyle({
      borderColor: civicNestSemanticTokens.colorEmphasis,
      color: civicNestSemanticTokens.colorText,
    });
  });

  it("exposes typed semantic token families through the package root", () => {
    const focusPath: CivicNestSemanticTokenPath = "focus.ring.color";
    const warningPath: CivicNestSemanticTokenPath = "color.state.warning";
    const validationPath: CivicNestSemanticTokenPath = "color.validation.error";
    const compactCardInset: CivicNestSemanticTokenPath =
      "responsive.inset.cardCompact";
    const wideCardInset: CivicNestSemanticTokenPath =
      "responsive.inset.cardWide";

    expect(Object.keys(civicNestSemanticTokenTaxonomy)).toEqual([
      "color",
      "typography",
      "spacing",
      "sizing",
      "responsive",
      "focus",
      "interaction",
    ]);
    expect(focusPath).toBe("focus.ring.color");
    expect(warningPath).toBe("color.state.warning");
    expect(validationPath).toBe("color.validation.error");
    expect(compactCardInset).toBe("responsive.inset.cardCompact");
    expect(wideCardInset).toBe("responsive.inset.cardWide");
    expect(civicNestSemanticTokenTaxonomy.responsive.inset.cardCompact).toBe(
      "0.75rem",
    );
    expect(civicNestSemanticTokenTaxonomy.responsive.inset.cardWide).toBe(
      "1.25rem",
    );
    expect(civicNestSemanticTokenTaxonomy.color.emphasis.primary).toBe(
      civicNestSemanticTokens.colorEmphasis,
    );
    expect(civicNestSemanticTokenTaxonomy.focus.ring).toEqual({
      color: "#183229",
      width: "3px",
      offset: "3px",
    });
  });

  it("meets documented text, state, border, and focus contrast thresholds", () => {
    const { color, focus, interaction } = civicNestSemanticTokenTaxonomy;

    expect(
      contrastRatio(color.text.primary, color.surface.card),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.action.text, color.action.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.action.text, interaction.hover.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.action.text, interaction.active.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.disabled.text, color.disabled.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.state.success, color.state.successSurface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.state.successBorder, color.state.successSurface),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(color.state.warning, color.state.warningSurface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.state.warningBorder, color.state.warningSurface),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(color.state.error, color.state.errorSurface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.action.border, color.action.surface),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(color.action.border, interaction.hover.surface),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(color.action.border, interaction.active.surface),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(
        color.validation.errorBorder,
        color.validation.errorSurface,
      ),
    ).toBeGreaterThanOrEqual(3);
    expect(color.action.surface).not.toBe(interaction.hover.surface);
    expect(color.action.surface).not.toBe(interaction.active.surface);
    expect(color.action.surface).not.toBe(color.disabled.surface);
    expect(interaction.active.surface).not.toBe(interaction.hover.surface);

    for (const surface of [
      color.action.surface,
      interaction.hover.surface,
      interaction.active.surface,
    ]) {
      expect(contrastRatio(focus.ring.color, surface)).toBeGreaterThanOrEqual(
        3,
      );
    }
  });

  it("uses the semantic disabled treatment on shared action controls", () => {
    render(
      <ServiceCard
        title="Example action"
        description="Synthetic disabled state"
      >
        <button className="service-demo__action" disabled type="button">
          Temporarily unavailable
        </button>
      </ServiceCard>,
    );

    const card = screen.getByRole("article", { name: "Example action" });
    expect(
      within(card).getByRole("button", { name: "Temporarily unavailable" }),
    ).toBeDisabled();
    expect(card).toHaveStyle({
      "--cn-color-disabled-text":
        civicNestSemanticTokenTaxonomy.color.disabled.text,
      "--cn-color-disabled-surface":
        civicNestSemanticTokenTaxonomy.color.disabled.surface,
      "--cn-color-disabled-border":
        civicNestSemanticTokenTaxonomy.color.disabled.border,
    });
    expect(getStylesheetRule(".service-demo__action:disabled")).toContain(
      "var(--cn-color-disabled-surface)",
    );
    expect(
      getStylesheetRule(".service-demo__action:not(:disabled):hover"),
    ).toContain("var(--cn-color-action-hover-surface)");
    expect(
      getStylesheetRule(".service-demo__action:not(:disabled):active"),
    ).toContain("var(--cn-color-action-active-surface)");
  });

  it("associates readable validation feedback with its field", () => {
    render(
      <ServiceCard
        title="Example form"
        description="Synthetic validation state"
      >
        <label htmlFor="example-value">Example value</label>
        <input
          aria-describedby="example-value-error"
          aria-invalid="true"
          id="example-value"
        />
        <p className="service-demo__field-error" id="example-value-error">
          Enter a fictional example value using plain text; do not include
          personal or real request information.
        </p>
      </ServiceCard>,
    );

    const card = screen.getByRole("article", { name: "Example form" });
    const field = within(card).getByRole("textbox", { name: "Example value" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(
      "Enter a fictional example value using plain text; do not include personal or real request information.",
    );
    expect(
      within(card).getByText(
        /do not include personal or real request information/,
      ),
    ).toHaveClass("service-demo__field-error");
    expect(card).toHaveStyle({
      "--cn-color-validation-error-text":
        civicNestSemanticTokenTaxonomy.color.validation.error,
      "--cn-color-validation-error-surface":
        civicNestSemanticTokenTaxonomy.color.validation.errorSurface,
      "--cn-color-validation-error-border":
        civicNestSemanticTokenTaxonomy.color.validation.errorBorder,
    });
    const fieldRule = getStylesheetRule(".service-card input");
    expect(fieldRule).toContain("width: 100%");
    expect(fieldRule).toContain("min-height: 2.75rem");
    expect(getStylesheetRule(".service-demo__field-error")).toContain(
      "overflow-wrap: anywhere",
    );
  });

  it("uses shared responsive tokens for narrow and wide service layouts", async () => {
    const user = userEvent.setup();
    const { responsive } = civicNestSemanticTokenTaxonomy;
    const stylesheetRules = Array.from(document.styleSheets)
      .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
      .map((rule) => rule.cssText);

    expect(
      stylesheetRules.some((rule) =>
        rule.includes(`@media (min-width: ${responsive.breakpoint.compact})`),
      ),
    ).toBe(true);
    expect(
      stylesheetRules.some((rule) =>
        rule.includes(`@media (min-width: ${responsive.breakpoint.wide})`),
      ),
    ).toBe(true);

    render(<App appName="Synthetic responsive test" />);

    const residentSupport = screen.getByRole("article", {
      name: "Resident support",
    });
    const permits = screen.getByRole("article", { name: "Permits" });
    const communityServices = screen.getByRole("article", {
      name: "Community services",
    });
    const serviceList = screen.getByRole("region", {
      name: "Available services",
    });
    expect(serviceList).toHaveClass("service-list");
    expect(screen.getByRole("main")).toHaveStyle({
      "--cn-responsive-content-max": responsive.sizing.contentMaxWidth,
      "--cn-responsive-card-minimum": responsive.sizing.cardMinimum,
    });
    expect(residentSupport).toHaveStyle({
      "--cn-responsive-card-inset-compact": responsive.inset.cardCompact,
      "--cn-responsive-card-inset-wide": responsive.inset.cardWide,
    });
    expect(residentSupport).toHaveTextContent("without hiding nearby controls");

    await user.click(
      within(permits).getByRole("button", {
        name: "Show sample appointment options",
      }),
    );
    expect(within(permits).getByRole("status")).toHaveTextContent(
      "does not reserve an appointment or send a request",
    );

    await user.click(
      within(communityServices).getByRole("button", {
        name: "Retry sample request",
      }),
    );
    expect(within(communityServices).getByRole("status")).toHaveTextContent(
      "without pushing actions outside the card",
    );
  });

  it("preserves ServiceCard semantics and consumer interaction", async () => {
    const user = userEvent.setup();
    render(<ResidentSupportConsumerFixture />);

    const card = screen.getByRole("article", {
      name: "Resident support example",
    });
    expect(card).toHaveAccessibleDescription("General example guidance.");
    await user.click(
      within(card).getByRole("button", { name: "Show support guidance" }),
    );

    expect(within(card).getByRole("status")).toHaveTextContent(
      "Example guidance is ready.",
    );
  });

  it("warns once in dev when reading deprecated colorAccent and keeps replacement silent", async () => {
    vi.resetModules();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      const {
        civicNestSemanticTokens: freshSemanticTokens,
        civicNestTokens: freshTokens,
      } = await import("@civicnest/design-tokens");

      expect(freshSemanticTokens.colorEmphasis).toBe("#39765c");
      expect(warnSpy).not.toHaveBeenCalled();

      expect(freshTokens.colorAccent).toBe("#39765c");
      expect(freshTokens.colorAccent).toBe("#39765c");
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("civicNestTokens.colorAccent"),
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("civicNestSemanticTokens.colorEmphasis"),
      );
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("preserves identical appearance and accessible behavior across service consumers", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ResidentSupportModule />
        <PermitsModule />
      </>,
    );

    const residentSupport = screen.getByRole("article", {
      name: "Resident support",
    });
    const migratedStatus = within(residentSupport).getByRole("status");
    expect(migratedStatus).toHaveTextContent(/Example guidance is ready/);

    await user.click(
      screen.getByRole("button", {
        name: "Show sample appointment options",
      }),
    );

    const permits = screen.getByRole("article", { name: "Permits" });
    const unmigratedStatus = within(permits).getByRole("status");
    expect(unmigratedStatus).toHaveClass("service-demo__status--success");
    expect(permits).toHaveStyle({
      "--cn-color-success-text":
        civicNestSemanticTokenTaxonomy.color.state.success,
    });
    expect(unmigratedStatus).toHaveTextContent("Example option A");
  });

  it("renders independent service content and loading, success, and error states", () => {
    render(
      <>
        <ResidentSupportModule />
        <PermitsModule />
        <CommunityServicesModule />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Resident support" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Permits" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Community services" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Support topics" }),
    ).toBeInTheDocument();
    const residentSupport = screen.getByRole("article", {
      name: "Resident support",
    });
    const permits = screen.getByRole("article", { name: "Permits" });
    const communityServices = screen.getByRole("article", {
      name: "Community services",
    });
    expect(within(residentSupport).getByRole("list").children).toHaveLength(3);
    expect(within(residentSupport).getByRole("status")).toHaveTextContent(
      "Example guidance is ready to explore.",
    );
    expect(within(permits).getByRole("status")).toHaveTextContent(
      "Loading sample appointment options.",
    );
    expect(within(communityServices).getByRole("alert")).toHaveTextContent(
      "The synthetic sample request failed. Example services could not be loaded.",
    );
    expect(
      within(communityServices).getByRole("button", {
        name: "Retry sample request",
      }),
    ).toBeEnabled();
  });

  it("lets a keyboard user reveal sample permit options", async () => {
    const user = userEvent.setup();
    render(<PermitsModule />);

    await user.tab();
    const action = screen.getByRole("button", {
      name: "Show sample appointment options",
    });
    expect(action).toHaveFocus();
    const focusRule = getStylesheetRule(".service-card :focus-visible");
    expect(focusRule).toContain("outline:");
    expect(focusRule).toContain("var(--cn-focus-ring-width)");
    expect(focusRule).toContain("var(--cn-focus-ring-color)");
    const permits = screen.getByRole("article", { name: "Permits" });
    expect(permits).toHaveStyle({
      "--cn-focus-ring-color": civicNestSemanticTokenTaxonomy.focus.ring.color,
      "--cn-focus-ring-width": civicNestSemanticTokenTaxonomy.focus.ring.width,
      "--cn-focus-ring-offset":
        civicNestSemanticTokenTaxonomy.focus.ring.offset,
    });
    const note = within(permits).getByRole("note");
    expect(note).toHaveTextContent(
      "Sample options only; no appointment is reserved.",
    );
    expect(note).toHaveClass("service-demo__status--warning");
    expect(permits).toHaveStyle({
      "--cn-color-warning-text":
        civicNestSemanticTokenTaxonomy.color.state.warning,
      "--cn-color-warning-border":
        civicNestSemanticTokenTaxonomy.color.state.warningBorder,
    });
    await user.keyboard("{Enter}");

    expect(within(permits).getByRole("status")).toHaveTextContent(
      "Example option A",
    );
    expect(within(permits).getByRole("status")).toHaveTextContent(
      "Example option B",
    );
    const refreshButton = screen.getByRole("button", {
      name: "Refresh sample appointment options",
    });
    expect(refreshButton).toHaveFocus();
  });

  it("recovers from the community services error when retried", async () => {
    const user = userEvent.setup();
    render(<CommunityServicesModule />);

    const communityServices = screen.getByRole("article", {
      name: "Community services",
    });
    const errorMessage = within(communityServices).getByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(
      "The synthetic sample request failed.",
    );
    expect(communityServices).toHaveStyle({
      "--cn-color-error-text": civicNestSemanticTokenTaxonomy.color.state.error,
      "--cn-color-error-surface":
        civicNestSemanticTokenTaxonomy.color.state.errorSurface,
      "--cn-color-error-border":
        civicNestSemanticTokenTaxonomy.color.state.errorBorder,
    });
    await user.click(
      within(communityServices).getByRole("button", {
        name: "Retry sample request",
      }),
    );

    expect(
      within(communityServices).queryByRole("alert"),
    ).not.toBeInTheDocument();
    expect(within(communityServices).getByRole("status")).toHaveTextContent(
      "Community learning",
    );
    expect(within(communityServices).getByRole("status")).toHaveTextContent(
      "Shared spaces",
    );
  });
});
