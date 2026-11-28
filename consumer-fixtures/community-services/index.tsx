import {
  civicNestSemanticTokenTaxonomy,
  type CivicNestSemanticTokenTaxonomyValue,
} from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

const emphasisColor: CivicNestSemanticTokenTaxonomyValue =
  civicNestSemanticTokenTaxonomy.color.emphasis.primary;

export function CommunityServicesConsumerFixture() {
  return (
    <ServiceCard
      title="Community services example"
      description={normalizeDisplayText(" Example community resources. ")}
    >
      <p style={{ color: emphasisColor }}>Example resources are available.</p>
    </ServiceCard>
  );
}
