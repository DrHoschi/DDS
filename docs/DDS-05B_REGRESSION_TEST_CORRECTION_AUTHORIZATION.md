# DDS-05B – Regression Test Correction Authorization

Status: AUTHORIZED / TEST-CORRECTION-ONLY / NOT YET IMPLEMENTED

## Basis

Authoritative reconciliation baseline:

- `367a1afeb121c7a5cb1383adc7570ee02671ccdf`
- `docs: reconcile DDS-05B regression test failures`

The prior regression re-verification for exact runtime/workflow baseline `3b030f3e637389fd67fcee103f7bec90b57fb2e4` executed DDS-04F + DDS-05A + DDS-05B and produced 54 tests, 52 PASS, 2 FAIL. Reconciliation determined both failures are test-contract defects rather than demonstrated runtime defects.

## Authorized correction scope

Exactly one existing file may be modified:

- `tests/dds-05b/visible-construction-grid.test.mjs`

No other file is authorized.

## Authorized correction 1 – presentation-state assertion

The test must continue verifying exactly the four authorized presentation states:

- `free`
- `occupied`
- `valid-target`
- `selected-target`

However, it must not require a dedicated CSS selector `.scene-grid__cell.is-free`, because the implemented presentation contract uses `.scene-grid__cell` as the FREE visual base and uses CSS overrides for the three non-default states.

The corrected assertion must verify both:

1. Runtime state generation still includes the explicit `"free"` state and all three non-default states.
2. CSS still contains the base `.scene-grid__cell` presentation plus the three state-specific override selectors.

No runtime or CSS change is authorized to satisfy the test.

## Authorized correction 2 – fixed GRID_SIZE assertion

The test must continue verifying that DDS-05B remains a fixed 9×9 presentation grid.

The existing negative regex `GRID_SIZE\s*=\s*[^9]` must be removed or replaced because it can match the whitespace preceding the correct value `9`.

The corrected test may rely on the already-present positive assertion `const GRID_SIZE = 9;` and/or a boundary-safe check that cannot falsely reject the valid declaration.

No runtime constant change is authorized.

## Explicitly not authorized

This authorization does not permit changes to:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`
- `.github/workflows/dds-05a-regression.yml`
- `index.html`
- controller / snap authority
- sprite presentation
- atlas / loader
- DDS-04F tests
- DDS-05A tests
- build/testbuild identity or cache-buster
- Y stacking, pan/zoom, dragging, TESTBUILD 4, DDS-05C+

## TESTBUILD identity

No TESTBUILD increment is part of this authorization. The visible runtime remains `DDS-05A · TESTBUILD 3.1` / `DDS-05A-TB3.1` because this is a regression-test-only correction and does not alter shipped runtime presentation.

## Completion condition for the correction implementation

After the one-file correction is implemented, the automatically triggered regression must be re-verified for the exact resulting commit and must execute:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

No PASS may be declared until that exact run completes successfully.
