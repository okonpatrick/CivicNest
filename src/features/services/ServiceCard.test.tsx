import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { communityServiceFixtures } from "../../test/fixtures/community-services";
import ServiceCard from "./ServiceCard";

describe("ServiceCard", () => {
  it("renders a synthetic community service fixture", () => {
    const library = communityServiceFixtures.find(
      (service) => service.id === "sample-library",
    );

    if (!library) {
      throw new Error("Missing sample-library test fixture.");
    }

    render(<ServiceCard service={library} />);

    expect(
      screen.getByRole("heading", { name: "Sampleton Community Library" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Central service zone")).toBeInTheDocument();
  });
});
