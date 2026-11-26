import { CommunityServicesModule } from "@civicnest/community-services";
import { PermitsModule } from "@civicnest/permits";
import { ResidentSupportModule } from "@civicnest/resident-support";

interface AppProps {
  appName: string;
}

export default function App({ appName }: AppProps) {
  return (
    <main className="welcome">
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
