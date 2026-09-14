# DDS-05A – Regression Execution Infrastructure Authorization

Status: AUTHORIZED / CI-INFRASTRUCTURE-ONLY / NOT IMPLEMENTED

## Authorized purpose

Authorize only the minimal GitHub Actions execution path required to run the already existing DDS regression tests with Node's built-in test runner.

This authorization exists inside the still-open DDS-05A Modular Grid Authority Compatibility Completion / Regression Gate. It does not authorize any new gameplay, runtime, rendering, sprite, atlas, grid, snap, responsive-layout, or build capability.

## Authorized implementation scope

A later implementation step may add exactly one GitHub Actions workflow file under `.github/workflows/` for regression execution.

The workflow may contain only the infrastructure needed to:

1. check out the repository commit that triggered the workflow;
2. install/use a current Node.js LTS runtime;
3. execute the existing tests with Node's built-in test runner via `node --test`;
4. fail the workflow if any executed test fails.

No `npm install`, package manager bootstrap, dependency installation, bundler, build system, browser automation, deployment, artifact rewriting, or generated source is required or authorized.

## Test scope

The workflow is authorized to execute the existing repository test suites under `tests/`, including the current DDS-04F and DDS-05A regression suites required by this gate.

The workflow must consume the tests as they already exist. It must not rewrite tests, runtime files, fixtures, assets, or source code as part of execution.

## Trigger scope

The workflow may be configured for `push` and/or `pull_request` execution so the exact commit under evaluation receives a reproducible regression result.

Manual `workflow_dispatch` may also be included for explicit reruns if useful, but it must not change repository state.

## Explicitly not authorized

This authorization does NOT permit changes to:

- `src/**`
- `tests/**`
- `index.html`
- `assets/**`
- atlas JSON or PNG data
- sprite presentation or calibration
- DDS-04B / DDS-04C / DDS-04D / DDS-04E authorities
- DDS-04F runtime/controller/CSS
- build identity or cache-buster values
- package.json or dependency manifests
- GitHub Pages deployment configuration
- branch topology
- DDS-05B or later capabilities
- Y-axis / storey / stacking rules

## Completion condition

The infrastructure implementation is complete only when the new workflow is present with no scope expansion. The DDS-05A Completion / Regression Gate itself remains open until the workflow has actually run against the intended branch/head and the required regression suites are green.
