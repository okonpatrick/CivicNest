import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CommunityServicesModule } from "./index";

describe("CommunityServicesModule", () => {
  it("announces request failure and recovers to sample results", async () => {
    const user = userEvent.setup();
    render(<CommunityServicesModule />);

    const card = screen.getByRole("article", { name: "Community services" });
    expect(
      within(card).getByRole("heading", { name: "Community resources" }),
    ).toBeInTheDocument();
    expect(within(card).getByRole("alert")).toHaveTextContent(
      "The synthetic sample request failed. Example services could not be loaded.",
    );

    await user.click(
      within(card).getByRole("button", { name: "Retry sample request" }),
    );
    const success = within(card).getByRole("status");
    expect(success).toHaveTextContent("Community learning and shared skills");
    expect(success).toHaveTextContent("no real service listing");
    expect(
      within(card).getByRole("button", {
        name: "Refresh community services",
      }),
    ).toBeEnabled();
  });
});
