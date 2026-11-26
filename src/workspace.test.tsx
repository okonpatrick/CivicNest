import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
