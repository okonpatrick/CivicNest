import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

const workspaceStyles = document.createElement("style");
workspaceStyles.textContent = readFileSync(
  resolve(process.cwd(), "src/styles.css"),
  "utf8",
);
document.head.append(workspaceStyles);

afterEach(cleanup);
