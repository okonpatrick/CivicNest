import { useState } from "react";
import {
  civicNestSemanticTokenTaxonomy,
  type CivicNestSemanticTokenTaxonomyValue,
} from "@civicnest/design-tokens";
import { ServiceCard, type ServiceCardProps } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

const emphasisColor: CivicNestSemanticTokenTaxonomyValue =
  civicNestSemanticTokenTaxonomy.color.emphasis.primary;
const cardProps: ServiceCardProps = {
  title: "Resident support example",
  description: normalizeDisplayText(" General example guidance. "),
};

export function ResidentSupportConsumerFixture() {
  const [requested, setRequested] = useState(false);

  return (
    <ServiceCard {...cardProps}>
      <button onClick={() => setRequested(true)} type="button">
        Show support guidance
      </button>
      {requested ? (
        <p role="status" style={{ color: emphasisColor }}>
          Example guidance is ready.
        </p>
      ) : null}
    </ServiceCard>
  );
}
