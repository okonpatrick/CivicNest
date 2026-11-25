# Local quality-gate verification receipt

Verified on 2026-11-25 from the repository root on
`sprint/month-01-1-7f6b839e`, with Node.js 22.19.0 and pnpm 10.17.1.

## Gate policy

The package scripts are the canonical local entry points:

- `pnpm typecheck` runs strict TypeScript checking, including
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, unused locals and
  parameters, and override checks.
- `pnpm lint` runs type-aware ESLint recommended rules. Explicit `any` and
  unused variables fail lint. React hook and Fast Refresh rules apply to TSX,
  not service TypeScript.
- `pnpm test` runs Vitest and the Testing Library suite, so test configuration
  failures fail the gate.
- `pnpm format:check` verifies formatting; `pnpm format` applies it.
- `pnpm build` type-checks and creates the production bundle.
- `pnpm check` runs lint, tests, formatting verification, and build together.

The root TypeScript project covers `src/`, `packages/`, and `services/`;
type-aware linting uses that project for TypeScript files in each area. These
commands are reproducible inputs for a future CI pipeline, not a replacement
for CI. During an early local spike, the full aggregate gate is advisory;
formatting can be applied with `pnpm format`. Before review or a release
candidate, typecheck, lint, tests, format verification, and build are blocking.

This balance helps municipal service teams move quickly while exploring, then
catch type-safety, behavior, consistency, and production-build problems before
changes reach review or release. Passing these checks gives teams a dependable
baseline for changes that residents and service staff rely on; CI remains a
separate safeguard.

Vitest is configured in `vite.config.ts` to use `jsdom` and load
`src/test/setup.ts` before test files. The shared setup installs the
Testing Library matchers and registers DOM cleanup after each test; test files
therefore only need to import test-specific dependencies.

## Executed results

`pnpm typecheck`:

```text
> tsc --noEmit -p tsconfig.json
Exit code: 0
```

`pnpm lint`:

```text
> eslint .
Exit code: 0 (no diagnostics)
```

`pnpm test`:

```text
✓ src/config/runtime.test.ts (3 tests)
✓ src/app/App.test.tsx (1 test)
✓ src/features/services/ServiceCard.test.tsx (1 test)
✓ src/test/fixtures/community-services.test.ts (1 test)
Test Files  4 passed (4)
Tests       6 passed (6)
Exit code: 0
```

Tests assert the configured app-name heading and local-services description,
validate missing and malformed runtime configuration, and render generic
synthetic service data with a non-address service area.

`pnpm format` applied Prettier to supported JavaScript, TypeScript, CSS, JSON,
and Markdown files. `pnpm format:check` then reported:

```text
Checking formatting...
All matched files use Prettier code style!
Exit code: 0
```

`pnpm build` passed the TypeScript check and Vite production build:

```text
✓ 30 modules transformed.
✓ built in 8.70s
Exit code: 0
```

`pnpm check` completed lint, the passing render test, formatting verification,
TypeScript checking, and the production build with exit code 0.
