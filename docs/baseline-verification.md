# CivicNest baseline verification receipt

Verified on 2026-11-22 with Node.js 22.19.0 and pnpm 10.17.1 from the repository
root on `sprint/month-01-1-7f6b839e`.

## Application startup

Command: `pnpm dev`

Vite output:

```text
VITE v7.3.8  ready in 798 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

The local URL was opened in the integrated browser and reloaded. Browser
checks returned:

```text
Page title: CivicNest
Heading "Welcome to CivicNest": visible
Local-services description: visible
Computed body font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Browser runtime/console errors: none
```

The computed font comes from `src/styles.css`, imported by `src/main.tsx`.
This confirms the stylesheet is applied to the running React application.

## Testing Library render test

Command: `pnpm test`

```text
✓ src/app/App.test.tsx (1 test)

Test Files  1 passed (1)
Tests       1 passed (1)
```

The test renders `App` and asserts that the user-visible `Welcome to CivicNest`
heading and local-services description are in the document.

## Production build

Command: `pnpm build`

```text
✓ 29 modules transformed.
dist/index.html                   0.57 kB
dist/assets/index-Bknv1NQv.css    0.75 kB
dist/assets/index-DOGWDbNn.js   222.97 kB
✓ built in 2.43s
```
