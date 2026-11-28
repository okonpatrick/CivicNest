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
        className="service-demo__status service-demo__status--success"
        role="status"
      >
        {message}
      </p>
    </ServiceCard>
  );
}
