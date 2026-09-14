# DDS-05B – FLOOR Sprite/Grid Geometry Correction Definition

Status: DEFINED — NOT IMPLEMENTED

## Basis

This definition is based on the measured `floor_s` source frame and the existing DDS-05B grid projection.

Source atlas contract for `floor_s`:
- frame origin: x=17, y=28
- frame size: 100×80 px
- current anchor: (0.5, 0.85) = (50,68) px
- current source image remains unchanged in this definition step

Measured visible top surface, approximate source-frame coordinates:
- TOP ≈ (50,3)
- RIGHT ≈ (98,34)
- BOTTOM ≈ (50,65)
- LEFT ≈ (1,34)
- top-surface center ≈ (50,34)
- top-surface width ≈ 97–98 px
- top-surface height ≈ 61–62 px
- top-surface width:height ≈ 1.58:1

Measured/defined grid-cell presentation ratio is approximately 2:1.

## Geometry conclusion

Uniform scale alone cannot reconcile a 1.58:1 top-surface footprint with an approximately 2:1 projected grid cell, because uniform scale preserves aspect ratio.

Therefore the next FLOOR correction must address source/presentation geometry before any further uniform scale calibration.

The current anchor at (50,68) is also not the geometric center of the top surface. Relative to the measured top-surface center near (50,34), the current anchor is approximately 34 source pixels too low for a center-registered 1×1 FLOOR footprint.

## Chosen correction strategy

The chosen strategy is to preserve the existing artistic FLOOR asset as the visual source and create a FLOOR-specific corrected presentation derivative for the authoritative runtime FLOOR directions.

The correction must NOT distort the authoritative grid or world geometry.

The target presentation derivative shall:
1. preserve the horizontal top-surface span as the primary visual reference;
2. compress only the projected vertical/top-surface axis sufficiently to reach approximately 2:1 width:height for the top surface;
3. keep board thickness/shadow as visual detail, not as logical footprint geometry;
4. register the logical FLOOR world point to the geometric center of the corrected top surface;
5. retain the original unmodified atlas/source asset as provenance/reference unless a later implementation scope explicitly authorizes replacement.

## Initial correction target

Using an approximate measured top surface of 98×62 px, the target height at a 2:1 ratio is approximately 49 px.

Therefore the first geometry-correction target is approximately:
- horizontal factor: 1.00
- vertical presentation factor: 49/62 ≈ 0.79

This `~0.79` factor is a calibration target, not yet an implementation constant or frozen value.

After correction, the corrected top-surface center must be used as the registration reference. The target anchor is conceptually `topSurfaceCenter`, not the bottom of the complete 100×80 sprite frame.

## Preferred implementation model

Preferred for the next implementation-scope reconciliation:
- do not modify grid cell geometry;
- do not modify snap offsets;
- do not modify world transforms;
- do not alter global CSS sprite scaling;
- do not apply this correction to WALL or any other sprite family;
- introduce the correction only in FLOOR presentation data/asset handling, with explicit tests;
- keep uniform final FLOOR scale as a separate post-geometry calibration parameter after the corrected 2:1 footprint is proven.

Whether the corrected derivative is produced as a revised atlas image region or as a runtime presentation transform remains an implementation-scope decision. This definition does not authorize either mechanism yet.

## Acceptance contract

A corrected FLOOR presentation passes geometry correction only when:
- its top surface is approximately congruent with one projected 1×1 grid cell;
- its four top-surface corners follow the four grid-cell corners within a small visual tolerance;
- its top-surface center coincides with the projected logical FLOOR world point;
- adjacent orthogonal FLOOR cells can visually meet edge-to-edge after subsequent uniform scale calibration;
- no change to grid/snap/world authority is required.

## Explicitly excluded

This definition does not authorize:
- atlas PNG modification;
- atlas JSON modification;
- runtime code modification;
- CSS modification;
- TESTBUILD 1.3;
- further uniform scale increase;
- WALL/CORNER/DOOR/ROOF/BEAM calibration;
- grid, projection, controller or snap-authority changes.
