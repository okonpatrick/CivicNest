import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

export function CommunityServicesModule() {
  return (
    <ServiceCard
      title="Community services"
      description={normalizeDisplayText(
        "Discover local programs and shared resources.",
      )}
    />
  );
}
