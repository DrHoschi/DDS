# DDS-05A – Atlas Frame-Count Regression Test Correction Authorization

Status: AUTHORIZED / SINGLE-TEST-FILE SCOPE / NOT IMPLEMENTED

## Authorized file

Only the following existing test file may be changed in the subsequent implementation step:

`tests/dds-05a/atlas-loader.test.mjs`

## Authorized correction

The implementation may remove or replace only the stale hard-coded assumption that the candidate atlas must contain exactly `78` frames.

The correction must preserve the actual DDS-05A atlas contract already enforced by the test and loader:

- the manifest must validate successfully;
- all six required sprite families remain required;
- all eight required directions remain required for every required family;
- the candidate package must still reference the exact colocated atlas image;
- image-dimension validation and out-of-bounds rejection remain unchanged.

The current additional `corner` frame is accepted as part of the present candidate atlas and must not be removed or altered by this correction.

## Explicitly not authorized

This authorization does not permit changes to:

- `assets/**` or the atlas PNG/JSON;
- `src/**` runtime or loader code;
- any other test file;
- `.github/workflows/**`;
- `index.html` or CSS;
- grid, snap, occupancy, projection, sprite-selection, responsive, cache-busting or build-id behavior;
- DDS-05B+ or any new capability.

No implementation is performed by this authorization step.
