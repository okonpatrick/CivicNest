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

| Command             | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Start the local Vite application                              |
| `pnpm typecheck`    | Run strict TypeScript checking                                |
| `pnpm lint`         | Run JavaScript/TypeScript ESLint rules                        |
| `pnpm contracts`    | Verify documented exports and compile consumer fixtures       |
| `pnpm test`         | Run Vitest and Testing Library tests                          |
| `pnpm format:check` | Check Prettier formatting without edits                       |
| `pnpm format`       | Apply Prettier formatting                                     |
| `pnpm build`        | Type-check and create production assets                       |
| `pnpm preview`      | Serve the last production build locally                       |
| `pnpm check`        | Run lint, boundaries, contracts, tests, formatting, and build |

Run `pnpm check` before requesting review. During early exploration, it can be
advisory; before review or a release candidate, every check it runs is
blocking. These reproducible local checks are suitable for future CI, but do
not replace CI. The linked receipt records the setup and every supported
command from a fresh checkout, including dependency installation and preview.
See [quality-gate policy and results](./quality-gates.md).

Prettier uses the checked-in `endOfLine: auto` setting so formatting checks
respect the line endings of both LF and CRLF checkouts.

## Keep module boundaries clear

- Keep the app shell in `src/app/` and product-specific UI and behavior under
  `src/features/<feature>/`.
- Shared package entry points are `@civicnest/design-tokens`,
  `@civicnest/ui`, and `@civicnest/utils`. Import those public APIs rather
  than package implementation paths. Shared packages must stay service-neutral
  and must not depend on service-specific behavior or data.
- Put independently owned service modules under `services/<service>/`.
  Their public entry points are `@civicnest/resident-support`,
  `@civicnest/permits`, and `@civicnest/community-services`. Services own
  their domain/API boundary, may consume stable shared contracts, and must
  not import app-shell components or global presentation code.
- The package aliases are mapped explicitly in TypeScript and Vite. Keep the
  single Vite build and root quality gates; don't add runtime federation or
  workspace orchestration until a demonstrated deployment or build need
  justifies it. See the [workspace boundary and ownership
  decision](./workspace-design.md) and [shared package contract
  policy](./public-contracts.md). New service interfaces must also follow the
  [non-functional requirements](./non-functional-requirements.md) and
  [release operations design](./release-operations.md).

  For service-team onboarding, use the [service-consumption guide](./service-consumption.md)
  for approved imports, worked examples, upgrades, rollback, and verification.

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
For a shared-package contract change, use the [public contract and
versioning policy](./public-contracts.md), follow the
[deprecation and migration policy](./deprecation-and-migration.md) when retiring
an existing export, complete a [release record](./release-record-template.md),
and check the [illustrative example](./release-record-example.md). The current
workspace does not independently publish shared packages.

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
