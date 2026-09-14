# DDS-05B – TESTBUILD 1.3 iPhone Device Result / FLOOR Top-Surface Anchor Reconciliation

Status: RECONCILED — NOT IMPLEMENTED

## Basis

- Runtime baseline: DDS-05B · TESTBUILD 1.3.
- Regression baseline: `3d2d46975e3e303d2dc8783faa3b7e0bf52cd292`, 56/56 PASS.
- Real iPhone/Safari evidence confirms TESTBUILD 1.3 is deployed and the FLOOR geometry is materially closer to the intended grid footprint.
- Current TESTBUILD 1.3 runtime correction remains a presentation-only correction. No world/grid/snap/projection authority is reopened by this reconciliation.

## New device evidence / Sprite-Lab evidence

The user refined the first source frame `floor_s` in Sprite Lab and supplied the following candidate frame data:

- frame x = 20
- frame y = 31
- frame w = 95
- frame h = 74
- Anchor X = 0.5
- Anchor Y = 0.84
- Scale = 1

The visual anchor marker is intentionally placed at the lower/front tip of the visible FLOOR top surface, immediately above the board-thickness/front-face overhang.

These Sprite-Lab values are evidence/candidate values only. They are not written into the runtime atlas by this reconciliation.

## Reconciled anchor contract

The previous TESTBUILD 1.3 center-registration hypothesis is superseded for the next calibration candidate.

For FLOOR presentation, the logical registration point shall be the **lower/front tip of the visible top surface**, not the geometric center of the top surface and not the bottom of the complete rendered board/shadow.

Consequences:

1. The lower/front top-surface tip is the point intended to coincide with the corresponding lower grid intersection.
2. The opposite upper/back top-surface tip is intended to coincide with the opposite grid intersection of the same logical 1×1 cell.
3. Board thickness, front face and shadow below the top-surface registration point are allowed to extend outside the logical grid diamond. They remain presentation-only 3D overhang.
4. When an adjacent FLOOR is placed in front, normal depth ordering may visually cover this overhang. The overhang itself does not enlarge occupancy and does not alter snap authority.
5. The logical 1×1 footprint continues to be represented by the visible **top surface**, not by the complete opaque sprite bounds.

## First calibrated source candidate

For `floor_s`, the user's Sprite-Lab refinement is accepted as the exact next candidate to evaluate in a later implementation step:

`frame = { x: 20, y: 31, w: 95, h: 74 }`

`anchorX = 0.5`

`anchorY = 0.84`

`scale = 1`

Important: `anchorY = 0.84` is relative to the newly refined 95×74 frame. It must not be compared numerically as though it referred to the old 100×80 crop. The crop and anchor form one candidate registration package.

## Relationship to TESTBUILD 1.3 scaleY correction

This reconciliation does not authorize changing or removing the existing FLOOR-only runtime `scaleY(0.79)` correction.

Before a later implementation is authorized, its interaction with the newly refined 95×74 source crop must be reconciled explicitly. The Sprite-Lab preview itself shows the source-frame crop and anchor; it does not prove that applying the existing runtime vertical compression on top of that crop produces the final desired grid geometry.

Therefore the next implementation scope must explicitly decide whether:

- the refined crop + anchor is used together with the existing `scaleY(0.79)`, or
- the refined source geometry replaces part/all of that runtime correction.

No silent double-correction is permitted.

## Required two-FLOOR device test

The next implemented candidate must be tested with at least two orthogonally adjacent FLOOR cells:

### FLOOR A

- lower/front top-surface tip sits on its intended lower grid intersection;
- upper/back top-surface tip reaches the opposite grid intersection;
- left/right top-surface edges follow the logical cell diamond closely.

### FLOOR B

- place a second FLOOR in the immediately adjacent front/orthogonal cell;
- both logical top surfaces must occupy their own 1×1 grid diamonds without changing snap/world positions;
- the presentation-only thickness/overhang of the rear FLOOR may be covered naturally by the front FLOOR;
- there must be no authority overlap, artificial positional offset or gap introduced merely to make the sprites look connected.

This two-FLOOR case is the acceptance case for the new anchor contract; a single isolated FLOOR is insufficient for final visual acceptance.

## Locked authority

Remain locked:

- 2-world-unit grid pitch;
- 9×9 presentation grid geometry;
- authoritative FLOOR snap offsets;
- world positions and occupancy;
- world-to-screen projection;
- construction controller;
- depth authority except normal existing presentation ordering;
- WALL and all other sprite families.

## Explicitly not authorized in this reconciliation

- no `construction-atlas.json` modification;
- no atlas PNG modification;
- no runtime/CSS modification;
- no TESTBUILD 1.4 identity;
- no change to `scaleY(0.79)`;
- no application of the Sprite-Lab crop to `floor_e`, `floor_n` or `floor_w` by assumption;
- no WALL/CORNER/DOOR/ROOF/BEAM calibration;
- no grid, snap, projection or controller change.

## Direction handling

`floor_s` is now the first calibrated reference direction. Its candidate values must not automatically be copied to the other authoritative FLOOR directions. A later scope reconciliation must inspect whether `floor_e`, `floor_n` and `floor_w` use geometrically equivalent source regions or require direction-specific crop/anchor values.

## Result

TESTBUILD 1.3 iPhone device evidence supports retaining the corrected general FLOOR perspective, but the final registration is still OPEN.

The next calibration hypothesis is now explicit:

**FLOOR logical presentation registration = lower/front tip of the visible top surface.**

The user's refined `floor_s` package `(20,31,95,74; anchor 0.5/0.84; scale 1)` is the first concrete candidate for that contract.

No implementation is performed in this step.
