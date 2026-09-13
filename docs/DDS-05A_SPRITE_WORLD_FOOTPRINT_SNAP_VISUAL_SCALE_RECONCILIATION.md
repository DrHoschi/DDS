# DDS-05A – Sprite World Footprint / Snap-Visual Scale Reconciliation

Status: **DEFINED / GEOMETRIC SCALE CONTRACT IDENTIFIED / CALIBRATION DATA REQUIRED / NOT IMPLEMENTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Input evidence:

- TESTBUILD 3 implementation: `6c32ca6875c109aaf5a884325138efa442d48e90`
- TESTBUILD 3 iPhone verification: `docs/DDS-05A_TESTBUILD3_VISUAL_DEVICE_VERIFICATION.md`
- verification commit: `2648ce54a8a86ea85fddfd7fee0f44db8b66d3e5`

Current presentation identity:

- visible: `DDS-05A · TESTBUILD 3`
- technical: `DDS-05A-TB3`

## 1. Purpose

This reconciliation determines how a rendered sprite must be scaled so that its visible geometry matches the already-authoritative DDS-04 world/snap geometry.

The problem to solve is:

**authoritatively connected modules are mathematically connected, but their visible sprite artwork does not meet at the corresponding visual connection points.**

This step defines the required geometric contract only.

No code, CSS, atlas JSON, PNG, crop, anchor or runtime scale is changed here.

## 2. TESTBUILD 3 Finding

TESTBUILD 3 established that:

- one shared pixel world projection is active
- actual target snap world points are projected
- authoritative placement remains functional
- connected sprite artwork still does not form a contiguous construction

Therefore the remaining defect is no longer primarily:

- stale cache
- percentage projection
- DDS-04C snap math

The remaining defect is:

**sprite-local pixel geometry is not calibrated to authoritative world-unit geometry.**

## 3. Current World Projection Is the Screen-Space Authority

TESTBUILD 3 defines:

`S = clamp(min(width / 16, height / 12), 24, 44)`

and:

`screenX = originX + (x - z) * S`

`screenY = originY + (x + z) * (S / 2) - y * S`

For a world-space delta:

`D = { dx, dy, dz }`

the corresponding screen delta is:

`projectDelta(D, S) = {`

`  x: (dx - dz) * S,`

`  y: (dx + dz) * (S / 2) - dy * S`

`}`

This projection remains the DDS-05A screen-space authority.

The sprite must adapt to this geometry.

The world projection must not be distorted to fit the artwork.

## 4. Current Authoritative Snap Spans

The existing frozen controller/snap profiles provide the following useful geometric spans.

### FLOOR

Snap positions include:

- `floor-east = { 2, 0, 0 }`
- `floor-west = { -2, 0, 0 }`
- `wall-north = { 0, 0, 1.3 }`
- `wall-south = { 0, 0, -1.3 }`

Therefore:

- east ↔ west world span = `{ 4, 0, 0 }`
- north ↔ south world span = `{ 0, 0, 2.6 }`

### WALL

- `base = { 0, 0, 0 }`
- `side = { 1.4, 0, 0 }`
- `top = { 0, 1.6, 0 }`

Therefore:

- base → side = `{ 1.4, 0, 0 }`
- base → top = `{ 0, 1.6, 0 }`

### CORNER

- `base = { 0, 0, 0 }`
- `side = { 1.2, 0, 1.2 }`
- `top = { 0, 1.6, 0 }`

Therefore:

- base → side = `{ 1.2, 0, 1.2 }`
- base → top = `{ 0, 1.6, 0 }`

### DOOR_OPENING

- `base = { 0, 0, 0 }`
- `side = { 1.4, 0, 0 }`
- `top = { 0, 1.6, 0 }`

Therefore:

- base → side = `{ 1.4, 0, 0 }`
- base → top = `{ 0, 1.6, 0 }`

### BEAM

- `base = { 0, 0, 0 }`
- `side = { 1.2, 0, 0 }`
- `top = { 0, 1.8, 0 }`

Therefore:

- base → side = `{ 1.2, 0, 0 }`
- base → top = `{ 0, 1.8, 0 }`

### ROOF

ROOF currently exposes only:

- `base = { 0, 0, 0 }`

Therefore the frozen snap contract alone does **not** provide an internal second point from which the visible roof width/depth can be calibrated.

