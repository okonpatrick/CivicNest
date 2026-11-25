# Contributor guide

This guide is for engineers adding CivicNest platform or municipal-service
features. Run commands from the repository root.

## Set up the workspace

Use Node.js 20.19+ or 22.12+ and pnpm 10.17.1 (the version pinned in
`package.json`):

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Open the local URL printed by Vite. `.env.local` is ignored by Git and must
contain only local synthetic values. `VITE_*` settings are bundled for the
browser, so they are public, never secrets. The required app name is validated
at startup; a missing or malformed value displays a diagnostic instead of
falling back. See [configuration and synthetic data rules](./configuration-and-test-data.md).

## Use the supported commands

| Command             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Start the local Vite application             |
| `pnpm typecheck`    | Run strict TypeScript checking               |
| `pnpm lint`         | Run JavaScript/TypeScript ESLint rules       |
| `pnpm test`         | Run Vitest and Testing Library tests         |
| `pnpm format:check` | Check Prettier formatting without edits      |
| `pnpm format`       | Apply Prettier formatting                    |
| `pnpm build`        | Type-check and create production assets      |
| `pnpm preview`      | Serve the last production build locally      |
| `pnpm check`        | Run lint, tests, formatting check, and build |

Run `pnpm check` before requesting review. During early exploration, it can be
advisory; before review or a release candidate, every check it runs is
blocking. These reproducible local checks are suitable for future CI, but do
not replace CI. See [quality-gate policy and results](./quality-gates.md).

## Keep module boundaries clear

- Keep the app shell in `src/app/` and product-specific UI and behavior under
  `src/features/<feature>/`.
- Put reusable platform libraries in `packages/<package>/` when they have
  more than one real consumer. Give each package a public entry point; import
  that API rather than another package's internal files.
- Put independently owned service modules under `services/<service>/`.
  Services own their domain/API boundary and must not import app-shell
  components or global presentation code.
- Until those directories contain projects, keep one Vite app and its root
  quality gates. Don't add a workspace orchestrator without multiple packages
  or services that need it. See [workspace design](./workspace-design.md).

## Style the UI without leaking app styles

`src/styles.css` is the app shell's global stylesheet. Limit it to document
defaults, resets, and app-level base styles. Use feature-prefixed class names
(for example, `.service-card__title`) for feature-specific UI rules and keep
them with that feature when its stylesheet is introduced. Don't use broad
element selectors for feature styling, and don't import the app stylesheet
from a service module. Shared UI styles belong with a shared UI package and
should be consumed through its public API.

## Test user-observable behavior

- Put a component test beside its component, for example
  `src/features/services/ServiceCard.test.tsx`.
- Put shared typed fixture data in `src/test/fixtures/`; keep each fixture's
  domain type with the feature it describes.
- Render components with Testing Library and assert accessible, user-visible
  results: roles, labels, text, validation messages, loading/empty/error
  states. Avoid assertions on private implementation details.
- Put runtime configuration validation tests beside the config module in
  `src/config/`. Exercise missing and malformed required values as well as a
  valid synthetic value.

## Handle demonstration data safely

Use synthetic data in development, automated tests, screenshots, and portfolio
demonstrations. Never include personal data, municipal production data,
secrets, personal names, account identifiers, addresses, real service requests,
or production endpoints. Use generic service categories and non-address
service-area descriptions. Never copy a real request into a fixture.

Keep local values in ignored `.env.local`; commit only the synthetic
`.env.example`. See [the full data policy](./configuration-and-test-data.md).

## Record changes and submit

Before review:

1. Run `pnpm check`; manually open the app when the change affects the UI.
2. Record the change summary, the exact commands and pass/fail results, and
   any manual browser result in the PR or task submission.
3. If a quality or performance constraint changes, record the old and new
   constraint, why it changed, the command or measurement used, its
   environment, the before/after result, and any remaining risk.
4. Update the relevant guide or verification receipt when behavior or a
   command changes.
5. Confirm `git status` contains only intended files; commit and push to the
   task's assigned branch.

Never put credentials, environment files, resident information, or other
secrets in Git history.

## Troubleshooting

### Dependency installation

- Check `node --version` (20.19+ or 22.12+) and `pnpm --version` (10.17.1).
- Run `pnpm install --frozen-lockfile` from the repository root. If the lock
  file is out of sync with `package.json`, stop and resolve that dependency
  change intentionally; don't bypass the frozen-lock check for a normal
  install.

### Development server or configuration

- Ensure `.env.local` exists by copying `.env.example`, and check that
  `VITE_CIVICNEST_APP_NAME` is non-empty, no longer than 80 characters, and
  contains no control characters.
- Read the Vite startup output for the URL and port. If the default port is
  occupied, run `pnpm dev -- --port 5174` and open the alternate URL.
- A configuration alert is intentional: correct the required value and
  restart; don't add an empty or production-like fallback.

### Tests

- Run `pnpm test`. Check that tests import the shared setup configured in
  `vite.config.ts` and use Testing Library matchers from
  `src/test/setup.ts`.
- For a test failure, inspect the first failing assertion and its rendered
  user-visible state before changing shared setup.

### Production build

- Run `pnpm build`; this runs typecheck before Vite builds.
- Fix the first reported TypeScript error before investigating later build
  messages. For a local production smoke test, run `pnpm preview` after a
  successful build and open the URL it prints.
