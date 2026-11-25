import { describe, expect, it } from "vitest";
import { communityServiceRequestFixtures } from "./community-services";

describe("community service request fixtures", () => {
  it("provides each interface state for the fictional library request", () => {
    expect(Object.keys(communityServiceRequestFixtures).sort()).toEqual([
      "empty",
      "invalid-input",
      "loading",
      "request-failure",
      "success",
    ]);

    expect(communityServiceRequestFixtures.loading.outcome).toEqual({
      status: "loading",
    });
    expect(communityServiceRequestFixtures.empty.outcome).toEqual({
      status: "empty",
    });
    expect(communityServiceRequestFixtures.success.outcome).toEqual({
      status: "success",
      services: [
        {
          id: "sample-library",
          name: "Sampleton Community Library",
          category: "Public library",
          serviceArea: "Central service zone",
        },
        {
          id: "sample-help-desk",
          name: "Exampleton Resident Help Desk",
          category: "Resident support",
          serviceArea: "North service zone",
        },
      ],
    });
    expect(communityServiceRequestFixtures["invalid-input"].outcome).toEqual({
      status: "invalid-input",
      message: "Enter a service or topic to search.",
    });
    expect(communityServiceRequestFixtures["request-failure"].outcome).toEqual({
      status: "request-failure",
      message: "Sample service search is unavailable. Try again.",
    });
  });
});
