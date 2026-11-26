import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ResidentSupportModule } from "./index";

describe("ResidentSupportModule", () => {
  it("renders guidance and communicates invalid and successful topic states", async () => {
    const user = userEvent.setup();
    render(<ResidentSupportModule />);

    expect(
      screen.getByRole("heading", { name: "Resident support" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Support topics" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent(
      /Example guidance is ready/,
    );

    const form = screen.getByRole("form", { name: "Example topic search" });
    const topic = within(form).getByRole("textbox", { name: "Example topic" });
    const submit = within(form).getByRole("button", {
      name: "Check example topic",
    });

    await user.click(submit);
    const validation = within(form).getByRole("alert");
    expect(validation).toHaveTextContent(
      "Enter a fictional example topic to continue.",
    );
    expect(topic).toHaveAttribute("aria-invalid", "true");
    expect(topic).toHaveAccessibleDescription(
      "Enter a fictional example topic to continue.",
    );

    await user.type(topic, "fictional community topic");
    await user.click(submit);
    expect(within(form).queryByRole("alert")).not.toBeInTheDocument();
    expect(topic).toHaveAttribute("aria-invalid", "false");
    expect(within(form).getByRole("status")).toHaveTextContent(
      "A synthetic topic match is ready to explore.",
    );
  });
});
