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
    {
      label: "Example option A: a fictional weekday morning appointment window",
      detail:
        "A synthetic example of available times; choosing this option does not reserve an appointment or send a request.",
    },
    {
      label:
        "Example option B: a fictional weekday afternoon appointment window",
      detail:
        "Another synthetic example with longer explanatory text that should wrap within a narrow card.",
    },
  ],
};
