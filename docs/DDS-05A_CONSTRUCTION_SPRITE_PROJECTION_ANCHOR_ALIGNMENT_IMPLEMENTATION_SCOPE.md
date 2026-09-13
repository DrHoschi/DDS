# DDS-05A – Construction Sprite Projection / Anchor Alignment – Implementation Scope Reconciliation

Status: **DEFINED / EXACT FILE SCOPE SET / NOT IMPLEMENTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Input reconciliation:

- `docs/DDS-05A_CONSTRUCTION_SPRITE_PROJECTION_ANCHOR_ALIGNMENT_RECONCILIATION.md`
- commit `1ea2d2c49360237a65b1ed014c3fd3fa570ac9d3`

Current real-device evidence state:

- `DDS-05A · TESTBUILD 2`
- `DDS-05A-TB2`
- real iPad evidence exists
- visual construction alignment = NOT PASS

## 1. Purpose

This step defines the exact later implementation surface and the exact presentation formulas needed to correct the TESTBUILD 2 alignment defect.

No runtime code, JSON, CSS or asset is changed by this document.

## 2. Implementation Strategy

The first alignment correction must solve the confirmed presentation defects in this order:

1. replace percentage-based world projection with one responsive pixel-space projection
2. use that same projection for committed modules, Ghosts and snap overlays
3. place snap-target buttons at the actual target snap world point
4. preserve current candidate sprite anchors unchanged for the first corrected build
5. re-test visually before changing atlas anchors or crops

This prevents asset edits from masking a projection defect.

## 3. TESTBUILD Progression

Because TESTBUILD 2 already has real iPad evidence, any presentation-runtime change must create a new test identity.

The later implementation is therefore required to deploy as:

**DDS-05A · TESTBUILD 3**

Technical build ID:

`DDS-05A-TB3`

TESTBUILD 2 evidence remains historical and must not be relabeled.

## 4. Exact Existing Files Authorized for Later Modification

Only these existing runtime/presentation files are required:

- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-04f/browser-app.mjs`
- `index.html`

Only these existing tests are required:

- `tests/dds-05a/sprite-presentation.test.mjs`
- `tests/dds-05a/testbuild-cache-busting.test.mjs`

No additional runtime file is currently justified.

## 5. Files Explicitly Not Required / Protected

The first projection/alignment fix must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04f/prototype.css`
- `src/dds-05a/atlas-loader.mjs`
- `assets/construction/dds-05a/candidate/construction-atlas.json`
- `assets/construction/dds-05a/candidate/construction-atlas.png`

No crop or anchor data is changed in this first correction.

## 6. Scene Projection Contract

DDS-05A must introduce a pure presentation helper equivalent to:

`createSceneProjection({ width, height })`

Input:

- actual rendered construction-scene width in CSS pixels
- actual rendered construction-scene height in CSS pixels

Both values must be finite and greater than zero.

### 6.1 Shared ground scale

The shared ground scale is:

`S = clamp(min(width / 16, height / 12), 24, 44)`

where:

`clamp(v, min, max) = min(max(v, min), max)`

This gives:

- small-phone lower bound: 24 px / world unit
- tablet/large-view upper bound: 44 px / world unit
- fixed projection ratio between device sizes

### 6.2 Projection origin

`originX = width * 0.50`

`originY = height * 0.70`

The authoritative world origin therefore stays centered horizontally and in the lower construction area vertically.

### 6.3 Vertical scale

`H = S`

No independent percentage-based vertical scale is allowed in this first fix.

## 7. Exact World → Screen Formula

For authoritative world position:

`P = { x, y, z }`

and scene projection:

`{ originX, originY, S, H }`

the pixel-space projection is:

`screenX = originX + (x - z) * S`

`screenY = originY + (x + z) * (S / 2) - y * H`

with `H = S`.

Therefore the fixed presentation vectors are:

- world `+X` → `(+S, +S/2)`
- world `+Z` → `(-S, +S/2)`
- world `+Y` → `(0, -S)`

This is the DDS-05A TESTBUILD 3 dimetric presentation contract.

It changes only screen presentation.

## 8. No Per-Point Clamping

The current browser helper clamps projected percentage coordinates.

The corrected pixel projection must **not clamp each module or snap point independently**.

Reason:

independent clamping changes relative geometry and can visually break an otherwise correct connection.

Instead:

- projection remains mathematically consistent
- `.construction-scene` continues to clip overflow visually
- responsive scale/origin are responsible for normal framing

No per-module "keep inside screen" offset is authorized.

## 9. Scene Metrics Source

`browser-app.mjs` must obtain scene dimensions from the actual rendered scene, using an equivalent of:

