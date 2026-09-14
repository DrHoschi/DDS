# DDS-05B – FLOOR Center-Anchor Correction Definition

Status: DEFINED — NOT AUTHORIZED — NOT IMPLEMENTED

## Basis

This definition is based on the completed TESTBUILD 1.4 iPhone Device Failure / Anchor-vs-World-Registration Reconciliation.

Authoritative registration contract:

- The authoritative FLOOR world position is the center of the logical 1×1 construction-grid cell.
- The shared world-to-screen projection maps that world position to the visual center of the corresponding grid diamond.
- The FLOOR sprite anchor must therefore represent the center of the visible FLOOR top surface, not the lower/front tip.
- Grid, snap, occupancy and world positions remain authoritative and must not be moved to compensate for presentation alignment.

## Current TESTBUILD 1.4 geometry

Authoritative cardinal FLOOR frames:

- floor_s: x=20, y=31, w=95, h=74
- floor_e: x=253, y=31, w=95, h=74
- floor_n: x=481, y=31, w=95, h=74
- floor_w: x=719, y=31, w=95, h=74

For all four:

- anchorX = 0.5
- anchorY = 0.84
- scale = 1

FLOOR-only presentation correction remains:

- scaleY(0.79)

The iPhone device evidence shows that anchorY=0.84 registers the sprite substantially too high relative to the grid because the pivot is approximately 62.16 px from the top of a 74 px frame.

## Mathematical center-anchor derivation

The previously measured visible top-surface center for the source FLOOR geometry was approximately 34 px from the top of the original 100×80 frame.

The TESTBUILD 1.4 crop removes 3 px from the top:

- original top-surface center ≈ 34 px
- new relative top-surface center ≈ 34 − 3 = 31 px
- new frame height = 74 px

Therefore:

anchorY = 31 / 74 = 0.4189189189…

Candidate representations:

- 0.419 → pivot 31.006 px
- 0.42 → pivot 31.08 px
- 0.425 → pivot 31.45 px

## Definition decision

The defined center-anchor value for the next implementation scope is:

**anchorY = 0.419**

Reason:

- It is the direct three-decimal representation of the measured 31/74 geometric relationship.
- It preserves the mathematically derived top-surface center with only ~0.006 px deviation before CSS transformation.
- 0.42 would also be visually near-equivalent, but is less directly traceable to the measured ratio.
- 0.425 was close in TESTBUILD 1.3 because the older 80 px frame placed the pivot at 34 px; after the 3 px top crop and reduced 74 px frame height, retaining 0.425 would move the pivot to 31.45 px and would no longer be the exact derived center.

## Horizontal anchor

anchorX remains **0.5**.

The estimated geometric center after the horizontal crop is approximately 47/95 ≈ 0.495. The existing 0.5 value differs by only 0.5 source pixel and remains the stable centered contract. No horizontal correction is defined in this block.

## Locked values / unchanged behavior

This definition does not authorize any implementation.

The following remain unchanged:

- floor_s/e/n/w crop rectangles (95×74 candidate package)
- floor_s/e/n/w scale = 1
- FLOOR-only scaleY(0.79)
- atlas PNG
- diagonal and auxiliary FLOOR frames
- grid geometry, grid pitch and grid size
- snap offsets and placement authority
- world positions and occupancy
- world-to-screen projection
- render-depth algorithm
- WALL/CORNER/DOOR/ROOF/BEAM presentation
- controller logic

## Future acceptance intent

A later separately authorized implementation must use anchorY=0.419 for exactly floor_s, floor_e, floor_n and floor_w and then require:

1. full regression on the exact implementation SHA;
2. real iPhone/Safari device evidence;
3. isolated FLOOR: world/grid center visually coincides with the top-surface center;
4. top-surface diamond aligns with the logical cell without moving authority;
5. two orthogonally adjacent FLOORs occupy their own cells and overlap only through presentation depth/board thickness;
6. no grid/snap/world-position compensation.

The value 0.419 is DEFINED but not frozen. Device evidence remains required before visual PASS or freeze.
