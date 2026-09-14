# DDS-05B – FLOOR Adjacent-Cell Authority Correction Implementation Authorization

Status: AUTHORIZED — NOT IMPLEMENTED

This authorization is limited to the previously reconciled FLOOR adjacent-cell authority correction scope. No implementation is performed in this step.

## Authorized implementation scope

Exactly eight existing files may be changed in the later implementation step:

1. `src/dds-04f/construction-ui-controller.mjs`
   - Change only the four cardinal `FLOOR_EDGE` snap positions from logical edge offsets `±2` to `±1` world unit:
     - east: `{ x: 1, y: 0, z: 0 }`
     - north: `{ x: 0, y: 0, z: 1 }`
     - west: `{ x: -1, y: 0, z: 0 }`
     - south: `{ x: 0, y: 0, z: -1 }`
   - Preserve snap ids, connection classes, compatibility, and non-FLOOR snap positions.

2. `src/dds-04c/snap-placement.mjs`
   - Add only the minimum FLOOR_EDGE↔FLOOR_EDGE placement rule required to preserve the selected adjacent cell center while rotation changes orientation.
   - For FLOOR_EDGE↔FLOOR_EDGE, rotating a selected/locked placement must not move the incoming FLOOR to another cell.
   - All other connection classes must continue using the existing generic placement mathematics unchanged.

3. `tests/dds-04f/construction-ui-controller.test.mjs`
   - Update cardinal FLOOR-edge expectations from `±2` to `±1`.
   - Update L-shaped and 2×2 authoritative FLOOR layouts from four-world-unit center spacing to two-world-unit center spacing.
   - Add/strengthen a FLOOR rotation contract proving that a selected adjacent target remains in the same logical cell through 0/90/180/270° rotations.
   - Preserve existing occupancy, undo, manual-target and non-FLOOR behavior tests.

4. `tests/dds-04c/snap-placement.test.mjs`
   - Add focused coverage for the FLOOR_EDGE↔FLOOR_EDGE special case.
   - Verify target cell center stability across allowed rotations.
   - Verify existing generic placement behavior for non-FLOOR_EDGE connection classes remains unchanged.

5. `index.html`
   - Advance visible identity to `DDS-05B · TESTBUILD 1.6`.
   - Advance technical/cache identity to `DDS-05B-TB1.6` in active HTML references only.
   - No unrelated markup or UI changes.

6. `src/dds-04f/browser-app.mjs`
   - Advance active module import/cache identifiers and `EXPECTED_BUILD_ID` from TESTBUILD 1.5 to TESTBUILD 1.6 only.
   - No grid, projection, rendering, sprite, placement UI or depth changes.

7. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - Advance expected visible/build/cache identity to TESTBUILD 1.6 / `DDS-05B-TB1.6`.
   - Assert no stale active TESTBUILD 1.5 identity remains.
   - Preserve the existing FLOOR presentation assertions, including `scaleY(0.79)`.

8. `.github/workflows/dds-05a-regression.yml`
   - Extend the regression command to include `tests/dds-04c/*.test.mjs` in addition to the existing DDS-04F, DDS-05A and DDS-05B suites.
   - No other workflow behavior changes.

## Authority contract preserved

- One logical 1×1 FLOOR cell has a center-to-center pitch of 2 world units.
- A FLOOR extends logically 1 world unit from its center to each cardinal edge.
- Directly adjacent FLOOR centers therefore differ by exactly 2 world units.
- FLOOR rotation is around the FLOOR's own logical cell center.
- Rotating a selected adjacent FLOOR must not change its selected grid cell.

## Explicitly not authorized

The following remain outside this implementation scope:

- visible grid size, pitch, geometry or presentation states
- `src/dds-04f/prototype.css`
- `src/dds-05a/sprite-presentation.mjs`
- atlas JSON or atlas PNG
- `anchorY=0.419`
- FLOOR-specific `scaleY(0.79)`
- sprite crop rectangles or sprite scale
- projection or depth-ordering algorithms
- WALL, CORNER, DOOR, ROOF, BEAM or FOUNDATION snap geometry
- wall/corner placement calibration
- any iPad-specific sprite-size or responsive-presentation correction
- any freeze/completion decision

The newly observed iPad presentation-scale issue is explicitly recorded as a separate future concern and is not part of this authority correction.

If implementation requires a ninth file, alters the grid/presentation system, or changes non-FLOOR placement behavior, implementation must stop and return to reconciliation.

## Post-implementation requirements

After implementation, compare the final implementation head against this authorization baseline and confirm that exactly these eight files changed and that no locked item changed.

Then run the complete regression suite including DDS-04C:

`node --test tests/dds-04c/*.test.mjs tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

Regression PASS must be tied to the exact final implementation SHA. Only after that may TESTBUILD 1.6 be evaluated on real devices for direct adjacent FLOOR placement and rotation-without-orbit. The separate iPad sprite-size issue remains open and must not be silently folded into this gate.