ROOF is geometrically underdetermined by the current snap profile.

No roof footprint dimension may be invented in this reconciliation.

## 5. Why Fixed Pixel Sprites Cannot Remain at Scale 1

Current candidate frame dimensions are fixed pixel rectangles.

Examples include:

- FLOOR: approximately 100×100, 120×120 or 128×128 depending direction
- WALL: approximately 70×110 or 120–128 square depending direction
- DOOR: approximately 70×113 or 128×128
- BEAM: approximately 100×80 through 128×135

But `S` changes with the actual device/scene.

Example FLOOR east ↔ west span:

`D = { 4, 0, 0 }`

At `S = 24`:

- projected delta = `{ 96, 48 }`

At `S = 44`:

- projected delta = `{ 176, 88 }`

The world distance nearly doubles between those presentation scales, while an unscaled 100 px sprite remains 100 px.

Therefore a fixed `scale = 1` sprite cannot preserve the same world footprint across iPhone and iPad.

This mismatch is structural, not a one-device offset.

## 6. Vertical Example Confirms the Same Problem

WALL base → top:

`D = { 0, 1.6, 0 }`

At `S = 24`:

- screen delta = `{ 0, -38.4 }`

At `S = 44`:

- screen delta = `{ 0, -70.4 }`

A wall image with a fixed 110–128 px height therefore represents a different number of world units depending on device unless the sprite itself scales with `S`.

This confirms:

**sprite geometric scale must be derived from world projection scale.**

## 7. Crop and Anchor Are Not Sufficient

A crop rectangle determines:

- which atlas pixels are sampled

An anchor/pivot determines:

- which sampled pixel corresponds to the module origin

Neither one determines:

- how many sprite pixels equal one world unit

Changing an anchor can move the artwork relative to the origin.

It cannot change the pixel distance between two visible snap locations.

Changing a crop can remove transparent/unused border pixels.

It does not by itself define the world size represented by the artwork.

Therefore:

**crop and anchor corrections cannot replace a footprint calibration contract.**

## 8. Current CSS Container Is Not the World Footprint

The sprite container currently has a fixed presentation box of roughly 58×58 px and uses:

- absolute module position
- `translate(-50%, -50%)`
- child sprite positioned at `left: 50%; top: 50%`
- sprite margins based on its pivot

Because the sprite may overflow the container, the 58×58 box is not the visible world footprint.

It primarily provides:

- interaction container
- positioning center

It must not be treated as a physical module size.

## 9. Current Pivot Placement Is Mathematically Separate From Footprint Scale

Current sprite placement computes:

`pivotX = frame.w * anchorX`

`pivotY = frame.h * anchorY`

and places that pivot at the projected authoritative module origin.

This is conceptually correct as a pivot contract.

The remaining error is that the artwork around that pivot has no calibrated world-unit scale.

Therefore:

- pivot problem and footprint-scale problem remain separate
- footprint calibration must be solved before deciding whether pivot values need correction

## 10. Current Mobile CSS Scale Rule Is Not the Geometric Contract

The stylesheet contains a mobile rule equivalent to:

`--sprite-scale: 0.88`

but runtime currently writes the sprite's `--sprite-scale` inline from atlas metadata.

Current atlas runtime scale values are `1`.

The inline value therefore has precedence over the stylesheet custom property.

The mobile 0.88 rule is not currently a reliable world-footprint mapping.

Even if it were active, an arbitrary device-specific 0.88 factor would not establish exact world geometry.

## 11. Required New Concept – Visual Snap Calibration

Exact geometry requires each rendered directional frame to know where the authoritative snap points appear **inside the artwork in sprite-local pixels**.

Required conceptual data per calibrated frame:

- visual pivot pixel
- one or more visual snap pixel positions
- frame/direction identity

Conceptually:

`visualPivotPx = { x, y }`

`visualSnapPx[snapId] = { x, y }`

These values are presentation metadata only.

They do not alter DDS-04 snap positions.

## 12. Visual Snap Meaning

A `visualSnapPx` point means:

**the pixel inside the unscaled sprite frame where the corresponding authoritative snap location is visually represented by the artwork.**

Examples:

