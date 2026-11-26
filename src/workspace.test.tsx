import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  civicNestSemanticTokens,
  civicNestTokens,
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

  it("preserves identical appearance and accessible behavior across migrated and unmigrated consumers", async () => {
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
    expect(migratedStatus).toHaveStyle({
      color: civicNestSemanticTokens.colorEmphasis,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Show sample appointment options",
      }),
    );

    const permits = screen.getByRole("article", { name: "Permits" });
    const unmigratedStatus = within(permits).getByRole("status");
    expect(unmigratedStatus).toHaveStyle({
      color: civicNestSemanticTokens.colorEmphasis,
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
    await user.keyboard("{Enter}");

    const permits = screen.getByRole("article", { name: "Permits" });
    expect(within(permits).getByRole("status")).toHaveTextContent(
      "Example option A",
    );
    expect(within(permits).getByRole("status")).toHaveTextContent(
      "Example option B",
    );
    expect(
      screen.getByRole("button", {
        name: "Refresh sample appointment options",
      }),
    ).toHaveFocus();
  });

  it("recovers from the community services error when retried", async () => {
    const user = userEvent.setup();
    render(<CommunityServicesModule />);

    const communityServices = screen.getByRole("article", {
      name: "Community services",
    });
    expect(within(communityServices).getByRole("alert")).toBeInTheDocument();
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
