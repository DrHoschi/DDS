# DDS-05B – FLOOR Top-Surface Anchor TESTBUILD 1.4 Implementation Scope Reconciliation

Status: RECONCILED — NOT AUTHORIZED — NOT IMPLEMENTED

## Baseline

This reconciliation is based on:

- TESTBUILD 1.3 implementation head: `3d2d46975e3e303d2dc8783faa3b7e0bf52cd292`
- TESTBUILD 1.3 regression: 56/56 PASS
- iPhone device / anchor reconciliation commit: `5623153004a3daa5842c6076f610936ac57b3225`
- current branch: `feature/dds-05a-sprite-construction-presentation`

No runtime or asset change is made in this step.

## Current TESTBUILD 1.3 presentation state

The four authoritative runtime FLOOR directions currently use:

- `floor_s`: frame `(17,28,100,80)`, anchor `(0.5,0.425)`, scale `1`
- `floor_e`: frame `(250,28,100,80)`, anchor `(0.5,0.425)`, scale `1`
- `floor_n`: frame `(478,28,100,80)`, anchor `(0.5,0.425)`, scale `1`
- `floor_w`: frame `(716,28,100,80)`, anchor `(0.5,0.425)`, scale `1`

The runtime CSS additionally applies, only to real FLOOR sprites:

`scale(var(--sprite-scale, 1)) scaleY(0.79)`

Grid/world/snap/projection remain authoritative and unchanged.

## User-calibrated reference: floor_s

The user refined `floor_s` in Sprite Lab to:

- x = 20
- y = 31
- w = 95
- h = 74
- anchorX = 0.5
- anchorY = 0.84
- scale = 1

The anchor represents the lower/front tip of the visible FLOOR top surface. Board thickness/front face below that point is presentation-only overhang.

Relative to the old 100×80 `floor_s` frame, this is:

- x inset: +3 px
- y inset: +3 px
- width: -5 px
- height: -6 px

## Decision: crop/anchor and scaleY(0.79) are complementary

The refined crop does **not** change the projected top-surface aspect ratio. It changes which source pixels belong to the frame and where the logical registration point lies inside that frame.

Therefore it does not replace the TESTBUILD 1.3 vertical geometry correction.

For the TESTBUILD 1.4 candidate:

- retain FLOOR-only `scaleY(0.79)` unchanged;
- apply the refined crop/anchor registration package;
- do not add another scale factor or another non-uniform transform.

This avoids double correction because the two corrections serve different purposes:

1. `scaleY(0.79)` corrects the projected FLOOR top-surface geometry toward the grid's ~2:1 presentation ratio.
2. the refined frame + `anchorY=0.84` registers the corrected top surface by its lower/front tip on the grid intersection.

The transform origin continues to be derived from the atlas anchor. With the new anchor, vertical compression occurs around the lower/front top-surface registration point, so that registration point remains fixed while the upper/back part is compressed toward the intended opposite grid intersection.

## Cardinal direction source inspection

The four authoritative cardinal source frames (`floor_s`, `floor_e`, `floor_n`, `floor_w`) all use 100×80 source regions and show equivalent FLOOR geometry positioned consistently inside those regions.

Therefore the same **relative** crop adjustment used for `floor_s` is admissible for the remaining three authoritative directions for the TESTBUILD 1.4 calibration candidate.

No diagonal FLOOR frame is changed.

## Exact TESTBUILD 1.4 candidate atlas values

### floor_s

- frame: `x=20, y=31, w=95, h=74`
- anchorX: `0.5`
- anchorY: `0.84`
- scale: `1`

### floor_e

Current source origin is `250,28`; applying the same relative crop gives:

- frame: `x=253, y=31, w=95, h=74`
- anchorX: `0.5`
- anchorY: `0.84`
- scale: `1`

### floor_n

Current source origin is `478,28`; applying the same relative crop gives:

- frame: `x=481, y=31, w=95, h=74`
- anchorX: `0.5`
- anchorY: `0.84`
- scale: `1`

### floor_w

Current source origin is `716,28`; applying the same relative crop gives:

- frame: `x=719, y=31, w=95, h=74`
- anchorX: `0.5`
- anchorY: `0.84`
- scale: `1`

