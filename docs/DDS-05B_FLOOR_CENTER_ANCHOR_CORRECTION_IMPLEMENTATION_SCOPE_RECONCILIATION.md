# DDS-05B – FLOOR Center-Anchor Correction Implementation Scope Reconciliation

Status: RECONCILED — NOT AUTHORIZED — NOT IMPLEMENTED

## Baseline

- Current runtime/test build: DDS-05B · TESTBUILD 1.4 / DDS-05B-TB1.4
- Current branch: feature/dds-05a-sprite-construction-presentation
- Current regression-verified runtime line retains the TESTBUILD 1.4 crop package.
- Center-anchor definition commit: 4fcd676e58123e8ea02362d80d99d42e1226fb98

## Reconciled correction

The next implementation candidate changes only the authoritative cardinal FLOOR presentation anchors:

- floor_s anchorY: 0.84 -> 0.419
- floor_e anchorY: 0.84 -> 0.419
- floor_n anchorY: 0.84 -> 0.419
- floor_w anchorY: 0.84 -> 0.419

For all four entries, the following remain unchanged:

- frame rectangles: 95 × 74 using the current TESTBUILD 1.4 x/y values
- anchorX: 0.5
- scale: 1

The FLOOR-only CSS geometry correction `scaleY(0.79)` remains unchanged.

## New unique test-build identity

Because this changes the user-visible runtime presentation after TESTBUILD 1.4, the next implementation must use a new identity:

- Visible label: `DDS-05B · TESTBUILD 1.5`
- Technical/cache identity: `DDS-05B-TB1.5`

This identity change is part of the same correction implementation so a real-device screenshot can be tied unambiguously to the corrected runtime.

## Exact implementation scope

A future separately authorized implementation may modify exactly these five existing files:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
   - only `anchorY` for `floor_s`, `floor_e`, `floor_n`, `floor_w`: `0.84 -> 0.419`
   - no frame/crop, anchorX, scale, image metadata, diagonal FLOOR, auxiliary FLOOR or other sprite changes

2. `index.html`
   - visible identity `TESTBUILD 1.4 -> TESTBUILD 1.5`
   - technical/cache identity `DDS-05B-TB1.4 -> DDS-05B-TB1.5`
   - no layout/content behavior changes

3. `src/dds-04f/browser-app.mjs`
   - only active import/cache IDs and `EXPECTED_BUILD_ID`: `DDS-05B-TB1.4 -> DDS-05B-TB1.5`
   - no render, projection, grid, snap, placement, depth or controller changes

4. `tests/dds-05a/sprite-presentation.test.mjs`
   - update TESTBUILD description from 1.4 to 1.5
   - retain exact 95 × 74 frame assertions
   - assert `anchorX = 0.5`, `anchorY = 0.419`, `scale = 1` for `floor_s/e/n/w`
   - retain assertions that diagonals and non-FLOOR families remain unchanged

5. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - update expected visible and technical identities to TESTBUILD 1.5 / DDS-05B-TB1.5
   - assert no stale TESTBUILD 1.4 identity remains in active runtime identity files
   - retain the existing FLOOR-only `scaleY(0.79)` scope assertion unchanged

## Explicitly not in scope

The following must remain untouched:

- `src/dds-04f/prototype.css`
- atlas PNG
- `src/dds-05a/sprite-presentation.mjs`
- `tests/dds-05a/atlas-loader.test.mjs`
- construction controller and placement authority
- grid size, pitch, geometry and states
- snap offsets and snap authority
- world positions / occupancy
- world-to-screen projection
- depth ordering algorithm
- all FLOOR frame rectangles
- FLOOR anchorX
- FLOOR scale
- diagonal/auxiliary FLOOR frames
- WALL, CORNER, DOOR, ROOF, BEAM and other sprite families
- CSS `scaleY(0.79)`

If implementation requires any sixth file or any value beyond the items above, implementation must stop and return to reconciliation.

## Required gates after a later authorized implementation

1. Compare implementation head against the authorization baseline and confirm exactly the five files above changed.
2. Run the complete regression suite:
   `node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`
3. Regression must PASS on the exact implementation SHA before device evaluation.
4. Real iPhone/Safari gate must visibly show `DDS-05B · TESTBUILD 1.5`.
5. Device evaluation must check the single-FLOOR center registration first, then two adjacent FLOORs and their depth/overhang behavior.
6. No freeze is permitted from this reconciliation alone.
