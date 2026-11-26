import { civicNestTokens } from "@civicnest/design-tokens";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { residentSupportDemoFixture } from "./demo-fixtures";

export function ResidentSupportModule() {
  return (
    <ServiceCard
      title="Resident support"
      description={normalizeDisplayText("Find general example guidance.")}
    >
      <section aria-labelledby="resident-support-topics">
        <h3 id="resident-support-topics">Support topics</h3>
        <p
          className="service-demo__status"
          style={{ color: civicNestTokens.colorEmphasis }}
          role="status"
        >
          {normalizeDisplayText(residentSupportDemoFixture.summary)}
        </p>
        <p>{residentSupportDemoFixture.category}</p>
        <ul>
          {residentSupportDemoFixture.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
    </ServiceCard>
  );
}
