import { useState } from "react";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import {
  permitsLoadingDemoFixture,
  permitsSuccessDemoFixture,
  type PermitsDemoFixture,
} from "./demo-fixtures";

export function PermitsModule() {
  const [fixture, setFixture] = useState<PermitsDemoFixture>(
    permitsLoadingDemoFixture,
  );

  return (
    <ServiceCard
      title="Permits"
      description={normalizeDisplayText("Example permit appointment options.")}
    >
      <section aria-labelledby="permits-options-heading">
        <h3 id="permits-options-heading">Appointment options</h3>
        <p
          className="service-demo__status service-demo__status--warning"
          role="note"
        >
          Sample options only; no appointment is reserved.
        </p>
        {fixture.status === "loading" ? (
          <p className="service-demo__status" role="status">
            {fixture.message}
          </p>
        ) : (
          <div
            className="service-demo__status service-demo__status--success"
            role="status"
            aria-live="polite"
          >
            <ul>
              {fixture.options.map((option) => (
                <li key={option.label}>
                  <strong>{option.label}</strong>: {option.detail}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="service-demo__action"
          onClick={() => setFixture(permitsSuccessDemoFixture)}
          type="button"
        >
          {fixture.status === "loading"
            ? "Show sample appointment options"
            : "Refresh sample appointment options"}
        </button>
      </section>
    </ServiceCard>
  );
}
