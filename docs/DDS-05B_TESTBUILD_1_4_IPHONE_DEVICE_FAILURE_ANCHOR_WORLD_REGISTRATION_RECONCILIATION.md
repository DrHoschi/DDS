# DDS-05B – TESTBUILD 1.4 iPhone Device Failure / Anchor-vs-World-Registration Reconciliation

Status: RECONCILED — NOT AUTHORIZED — NOT IMPLEMENTED

Baseline runtime: `29e51b2088c28095a71fc28bf1db55a23a2b3187`

## Scope

This reconciliation addresses only the failed real-iPhone visual registration of authoritative cardinal FLOOR sprites against the existing DDS-05B presentation grid. No runtime, atlas, CSS, grid, snap, projection, controller, depth, build-id, or test file is changed in this step.

## 1. Authoritative FLOOR world point

The current renderer positions each `.scene-module` at `projectWorldPoint(instance.transform.position, projection)`.

For FLOOR placement, authoritative neighbour positions are exactly ±2 world units on X/Z. DDS-05B grid cells are also centered on 2-world-unit coordinates. Occupied FLOOR cells are derived directly from each FLOOR instance `transform.position`.

Therefore the authoritative FLOOR `transform.position` is the **center of its logical 1×1 grid cell**, not a cell corner and not the lower/front diamond tip.

For a cell centered at world `(x,z)`, the visible grid diamond is generated from world offsets ±1 around that center. Under the frozen projection:

- cell center projects to `projectWorldPoint(x,0,z)`;
- upper/back tip is one ground-scale unit above that center;
- lower/front tip is one ground-scale unit below that center;
- left/right tips are horizontally displaced from that same center.

Thus the projected FLOOR world point is the **screen-space center of the logical grid diamond**.

## 2. How the sprite anchor is registered

`.scene-module` is centered on the projected world point with `translate(-50%, -50%)`.

The sprite child is positioned from the module center using `left:50%`, `top:50%`, and margins equal to the negative atlas pivot (`anchorX * frame.w`, `anchorY * frame.h`).

Therefore the atlas anchor/pivot itself lands on the projected FLOOR world point.

The FLOOR-only `scaleY(0.79)` uses that same pivot as `transform-origin`; it compresses the sprite around the anchor but does not move the anchor.

Consequently:

**FLOOR atlas anchor = projected logical cell center.**

It must not be placed on the lower/front top-surface tip while the authoritative transform remains the cell center.

## 3. Why TESTBUILD 1.4 moved the FLOORs upward

TESTBUILD 1.3 cardinal FLOOR frames used 100×80 with `anchorY=0.425`, producing a vertical pivot of:

`80 × 0.425 = 34 px`.

TESTBUILD 1.4 uses 95×74 with `anchorY=0.84`, producing:

`74 × 0.84 = 62.16 px`.

Because both pivots are registered to the same projected world/cell-center point, TESTBUILD 1.4 shifts the visible sprite upward by approximately 28 px relative to TESTBUILD 1.3 before considering the retained pivot-centered vertical compression.

This matches the iPhone device failure: the plates visibly sit above the intended grid diamonds.

## 4. Correct anchor target for the refined 95×74 crop

Earlier source-geometry measurement located the visible FLOOR top-surface center at approximately `(50,34)` inside the original 100×80 cardinal crop.

The TESTBUILD 1.4 refined crop moves the frame origin by +3 px X and +3 px Y while changing the frame to 95×74. Therefore the same top-surface-center feature is approximately:

- X: `50 - 3 = 47 px` within the new frame;
- Y: `34 - 3 = 31 px` within the new frame.

Normalized against 95×74:

- `anchorX ≈ 47 / 95 ≈ 0.495`, effectively consistent with `0.5`;
- `anchorY ≈ 31 / 74 ≈ 0.419`.

This independently explains why TESTBUILD 1.3 at `anchorY=0.425` was already visually close: its anchor was near the top-surface center, which is the correct feature to register to the logical cell center.

## 5. Reconciled conclusion

The previous TESTBUILD 1.4 assumption was wrong: the lower/front top-surface tip must **not** be registered to the existing FLOOR world point.

The correct relationship is:

1. authoritative FLOOR transform/world point = logical 1×1 cell center;
2. projected world point = screen-space center of the grid diamond;
3. sprite anchor = visible top-surface center;
4. board thickness/front face/shadow may extend below the logical top surface as presentation-only geometry;
5. `scaleY(0.79)` remains conceptually compatible because it acts around the correctly registered center pivot.

## 6. Candidate anchor range for a later step

No implementation value is authorized here.

For the current 95×74 crop, the mathematically supported candidate is approximately:

- `anchorX = 0.5` (or measured ~0.495; 0.5 remains the symmetry-preserving candidate),
- `anchorY ≈ 0.419`.

A practical later definition may compare `0.419`, `0.42`, and the previously successful `0.425`, but there must be no blind offset tuning. Any selected value must preserve the contract that the anchor represents the visible top-surface center and therefore the logical cell center.

## 7. Locked / unchanged in this reconciliation

- authoritative world positions
- FLOOR snap offsets
- 9×9 grid and 2-world-unit pitch
- world-to-screen projection
- current 95×74 crop rectangles
- `scaleY(0.79)`
- depth ordering
- PNG atlas image
- WALL/CORNER/DOOR/ROOF/BEAM
- diagonal/auxiliary FLOOR frames
- TESTBUILD identity

## Result

TESTBUILD 1.4 device registration failure is reconciled as an **anchor semantic mismatch**, not a grid/snap/world-authority failure.

No implementation is authorized by this document.