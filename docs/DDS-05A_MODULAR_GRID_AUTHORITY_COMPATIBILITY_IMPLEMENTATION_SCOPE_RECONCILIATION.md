# DDS-05A – Modular Grid Authority Compatibility – Implementation Scope Reconciliation

Status: RECONCILED / EXACT MINIMAL AUTHORITY SCOPE IDENTIFIED / NOT IMPLEMENTED / NOT AUTHORIZED

## 1. Purpose

This reconciliation determines only the minimal existing DDS authority changes required so FLOOR placement can form a true orthogonal 2D modular construction grid instead of extending only along one axis.

This step does not implement the change.

It does not implement the visible 9×9 construction grid, sprite calibration, sprite direction reuse, atlas changes, loader changes, rendering changes, movement, pathfinding, building rules, or DDS-05B+ capabilities.

## 2. Frozen authority boundary

The existing authority split remains intact:

- `src/dds-04b/construction-state.mjs` remains authoritative for committed module instances and connection references.
- `src/dds-04c/snap-placement.mjs` remains the generic snap/placement authority for profile registration, compatibility, occupancy, candidate transforms, placement and undo.
- `src/dds-04f/construction-ui-controller.mjs` currently owns the concrete prototype snap profiles and UI target-candidate orchestration.

The modular-grid compatibility correction must not move authority between these layers.

## 3. Current incompatibility

The current FLOOR profile exposes FLOOR-to-FLOOR neighbours only on one local axis:

- `floor-east` at `{ x: +2, y: 0, z: 0 }`
- `floor-west` at `{ x: -2, y: 0, z: 0 }`

It does not expose matching FLOOR-to-FLOOR north/south neighbour snaps.

Therefore the current authority can extend FLOOR chains along one axis but cannot authoritatively form a free 2D floor layout such as 2×2, L, U or arbitrary connected orthogonal footprints.

The current FLOOR profile also does not yet express the complete conceptual modular-cell contract of four floor neighbours, four wall edges and four corner positions.

## 4. Generic DDS-04C engine finding

No generic SnapPlacementFoundation redesign is required for the first grid-authority compatibility correction.

`SnapPlacementFoundation` already:

- accepts arbitrary snap-point collections per definition;
- normalizes arbitrary 3D snap positions;
- supports the existing four rotations `0/90/180/270`;
- evaluates every requested source/target snap pair;
- computes world-space transforms from snap positions and yaw;
- enforces connection-class compatibility;
- enforces target occupancy;
- commits through ConstructionState;
- preserves deterministic undo semantics.

Therefore adding correctly defined FLOOR snap points does not require a new placement algorithm.

`src/dds-04c/snap-placement.mjs` is explicitly OUT OF SCOPE for the first implementation unless a later red test demonstrates an actual generic-engine defect.

## 5. Minimal FLOOR neighbour contract

The later implementation may extend the existing FLOOR snap profile so a FLOOR has four orthogonal FLOOR_EDGE neighbour positions in local construction space:

- east
- west
- north
- south

The existing east/west spacing is the compatibility baseline. The north/south spacing must be derived from the agreed 1×1 modular-cell geometry and must be internally symmetric around the FLOOR origin.

No diagonal FLOOR-to-FLOOR neighbour snaps are authorized in this block.

The four logical construction orientations remain the existing four yaw states `0/90/180/270`. Presentation labels such as NE/SE/SW/NW are presentation vocabulary and must not rewrite the authority math in this block.

## 6. Four wall-edge contract

The target conceptual 1×1 cell has four wall-capable perimeter edges.

The current profile already has `wall-north` and `wall-south`. The later implementation may add the two missing orthogonal wall-edge snap positions so all four perimeter edges are addressable by the existing `FLOOR_WALL` ↔ `MODULE_BASE` compatibility mechanism.

This block does not redesign WALL, DOOR_OPENING or BEAM profiles.

It does not add continuous edge placement, fractional placement, free dragging or non-grid wall placement.

## 7. Four corner-position contract

