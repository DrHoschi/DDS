# DDS-05B – FLOOR Sprite Footprint Geometry Reconciliation

Status: RECONCILED — NO IMPLEMENTATION AUTHORIZED

## Evidence basis

- iPhone Safari screenshot visibly shows `DDS-05B · TESTBUILD 1.2`.
- TESTBUILD 1.2 uses `scale: 1.30` for the four authoritative runtime FLOOR frames.
- Authoritative grid remains 9×9, cell size 2 world units, with the existing frozen projection/snap geometry.
- FLOOR atlas crop metadata remains 100×80 with `anchorX: 0.5`, `anchorY: 0.85` for `floor_s/e/n/w`.

## Required visual contract

One authoritative FLOOR instance represents exactly one logical 1×1 grid cell.

The comparison boundary is the four corners / four edges of the visible walkable top surface of the FLOOR tile, not the full rectangular atlas frame, not the front thickness and not the shadow.

For two orthogonally adjacent FLOOR cells the corresponding top-surface edges must meet without a deliberate gap and without material overlap.

## Geometry reconciliation

### 1. Grid geometry

The grid remains the reference authority. No evidence from TESTBUILD 1.2 justifies changing cell pitch, world coordinates, snap offsets or projection.

At the phone lower-bound projection already covered by the regression contract, one 2-world-unit cell projects as a diamond with a 2:1 horizontal-to-vertical bounding-box ratio. The visible FLOOR top surface therefore has to reproduce that same projected basis if it is to match one cell in every direction.

### 2. Uniform scale

TESTBUILD 1.1 (`1.15`) and TESTBUILD 1.2 (`1.30`) establish that increasing uniform scale changes overall footprint size in the expected direction, but TESTBUILD 1.2 still does not yield a clean four-edge coincidence with the grid diamond.

Conclusion: uniform scale alone is no longer a sufficient diagnosis. No further blind scale increase is authorized by this reconciliation.

### 3. Crop / transparent padding

The atlas crop rectangle is not itself the logical footprint. Transparent padding can influence clipping and, because the anchor is expressed as a fraction of the crop dimensions, can indirectly influence registration if the crop is changed.

However, merely trimming transparent padding does not automatically correct a wrong top-surface perspective ratio. Crop must therefore not be used as a size substitute. It may only be changed later if a source-image inspection proves that the relevant top-surface pixels are unnecessarily offset or clipped by the current 100×80 frame.

Current conclusion: CROP = POSSIBLE CONTRIBUTOR, NOT YET PROVEN ROOT CAUSE.

### 4. Anchor / registration

The current FLOOR anchor is `(0.5, 0.85)`. That places the projected world point at 85% of the crop height, which is a bottom-biased registration convention.

For a FLOOR tile the authoritative world point conceptually corresponds to the logical cell position. Therefore the correct sprite anchor must coincide with the projected reference point of the tile's top surface (normally its geometric cell center), not simply with a generic bottom-of-sprite convention.

The iPhone result is compatible with a registration mismatch: changing scale does not guarantee coincidence of all four top-surface corners when the top-surface center is not registered to the grid-cell center.

Current conclusion: ANCHOR/REGISTRATION = STRONG CANDIDATE FOR NEXT MEASUREMENT, but no new anchor value is defined in this step.

### 5. Sprite perspective / top-surface proportion

The FLOOR top surface must have the same two projected basis directions as the grid. If the sprite artwork was rendered with a different camera elevation/isometric compression, no uniform scale and no anchor shift can make all four corners coincide simultaneously.

The TESTBUILD 1.2 screenshot provides enough evidence to stop treating the problem as scale-only, but not enough pixel-level source evidence to prove that the artwork perspective itself is wrong.

Current conclusion: SPRITE PERSPECTIVE = POSSIBLE ROOT CAUSE; must be measured before any image rewrite.

## Decision

- Grid/world/snap/projection authority remains LOCKED.
- Current `scale: 1.30` remains the last calibration probe; no further scale increase is defined here.
- Crop remains LOCKED pending proof of transparent-padding/crop contribution.
- Anchor remains LOCKED pending explicit top-surface-center measurement.
- FLOOR artwork remains unchanged pending explicit comparison of its top-surface corner vectors against the grid-cell vectors.
- WALL and all other piece families remain out of scope.

## Required next diagnostic definition

Before another implementation, define a FLOOR geometry measurement contract that records for one authoritative FLOOR frame:

1. the four top-surface corner pixel coordinates inside the atlas frame;
2. the top-surface geometric center in frame coordinates;
3. the current anchor pixel coordinate (`50, 68` for a 100×80 frame with anchor 0.5/0.85);
4. the two top-surface edge vectors / their projected slope and ratio;
5. the corresponding one-cell grid vectors under the frozen projection;
6. whether the mismatch is:
   - size only,
   - registration only,
   - perspective/proportion only,
   - or a combination.

Only after that measurement may a separate definition choose exactly one corrective path: scale, anchor/registration, crop, or regenerated/warped FLOOR artwork.

## Scope boundary

This document performs reconciliation only. It does not authorize any change to atlas metadata, source PNG, runtime, CSS, projection, controller, tests, build identity, or any WALL asset.
