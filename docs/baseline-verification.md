# CivicNest baseline verification receipt

Verified on 2026-11-25 with Node.js 22.19.0 and pnpm 10.17.1 from the repository
root on `sprint/month-01-1-7f6b839e`.

## Application startup

Command: `pnpm dev` with the synthetic value from `.env.example`.

Vite output:

```text
VITE v7.3.8  ready in 7377 ms

➜  Local:   http://127.0.0.1:4175/
➜  Network: use --host to expose
```

The local URL was opened in the integrated browser and reloaded. Browser
checks returned:

```text
Page title: CivicNest Local Demo
Heading "Welcome to CivicNest Local Demo": visible
Local-services description: visible
Computed body font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Browser runtime/console errors: none
```

The computed font comes from `src/styles.css`, imported by `src/main.tsx`.
This confirms the stylesheet is applied to the running React application.

With the required value unset, the server remained available but the browser
rendered a `role="alert"` stating that `VITE_CIVICNEST_APP_NAME` is required;
the browser console logged the same diagnostic. No default app name was used.

## Testing Library render test

Command: `pnpm test`

```text
✓ src/config/runtime.test.ts (3 tests)
✓ src/app/App.test.tsx (1 test)
✓ src/features/services/ServiceCard.test.tsx (1 test)

Test Files  3 passed (3)
Tests       5 passed (5)
```

Tests check required and malformed runtime configuration, the visible app
heading and local-services description, and a synthetic service card.

## Production build

Command: `pnpm build`

```text
✓ 30 modules transformed.
dist/index.html                   0.57 kB
dist/assets/index-_vYGOaUt.css    0.85 kB
dist/assets/index-Dj6SYyGt.js   224.01 kB
✓ built in 8.97s
```
