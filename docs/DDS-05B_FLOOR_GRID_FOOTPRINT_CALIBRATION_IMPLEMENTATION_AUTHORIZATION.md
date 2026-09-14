# DDS-05B – FLOOR/Grid Footprint Calibration Implementation Authorization

Status: AUTHORIZED

## Basis

Implementation Scope Reconciliation commit: `5e89ed94a3736e8bd24e955861cd0b01f018fb36`

## Exact authorized implementation scope

Only the following five existing files may be modified in the later implementation step:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
2. `tests/dds-05a/sprite-presentation.test.mjs`
3. `index.html`
4. `src/dds-04f/browser-app.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

## Authorized FLOOR calibration change

In `construction-atlas.json`, only the `scale` values of the four authoritative runtime FLOOR frames may be changed:

- `floor_s`
- `floor_e`
- `floor_n`
- `floor_w`

The purpose is exclusively to calibrate the visible FLOOR sprite footprint to one existing 1×1 grid cell while preserving the already authoritative world/grid spacing.

No `x`, `y`, `w`, `h`, `anchorX`, or `anchorY` change is authorized in this implementation.

The non-authoritative diagonal/helper/state FLOOR entries and all non-FLOOR entries remain unchanged unless a later separate scope explicitly authorizes otherwise.

## Authorized test changes

`tests/dds-05a/sprite-presentation.test.mjs` may be extended or adjusted only to verify:

- the authorized four FLOOR runtime directions resolve the intended calibrated scale,
- FLOOR calibration remains presentation-only,
- non-FLOOR sprite scale/descriptor behavior remains unchanged.

No placement-authority, snap, grid or controller contract may be changed by these tests.

## Authorized TESTBUILD update

The visible/test cache identity must advance from:

- `DDS-05B · TESTBUILD 1`
- `DDS-05B-TB1`

to:

- `DDS-05B · TESTBUILD 1.1`
- `DDS-05B-TB1.1`

This may be applied only through the existing build-identity/cache-busting locations in:

- `index.html`
- `src/dds-04f/browser-app.mjs`
- `tests/dds-05a/testbuild-cache-busting.test.mjs`

Existing build-id derivation and propagation behavior must remain unchanged.

## Explicitly unchanged / prohibited

The following are not authorized in this implementation:

- `src/dds-04f/construction-ui-controller.mjs`
- any FLOOR snap-point or world-position change
- grid size, grid pitch or grid authority changes
- projection changes
- CSS changes, including the existing phone media-query scale declaration
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-05a/atlas-loader.mjs`
- `tests/dds-05a/atlas-loader.test.mjs`
- atlas PNG changes
- frame crop changes (`x/y/w/h`)
- anchor/pivot changes
- WALL/CORNER/DOOR/ROOF/BEAM changes
- workflow/CI changes
- DDS-05C+ work

## Failure / stop condition

If a scale-only calibration cannot make adjacent FLOOR sprites visually match the 1×1 grid footprint because transparent frame padding or pivot alignment prevents it, implementation must stop after evidence is collected. No crop or anchor correction may be introduced under this authorization. A separate reconciliation/authorization is required first.

## Required later verification

After implementation:

1. regression must be rerun on the exact resulting head SHA,
2. the visible iPhone build must show `DDS-05B · TESTBUILD 1.1`,
3. real-device FLOOR placement must be checked with at least adjacent orthogonal FLOOR cells,
4. WALL remains out of scope until FLOOR calibration is accepted.
