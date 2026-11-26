export interface ResidentSupportDemoFixture {
  category: string;
  summary: string;
  topics: readonly string[];
}

// Synthetic-only examples; never populate this fixture from resident records.
export const residentSupportDemoFixture: ResidentSupportDemoFixture = {
  category: "General guidance",
  summary:
    "Example guidance is ready to explore. This synthetic message demonstrates wrapping for longer service instructions without hiding nearby controls.",
  topics: [
    "Getting started",
    "Community resources",
    "Preparing a fictional service request using general example information",
  ],
};
