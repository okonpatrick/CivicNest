import { useId, type ReactNode } from "react";
import { civicNestSemanticTokenTaxonomy } from "@civicnest/design-tokens";

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
        backgroundColor: civicNestSemanticTokenTaxonomy.color.surface.card,
        border: `1px solid ${civicNestSemanticTokenTaxonomy.color.border.emphasis}`,
        borderRadius: civicNestSemanticTokenTaxonomy.sizing.radius.card,
        color: civicNestSemanticTokenTaxonomy.color.text.primary,
        padding: civicNestSemanticTokenTaxonomy.spacing.inset.card,
      }}
    >
      <h2 id={headingId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {children}
    </article>
  );
}
