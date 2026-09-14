# DDS-05B – FLOOR Sprite/Grid Geometry Correction Implementation Scope Reconciliation

Status: RECONCILED — NOT IMPLEMENTED

## Basis

This reconciliation is based on the previously defined FLOOR source-frame measurement and geometry-correction target:

- authoritative logical grid remains unchanged;
- one logical FLOOR occupies exactly one 1×1 grid cell;
- `floor_s` source frame is 100×80 px;
- measured top-surface is approximately 98×62 px;
- target projected grid footprint is approximately 2:1;
- target top-surface height for ~98 px width is approximately 49 px;
- first vertical correction factor is therefore approximately `49 / 62 ≈ 0.79`;
- current anchor `(50,68)` does not represent the top-surface center; measured top-surface center is approximately `(50,34)`.

No implementation is authorized by this document.

## Asset correction vs runtime presentation correction

### Asset rewrite option

An asset rewrite would require modifying the packed atlas bitmap itself, regenerating or manually replacing at least the four authoritative FLOOR direction cells, re-validating frame rectangles, transparent padding and visual fidelity, and then synchronizing JSON metadata. Because the atlas contains multiple sprite families and states, this creates unnecessary binary-asset risk for a correction that is presentation-only.

Result: **not preferred for the next correction probe**.

The atlas PNG must remain unchanged for the next implementation scope.

### Runtime presentation correction option

The existing presentation path already provides:

- per-frame scalar `scale` from atlas metadata;
- per-frame anchor metadata;
- an inline `--sprite-scale` custom property;
- a CSS transform on `.scene-module__sprite`;
- a category class on the parent such as `.scene-module--floor`.

Therefore a FLOOR-only non-uniform presentation correction can be introduced without changing world coordinates, snap authority, projection or the source bitmap.

Result: **preferred implementation path**.

## Reconciled correction model

The next implementation probe may do only the following for authoritative runtime FLOOR frames `floor_s`, `floor_e`, `floor_n`, `floor_w`:

1. retire the temporary uniform TESTBUILD 1.2 calibration scale `1.30` and return the scalar FLOOR scale to the geometry baseline (`1.00` for the first correction probe);
2. move FLOOR registration from the old bottom-biased anchor toward the measured top-surface center, first target approximately:
   - `anchorX = 0.50`
   - `anchorY = 34 / 80 = 0.425`;
3. apply a FLOOR-only vertical presentation factor of approximately `0.79` while leaving horizontal presentation factor at `1.00`;
4. apply the correction to the complete FLOOR sprite image around the corrected pivot; this is a presentation experiment and does not redefine logical footprint authority;
5. advance build/cache identity only in a separately authorized implementation build.

The `0.79` factor and `0.425` anchor are calibration targets, not frozen final values.

## Why CSS/runtime is the narrowest current path

`browser-app.mjs` already writes width, height, margins, background atlas coordinates, transform origin and `--sprite-scale` from the descriptor. No new world-space calculation is required.

`prototype.css` already owns the actual sprite transform using `scale(var(--sprite-scale, 1))`. The parent module already carries a FLOOR-specific class. A FLOOR-only Y correction can therefore be layered at presentation level without modifying placement/controller logic.

No schema extension to generic `scaleX` / `scaleY` is required for this first probe. If later multiple sprite families need independently calibrated non-uniform transforms, that must be reconciled as a separate generalized atlas-contract change.

## Exact proposed implementation file scope

The next implementation, if separately authorized, may modify exactly these six existing files:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
   - authoritative FLOOR runtime directions only;
   - scalar scale `1.30 → 1.00`;
   - anchor target `anchorY 0.85 → approximately 0.425`;
   - no frame rectangle/crop changes;
   - no other sprite-family metadata changes.

2. `src/dds-04f/prototype.css`
   - add/adjust only a FLOOR-specific sprite presentation transform so the existing scalar scale is combined with approximately `scaleY(0.79)`;
   - no grid, layout, breakpoint or unrelated visual changes.

3. `index.html`
   - later build label/cache-buster update only, if the implementation build is authorized.

4. `src/dds-04f/browser-app.mjs`
   - later canonical expected build/cache id update only;
   - no placement, projection, snap, grid or sprite-style algorithm change is required by this reconciliation.

5. `tests/dds-05a/sprite-presentation.test.mjs`
   - update FLOOR metadata assertions for the corrected scalar scale/anchor;
   - retain assertions that other families remain unchanged.

6. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - update build identity/cache assertions;
   - add or retain a narrowly scoped assertion that the FLOOR-only geometry correction is present while other families are not given the correction.

## Explicitly outside scope

The following are not authorized for the next implementation probe:

- `construction-atlas.png` or any other bitmap rewrite;
- atlas frame x/y/w/h crop rectangles;
- diagonal FLOOR frames unless separately reconciled;
- `src/dds-05a/sprite-presentation.mjs` contract changes;
- generic `scaleX` / `scaleY` atlas-schema expansion;
- `construction-ui-controller.mjs`;
- grid size, cell pitch or grid rendering geometry;
- snap offsets or snap authority;
- world transforms;
- scene projection;
- WALL/CORNER/DOOR/ROOF/BEAM calibration;
- responsive layout changes;
- any DDS-05B freeze decision.

## Scope decision

**Preferred path: runtime presentation correction, not asset rewrite.**

**Reconciled implementation scope: exactly six existing files.**

This document does not authorize implementation. A separate Implementation Authorization is required before any of these six files may be changed.
