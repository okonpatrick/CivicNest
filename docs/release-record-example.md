# Example shared-package release record

This is an illustrative proposal, not a record of a change made to CivicNest.
The versions, dependency declaration, and check statuses below are examples
only; no package has been independently versioned or published by this
workspace.

## Release identity

- **Status:** Proposed; not approved or released
- **Package:** `@civicnest/design-tokens`
- **Current version:** `1.3.0` (illustrative)
- **Proposed version:** `1.4.0` (illustrative)
- **Source revision:** To be recorded for an actual change
- **Package owner:** Shared platform package owner
- **Release date or target date:** Not scheduled
- **Publishing infrastructure:** Not configured in the current single-Vite
  workspace. These versions do not correspond to package manifests, registry
  artifacts, or release automation in this repository.

## Change and version decision

- **Change summary:** Add a semantic `colorFocusRing` token for the shared
  keyboard-focus indicator color. Existing token names, values, roles, and
  consumer defaults remain unchanged.
- **Version impact:** Minor (`1.3.0` to `1.4.0`)
- **Policy rationale:** A new documented token is an additive public-contract
  capability. It does not remove or rename an existing token or require
  consumers to change, so the minor rule applies.
- **Affected public contracts:** Add `colorFocusRing` to the
  `@civicnest/design-tokens` package-root export and
  `CivicNestTokenName`/`CivicNestTokenValue` types; document its semantic role
  and value format. No other package entry point changes. Because expanding a
  public union can affect exhaustive consumers, the proposed minor impact is
  conditional on the consumer type-compatibility check; if it exposes a
  source-breaking impact, reclassify as major or redesign the type addition.
- **Compatibility and deprecation:** No deprecation. Existing consumers can
  continue using the existing token names and values.

## Consumer dependency ranges

These are proposed declarations, not checked-in manifests. The example
service uses the new token and must verify against the exact candidate before
adoption.

| Consumer service     | Declared package range             | Resolved version tested                       | Verification result / follow-up             |
| -------------------- | ---------------------------------- | --------------------------------------------- | ------------------------------------------- |
| `resident-support`   | `@civicnest/design-tokens: ^1.3.0` | Candidate `1.4.0` (illustrative)              | Pending; run service checks before approval |
| `permits`            | `@civicnest/design-tokens: ^1.3.0` | Existing compatible resolution to be recorded | No adoption of the new token planned        |
| `community-services` | `@civicnest/design-tokens: ^1.3.0` | Existing compatible resolution to be recorded | No adoption of the new token planned        |

## Verification evidence

No checks have been run for this hypothetical change. An actual proposal must
replace these pending entries with exact commands, source revision, and
observed results before approval.

| Check                        | Command or evidence link                                     | Result  | Notes                                                                  |
| ---------------------------- | ------------------------------------------------------------ | ------- | ---------------------------------------------------------------------- |
| Consumer contract/type check | `pnpm typecheck`                                             | Pending | Confirm the new name is exported from the package root and type unions |
| Tests                        | `pnpm test`                                                  | Pending | Cover token presence and consumer use                                  |
| Lint and formatting          | `pnpm lint`; `pnpm format:check`                             | Pending | Run against the actual change                                          |
| Production build             | `pnpm build`                                                 | Pending | Build the host and consumers against the candidate                     |
| Contrast check               | Record the actual contrast measurement and tested background | Pending | Verify documented focus-indicator contrast intent                      |

- **Accessibility impact and evidence:** The token is intended for keyboard
  focus indicators. Confirm its contrast against each supported surface and
  verify the consuming UI visibly uses it without changing focus behavior.
  Evidence is pending.
- **Performance impact and evidence:** A static token addition is not expected
  to affect runtime performance; verify the actual built output and record any
  material size change. Evidence is pending.
- **Security and data-protection impact:** No data handling or access-control
  change is proposed. An actual diff still requires review; do not include
  secrets or resident data in the record.

## Migration and approval

- **Consumer migration required:** No for existing consumers. A service that
  opts into the token must first update its declared range if its current
  range excludes `1.4.0`, then test its UI against the resolved version.
- **Migration steps or guide:** None for existing token use. Record adoption
  and visual checks for any consumer that chooses the new token.
- **Approvals:** Pending package owner and any service owner adopting the
  token.
- **Release decision and date:** Pending compatibility checks and approval.
- **Outstanding risks or follow-up owner/date:** Validate contrast usage,
  implementation, and exact consumer resolutions before approval.
