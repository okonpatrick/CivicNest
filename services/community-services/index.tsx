import { useState } from "react";
import { civicNestSemanticTokenTaxonomy } from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import {
  communityServicesErrorDemoFixture,
  communityServicesSuccessDemoFixture,
  type CommunityServicesDemoFixture,
} from "./demo-fixtures";

export function CommunityServicesModule() {
  const [fixture, setFixture] = useState<CommunityServicesDemoFixture>(
    communityServicesErrorDemoFixture,
  );

  return (
    <ServiceCard
      title="Community services"
      description={normalizeDisplayText("Example community resources.")}
    >
      <section aria-labelledby="community-services-heading">
        <h3 id="community-services-heading">Community resources</h3>
        {fixture.status === "error" ? (
          <p className="service-demo__error" role="alert">
            {fixture.message}
          </p>
        ) : (
          <div
            className="service-demo__status"
            style={{
              color: civicNestSemanticTokenTaxonomy.color.emphasis.primary,
            }}
            role="status"
            aria-live="polite"
          >
            <ul>
              {fixture.services.map((service) => (
                <li key={service.name}>
                  <strong>{service.name}</strong>: {service.summary}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="service-demo__action"
          onClick={() => setFixture(communityServicesSuccessDemoFixture)}
          type="button"
        >
          {fixture.status === "error"
            ? "Retry sample request"
            : "Refresh community services"}
        </button>
      </section>
    </ServiceCard>
  );
}
