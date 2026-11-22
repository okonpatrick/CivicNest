# Local quality-gate verification receipt

Verified on 2026-11-22 from the repository root on
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
✓ src/app/App.test.tsx (1 test)
Test Files  1 passed (1)
Tests       1 passed (1)
Exit code: 0
```

The render test asserts the visible CivicNest heading and local-services
description.

`pnpm format` applied Prettier to supported JavaScript, TypeScript, CSS, JSON,
and Markdown files. `pnpm format:check` then reported:

```text
Checking formatting...
All matched files use Prettier code style!
Exit code: 0
```

`pnpm build` passed the TypeScript check and Vite production build:

```text
✓ 29 modules transformed.
✓ built in 1.96s
Exit code: 0
```

`pnpm check` completed lint, the passing render test, formatting verification,
TypeScript checking, and the production build with exit code 0.
