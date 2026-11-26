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
        name: "Community learning",
        summary: "A synthetic example of a local learning resource.",
      },
      {
        name: "Shared spaces",
        summary: "A synthetic example of a neighborhood resource.",
      },
    ],
  };
