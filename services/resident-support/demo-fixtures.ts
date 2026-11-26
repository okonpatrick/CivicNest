export interface ResidentSupportDemoFixture {
  category: string;
  summary: string;
  topics: readonly string[];
}

export const residentSupportDemoFixture: ResidentSupportDemoFixture = {
  category: "General guidance",
  summary: "Example guidance is ready to explore.",
  topics: ["Getting started", "Community resources", "Common questions"],
};
