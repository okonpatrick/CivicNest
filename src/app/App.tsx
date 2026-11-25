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
    </main>
  );
}
