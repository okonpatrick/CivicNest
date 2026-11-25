import type { ReactNode } from "react";
import { civicNestTokens } from "@civicnest/design-tokens";

interface ServiceCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function ServiceCard({
  title,
  description,
  children,
}: ServiceCardProps) {
  return (
    <article
      style={{
        backgroundColor: civicNestTokens.colorSurface,
        border: `1px solid ${civicNestTokens.colorAccent}`,
        borderRadius: civicNestTokens.radiusCard,
        color: civicNestTokens.colorText,
        padding: civicNestTokens.spaceCard,
      }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </article>
  );
}
