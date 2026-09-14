# DDS-05B – FLOOR/Grid Footprint Calibration 1.2 Device Result Reconciliation

Status: RECONCILED — NO IMPLEMENTATION AUTHORIZED

## Evaluated evidence

- Real iPhone Safari screenshot.
- Visible build label: `DDS-05B · TESTBUILD 1.2`.
- Implemented FLOOR runtime scale under evaluation: `1.30` for `floor_s`, `floor_e`, `floor_n`, `floor_w`.
- Implementation baseline immediately before this reconciliation: `4188786c3cb5d1b567eaddfa6872e0a2d140cf8b`.

## Device result

The screenshot confirms that TESTBUILD 1.2 is deployed and visible on iPhone.

The intended visual contract remains:

- one logical FLOOR module represents exactly one logical 1×1 grid cell;
- the visible top walking/construction plane of the FLOOR sprite is the footprint reference;
- the sprite's vertical thickness, trim and shadows are allowed to extend outside that top-plane footprint and do not define grid occupancy.

## Corner/edge comparison result

The visible top plane of the FLOOR sprite does not align cleanly with the four projected corners/edges of a single grid cell.

The remaining mismatch is not safely classifiable as a pure uniform-size error. Increasing the complete sprite uniformly would also enlarge the sprite thickness/details and cannot independently correct a mismatch in the top-plane shape or projection ratio.

Therefore `scale: 1.30` is NOT accepted as a final footprint calibration, but this reconciliation also does NOT authorize another blind uniform-scale increment.

## Reconciled diagnosis

1. Grid/world/snap geometry remains authoritative and is not implicated by this screenshot.
2. The visible FLOOR module is positioned plausibly on its intended cell; there is no evidence requiring a snap/grid-authority change.
3. Anchor/pivot is not proven wrong by this screenshot alone.
4. Uniform scale has reached the point where the next decision must be based on the sprite's visible top-plane geometry relative to the projected grid diamond.
5. The likely remaining causes to evaluate are limited to presentation data/asset geometry: transparent crop/padding, footprint registration within the frame, and/or the perspective/proportions of the FLOOR artwork itself.

## Decision

- `1 FLOOR = 1 grid cell` remains the required contract.
- TESTBUILD 1.2 device visibility = PASS.
- TESTBUILD 1.2 FLOOR footprint geometry = NOT PASS / OPEN.
- `scale: 1.30` remains only the current test value.
- No `1.40`, `1.50`, or other next scale value is defined by this reconciliation.
- Do not change grid pitch, snap offsets, projection or controller authority.
- Do not change WALL or any other construction family.

## Required next analysis boundary

Before any further implementation, perform a dedicated FLOOR Sprite Footprint Geometry Reconciliation. That step must determine which presentation property is actually responsible for the mismatch by comparing:

- the projected 1×1 grid-cell diamond;
- the four corners of the visible FLOOR top plane;
- the FLOOR frame rectangle/crop;
- transparent padding around the visible artwork;
- current anchor/pivot registration;
- whether the artwork's own top-plane perspective ratio can match the fixed game projection with uniform scaling at all.

Only after that geometry reconciliation may a new calibration definition choose one of these paths:

A. another uniform scale value, if the top-plane shape already matches the grid ratio and only size is wrong;
B. crop/padding/registration correction, if frame-space geometry is the cause;
C. a corrected FLOOR sprite asset/perspective, if the artwork geometry itself cannot match the fixed grid projection.

No implementation, WALL work or freeze is authorized in this step.
