# Configuration and synthetic data rules

## Runtime configuration

Copy the committed synthetic example to a local, ignored file before starting
the app:

```powershell
Copy-Item .env.example .env.local
pnpm dev
```

`.env.local` is machine-local and ignored by Git. The required
`VITE_CIVICNEST_APP_NAME` is a public display name; Vite embeds every `VITE_*`
variable in browser code. Never put passwords, API keys, tokens, private
credentials, personal information, or other secrets in a `VITE_*` variable,
environment example, source file, or fixture. Use public synthetic values in
examples; provide any public production endpoints through deployment
configuration. Keep secrets in a protected server-side environment or secret
manager.

Add future settings to `src/vite-env.d.ts` and validate them in
`src/config/runtime.ts`. Required values must be checked at the typed
configuration boundary before components start. Validation must reject missing
or malformed values with a diagnostic naming the setting and expected shape;
do not use empty strings, credentials, or guessed production endpoints as
fallbacks. CivicNest logs a `RuntimeConfigError` and renders a startup alert
when the required app name is missing or malformed, rather than starting with
an undefined value.

`.env.example` must contain synthetic, non-secret development values only.
Keep real local values in ignored `.env.local`; supply production values
through deployment configuration, never by editing the example. The existing
ignore exception allows only the documented example file to be committed.

## Test fixtures

Keep test-only records under `src/test/fixtures/`, close to the test suite,
and keep their TypeScript domain shape with the feature they model. Current
community-service examples deliberately use fictional names and `ZZ` / sample
addresses. They are for tests only, not a production directory or a source of
municipal service facts.

Use clearly fictional labels, reserved example domains, and non-routable
contact details in future examples. Do not copy real resident, employee, or
service-user data into fixtures. Runtime configuration belongs in the
configuration boundary and environment files, not in test fixtures.
