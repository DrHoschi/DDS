# DDS-05B – Visible Construction Grid / Placement Presentation Reconciliation

Status: RECONCILED / PRESENTATION-ONLY / NOT IMPLEMENTED / NOT AUTHORIZED

## Baseline

DDS-05B is reconciled strictly above the frozen DDS-05A baseline.

- DDS-05A freeze commit: `56c92c0f7329b16e7d57086c078f8131a6dbcb02`
- Frozen technical baseline: `95de18038e8045c9dde4f6a5a9ff9dc07e27fa0b`
- DDS-05A grid/snap/world authority remains unchanged.
- No DDS-05A runtime, test, atlas, sprite, snap or projection contract is modified by this reconciliation.

## Existing authority that DDS-05B must reuse

The existing FLOOR contract already provides four orthogonal FLOOR neighbour targets:

- east: `(x + 2, z)`
- north: `(x, z + 2)`
- west: `(x - 2, z)`
- south: `(x, z - 2)`

Therefore the visible construction grid shall use a logical **1×1 cell pitch of 2 world units** on X and Z. The visible grid is not allowed to introduce a second placement coordinate system.

The current scene projection remains the geometric source for screen placement:

`screenX = originX + (x - z) * groundScale`

`screenY = originY + (x + z) * groundScale / 2 - y * verticalScale`

Every grid corner, grid cell, highlight and placement indicator must be projected through the same world-to-screen relation used for modules and snap points.

## 9×9 authority versus viewport presentation

The construction raster is conceptually a **9×9 logical grid** centered on the construction origin/starter-floor region.

DDS-05B must not redefine that authority merely because a device cannot show all cells simultaneously.

A full 9×9 projection at the current minimum `groundScale = 24` can exceed an iPhone scene width. Therefore:

- the logical grid remains 9×9 on every device;
- the visible grid may be clipped by the scene viewport;
- iPhone may show only the useful central/active subset at one time;
- iPad/desktop may expose a larger portion or the complete 9×9 area when space permits;
- DDS-05B must not shrink or distort world cell spacing merely to force all 81 cells onto every phone screen;
- changing the frozen DDS-05A projection solely to fit all 81 cells is outside this reconciliation.

## Visual cell contract

Each logical 1×1 cell is presentation-only and represents one FLOOR footprint position.

The grid should visually read as a 45°/2.5D diamond lattice generated from world coordinates. It must remain behind construction sprites and interactive snap targets.

Minimum presentation states to be distinguishable without becoming a second authority:

1. **neutral/free visual cell** – passive lattice presentation only;
2. **occupied FLOOR cell** – derived from existing placed FLOOR instances;
3. **currently valid FLOOR candidate cell** – derived from existing DDS-04C/DDS-05A placement candidates/ghost preview;
4. **selected FLOOR candidate cell** – derived from the existing selected target;
5. **invalid placement indication** – remains driven by the existing ghost/placement result, not by independent grid logic.

The grid itself must never decide whether placement is valid.

## Occupancy presentation

Grid occupancy is presentation-derived only.

A cell may be shown as occupied when an existing authoritative FLOOR instance occupies its world cell position. DDS-05B must not add a parallel occupancy store, grid array, reservation system or independent collision check.

For non-FLOOR categories, placement remains snap-authoritative. Walls, corners, door openings, beams and roofs must not be converted into free-form cell occupancy rules in DDS-05B.

## Snap-point relationship

Existing snap targets remain authoritative and interactive.

DDS-05B may visually align them to the new grid but must not replace them.

- FLOOR neighbour snap targets correspond to adjacent cell centers.
- FLOOR_WALL targets correspond to the four cell edges already defined by DDS-05A.
- FLOOR_CORNER targets correspond to the four existing corner positions.
- beam/roof/side/top snaps remain governed by their existing profiles.

The visible grid therefore acts as spatial orientation underneath the existing green/selected snap controls.

## Layering contract

Required conceptual rendering order:

1. scene background / ground presentation;
2. visible grid lattice and passive cell state;
3. placed construction sprites;
4. ghost preview;
5. interactive snap targets / selection markers / HUD.

Exact z-index values are an implementation detail for a later scope step, but DDS-05B must not allow the grid to cover construction sprites or intercept touch input.

## Interaction contract

DDS-05B is not authorized to make arbitrary grid cells independently clickable.

Any future cell tap behavior may only select an already-valid DDS-04C placement candidate. It may not synthesize a new placement request from screen coordinates.

For the first DDS-05B implementation, the safest minimal contract is therefore:

- grid = visual orientation;
- existing snap targets = interaction authority.

Direct grid-cell selection remains a possible later separately reconciled enhancement.

## Responsive contract

### iPhone

- prioritize the active construction region and nearby placement cells;
- allow the outer 9×9 grid to be naturally clipped by the existing scene viewport;
- preserve touch-sized snap targets;
- grid strokes/fills must remain subordinate to sprites and snap controls;
- no requirement to display all 81 cells simultaneously.

### iPad / wider layouts

- use the same world coordinates and cell pitch;
- show more of the same 9×9 authority because the viewport is larger;
- no alternate tablet-only grid geometry.

Thus responsive behavior changes only how much of the same world grid is visible, not the construction authority.

## Explicitly out of scope

DDS-05B does not authorize:

- changes to DDS-05A FROZEN semantics;
- a second grid/occupancy authority;
- arbitrary screen-to-world placement;
- direct free placement by tapping empty cells;
- Y stacking, storeys, vertical grid layers or elevation authority;
- sprite scale/pivot calibration;
- TESTBUILD 4 implementation;
- atlas changes;
- replacement of existing snap targets;
- pathfinding, terrain or world-map grid systems;
- DDS-05C+ capabilities.

## Reconciliation result

DDS-05B is compatible with the frozen DDS-05A architecture without redesigning the placement engine.

The visible grid must be a **derived presentation of the existing world/snap authority**, with a 2-world-unit 1×1 cell pitch and a logical 9×9 extent. It must use the existing isometric world projection and remain presentation-only.

The only material responsive constraint discovered is that a complete 9×9 projection cannot be guaranteed to fit simultaneously inside the current iPhone scene at the frozen projection scale. The correct reconciliation is viewport clipping/partial visibility, not a second grid scale or authority.

No implementation is authorized by this document.

## Next permitted step

Only a separate **DDS-05B – Visible Construction Grid / Placement Presentation Definition / Scope Gate** may follow. That step may define exact visual appearance, active/occupied/candidate styling and later implementation boundaries. No implementation may occur before separate authorization.