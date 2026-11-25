import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

export function PermitsModule() {
  return (
    <ServiceCard
      title="Permits"
      description={normalizeDisplayText(
        "Explore permit information and application steps.",
      )}
    />
  );
}
