import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

export function ResidentSupportModule() {
  return (
    <ServiceCard
      title="Resident support"
      description={normalizeDisplayText(
        "Find guidance for common community questions.",
      )}
    />
  );
}
