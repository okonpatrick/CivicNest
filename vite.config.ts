import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@civicnest\/design-tokens$/,
        replacement: fileURLToPath(
          new URL("./packages/design-tokens/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@civicnest\/ui$/,
        replacement: fileURLToPath(
          new URL("./packages/ui/index.tsx", import.meta.url),
        ),
      },
      {
        find: /^@civicnest\/utils$/,
        replacement: fileURLToPath(
          new URL("./packages/utils/index.ts", import.meta.url),
        ),
      },
      {
        find: /^@civicnest\/resident-support$/,
        replacement: fileURLToPath(
          new URL("./services/resident-support/index.tsx", import.meta.url),
        ),
      },
      {
        find: /^@civicnest\/permits$/,
        replacement: fileURLToPath(
          new URL("./services/permits/index.tsx", import.meta.url),
        ),
      },
      {
        find: /^@civicnest\/community-services$/,
        replacement: fileURLToPath(
          new URL("./services/community-services/index.tsx", import.meta.url),
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
