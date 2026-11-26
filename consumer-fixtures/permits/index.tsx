import { civicNestSemanticTokenTaxonomy } from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { permitsSuccessDemoFixture } from "./demo-fixtures";

export function PermitsSummary() {
  const message = normalizeDisplayText(
    permitsSuccessDemoFixture.options
      .map((option) => `${option.label}: ${option.detail}`)
      .join(". "),
  );

  return (
    <ServiceCard
      title="Permits"
      description={normalizeDisplayText("Example permit appointment options.")}
    >
      <p
        role="status"
        style={{
          color: civicNestSemanticTokenTaxonomy.color.emphasis.primary,
        }}
      >
        {message}
      </p>
    </ServiceCard>
  );
}
