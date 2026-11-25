import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { civicNestTokens } from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { CommunityServicesModule } from "@civicnest/community-services";
import { PermitsModule } from "@civicnest/permits";
import { ResidentSupportModule } from "@civicnest/resident-support";

describe("governed workspace public APIs", () => {
  it("exports shared tokens, components, and service-neutral utilities", () => {
    expect(civicNestTokens.colorAccent).toBe("#39765c");
    expect(normalizeDisplayText("  local \n services  ")).toBe(
      "local services",
    );

    render(
      <ServiceCard title="Example service" description="Synthetic example" />,
    );

    expect(screen.getByRole("article")).toHaveStyle({
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
