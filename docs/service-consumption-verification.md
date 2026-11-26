# Service consumption clean-checkout verification

Verified on 2026-11-26 from a detached, clean Git worktree at
`31099cbe35a8d840b89e0a3458a05cc08f06e84f` on
`sprint/month-02-2-7f6b839e`, using Windows PowerShell, Node.js 22.19.0, and
pnpm 10.17.1. The checkout had no `node_modules/`, `dist/`, or `.env.local`
before setup. No secrets, production endpoints, or non-synthetic municipal
data were used.

| Command                          | Result | Evidence                                                                                                                                               |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm install --frozen-lockfile` | Passed | Installed 260 lockfile packages. pnpm noted that the `esbuild` build script was ignored; the type checks, tests, and build passed afterward.           |
| `pnpm contracts`                 | Passed | 11 documented exports across 3 shared packages; all consumer fixtures, including the Permits example, type-checked through approved package roots.     |
| `pnpm check`                     | Passed | Lint, boundaries (21 source files), contracts, all 13 tests in 5 files, formatting, strict TypeScript, and the 39-module Vite production build passed. |
| `git status --short`             | Clean  | No files were modified by installation or verification.                                                                                                |

The Permits worked example and its local synthetic fixture are the checked
consumer files `consumer-fixtures/permits/index.tsx` and
`consumer-fixtures/permits/demo-fixtures.ts`. `pnpm contracts` compiles this
example as part of the clean-checkout walkthrough documented in
[service-consumption.md](./service-consumption.md).

The full gate does not need `.env.local`; tests and the consumer example use
synthetic, checked-in values. A local application launch, if desired, uses only
the public synthetic app name in `.env.example`, copied to the ignored
`.env.local` as described in the [contributor guide](./contributing.md). Never
copy credentials, resident data, or production endpoints into that file.
