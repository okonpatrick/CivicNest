# Workspace boundaries and ownership

## Decision record

- **Status:** Accepted for the initial federated frontend
- **Decision date:** 2026-11-25
- **Scope:** Source-code ownership and dependency direction; this does not
  select a deployment or runtime-federation platform.

### Context

CivicNest starts as one React and TypeScript application built and served by
Vite. The frontend is expected to grow into a platform where teams can own
municipal-service modules and reuse stable platform capabilities. The initial
workspace needs clear ownership and import rules without requiring projects,
build tooling, or deployment infrastructure that do not yet exist.

### Decision

Keep the current Vite application as the host and introduce directories only
when there is real code to put in them. Organize application-owned composition
in `src/app/`, feature-specific UI in `src/features/<feature>/`, reusable
platform libraries in `packages/<package>/`, and independently owned
service modules in `services/<service>/`.

The host composes service modules through their documented public entry points.
Service modules may import public APIs from shared packages, including stable
platform contracts. Shared packages are service-agnostic: they must not import
from `services/`, contain a service's behavior, or define its service-specific
data. Shared contracts are limited to stable concepts that genuinely cross
service boundaries; they are not a place to centralize one service's domain
model. A service team proposing a contract change reviews its compatibility
with the platform contract owner before adoption.

These are source and ownership boundaries, not promises of separately
deployable modules. Keep one Vite build and the existing package scripts while
there is one application to build. Do not introduce runtime federation or a
monorepo task orchestrator merely to express ownership. Revisit workspace
orchestration when multiple real packages or applications need coordinated
builds, caching, or affected-project checks. Revisit runtime federation and
independent deployment only if separately released service modules become a
requirement and their operational, security, accessibility, performance, and
contract-versioning costs are understood.

### Dependency and ownership map

```text
                         CivicNest frontend

             +---------------------------------+
             | Vite application host           |
             | src/app/                        |
             | Owner: Frontend Platform team   |
             +---------------+-----------------+
                             |
                  composes public entry points
                             v
             +---------------------------------+
             | Service modules                 |
             | services/<service>/             |
             | Owner: owning Service team      |
             +---------------+-----------------+
                             |
                  consumes stable public APIs
                             v
             +---------------------------------+
             | Shared platform packages       |
             | packages/<package>/             |
             | Owner: Frontend Platform team   |
             |                                 |
             | packages/contracts/ (only when |
             | justified by real consumers)    |
             | Owner: Platform Contract Steward|
             +---------------------------------+

     Forbidden reverse dependency:
     packages/*  -X->  services/* or service-specific behavior/data
```

The host also consumes shared platform packages through their public APIs.
`packages/contracts/` is one possible service-neutral package boundary; it is
not a separate runtime or required initial project.

`src/features/` remains the home for capabilities that are part of the current
host application and do not need independent service-team ownership. The
diagram describes the intended dependency direction when the future boundaries
are introduced; it does not claim that empty `packages/` or `services/`
projects already exist.

### Boundary ownership and responsibilities

| Boundary                                              | Accountable owner role                               | Owns                                                                                    | Must not                                                                 |
| ----------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Application host (`src/app/`)                         | Frontend Platform team                               | Startup, navigation, configuration, and composition of feature and service entry points | Accumulate service-specific business rules or import service internals   |
| Host feature (`src/features/<feature>/`)              | Frontend Platform team, with capability contributors | Host-level UI and behavior that has no separate service owner                           | Become a back door around a service module's public API                  |
| Service module (`services/<service>/`)                | Owning Service team                                  | Its user journey, domain behavior, and adapter to its service boundary                  | Import host internals or another module's private files                  |
| Shared platform package (`packages/<package>/`)       | Frontend Platform team                               | Reusable, service-neutral capabilities and their documented public API                  | Depend on service code, service-specific behavior, or service-owned data |
| Shared contracts (`packages/contracts/`, when needed) | Platform Contract Steward                            | Compatibility and review of genuinely shared, stable contracts                          | Absorb a single service's domain model or change without consumer review |

The owning role is accountable for review and maintenance; it is not a named
individual. Each package or module publishes its supported entry point.
Consumers import only that entry point, not internal paths.

### Alternatives considered

- **One undivided application:** simplest initially, but it does not record
  responsibility or import direction as service ownership is introduced.
- **Nx or Turborepo from the first commit:** provides task orchestration for
  multiple projects, but adds configuration and operational conventions before
  there are projects to coordinate. Reconsider when real project count and
  build needs justify it.
- **Runtime federation and separate service deployments immediately:** could
  allow independent release, but introduces runtime integration, versioning,
  failure, accessibility, and performance concerns without a current
  independent-release requirement. Reconsider only with an explicit
  operational need and a reviewed deployment design.

## Current implementation

The current application remains a single Vite project. `src/main.tsx` is its
entry point; the UI shell and tests live in `src/app/`, shared styling in
`src/styles.css`, and product-specific areas can be grouped under
`src/features/`. The `packages/` and `services/` directories are future
boundaries, not requirements to create placeholder projects.

The TypeScript and lint configuration already includes `src/`, `packages/`,
and `services/`, so the strict checks apply when those directories gain real
modules. The root package scripts remain the common local quality gates.

## Revisit triggers

Review this decision when any of the following becomes true:

- Multiple consumers need the same platform capability or stable contract.
- A service team needs an independently owned module with a public entry
  point.
- Multiple buildable projects need dependency-aware orchestration or
  affected-project checks.
- A service needs independent deployment or release cadence.

Record the concrete consumers, ownership, import graph, compatibility and
deployment requirements, quality/performance measurements, and migration
impact before changing the layout or adding build/runtime infrastructure.
