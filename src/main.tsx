import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { loadRuntimeConfig, RuntimeConfigError } from "./config/runtime";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("CivicNest startup failed: the #root element is missing.");
}

const root = ReactDOM.createRoot(rootElement);

try {
  const config = loadRuntimeConfig(import.meta.env);
  document.title = config.appName;
  root.render(
    <React.StrictMode>
      <App appName={config.appName} />
    </React.StrictMode>,
  );
} catch (error) {
  if (!(error instanceof RuntimeConfigError)) {
    throw error;
  }

  console.error("CivicNest startup configuration error:", error.message);
  root.render(
    <main className="startup-error" role="alert">
      <h1>CivicNest could not start</h1>
      <p>{error.message}</p>
      <p>Check the local configuration guide and restart the application.</p>
    </main>,
  );
}
