# DDS-05A – TESTBUILD 3.1 Cache-Busting Regression Test Correction Authorization

Status: AUTHORIZED / SINGLE-TEST-FILE SCOPE / NOT IMPLEMENTED

## Purpose

Authorize the correction of the stale TESTBUILD 3 cache-busting regression expectations so they match the already deployed TESTBUILD 3.1 runtime contract.

## Authorized file

Exactly one existing file may be modified:

- `tests/dds-05a/testbuild-cache-busting.test.mjs`

No other file is authorized for modification in this correction.

## Authorized changes

The correction may only update regression expectations from TESTBUILD 3 / `DDS-05A-TB3` to TESTBUILD 3.1 / `DDS-05A-TB3.1`, including:

- `BUILD_ID`
- `BUILD_LABEL`
- visible HTML build-label expectations
- `data-build-id` expectation
- document title expectation
- CSS cache-buster expectation
- `browser-app.mjs` cache-buster expectation
- runtime `EXPECTED_BUILD_ID` expectation
- `atlas-loader.mjs` cache-buster expectation
- `sprite-presentation.mjs` cache-buster expectation
- add/adjust an assertion for `construction-ui-controller.mjs?build=DDS-05A-TB3.1`
- atlas manifest/image URL expectations using `DDS-05A-TB3.1`
- stale-build negative assertions so an exact old TB3 identity is rejected without falsely matching TB3.1
- preserve the existing TB2 exclusion checks where still applicable

## Explicit exclusions

This authorization does not permit changes to:

- runtime code
- `index.html`
- `src/dds-04f/browser-app.mjs`
- construction/grid/snap authority
- atlas JSON crop data
- atlas PNG
- atlas loader behavior
- sprite presentation behavior
- CSS or responsive layout
- GitHub Actions / CI workflows
- package or dependency configuration
- any DDS-05B+ capability

## Gate relationship

This correction exists only to restore the accuracy of the existing regression suite against the already active TESTBUILD 3.1 runtime. It does not itself complete or freeze the DDS-05A Modular Grid Authority Compatibility Completion / Regression Gate.

After implementation of this single-file correction, the regression execution path must still be executed and evidenced before the gate may be marked PASS/FROZEN.