These values are now reconciled candidate values only. They are not yet authorized or written.

## Diagonal and auxiliary FLOOR frames

Explicitly unchanged:

- `floor_se`
- `floor_ne`
- `floor_nw`
- `floor_sw`
- `floor_normal`
- `floor_hover`
- `floor_ghost`
- `floor_invalid`

The authoritative runtime yaw mapping uses only `floor_s/e/n/w`; expanding calibration to the other physical frames would be a separate scope.

## Future TESTBUILD 1.4 implementation file scope

A later authorized implementation should require exactly these five existing files:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
   - update only `floor_s/e/n/w` frame rectangles and anchors to the reconciled candidate values;
   - keep `scale: 1`;
   - no other atlas entries.

2. `index.html`
   - advance visible identity to `DDS-05B · TESTBUILD 1.4`;
   - advance technical/cache identity to `DDS-05B-TB1.4`.

3. `src/dds-04f/browser-app.mjs`
   - advance only active build/cache identity from 1.3 to 1.4;
   - no rendering, projection, grid or controller logic change.

4. `tests/dds-05a/sprite-presentation.test.mjs`
   - assert exact `floor_s/e/n/w` candidate crop/anchor/scale values;
   - assert non-FLOOR and non-authoritative FLOOR entries remain unchanged.

5. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - advance expected visible/technical build identity to 1.4;
   - retain/strengthen the assertion that FLOOR-only `scaleY(0.79)` remains present and scoped to FLOOR.

## prototype.css decision

`src/dds-04f/prototype.css` is **not** part of the future TESTBUILD 1.4 implementation scope.

Reason: `scaleY(0.79)` remains unchanged. No CSS edit is necessary merely to retain an existing rule.

If implementation later discovers that CSS must be changed, implementation must stop and return to scope reconciliation; CSS may not be silently added as a sixth implementation file.

## Explicitly locked / untouched

The future TESTBUILD 1.4 implementation must not change:

- atlas PNG;
- `src/dds-04f/prototype.css`;
- `src/dds-05a/sprite-presentation.mjs`;
- construction controller;
- grid size/pitch/geometry;
- snap offsets or snap authority;
- world positions/occupancy;
- world-to-screen projection;
- depth algorithm;
- WALL/CORNER/DOOR/ROOF/BEAM;
- diagonal/auxiliary FLOOR frames;
- global sprite scale;
- `scaleY(0.79)`.

## Required post-implementation regression

After a separately authorized implementation, the full existing command must pass:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

No regression PASS may be claimed before the workflow for the exact final TESTBUILD 1.4 SHA is verified.

## Required iPhone device acceptance case

After regression PASS, the device gate must first use real iPhone/Safari evidence.

Minimum acceptance:

1. visible identity is `DDS-05B · TESTBUILD 1.4`;
2. isolated FLOOR lower/front top-surface tip sits on the intended lower grid intersection;
3. opposite upper/back top-surface tip reaches the opposite grid intersection closely;
4. left/right top-surface edges visually follow the logical grid diamond;
5. board thickness/shadow may extend outside the logical cell;
6. place a second orthogonally adjacent FLOOR in front;
7. both top surfaces occupy their own logical cells;
8. front FLOOR may naturally cover the rear FLOOR's presentation-only front-face overhang;
9. no snap/world/grid position may be altered to force visual alignment.

Only after this two-FLOOR device case may the anchor registration be considered for visual PASS.

## Out of scope

- no implementation in this reconciliation;
- no TESTBUILD 1.4 code/JSON change yet;
- no WALL calibration;
- no iPad completion gate yet;
- no DDS-05B freeze;
- no final claim that 0.84 is frozen; it remains the TESTBUILD 1.4 calibration candidate until device evidence passes.

## Reconciled result

The TESTBUILD 1.4 implementation candidate is now narrowly defined:

- retain `scaleY(0.79)`;
- refine only the four authoritative cardinal FLOOR frame rectangles using the same relative inset;
- move their logical registration anchor to `anchorX=0.5`, `anchorY=0.84`;
- keep `scale=1`;
- five-file implementation scope only;
- validate using the real iPhone two-FLOOR overlap/registration case.

No implementation is authorized by this document.
