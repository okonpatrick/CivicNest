import type { CSSProperties } from "react";
import { civicNestSemanticTokenTaxonomy } from "@civicnest/design-tokens";
import { CommunityServicesModule } from "@civicnest/community-services";
import { PermitsModule } from "@civicnest/permits";
import { ResidentSupportModule } from "@civicnest/resident-support";

type ResponsiveLayoutStyle = CSSProperties & {
  [key: `--cn-responsive-${string}`]: string;
};

interface AppProps {
  appName: string;
}

export default function App({ appName }: AppProps) {
  const responsiveStyle: ResponsiveLayoutStyle = {
    "--cn-responsive-page-gutter-compact":
      civicNestSemanticTokenTaxonomy.responsive.gutter.pageCompact,
    "--cn-responsive-page-gutter-wide":
      civicNestSemanticTokenTaxonomy.responsive.gutter.pageWide,
    "--cn-responsive-card-minimum":
      civicNestSemanticTokenTaxonomy.responsive.sizing.cardMinimum,
    "--cn-responsive-content-max":
      civicNestSemanticTokenTaxonomy.responsive.sizing.contentMaxWidth,
  };

  return (
    <main className="welcome" style={responsiveStyle}>
      <p className="welcome__eyebrow">A stronger community starts here</p>
      <h1>Welcome to {appName}</h1>
      <p className="welcome__description">
        Your home for discovering and connecting with local services.
      </p>
      <p className="welcome__note">
        Synthetic demonstration only. Actions update local sample states; no
        service requests are sent.
      </p>
      <section className="service-list" aria-label="Available services">
        <ResidentSupportModule />
        <PermitsModule />
        <CommunityServicesModule />
      </section>
    </main>
  );
}
