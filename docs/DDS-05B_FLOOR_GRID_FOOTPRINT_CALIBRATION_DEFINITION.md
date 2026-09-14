# DDS-05B – FLOOR/Grid Footprint Calibration Definition

Status: DEFINED

## Basis

- Active device baseline: `DDS-05B · TESTBUILD 1` / `DDS-05B-TB1`
- Reconciliation commit: `6b4be70475b602a0506d7273b2309383a89686a9`
- Authoritative FLOOR neighbour distance: 2 world units
- Visible grid cell size: 2 world units
- Current FLOOR atlas frame family: 100×80 px, anchorX 0.5, anchorY 0.85, scale 1
- Current phone presentation applies an additional generic sprite scale of 0.88

## Calibration objective

A committed or ghost FLOOR module represents exactly one logical 1×1 construction-grid cell.

Its visible ground footprint must therefore match the projected diamond of that exact grid cell. Two FLOOR modules placed on orthogonally adjacent grid cells must visually meet edge-to-edge along their shared cell edge.

The calibration must not alter the authoritative world position, snap distance, occupancy, target generation, placement authority, grid geometry, or projection.

## Anchor/Pivot definition

For the first calibration pass, the currently authored FLOOR anchor is LOCKED.

- horizontal anchor remains bottom/footprint-centered as authored (`anchorX = 0.5`)
- vertical anchor remains the authored contact-point baseline (`anchorY = 0.85`)
- no anchor changes are allowed merely to compensate for an undersized sprite

Anchor adjustment is permitted only in a later fine-alignment pass if, after correct footprint scale is achieved, the full footprint is consistently translated away from the target grid diamond.

## Visible-footprint definition

The calibration reference is the visible opaque FLOOR footprint, not the raw rectangular atlas frame.

For each authoritative FLOOR presentation direction used by gameplay:

1. determine the visible outer footprint of the floor slab in the sprite frame, ignoring transparent padding and soft shadow outside the structural slab;
2. project the corresponding 1×1 grid-cell diamond using the existing shared world-to-screen projection;
3. scale the FLOOR presentation so the structural slab's four footprint extremes align with the four projected cell-edge/corner extents;
4. preserve the authored perspective and aspect ratio; no non-uniform X/Y stretching is allowed.

Soft drop shadow may extend outside the cell and is not part of the footprint acceptance measurement.

## Neighbour acceptance contract

For two orthogonally adjacent FLOOR modules:

- no deliberate visible gap may remain between the structural slab edges along the shared grid edge;
- no meaningful structural overlap may occur across the shared grid edge;
- a maximum rasterization/antialiasing tolerance of approximately 2 screen pixels on the iPhone reference viewport is acceptable;
- the same world-space calibration must remain valid on iPad/desktop through the shared projection rather than device-specific manual offsets.

## Calibration strategy

Priority order is fixed:

1. **FLOOR-specific presentation scale** — primary calibration variable.
2. **Atlas crop / transparent-padding metadata** — use only if the frame rectangle contains material transparent padding that prevents reliable footprint calibration.
3. **Anchor fine-alignment** — only after footprint scale is correct, and only for residual translation.

The generic phone-wide `.scene-module__sprite { --sprite-scale: 0.88; }` must not remain the authority for FLOOR footprint size. Any later implementation must ensure FLOOR calibration is category-specific and must not silently resize WALL/CORNER/DOOR/ROOF/BEAM as part of this block.

## Direction scope

Calibration begins with FLOOR only.

The four authoritative gameplay yaw directions (0°, 90°, 180°, 270°) must all satisfy the same 1×1 footprint contract. Atlas diagonal/reference variants may exist but are not placement authority and are not required to expand this calibration block.

## Testbuild rule

The first implementation that changes the visible FLOOR calibration must advance the active device identity to:

- visible: `DDS-05B · TESTBUILD 1.1`
- canonical/cache id: `DDS-05B-TB1.1`

Any subsequent visible calibration iteration must advance again (`1.2`, `1.3`, …) so iPhone evidence can always be tied to an unambiguous deployed build.

## Explicitly out of scope

- WALL calibration
- changing FLOOR snap points or 2-world-unit spacing
- changing GRID_CELL_WORLD_SIZE
- changing world-to-screen projection
- changing placement/occupancy authority
- Y stacking
- general atlas redesign
- device-specific world geometry
- unrelated UI changes

## Completion evidence for this calibration block

A later implementation may be considered device-ready only when iPhone screenshots from the exact new TESTBUILD demonstrate at minimum:

1. one FLOOR centered on one selected/occupied grid cell;
2. two orthogonally adjacent FLOOR modules meeting edge-to-edge;
3. a three- or four-FLOOR arrangement showing no accumulating gap or overlap;
4. ghost FLOOR and committed FLOOR sharing the same calibrated footprint.

No implementation is authorized by this definition document itself.
