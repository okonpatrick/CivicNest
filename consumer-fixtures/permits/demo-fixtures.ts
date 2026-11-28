// Synthetic-only consumer data; never populate it from permit requests.
export const permitsSuccessDemoFixture = {
  options: [
    { label: "Example option A", detail: "A sample weekday time window." },
    {
      label: "Example option B",
      detail: "Another sample weekday time window.",
    },
  ],
} as const;
