# DDS-05B – FLOOR Adjacent-Cell Authority Correction Implementation Scope Reconciliation

Status: RECONCILED — NOT AUTHORIZED — NOT IMPLEMENTED

This reconciliation is based on the TESTBUILD 1.5 device finding and the defined DDS-05B FLOOR Adjacent-Cell Authority Contract. It determines the narrow implementation surface required to correct both adjacent-cell spacing and FLOOR rotation without cell orbit.

## Confirmed current behavior

The visible construction grid uses `GRID_CELL_WORLD_SIZE = 2`, so neighboring 1×1 cell centers are two world units apart.

The current FLOOR profile in `src/dds-04f/construction-ui-controller.mjs` defines the four `FLOOR_EDGE` snap points at `±2` world units from the FLOOR center.

The generic DDS-04C placement engine in `src/dds-04c/snap-placement.mjs` computes an incoming module position by aligning the rotated source snap to the target snap:

`incomingPosition = targetWorldPosition - sourceWorldOffset`

For opposing FLOOR edge snaps at `±2`, this produces a four-world-unit center separation. Changing the FLOOR edge coordinates to `±1` corrects the unrotated separation to two world units.

However, `±1` alone does not satisfy the newly defined rotation contract. The generic DDS-04C formula rotates the source snap as the requested rotation changes. Therefore a locked FLOOR target can still move around the target edge when the FLOOR is rotated. The correction must explicitly preserve the adjacent target cell center for FLOOR_EDGE-to-FLOOR_EDGE placement while allowing the FLOOR yaw to change.

## Reconciled correction model

The correction is one narrow authority correction with two inseparable parts:

1. **FLOOR edge geometry**
   - `floor-east`: `{ x: 1, y: 0, z: 0 }`
   - `floor-north`: `{ x: 0, y: 0, z: 1 }`
   - `floor-west`: `{ x: -1, y: 0, z: 0 }`
   - `floor-south`: `{ x: 0, y: 0, z: -1 }`
   - Their identities, connection class `FLOOR_EDGE`, compatibility, and four-direction topology remain unchanged.

2. **FLOOR_EDGE-to-FLOOR_EDGE placement semantics**
   - Only when both source and target snaps are `FLOOR_EDGE`, the incoming FLOOR center must be derived from the target FLOOR cell edge / adjacent cell center and must not orbit when the requested rotation changes.
   - The selected neighboring cell remains fixed while yaw changes through the existing 0/90/180/270 rotation values.
   - Generic placement behavior for WALL, CORNER, DOOR, ROOF, BEAM and all non-FLOOR_EDGE connections must remain unchanged.
   - Snap identities, occupancy, connection identity, undo semantics and authoritative ConstructionState ownership remain unchanged.

This requires a narrow DDS-04C special case; a controller-only `±2 → ±1` change is insufficient for the rotation contract.

## Exact future implementation file scope

Exactly these existing files may be changed in a later authorized implementation:

1. `src/dds-04f/construction-ui-controller.mjs`
   - Change only the four `FLOOR_EDGE` positions from `±2` to `±1`.
   - No changes to WALL/CORNER/DOOR/ROOF/BEAM snap points.
   - No change to target enumeration, selection, occupancy or UI behavior beyond the resulting corrected FLOOR candidates.

2. `src/dds-04c/snap-placement.mjs`
   - Add only the narrowly scoped FLOOR_EDGE-to-FLOOR_EDGE placement rule required to preserve the chosen adjacent cell center under rotation.
   - Existing generic placement mathematics remains the path for every other connection class.
   - No changes to connection identities, occupancy derivation, history, undo, compatibility checks or ConstructionState mutation ownership.

3. `tests/dds-04f/construction-ui-controller.test.mjs`
   - Update the expected four FLOOR edge positions from `±2` to `±1`.
   - Update L-layout expected centers from `(0,0),(0,4),(4,0)` to `(0,0),(0,2),(2,0)`.
   - Update 2×2 expected centers from 4-unit spacing to `(0,0),(0,2),(2,0),(2,2)`.
   - Add/strengthen a FLOOR rotation assertion proving a manually selected adjacent cell keeps the same center across 0/90/180/270 while yaw changes.
   - Preserve existing occupancy/undo and four-orthogonal-neighbour assertions.

4. `tests/dds-04c/snap-placement.test.mjs`
   - Add a focused authority-level regression for FLOOR_EDGE-to-FLOOR_EDGE placement.
   - Prove two-unit center separation from ±1 edge snaps.
   - Prove requested FLOOR rotations do not move the chosen adjacent center.
   - Prove an existing non-FLOOR placement case remains unchanged.

5. `index.html`
   - Advance visible identity from `DDS-05B · TESTBUILD 1.5` to a new unambiguous device build, proposed `DDS-05B · TESTBUILD 1.6`.
   - Advance active cache identity to proposed `DDS-05B-TB1.6`.
   - No other markup/UI changes.

6. `src/dds-04f/browser-app.mjs`
   - Advance only active import/cache/expected build identity to proposed `DDS-05B-TB1.6`.
   - Grid size, grid pitch, projection, target-state derivation, rendering and sprite positioning remain unchanged.

7. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - Advance build/cache expectations to proposed TESTBUILD 1.6 / `DDS-05B-TB1.6`.
   - Exclude stale active TESTBUILD 1.5 identity.
   - Preserve all sprite geometry and responsive assertions.

8. `.github/workflows/dds-05a-regression.yml`
   - Because the correction changes DDS-04C authority code, the regression workflow must execute `tests/dds-04c/*.test.mjs` in addition to the existing DDS-04F, DDS-05A and DDS-05B suites.
   - No other workflow behavior is in scope.

## Explicitly outside scope

The following must remain untouched:

- `src/dds-04f/prototype.css`
- `src/dds-05a/sprite-presentation.mjs`
- construction atlas JSON and PNG
- `anchorY=0.419`
- FLOOR-only `scaleY(0.79)`
- grid size 9×9
- grid pitch 2 world units
- world-to-screen projection
- depth ordering
- sprite crops/scales/anchors
- WALL, CORNER, DOOR, ROOF, BEAM or FOUNDATION geometry
- material/stability authority
- wolf dynamics
- ConstructionState schema/ownership
- adding diagonal FLOOR neighbors
- changing snap/connection identities

## Contract consequences

After the correction, the authoritative examples must be:

- starter `(0,0,0)` + east neighbor → `(2,0,0)`
- starter `(0,0,0)` + north neighbor → `(0,0,2)`
- 2×2 FLOOR block → centers `(0,0)`, `(2,0)`, `(0,2)`, `(2,2)` in X/Z
- rotating a locked neighboring FLOOR changes yaw only; its chosen cell center is invariant

The visible grid requires no compensation because its existing two-world-unit pitch already matches this contract.

## Regression requirement after any later implementation

The final implementation SHA must be verified with the expanded complete command:

`node --test tests/dds-04c/*.test.mjs tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

No device gate is permitted until this expanded regression passes on the exact implementation SHA.

## Gate

This document authorizes no code changes. A separate Implementation Authorization is required before any of the eight files above may be changed.