- FLOOR `floor-east` visual edge point
- FLOOR `floor-west` visual edge point
- WALL `base`, `side`, `top`
- DOOR `base`, `side`, `top`
- BEAM `base`, `side`, `top`

These are not new gameplay snaps.

They are artwork calibration landmarks tied by ID to existing authoritative snaps.

## 13. Direction / Yaw Must Be Included in Calibration

The atlas contains rendered directional frames.

The visual snap locations differ between directions.

Therefore calibration must be frame/direction-specific.

For example:

- `wall_s`
- `wall_e`
- `wall_n`
- `wall_w`

must not silently share pixel coordinates unless measured evidence proves they are identical.

The existing yaw mapping remains unchanged in this reconciliation:

- 0° → `s`
- 90° → `e`
- 180° → `n`
- 270° → `w`

## 14. Exact Calibration Geometry

For one sprite frame with authoritative yaw `r`:

1. take two authoritative local snap positions `A` and `B`
2. compute local delta:

`Dlocal = B - A`

3. rotate that world delta around Y using the frame's authoritative yaw:

`Dworld = Ry(r) * Dlocal`

4. project it using a unit world scale `S = 1`:

`U = projectDelta(Dworld, 1)`

5. measure the corresponding unscaled sprite-local pixel vector:

`V = visualSnapPx[B] - visualSnapPx[A]`

For a geometrically faithful pre-rendered frame, `V` must be a scalar multiple of `U`.

That scalar is the frame's:

**asset pixels per projected world unit**

## 15. Single-Pair Scale Formula

For one valid calibration pair:

`assetPPU = dot(V, U) / dot(U, U)`

This formula preserves sign/direction and provides the best scalar fit for that pair.

Required condition:

`assetPPU > 0`

A perpendicular or negative result indicates incorrect landmark assignment, incorrect direction mapping or incompatible artwork geometry.

## 16. Multi-Pair Scale Formula

Where a frame has several calibrated snap pairs, one uniform scale must be fitted across all of them.

For pairs `i = 1..n`:

`assetPPU = Σ dot(Vi, Ui) / Σ dot(Ui, Ui)`

This is the uniform least-squares scale fit.

It must be one scalar.

No independent X/Y scaling is allowed.

## 17. Why Uniform Scale Is Mandatory

Non-uniform scaling would distort:

- sprite proportions
- material appearance
- angle relationships
- different snap directions

It could make one connection line up while breaking another.

Therefore:

**DDS-05A sprite footprint calibration uses uniform scale only.**

If one uniform scale cannot align the calibrated snap landmarks with the authoritative projected geometry, the asset/frame itself is not geometrically compatible enough and must be corrected as an asset.

Runtime must not warp it.

## 18. Runtime Geometric Scale Formula

Once `assetPPU` has been calibrated for a frame, and the active scene projection uses `S` pixels/world-unit, the exact runtime geometric sprite scale is:

`renderScale = S / assetPPU`

This replaces the current assumption that geometric sprite scale is always `1`.

Consequences:

- when `S` increases, sprite grows proportionally
- when `S` decreases, sprite shrinks proportionally
- visible snap-to-snap distances remain tied to authoritative world geometry
- iPhone and iPad represent the same world-sized module at different pixel sizes

## 19. Exact Visual-Snap Alignment Equation

For an authoritative module whose projected origin is:

`Oscreen`

and a sprite whose unscaled visual pivot is:

`Ppx`

the screen position of an artwork landmark `Lpx` after calibrated scaling is:

`Lscreen = Oscreen + (Lpx - Ppx) * renderScale`

For every calibrated authoritative snap landmark, the required equality is:

`Oscreen + (visualSnapPx[snapId] - visualPivotPx) * renderScale`

approximately equals:

`projectWorldPoint(authoritativeSnapWorldPosition, sceneProjection)`

This is the core DDS-05A visual-alignment contract.

## 20. Existing Anchor Relationship

The current atlas anchor can still provide the initial pivot:

`visualPivotPx.x = frame.w * anchorX`

`visualPivotPx.y = frame.h * anchorY`

However this pivot must be treated as a candidate calibration value, not automatically assumed correct forever.

The footprint calibration can be implemented first using the existing pivot.

If calibrated snap residuals remain systematic after correct scale, pivot correction can then be reconciled separately.

## 21. Existing Atlas scale Field

