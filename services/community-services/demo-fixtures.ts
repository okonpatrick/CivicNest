export interface CommunityServiceDemoFixture {
  name: string;
  summary: string;
}

export type CommunityServicesDemoFixture =
  | { status: "error"; message: string }
  | { status: "success"; services: readonly CommunityServiceDemoFixture[] };

// Synthetic-only examples; never populate this fixture from service records.
export const communityServicesErrorDemoFixture: CommunityServicesDemoFixture = {
  status: "error",
  message:
    "The synthetic sample request failed. Example services could not be loaded.",
};

export const communityServicesSuccessDemoFixture: CommunityServicesDemoFixture =
  {
    status: "success",
    services: [
      {
        name: "Community learning and shared skills example",
        summary:
          "A synthetic example of a neighborhood learning resource with a longer description that wraps without pushing actions outside the card.",
      },
      {
        name: "Shared spaces",
        summary:
          "A fictional shared-space example with general information only; no real service listing or resident details are represented.",
      },
    ],
  };
