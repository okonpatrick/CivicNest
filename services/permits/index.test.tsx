import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PermitsModule } from "./index";

describe("PermitsModule", () => {
  it("announces loading and sample success with a refresh control", async () => {
    const user = userEvent.setup();
    render(<PermitsModule />);

    const card = screen.getByRole("article", { name: "Permits" });
    expect(
      within(card).getByRole("heading", { name: "Appointment options" }),
    ).toBeInTheDocument();
    expect(within(card).getByRole("note")).toHaveTextContent(
      "Sample options only; no appointment is reserved.",
    );
    expect(within(card).getByRole("status")).toHaveTextContent(
      "Loading sample appointment options.",
    );

    await user.click(
      within(card).getByRole("button", {
        name: "Show sample appointment options",
      }),
    );
    const success = within(card).getByRole("status");
    expect(success).toHaveTextContent("Example option A");
    expect(success).toHaveTextContent("does not reserve an appointment");
    expect(
      within(card).getByRole("button", {
        name: "Refresh sample appointment options",
      }),
    ).toBeEnabled();
  });
});