The target conceptual 1×1 cell has four corner positions.

The current FLOOR profile exposes only `corner-east` at one corner-like local position. The later implementation may reconcile this into four explicit corner snap identities positioned symmetrically at the four cell corners and using the existing `FLOOR_CORNER` ↔ `MODULE_BASE` compatibility mechanism.

The exact stable IDs must be explicit and unique. Existing persisted compatibility must be considered before renaming/removing `corner-east`; the implementation should prefer backward-compatible retention or an explicitly tested migration rather than silently changing snap identity.

No diagonal FLOOR adjacency is implied by corner snaps.

## 8. Candidate generation

`ConstructionPrototypeController.#refreshPreview()` already iterates:

- every committed target instance,
- every source snap of the selected incoming piece,
- every target snap of each target instance,

and delegates validity to `SnapPlacementFoundation.previewPlacement()`.

Therefore no new grid-specific candidate enumeration algorithm is required merely to expose the additional FLOOR targets.

The existing target-selection, recommendation and locking behavior must remain intact.

## 9. Exact later existing files permitted to change

For the first minimal authority implementation, the expected existing-file scope is:

1. `src/dds-04f/construction-ui-controller.mjs`
   - extend/reconcile the concrete FLOOR snap profile only as required for four FLOOR neighbours, four wall edges and four corners;
   - preserve existing module categories, materials, rotation cycle, candidate selection and placement flow.

2. `tests/dds-04f/construction-ui-controller.test.mjs`
   - add focused regression coverage proving authoritative 2D FLOOR expansion and preservation of existing UI/placement behavior.

No other existing runtime file is authorized by this reconciliation.

## 10. Explicitly untouched files / systems

The first implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`
- `src/dds-05a/atlas-loader.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- any atlas JSON or PNG
- build/cache identity
- sprite calibration files
- movement/character code
- responsive layout

If implementation proves one of these files genuinely necessary, scope must return to reconciliation before modification.

## 11. Required later tests

The implementation authorization, if granted later, must require at least:

1. Starter FLOOR exposes authoritative valid placement targets on both world-grid axes.
2. A second FLOOR can be placed on the previously missing orthogonal axis.
3. From placed floors, a 2×2 connected floor footprint can be formed without free-position mutation.
4. An L-shaped connected floor footprint can be formed.
5. Each FLOOR neighbour target is independently occupancy-protected.
6. Four wall-edge targets are addressable through existing compatibility rules.
7. Four corner targets are addressable through existing compatibility rules.
8. Existing wall placement still succeeds.
9. Existing rotation remains exactly `0/90/180/270`.
10. Manual target selection/locking still resolves the exact DDS-04C candidate.
11. Undo still removes only the latest committed placement and frees its occupied snap identities.
12. Reset still returns to one authoritative starter floor.
13. Wolf/material behavior is not changed by the grid-profile correction.

## 12. 1×1 geometry boundary

This reconciliation defines topology and scope, not final visual pixel dimensions.

The authoritative 1×1 module dimensions must be internally consistent with the existing world-space snap profile and the later sprite/grid calibration. Pixel frame sizes do not determine world-cell dimensions.

The visible 9×9 diagnostic grid must later be projected from the same authoritative world geometry; it must never become a second placement authority.

## 13. Direction boundary

Construction authority retains four yaw states:

- 0°
- 90°
- 180°
- 270°

A later presentation layer may label these NE/SE/SW/NW and may reuse only two physical sprite views for symmetric construction parts (`NE ↔ SW`, `NW ↔ SE`).

That sprite reuse is not part of this authority implementation.

Character locomotion may later use the same four presentation-direction labels, but locomotion is outside this block.

## 14. Authorization boundary

This document is reconciliation only.

It does NOT authorize code implementation.

The next allowed step, if accepted, is a separate **DDS-05A – Modular Grid Authority Compatibility Implementation Authorization** against exactly this scope.

DDS-05A TB4 sprite/grid rendering implementation and DDS-05B+ remain separately unauthorized.
