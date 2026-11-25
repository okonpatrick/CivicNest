const appNameKey = "VITE_CIVICNEST_APP_NAME";

export interface RuntimeConfig {
  appName: string;
}

export class RuntimeConfigError extends Error {
  constructor(message: string) {
    super(`${appNameKey} ${message}`);
    this.name = "RuntimeConfigError";
  }
}

export function loadRuntimeConfig(
  environment: Record<string, string | undefined>,
): RuntimeConfig {
  const appName = environment[appNameKey]?.trim();

  if (!appName) {
    throw new RuntimeConfigError(
      "is required. Set a public display name in your local environment file.",
    );
  }

  const hasControlCharacters = [...appName].some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });

  if (appName.length > 80 || hasControlCharacters) {
    throw new RuntimeConfigError(
      "must be at most 80 characters and contain no control characters.",
    );
  }

  return { appName };
}
