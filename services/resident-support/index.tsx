import { useId, useState } from "react";
import { ServiceCard } from "@civicnest/ui";
import { normalizeDisplayText } from "@civicnest/utils";
import { residentSupportDemoFixture } from "./demo-fixtures";

export function ResidentSupportModule() {
  const fieldId = useId();
  const errorId = useId();
  const [topic, setTopic] = useState("");
  const [requestState, setRequestState] = useState<
    "idle" | "invalid" | "success"
  >("idle");

  return (
    <ServiceCard
      title="Resident support"
      description={normalizeDisplayText("Find general example guidance.")}
    >
      <section aria-labelledby="resident-support-topics">
        <h3 id="resident-support-topics">Support topics</h3>
        <p
          className="service-demo__status service-demo__status--success"
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
      <form
        aria-label="Example topic search"
        onSubmit={(event) => {
          event.preventDefault();
          setRequestState(topic.trim() ? "success" : "invalid");
        }}
      >
        <label htmlFor={fieldId}>Example topic</label>
        <p>
          Use a fictional topic only; this demonstration does not send requests.
        </p>
        <input
          aria-describedby={requestState === "invalid" ? errorId : undefined}
          aria-invalid={requestState === "invalid"}
          id={fieldId}
          onChange={(event) => setTopic(event.currentTarget.value)}
          value={topic}
        />
        {requestState === "invalid" ? (
          <p className="service-demo__field-error" id={errorId} role="alert">
            Enter a fictional example topic to continue.
          </p>
        ) : null}
        {requestState === "success" ? (
          <p
            className="service-demo__status service-demo__status--success"
            role="status"
          >
            A synthetic topic match is ready to explore.
          </p>
        ) : null}
        <button className="service-demo__action" type="submit">
          Check example topic
        </button>
      </form>
    </ServiceCard>
  );
}
