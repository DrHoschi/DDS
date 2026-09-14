# DDS-05B – TESTBUILD 1 Identity / Cache-Buster Implementation Scope Reconciliation

## Basis

Reconciled against branch `feature/dds-05a-sprite-construction-presentation` after DDS-05B regression PASS at commit `0d09783af039fd4caccc90393d4ad1d40027e84a`.

Target identity for the first explicit DDS-05B device-test build:

- visible label: `DDS-05B · TESTBUILD 1`
- canonical technical build id: `DDS-05B-TB1`

This step defines implementation scope only. No identity/cache-buster change is implemented here.

## Reconciled active files

### 1. `index.html`

Current active identity is still `DDS-05A · TESTBUILD 3.1` / `DDS-05A-TB3.1` in:

- meta description
- document title
- CSS query-string cache-buster
- `data-build-id`
- visible header label
- browser-app module query-string cache-buster

Authorized later implementation would replace these active DDS-05A TESTBUILD 3.1 identities consistently with `DDS-05B · TESTBUILD 1` / `DDS-05B-TB1`.

### 2. `src/dds-04f/browser-app.mjs`

Current runtime still hardcodes `DDS-05A-TB3.1` in:

- `construction-ui-controller.mjs` import query string
- `atlas-loader.mjs` import query string
- `sprite-presentation.mjs` import query string
- `EXPECTED_BUILD_ID`

Authorized later implementation would replace only these build/cache-buster identity tokens with `DDS-05B-TB1` while preserving runtime behavior.

The existing atlas manifest forwarding behavior remains unchanged: the active build id continues to be appended to the atlas manifest URL and is then propagated by the existing atlas loader to the atlas image URL.

### 3. `tests/dds-05a/testbuild-cache-busting.test.mjs`

This existing regression contract explicitly asserts the current TESTBUILD 3.1 identity and therefore must move with the active build identity. Required later updates are limited to:

- `BUILD_ID` / `BUILD_LABEL`
- visible title / `data-build-id` assertions
- CSS and browser-app query-string assertions
- `EXPECTED_BUILD_ID` assertion
- three module-import cache-id assertions
- stale-build assertions so they reject the superseded DDS-05A TESTBUILD 3.1 identity in the active identity files
- atlas URL propagation fixture/expectation from `DDS-05A-TB3.1` to `DDS-05B-TB1`
- human-readable test names where they explicitly say `DDS-05A` or `TESTBUILD 3.1`

The test file remains in `tests/dds-05a/` for this narrow correction; moving/renaming the regression file is not required for cache correctness and would be scope expansion.

## Exact later implementation scope

Only these three existing files are required for the TESTBUILD 1 identity/cache-buster implementation:

1. `index.html`
2. `src/dds-04f/browser-app.mjs`
3. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No new runtime file is required.

## Explicitly unchanged

The later identity-only implementation must not modify:

- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04f/prototype.css`
- `src/dds-05a/atlas-loader.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `assets/construction/dds-05a/candidate/construction-atlas.json`
- `assets/construction/dds-05a/candidate/construction-atlas.png`
- `tests/dds-05b/visible-construction-grid.test.mjs`
- `.github/workflows/dds-05a-regression.yml`
- grid dimensions or projection
- snap authority or placement geometry
- sprite crop/scale/anchor/calibration
- FLOOR footprint or FLOOR spacing
- WALL placement/spacing
- any DDS-05C+ capability

## Cache chain after later implementation

The intended single build token chain is:

`index.html` → CSS `?build=DDS-05B-TB1`

`index.html` → `browser-app.mjs?build=DDS-05B-TB1`

`browser-app.mjs` validates `EXPECTED_BUILD_ID === DDS-05B-TB1`

`browser-app.mjs` → controller / atlas-loader / sprite-presentation imports with `?build=DDS-05B-TB1`

`browser-app.mjs` → atlas manifest URL with `?build=DDS-05B-TB1`

existing atlas-loader behavior → atlas PNG URL with the same build id.

This provides an unambiguous device-test identity and forces the active browser/module/asset request chain onto the DDS-05B TESTBUILD 1 cache namespace.

## Gate

Reconciliation result: **three-file implementation scope identified**.

No implementation is authorized by this reconciliation alone.

FLOOR/Grid Footprint Calibration is a separate later block and remains explicitly outside this identity/cache-buster scope. WALL calibration remains later still.
