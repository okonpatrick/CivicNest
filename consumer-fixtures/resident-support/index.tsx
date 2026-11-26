import { useState } from "react";
import {
  civicNestSemanticTokens,
  type CivicNestSemanticTokenName,
} from "@civicnest/design-tokens";
import { ServiceCard, type ServiceCardProps } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";

const emphasisToken: CivicNestSemanticTokenName = "colorEmphasis";
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
        <p
          role="status"
          style={{ color: civicNestSemanticTokens[emphasisToken] }}
        >
          Example guidance is ready.
        </p>
      ) : null}
    </ServiceCard>
  );
}
