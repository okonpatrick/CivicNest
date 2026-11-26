import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  civicNestTokens,
  type CivicNestTokenName,
  type CivicNestTokenValue,
} from "@civicnest/design-tokens";
import { ServiceCard, type ServiceCardProps } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { CommunityServicesModule } from "@civicnest/community-services";
import { PermitsModule } from "@civicnest/permits";
import { ResidentSupportModule } from "@civicnest/resident-support";

describe("governed workspace public APIs", () => {
  it("exports shared tokens, components, and service-neutral utilities", () => {
    const accentToken: CivicNestTokenName = "colorAccent";
    const accentValue: CivicNestTokenValue = civicNestTokens[accentToken];
    const cardProps: ServiceCardProps = {
      title: "Example service",
      description: "Synthetic example",
    };

    expect(Object.keys(civicNestTokens)).toEqual([
      "colorAccent",
      "colorSurface",
      "colorText",
      "radiusCard",
      "spaceCard",
    ]);
    expect(accentValue).toBe("#39765c");
    expect(normalizeDisplayText("  local \n services  ")).toBe(
      "local services",
    );
    expect(normalizeDisplayText(" \t\n ")).toBe("");

    render(<ServiceCard {...cardProps} />);

    const card = screen.getByRole("article", { name: "Example service" });
    expect(card).toHaveAccessibleDescription("Synthetic example");
    expect(card).toHaveStyle({
      color: civicNestTokens.colorText,
    });
  });

  it("exposes each representative service through its public entry point", () => {
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
  });
});
