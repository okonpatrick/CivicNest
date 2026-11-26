# Shared-package release record

Copy this template for each proposed shared-package release. Complete every
field before requesting approval. Use `Not applicable` with a reason where a
field does not apply; do not treat a planned or illustrative check as a
passing result.

## Release identity

- **Status:** Proposed / In review / Approved / Released
- **Package:**
- **Current version:**
- **Proposed version:**
- **Source revision:**
- **Package owner:**
- **Release date or target date:**
- **Publishing infrastructure:** State whether a registry, package manifest,
  release automation, and immutable artifact are actually configured. Do not
  imply publication or deployment occurred when it did not.

## Change and version decision

- **Change summary:**
- **Version impact:** Major / Minor / Patch / No package release
- **Policy rationale:** Identify the applicable rule in the
  [public contract policy](./public-contracts.md) and explain why existing
  consumers can or cannot continue unchanged.
- **Affected public contracts:** List package-root entry points and each
  changed or added token, component property/behavior, exported type, utility,
  or other consumer-visible contract. State `None` if the public contract is
  unchanged.
- **Compatibility and deprecation:** Describe defaults, supported behavior,
  deprecation period, replacement, and affected consumers, or state why these
  do not apply.

## Consumer dependency ranges

For each consuming service, record both the declared compatible range and the
exact package version used to verify it. If service manifests are not
implemented in the current workspace, record this as proposed release metadata
and do not imply that dependency installation already enforces it.

| Consumer service | Declared package range | Resolved version tested | Verification result / follow-up |
| ---------------- | ---------------------- | ----------------------- | ------------------------------- |
|                  |                        |                         |                                 |

## Verification evidence

List exact commands or test names, environment/source revision, and observed
pass/fail results. Link to available CI or build evidence without claiming a
CI system exists when it does not.

| Check                        | Command or evidence link | Result | Notes |
| ---------------------------- | ------------------------ | ------ | ----- |
| Consumer contract/type check |                          |        |       |
| Tests                        |                          |        |       |
| Lint and formatting          |                          |        |       |
| Production build             |                          |        |       |
| Other relevant check         |                          |        |       |

- **Accessibility impact and evidence:** Identify affected accessible
  semantics, keyboard/focus behavior, names, and state announcements; record
  relevant checks or explain why there is no impact.
- **Performance impact and evidence:** Identify relevant bundle/runtime
  measurements or explain why there is no expected impact.
- **Security and data-protection impact:** Describe any relevant review and
  confirm the record contains no credentials, resident information, or other
  sensitive data.

## Migration and approval

- **Consumer migration required:** Yes / No
- **Migration steps or guide:** Include affected consumers, sequencing, and
  deprecation/removal dates, or state `None` with a reason.
- **Approvals:** Package owner; affected service owners; other required
  reviewers.
- **Release decision and date:**
- **Outstanding risks or follow-up owner/date:**