Current runtime atlas `scale` values are `1`.

After geometric calibration, an independent arbitrary scale multiplier would break exact snap alignment.

Therefore future geometry must follow one of these rules:

- atlas `scale` remains `1`, or
- any non-1 asset scale is folded into the calibrated `assetPPU`

It must not be applied as an independent post-calibration visual tweak.

## 22. Category Calibration Coverage

### FLOOR

Sufficient authoritative geometry exists.

Recommended calibration landmarks include at least:

- `floor-west`
- `floor-east`
- `wall-south`
- `wall-north`

This permits checking both primary ground axes.

### WALL

Sufficient geometry exists:

- `base`
- `side`
- `top`

This permits horizontal and vertical proportion validation.

### CORNER

Sufficient geometry exists:

- `base`
- `side`
- `top`

### DOOR_OPENING

Sufficient geometry exists:

- `base`
- `side`
- `top`

### BEAM

Sufficient geometry exists:

- `base`
- `side`
- `top`

### ROOF

Insufficient internal authoritative span exists.

A separate roof presentation-footprint reference must later be defined or derived from an explicitly approved asset-generation/world-footprint contract.

No roof scale may be guessed from its 128×128 crop alone.

## 23. Calibration Data Must Remain Presentation-Only

Visual calibration metadata must not become DDS-04 authority.

It may describe:

- pixels-per-world calibration
- visual snap landmarks
- visual pivot
- frame identity

It must not redefine:

- snap compatibility
- authoritative snap positions
- placement transform
- occupancy
- construction connections
- stability
- Wolf response

## 24. Preferred Data Separation

The existing atlas manifest primarily describes:

- image
- crop rectangles
- anchors
- scale

The new world-footprint calibration is a separate semantic layer.

Preferred architecture:

**keep sprite-world calibration as DDS-05A presentation metadata separate from DDS-04 authority and separate from raw crop generation.**

The exact later file/sidecar location is intentionally deferred to the Implementation Scope Reconciliation.

This reconciliation does not create a new file yet.

## 25. Asset Compatibility Gate

A frame is geometrically compatible only if:

1. its direction/yaw is correct
2. its visual snap landmarks can be identified
3. one positive uniform `assetPPU` fits its calibrated pairs
4. residual misalignment after that uniform fit is acceptably small
5. no non-uniform warp is needed

If these conditions fail:

**the asset must be corrected rather than the world/snap authority.**

## 26. What TESTBUILD 3 Already Proves

TESTBUILD 3 proves enough to reject the following as primary fixes:

- changing world projection again to chase current sprite dimensions
- arbitrary per-instance pixel offsets
- arbitrary per-device sprite scale constants
- crop-only correction
- anchor-only correction
- reopening DDS-04C

The next correction must be based on explicit sprite/world calibration.

## 27. Framing Is a Separate Concern

When correctly world-scaled sprites become larger on larger scenes, overall construction framing may need later review.

That is separate from geometric correctness.

The application must not shrink individual pieces inconsistently just to keep them inside the viewport.

Camera/framing/scene-origin adaptation, if needed, requires its own later reconciliation.

## 28. Reconciliation Result

**DDS-05A – Sprite World Footprint / Snap-Visual Scale Reconciliation = DEFINED**

Resolved:

- world projection remains authoritative: YES
- fixed sprite scale 1 is geometrically sufficient: NO
- sprite scale must track `S`: YES
- exact formula: `renderScale = S / assetPPU`
- `assetPPU` may be guessed from crop size: NO
- explicit visual snap calibration required: YES
- uniform scale only: YES
- non-uniform warp: FORBIDDEN
- current anchor may remain initial pivot candidate: YES
- crop/anchor alone solve footprint: NO
- CSS 58×58 module container defines world size: NO
- DDS-04C reopened: NO
- ROOF fully calibratable from current snap data: NO
- implementation performed: NO

## 29. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Sprite World Footprint / Snap-Visual Scale – Implementation Scope Reconciliation**

That step must determine:

- the exact presentation calibration data structure/file location
- which runtime families/directions enter the first calibration pass
- how visual snap pixel landmarks are supplied/measured
- how `assetPPU` is validated
- which runtime/test files would later change
- how TESTBUILD progression is handled after real TB3 evidence

No implementation or asset edit may occur in that same step.
