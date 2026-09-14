# DDS-05B – Regression Execution Reconciliation

## Status
RECONCILED / NO IMPLEMENTATION AUTHORIZED

## Baseline
DDS-05B implementation head before this reconciliation:
`57bc4f25d6d25cb1bf363453790e557e1a36246f`

## Purpose
Determine the smallest valid change required to execute the already existing DDS-05B regression test inside the established repository regression workflow, without restructuring CI and without modifying runtime behavior.

## Existing regression execution
The existing workflow is:
`.github/workflows/dds-05a-regression.yml`

It currently:
- runs on pushes to `feature/dds-05a-sprite-construction-presentation` and by `workflow_dispatch`;
- uses the existing single `regression` job;
- uses Node.js 22;
- executes:
  `node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs`

The workflow already passes for DDS-05B implementation head, but it does not include the new DDS-05B test directory.

## Existing DDS-05B test
The test already exists at:
`tests/dds-05b/visible-construction-grid.test.mjs`

It uses only Node built-ins (`node:test`, `node:assert/strict`, `node:fs/promises`) and repository files. No package install, browser runner, extra dependency, artifact, environment variable, or separate job is required.

## Reconciled minimal execution change
The only required later CI change is to extend the existing command in `.github/workflows/dds-05a-regression.yml` from:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs`

to:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

The step label may be updated only if needed to accurately describe the command, for example from `Run DDS-04F and DDS-05A regression tests` to `Run DDS-04F, DDS-05A and DDS-05B regression tests`.

## Exact later implementation scope
Permitted existing file:
1. `.github/workflows/dds-05a-regression.yml`

No new workflow file is required.
No new job is required.
No trigger change is required.
No Node version change is required.
No permissions change is required.
No dependency installation is required.

## Explicitly unchanged
The regression execution correction must not change:
- `src/dds-04f/browser-app.mjs`;
- `src/dds-04f/prototype.css`;
- `tests/dds-05b/visible-construction-grid.test.mjs`;
- any DDS-04F or DDS-05A test;
- controller, snap, atlas, sprite or placement authority;
- GitHub Pages deployment;
- TESTBUILD identity/cache-busting;
- DDS-05A FROZEN state;
- any DDS-05B runtime behavior.

## Required later verification
After a separately authorized workflow correction, the resulting workflow run must be tied to the exact correction commit and must show that the command contains all three test directories:
- `tests/dds-04f/*.test.mjs`
- `tests/dds-05a/*.test.mjs`
- `tests/dds-05b/*.test.mjs`

The TAP result must show zero failures. The exact total test count is evidence, not a frozen contract, because future authorized tests may increase it.

## Device gate boundary
This reconciliation does not alter device acceptance. Existing iPhone evidence remains separate. DDS-05B still requires iPad device evidence before completion/freeze can be considered.

## Conclusion
DDS-05B regression execution requires one narrowly scoped workflow-command extension only. No CI architecture change is justified.

**DDS-05B REGRESSION EXECUTION = RECONCILED**

**EXACT LATER FILE SCOPE = ONE WORKFLOW FILE**

**NO IMPLEMENTATION AUTHORIZED IN THIS STEP**
