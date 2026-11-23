# Workspace design

The repository starts as one React application built with Vite. Its entry point
is `src/main.tsx`; the UI shell and tests live in `src/app/`, shared styling in
`src/styles.css`, and product-specific areas can be grouped under
`src/features/`.

Future reusable frontend libraries belong in `packages/`, with their own
public APIs and consumers. Independently owned service modules belong in
`services/`, separate from the UI and its feature code.

**Alternative considered:** begin with an Nx or Turborepo monorepo. That adds
cross-project task orchestration, but also brings configuration before there
are multiple projects to coordinate. A plain Vite app keeps setup small now;
orchestration can be selected once real package and service boundaries need it.
