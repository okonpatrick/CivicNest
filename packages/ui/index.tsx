import { useId, type CSSProperties, type ReactNode } from "react";
import { civicNestSemanticTokenTaxonomy } from "@civicnest/design-tokens";

type ServiceCardStyle = CSSProperties & {
  [key: `--cn-${string}`]: string;
};

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
  const cardStyle: ServiceCardStyle = {
    backgroundColor: civicNestSemanticTokenTaxonomy.color.surface.card,
    border: `1px solid ${civicNestSemanticTokenTaxonomy.color.border.emphasis}`,
    borderRadius: civicNestSemanticTokenTaxonomy.sizing.radius.card,
    color: civicNestSemanticTokenTaxonomy.color.text.primary,
    minWidth: 0,
    overflowWrap: "anywhere",
    "--cn-responsive-card-inset-compact":
      civicNestSemanticTokenTaxonomy.responsive.inset.cardCompact,
    "--cn-responsive-card-inset-wide":
      civicNestSemanticTokenTaxonomy.responsive.inset.cardWide,
    "--cn-color-action-text": civicNestSemanticTokenTaxonomy.color.action.text,
    "--cn-color-action-surface":
      civicNestSemanticTokenTaxonomy.color.action.surface,
    "--cn-color-action-border":
      civicNestSemanticTokenTaxonomy.color.action.border,
    "--cn-color-action-hover-surface":
      civicNestSemanticTokenTaxonomy.interaction.hover.surface,
    "--cn-color-action-active-surface":
      civicNestSemanticTokenTaxonomy.interaction.active.surface,
    "--cn-color-disabled-text":
      civicNestSemanticTokenTaxonomy.color.disabled.text,
    "--cn-color-disabled-surface":
      civicNestSemanticTokenTaxonomy.color.disabled.surface,
    "--cn-color-disabled-border":
      civicNestSemanticTokenTaxonomy.color.disabled.border,
    "--cn-color-success-text":
      civicNestSemanticTokenTaxonomy.color.state.success,
    "--cn-color-success-surface":
      civicNestSemanticTokenTaxonomy.color.state.successSurface,
    "--cn-color-success-border":
      civicNestSemanticTokenTaxonomy.color.state.successBorder,
    "--cn-color-warning-text":
      civicNestSemanticTokenTaxonomy.color.state.warning,
    "--cn-color-warning-surface":
      civicNestSemanticTokenTaxonomy.color.state.warningSurface,
    "--cn-color-warning-border":
      civicNestSemanticTokenTaxonomy.color.state.warningBorder,
    "--cn-color-error-text": civicNestSemanticTokenTaxonomy.color.state.error,
    "--cn-color-error-surface":
      civicNestSemanticTokenTaxonomy.color.state.errorSurface,
    "--cn-color-error-border":
      civicNestSemanticTokenTaxonomy.color.state.errorBorder,
    "--cn-color-validation-error-text":
      civicNestSemanticTokenTaxonomy.color.validation.error,
    "--cn-color-validation-error-surface":
      civicNestSemanticTokenTaxonomy.color.validation.errorSurface,
    "--cn-color-validation-error-border":
      civicNestSemanticTokenTaxonomy.color.validation.errorBorder,
    "--cn-focus-ring-color": civicNestSemanticTokenTaxonomy.focus.ring.color,
    "--cn-focus-ring-width": civicNestSemanticTokenTaxonomy.focus.ring.width,
    "--cn-focus-ring-offset": civicNestSemanticTokenTaxonomy.focus.ring.offset,
  };

  return (
    <article
      className="service-card"
      aria-describedby={descriptionId}
      aria-labelledby={headingId}
      style={cardStyle}
    >
      <h2 id={headingId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {children}
    </article>
  );
}
