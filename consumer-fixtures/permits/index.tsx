import {
  civicNestTokens,
  type CivicNestTokenName,
} from "@civicnest/design-tokens";
import { ServiceCard, type ServiceCardProps } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

const legacyAccentToken: CivicNestTokenName = "colorAccent";
const cardProps: ServiceCardProps = {
  title: "Permits example",
  description: normalizeDisplayText(" Example appointment options. "),
};

export function PermitsConsumerFixture() {
  return (
    <ServiceCard {...cardProps}>
      <p style={{ color: civicNestTokens[legacyAccentToken] }}>
        Example appointment options are available.
      </p>
    </ServiceCard>
  );
}
