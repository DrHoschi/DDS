# DDS-05B – FLOOR Center-Anchor Correction Implementation Authorization

Status: AUTHORIZED — NOT IMPLEMENTED

This authorization is limited to the previously reconciled DDS-05B FLOOR Center-Anchor Correction scope. No implementation is performed in this step.

## Authorized implementation scope

Exactly five existing files may be changed in the later implementation step:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
   - Change only `anchorY` from `0.84` to `0.419` for:
     - `floor_s`
     - `floor_e`
     - `floor_n`
     - `floor_w`
   - Keep their existing TESTBUILD 1.4 frame rectangles unchanged:
     - `floor_s`: `x=20, y=31, w=95, h=74`
     - `floor_e`: `x=253, y=31, w=95, h=74`
     - `floor_n`: `x=481, y=31, w=95, h=74`
     - `floor_w`: `x=719, y=31, w=95, h=74`
   - Keep `anchorX=0.5` and `scale=1` unchanged.
   - Do not modify diagonal or auxiliary FLOOR frames or any other sprite family.

2. `index.html`
   - Advance the visible identity from `DDS-05B · TESTBUILD 1.4` to `DDS-05B · TESTBUILD 1.5`.
   - Advance the technical/cache identity from `DDS-05B-TB1.4` to `DDS-05B-TB1.5` in all active HTML references.
   - No other markup or UI behavior changes are authorized.

3. `src/dds-04f/browser-app.mjs`
   - Advance active module import cache identifiers from `DDS-05B-TB1.4` to `DDS-05B-TB1.5`.
   - Change `EXPECTED_BUILD_ID` to `DDS-05B-TB1.5`.
   - No rendering, projection, grid, snap, controller, placement, or depth logic changes are authorized.

4. `tests/dds-05a/sprite-presentation.test.mjs`
   - Update the cardinal FLOOR anchor expectations to `anchorY=0.419`.
   - Keep exact 95×74 TESTBUILD 1.4 frame rectangle expectations unchanged.
   - Preserve assertions that other FLOOR frames and all other sprite families remain unchanged.

5. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - Advance expected visible/build/cache identity to TESTBUILD 1.5 / `DDS-05B-TB1.5`.
   - Assert active runtime/testbuild identity contains no stale TESTBUILD 1.4 identity.
   - Retain the existing assertion that FLOOR-only `scaleY(0.79)` remains unchanged and scoped only to FLOOR.

## Explicitly not authorized

The following remain outside the implementation scope:

- `src/dds-04f/prototype.css`
- atlas PNG
- `src/dds-05a/sprite-presentation.mjs`
- `tests/dds-05a/atlas-loader.test.mjs`
- construction controller
- grid dimensions, pitch, visual geometry, or presentation states
- snap offsets, placement authority, occupancy, or world positions
- world-to-screen projection
- depth ordering algorithm
- global sprite scale
- FLOOR-specific `scaleY(0.79)`
- diagonal/auxiliary FLOOR frames
- WALL, CORNER, DOOR, ROOF, BEAM, FOUNDATION, or any other sprite family
- iPad completion/freeze work

If implementation requires any sixth file or any change to the locked items above, implementation must stop and return to scope reconciliation.

## Post-implementation requirements

After implementation, compare the implementation head against this authorization baseline and confirm exactly the five authorized files changed. Then run the complete regression suite:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

Regression PASS must be tied to the exact final implementation SHA. Only after full regression PASS is a real iPhone TESTBUILD 1.5 device gate permitted. The device gate must evaluate the actual FLOOR/grid center registration and adjacent two-FLOOR visual behavior. No freeze is authorized by this document.
