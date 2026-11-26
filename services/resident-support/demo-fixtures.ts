export interface ResidentSupportDemoFixture {
  category: string;
  summary: string;
  topics: readonly string[];
}

// Synthetic-only examples; never populate this fixture from resident records.
export const residentSupportDemoFixture: ResidentSupportDemoFixture = {
  category: "General guidance",
  summary: "Example guidance is ready to explore.",
  topics: ["Getting started", "Community resources", "Common questions"],
};