- `scene.getBoundingClientRect().width`
- `scene.getBoundingClientRect().height`

The same projection object from those dimensions must be used within one render pass for:

- committed modules
- Ghost
- target snap markers

No separate projection calculation may use different scene metrics during the same render.

## 10. Resize / Orientation Contract

Because projection now depends on actual pixel dimensions, DDS-05A must re-render when the construction scene size changes.

A narrow presentation-only `ResizeObserver` on the scene is authorized.

Its only responsibility:

- detect scene width/height change
- trigger a presentation re-render

It must not alter controller/construction state.

No global responsive subsystem is introduced.

## 11. Committed Module Position Contract

For every committed construction instance:

1. read authoritative `instance.transform.position`
2. project it with the current shared scene projection
3. set module container screen position in **pixels**
4. keep authoritative transform unchanged

Equivalent output usage:

- `left = screenX + "px"`
- `top = screenY + "px"`

Percentage positioning is removed for DDS-05A sprite-module world placement.

## 12. Ghost Position Contract

Ghost origin remains exactly:

`state.placement.ghostPreview.transform.position`

The Ghost uses the same scene projection as committed modules.

No extra Ghost offset is permitted.

## 13. Target Snap World Position Contract

A new pure presentation helper is authorized in:

`src/dds-05a/sprite-presentation.mjs`

Equivalent signature:

`snapWorldPosition(instanceTransform, snapPoint)`

It must reproduce only the world-point transformation needed for display.

Given:

- instance position `T = {tx, ty, tz}`
- instance scale `K = {kx, ky, kz}`
- instance Y rotation `r`
- snap local position `L = {lx, ly, lz}`

first scale:

`sx = lx * kx`

`sy = ly * ky`

`sz = lz * kz`

then rotate around Y:

`theta = r * PI / 180`

`rx = sx * cos(theta) - sz * sin(theta)`

`ry = sy`

`rz = sx * sin(theta) + sz * cos(theta)`

then translate:

`worldX = tx + rx`

`worldY = ty + ry`

`worldZ = tz + rz`

Return:

`{ x: worldX, y: worldY, z: worldZ }`

The helper is presentation-only and must not write state.

## 14. Snap Candidate Resolution Contract

For each existing UI target candidate, `browser-app.mjs` already has:

- `candidate.targetInstanceId`
- `candidate.targetSnapId`

The browser presentation must resolve:

1. target instance from `state.construction.instances`
2. matching target snap profile from `state.placement.snapProfiles` using target instance `definitionId`
3. target snap point using `candidate.targetSnapId`
4. actual target snap world position using `snapWorldPosition(...)`
5. screen point using the shared scene projection

The candidate selection key/request remains unchanged.

Only marker rendering position changes.

## 15. Snap Marker Semantics

After the correction, a green / recommended / selected snap button means:

**"This is the actual visible world position of the target snap point on the existing construction."**

It must no longer be positioned at:

`candidate.transform.position`

because that value is the incoming module origin.

## 16. Snap Resolution Failure

If a UI candidate references a target instance/profile/snap point that cannot be resolved for presentation:

- do not invent coordinates
- do not fall back to incoming module origin
- omit that marker from visual rendering
- optionally emit a diagnostic warning
- leave the authoritative candidate/controller state unchanged

This is presentation fail-safe behavior only.

## 17. Visual Pivot Contract – First Corrected Pass

The first alignment implementation does **not** change atlas anchor values.

Existing manifest anchors remain the active candidate pivot metadata.

For a frame:

- width = `frame.w`
- height = `frame.h`
- normalized anchor = `anchorX, anchorY`

the visual pivot in frame pixels is defined as:

`pivotX = frame.w * anchorX`

`pivotY = frame.h * anchorY`

The renderer must place the sprite so that this pivot lands exactly on the projected authoritative module origin.

Current examples remain unchanged:

- WALL/DOOR/CORNER generally `0.5 / 1`
- FLOOR generally `0.5 / 0.85`

## 18. Pivot Scaling Rule

Sprite `scale` remains presentation metadata.

Scaling must occur around the visual pivot.

Therefore changing sprite scale must not move the pivot away from the projected module origin.

No additional per-category offset is authorized.

## 19. spriteDescriptor Scope

`spriteDescriptor()` may continue to resolve:

- frame key
- frame rectangle
- anchor metadata
- scale
- image URL
- image dimensions
- depth

Its current internally derived `point` must either:

- be removed, or
- require/use the explicit current scene projection

It must not retain a hidden default percentage projection.

Preferred contract:

**projection is centralized outside spriteDescriptor and descriptor no longer owns module screen position.**

