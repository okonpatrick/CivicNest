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
