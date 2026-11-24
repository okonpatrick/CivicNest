import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("introduces the CivicNest community platform", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByText("A stronger community starts here"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Welcome to CivicNest" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/discovering and connecting with local services/i),
    ).toBeInTheDocument();
  });
});