## 20. Depth Contract

`renderDepth()` remains unchanged in behavior for this first fix.

Depth remains presentation-only and continues to derive from authoritative world transform plus stable ID tie-breaker.

No depth-authority redesign is authorized.

## 21. Yaw / Direction Contract

The existing mapping remains unchanged:

- 0° → `s`
- 90° → `e`
- 180° → `n`
- 270° → `w`

TESTBUILD 3 will evaluate it visually after positional alignment improves.

No yaw mapping correction is included in this implementation scope.

## 22. Atlas Asset Contract

TESTBUILD 3 uses the exact existing TESTBUILD 2 candidate atlas package.

No changes to:

- frame rectangles
- anchors
- scales
- image
- additional asset entries

The only new atlas request difference is the normal cache identity progression to:

`DDS-05A-TB3`

The atlas loader behavior remains unchanged.

## 23. TESTBUILD 3 Cache / Identification Scope

Because runtime presentation code changes, implementation must update:

### index.html

- visible label → `DDS-05A · TESTBUILD 3`
- technical metadata → `DDS-05A-TB3`
- CSS URL query → TB3
- browser-app URL query → TB3

### browser-app.mjs

- expected build ID → `DDS-05A-TB3`
- DDS-05A module import queries → TB3
- atlas manifest request inherits active TB3

### tests

- cache/build expectations → TB3

The atlas JSON/PNG content remains unchanged but is requested with TB3.

## 24. Exact Later Diff Boundary

The later implementation is authorized to target only:

### Existing runtime files

1. `src/dds-05a/sprite-presentation.mjs`
2. `src/dds-04f/browser-app.mjs`
3. `index.html`

### Existing test files

4. `tests/dds-05a/sprite-presentation.test.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No sixth runtime/test file is currently required.

## 25. Required Tests

The later implementation must prove at minimum:

### Projection

1. `800×600` scene:
   - `S = 44`
   - origin = `(400, 420)`
   - +X projects by `(+44, +22)`
   - +Z projects by `(-44, +22)`
   - +Y projects by `(0, -44)`

2. `360×360` scene:
   - `S = 24`
   - origin = `(180, 252)`
   - fixed vector ratio remains 2:1

### Snap world point

3. yaw 0°, unit scale, local snap `{0,0,1.3}`
   projects to world snap `{0,0,1.3}`

4. yaw 90°, unit scale, local snap `{0,0,1.3}`
   produces approximately `{-1.3,0,0}`

5. non-unit scale is applied before rotation

### Authority safety

6. projection helper does not mutate input position
7. snap-world helper does not mutate transform/snap input
8. candidate key/request remains unchanged by marker rendering
9. DDS-04 protected files unchanged

### Build identity

10. visible label = TESTBUILD 3
11. all cache-sensitive active references = `DDS-05A-TB3`
12. no active TB2 reference remains in runtime/testbuild identity files

## 26. Device Verification Requirement After Implementation

The first real TESTBUILD 3 device check must compare against TESTBUILD 2 specifically for:

- floor-to-wall visual distance
- door-to-wall visual connection
- wall/corner adjacency
- snap marker placement on actual visible connection point
- Ghost alignment
- iPad layout preservation
- iPhone layout preservation

Only after that evidence may we decide whether atlas anchor corrections are still necessary.

## 27. Explicit Exclusions

This implementation scope does not authorize:

- atlas JSON edits
- PNG edits
- crop edits
- anchor edits
- scale edits
- yaw mapping edits
- DDS-04C changes
- controller changes
- CSS layout changes
- new module categories
- new snap semantics
- Completion/Freeze decision

## 28. Scope Result

**DDS-05A – Construction Sprite Projection / Anchor Alignment – Implementation Scope Reconciliation = DEFINED**

Exact decisions:

- projection unit: CSS pixels
- responsive ground scale: `clamp(min(width/16, height/12), 24, 44)`
- projection origin: `50% width / 70% height`
- dimetric vectors: `(+S,+S/2)`, `(-S,+S/2)`, `(0,-S)`
- point clamping: FORBIDDEN
- target snap marker source: actual target snap world point
- Ghost source: authoritative Ghost transform
- pivot first pass: existing normalized atlas anchors
- per-piece visual offsets: FORBIDDEN
- atlas changes in first fix: NONE
- next test identity: **DDS-05A · TESTBUILD 3 / DDS-05A-TB3**
- exact later modified files: 5

## 29. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Construction Sprite Projection / Anchor Alignment – Implementation Authorization**

That authorization may permit only the five-file diff and formulas defined here.

No implementation may occur in the same authorization step.
