export interface PermitOptionDemoFixture {
  label: string;
  detail: string;
}

export type PermitsDemoFixture =
  | { status: "loading"; message: string }
  | { status: "success"; options: readonly PermitOptionDemoFixture[] };

// Synthetic-only examples; never populate this fixture from permit requests.
export const permitsLoadingDemoFixture: PermitsDemoFixture = {
  status: "loading",
  message: "Loading sample appointment options.",
};

export const permitsSuccessDemoFixture: PermitsDemoFixture = {
  status: "success",
  options: [
    { label: "Example option A", detail: "A sample weekday time window." },
    {
      label: "Example option B",
      detail: "Another sample weekday time window.",
    },
  ],
};
