import { useId, type ReactNode } from "react";
import { civicNestSemanticTokens } from "@civicnest/design-tokens";

export interface ServiceCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function ServiceCard({
  title,
  description,
  children,
}: ServiceCardProps) {
  const headingId = useId();
  const descriptionId = useId();

  return (
    <article
      aria-describedby={descriptionId}
      aria-labelledby={headingId}
      style={{
        backgroundColor: civicNestSemanticTokens.colorSurface,
        border: `1px solid ${civicNestSemanticTokens.colorEmphasis}`,
        borderRadius: civicNestSemanticTokens.radiusCard,
        color: civicNestSemanticTokens.colorText,
        padding: civicNestSemanticTokens.spaceCard,
      }}
    >
      <h2 id={headingId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {children}
    </article>
  );
}
