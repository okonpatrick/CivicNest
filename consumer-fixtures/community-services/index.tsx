import {
  civicNestSemanticTokens,
  type CivicNestSemanticTokenValue,
} from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

const emphasisColor: CivicNestSemanticTokenValue =
  civicNestSemanticTokens.colorEmphasis;

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
