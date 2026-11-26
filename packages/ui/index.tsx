import { useId, type ReactNode } from "react";
import { civicNestTokens } from "@civicnest/design-tokens";

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
        backgroundColor: civicNestTokens.colorSurface,
        border: `1px solid ${civicNestTokens.colorEmphasis}`,
        borderRadius: civicNestTokens.radiusCard,
        color: civicNestTokens.colorText,
        padding: civicNestTokens.spaceCard,
      }}
    >
      <h2 id={headingId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {children}
    </article>
  );
}
