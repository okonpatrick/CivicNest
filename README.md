# CivicNest

CivicNest is a React and TypeScript frontend built with Vite.

## Get started

Requires Node.js 20.19+ or 22.12+.

```sh
pnpm install
pnpm dev
```

Run the unit tests with `pnpm test` and create a production build with
`pnpm build`.

## Workspace architecture

The initial repository is one Vite application, with app code under `src/` and
features grouped there as the product grows. This keeps the first workspace
easy to install, run, test, and build without introducing monorepo tooling
before there are modules that need it.

When shared frontend libraries or independently owned service modules become
real requirements, they can be added as clearly separated top-level
`packages/` and `services/` directories. At that point, repository ownership
and dependency needs can guide whether to add workspace tooling; the baseline
does not assume a particular build system for those future modules.
