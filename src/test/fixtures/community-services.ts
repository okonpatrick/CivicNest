import type { CommunityServiceSummary } from "../../features/services/ServiceCard";

export interface SyntheticServiceRequest {
  id: string;
  query: string;
}

export type ServiceRequestStatus =
  "loading" | "empty" | "success" | "invalid-input" | "request-failure";

export type ServiceRequestOutcome =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "success"; services: CommunityServiceSummary[] }
  | { status: "invalid-input"; message: string }
  | { status: "request-failure"; message: string };

export type CommunityServiceRequestFixtures = {
  [Status in ServiceRequestStatus]: {
    request: SyntheticServiceRequest;
    outcome: Extract<ServiceRequestOutcome, { status: Status }>;
  };
};

const publicLibraryRequest: SyntheticServiceRequest = {
  id: "fictional-library-help",
  query: "help finding public library borrowing support",
};

const successfulServices: CommunityServiceSummary[] = [
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
];

export const communityServiceRequestFixtures = {
  loading: {
    request: publicLibraryRequest,
    outcome: { status: "loading" },
  },
  empty: {
    request: publicLibraryRequest,
    outcome: { status: "empty" },
  },
  success: {
    request: publicLibraryRequest,
    outcome: { status: "success", services: successfulServices },
  },
  "invalid-input": {
    request: {
      id: "fictional-invalid-query",
      query: "",
    },
    outcome: {
      status: "invalid-input",
      message: "Enter a service or topic to search.",
    },
  },
  "request-failure": {
    request: publicLibraryRequest,
    outcome: {
      status: "request-failure",
      message: "Sample service search is unavailable. Try again.",
    },
  },
} satisfies CommunityServiceRequestFixtures;

export const communityServiceFixtures = successfulServices;
