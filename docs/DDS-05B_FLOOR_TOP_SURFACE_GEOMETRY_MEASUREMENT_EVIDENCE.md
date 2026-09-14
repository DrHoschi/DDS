# DDS-05B – FLOOR Top-Surface Geometry Measurement / Evidence Capture

Status: EVIDENCE CAPTURED — NO IMPLEMENTATION

## Basis

- Existing device build: `DDS-05B · TESTBUILD 1.2`
- Existing FLOOR runtime scale: `1.30`
- Grid/world/snap/projection authority remains locked.
- User-provided grid-cell sketch used as measurement evidence.

## Grid-cell evidence

The supplied single-cell sketch is 995 × 513 px as an image. The visible grid diamond reaches approximately:

- left: `(0, 257)`
- top: `(496, 0)`
- right: `(994, 258)`
- bottom: `(495, 512)`

Approximate diamond bounding dimensions:

- width: `994 px`
- height: `512 px`
- width / height: `1.94`

This is very close to the frozen construction projection's intended `2:1` grid-diamond bounding ratio.

## Consequence for a 100 px wide FLOOR reference

If a FLOOR top surface is normalized to a projected grid-cell width of `100 px`, a geometrically matching 2:1 top-surface diamond should be approximately:

- top-surface width: `100 px`
- top-surface height: `50 px`

Therefore the atlas frame size `100 × 80 px` must not be interpreted as the logical FLOOR top-surface footprint itself. The extra vertical pixels can contain board thickness, shadow and/or transparent padding.

A full-frame `100 × 80` footprint would have a width/height ratio of only `1.25`, which does not match the measured grid-cell diamond ratio (~1.94) and cannot be made congruent by uniform scale alone.

## Anchor implication

The existing FLOOR frame anchor metadata is `anchorX = 0.5`, `anchorY = 0.85`. For a `100 × 80` frame this corresponds to approximately:

- anchor pixel X: `50 px`
- anchor pixel Y: `68 px`

The user's blue-point sketch correctly illustrates the key registration question: the world/grid placement point must be related to the logical top-surface footprint, not blindly to the full 100 × 80 frame rectangle.

This evidence does not yet authorize a new anchor value. It shows only that `Y=68` must be evaluated against the measured top-surface diamond and any lower board thickness/shadow/padding.

## Diagnostic result

1. Grid-cell geometry is consistent with the frozen projection and remains locked.
2. A projected 1×1 cell is approximately a 2:1 diamond in screen-space bounding dimensions.
3. The full `100 × 80` FLOOR atlas frame is not itself a valid 1×1 top-surface footprint.
4. Uniform scale cannot change the frame/top-surface aspect ratio; therefore further blind scale-only increments are not justified.
5. The logical top surface should be measured independently inside the frame. At a normalized 100 px width, the target top-surface height is approximately 50 px.
6. The anchor must then register that measured top-surface geometry to the grid cell's placement point.

## Evidence still required before changing the atlas/runtime

For at least one authoritative FLOOR frame (`floor_s` preferred), determine inside the unscaled source frame:

- actual top-surface left/right/top/bottom corner pixel coordinates;
- top-surface bounding width and height;
- top-surface center;
- current anchor position relative to that center;
- amount of transparent padding / board thickness / shadow below the top surface.

Only after those source-frame measurements can we decide whether the next correction is:

- scale only,
- anchor only,
- crop/padding plus anchor,
- or a regenerated/reprojected FLOOR sprite.

## Scope boundary

No implementation is authorized here. No atlas metadata, PNG, scale, anchor, crop, CSS, projection, grid, snap, controller, WALL or other construction part is changed by this evidence-capture step.
