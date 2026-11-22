# CivicNest

CivicNest is a React and TypeScript frontend built with Vite.

## Get started

Requires Node.js 20.19+ or 22.12+.

```sh
pnpm install
pnpm dev
```

Vite prints a local URL when the development server is ready. Open that URL to
see the CivicNest welcome screen. The entry point is `src/main.tsx`, which
imports `src/styles.css` once for the application.

Run the unit tests with `pnpm test` and create a production build with
`pnpm build`.

## Local quality gates

Use the package scripts as the single entry point for repeatable checks:

| Command             | Check                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm typecheck`    | Strict TypeScript check, including unused locals/parameters and safer indexed/optional access |
| `pnpm lint`         | Type-aware ESLint rules for TS/TSX; unused code and unsafe TypeScript patterns fail           |
| `pnpm test`         | Run the Vitest and Testing Library suite                                                      |
| `pnpm format:check` | Verify Prettier formatting without modifying files                                            |
| `pnpm format`       | Apply Prettier formatting to supported source, config, and Markdown files                     |
| `pnpm build`        | Type-check and create the production bundle                                                   |
| `pnpm check`        | Run lint, tests, formatting verification, and the type-checked production build               |

The TypeScript project includes `src/`, `packages/`, and `services/`, so the
same strict checks apply as shared platform packages and service modules are
added. ESLint applies typed rules to TypeScript in those areas and React hook
and refresh rules only to TSX files.

For an early local spike, the full `pnpm check` can be advisory while code is
still changing; use `pnpm format` to fix formatting. Before requesting review
or preparing a release candidate, `pnpm typecheck`, `pnpm lint`, `pnpm test`,
`pnpm format:check`, and `pnpm build` are blocking. `pnpm check` runs the
blocking checks together. These local commands provide reproducible evidence
for contributors and a future automation pipeline to invoke; they do not
replace continuous integration.

See [the quality-gate verification receipt](./docs/quality-gates.md) for the
executed command results and tool versions.

## Workspace architecture

The initial architecture is one Vite application. Its app shell lives in
`src/app/`, with product areas grouped under `src/features/` as they emerge.
This keeps the first workspace straightforward to install, run, test, and
build.

The layout leaves clear boundaries for future ownership:

- `packages/` can hold shared frontend libraries that have their own APIs and
  consumers.
- `services/` can hold independently owned service modules, separate from the
  frontend app shell and its product features.

**Rejected alternative:** starting with a monorepo orchestrator such as Nx or
Turborepo. It would provide cross-project task pipelines immediately, but
would also add configuration and workflow concepts before there are multiple
projects to coordinate. The simple Vite app defers that trade-off; workspace
orchestration can be chosen later when actual package and service boundaries
justify it.

## Baseline verification

- `pnpm dev` starts the local Vite application and serves the welcome screen.
- `pnpm test` runs the Testing Library render test, which checks the visible
  CivicNest heading and local-services description.
- `pnpm build` type-checks the project and creates the production build.

See [the baseline verification receipt](./docs/baseline-verification.md) for
the recorded test output and live startup/browser checks.
