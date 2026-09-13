# DDS-05A – Construction Sprite Projection / Anchor Alignment Reconciliation

Status: **DEFINED / ROOT CAUSES SEPARATED / NOT IMPLEMENTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Current TESTBUILD:

- visible: `DDS-05A · TESTBUILD 2`
- technical: `DDS-05A-TB2`
- implementation commit: `7049ac8dfbe7d14180e5988f8316d8728c38286f`

Real-device evidence:

- iPad screenshot with visible `DDS-05A · TESTBUILD 2`
- sprite runtime active
- responsive layout stable
- visual construction alignment not yet acceptable

## 1. Purpose

This reconciliation determines why authoritative connected construction modules do not yet appear as one visually connected structure.

The analysis is limited to:

- world-to-screen projection
- sprite anchor/pivot interpretation
- snap-target overlay projection
- interaction between those presentation layers

No code, JSON, crop, anchor or layout changes are performed in this step.

## 2. Observed TESTBUILD 2 Evidence

The real iPad screenshot shows:

- wall / door / floor sprites render successfully
- sprites are individually recognizable
- no fallback glyph rendering is visible
- TESTBUILD 2 identity is visible
- the responsive three-column iPad layout remains intact
- authoritative placement continues to work
- connected modules are visually separated
- the floor appears significantly offset from the wall group
- the door appears in front of rather than visually integrated with the connected wall region
- a valid snap marker appears well below the visible construction

This evidence proves that the problem is no longer primarily stale caching.

## 3. Authoritative Placement State Is Not Reopened

DDS-04C remains authoritative for snap placement.

Current DDS-04C computes the incoming authoritative transform from:

- target instance transform
- target snap local position
- target yaw
- source snap local position
- source rotation

The resulting candidate transform is then committed unchanged by placement.

This reconciliation finds no evidence that DDS-04C must be changed to solve the visual misalignment.

Therefore:

**DDS-04C remains protected.**

## 4. Root Cause A – Percentage Projection vs Pixel Sprite Geometry

Current DDS-05A projection:

`projectWorldPoint()`

uses:

- `originX = 50`
- `originY = 70`
- `groundScale = 8`
- `verticalScale = 12`

and returns values interpreted by `browser-app.mjs` as percentages:

- `left = point.x + "%"`
- `top = point.y + "%"`

At the same time, sprite frames render at fixed pixel dimensions such as:

- WALL around 70×110 px for some views
- FLOOR around 100×100 px for some views
- other views around 120–128 px

Therefore the current scene mixes:

**percentage world spacing**

with:

**fixed-pixel sprite geometry**

This causes visual distance between connected module origins to depend on scene width/height, while sprite size does not scale by the same world-unit rule.

This is a primary cause of visible separation.

### Reconciliation decision

DDS-05A must move to one coherent presentation metric.

The preferred next implementation contract is:

**world-unit → pixel projection derived from actual scene dimensions**

rather than returning percentage coordinates directly.

The projection may remain responsive, but it must use one shared pixel scale for:

- committed modules
- Ghost module
- snap overlays

The authoritative world transform remains unchanged.

## 5. Root Cause B – Non-Isometric X/Y Scene Scaling

Current projection applies:

- x contribution to horizontal position using scene width percentages
- x/z contribution to vertical position using scene height percentages

Because the scene is not square, one "8%" horizontal step and one "4%" vertical step correspond to different pixel magnitudes.

Therefore the intended dimetric relationship changes with scene aspect ratio.

This makes the current 2.5D projection visually unstable across:

- iPad
- iPhone
- different viewport sizes

### Reconciliation decision

The corrected presentation projection must define its geometry in pixels after reading the scene bounds.

A shared ground-unit scale must produce deterministic screen vectors such as:

- world +X → fixed pixel vector A
- world +Z → fixed pixel vector B
- world +Y → fixed vertical pixel vector

Those vectors may be scaled responsively from scene size, but their ratio must remain fixed.

## 6. Root Cause C – Crop-Relative Anchors Move the Visible Footpoint

Current atlas metadata uses anchors such as:

- WALL: `anchorX = 0.5`, `anchorY = 1`
- DOOR: `0.5 / 1`
- CORNER: `0.5 / 1`
- FLOOR: `0.5 / 0.85`

The renderer applies these anchors relative to the **current cropped frame width/height**.

TESTBUILD 1 → TESTBUILD 2 crop refinements changed multiple frame rectangles.

When a crop becomes tighter or shifts inside the atlas while anchor fractions remain unchanged, the world origin effectively attaches to a different visible pixel.

Therefore crop refinement alone can change where the sprite visually "stands" even if authoritative transform is identical.

### Reconciliation decision

DDS-05A needs an explicit **visual pivot contract**.

The later implementation must distinguish:

- crop rectangle = which pixels are sampled
- visual pivot = which pixel inside that crop corresponds to authoritative module origin

A normalized anchor may remain valid only if visually verified per frame/family.

Otherwise the candidate manifest must later support a more precise pivot representation.

No anchor values are changed in this reconciliation.

## 7. Root Cause D – Current Snap Buttons Use Incoming Module Origin

Current `makeSnapTarget(candidate, selection)` does:

`scenePoint(candidate.transform.position)`

But `candidate.transform.position` is the calculated **origin position of the incoming module**.

It is not the actual world position of:

- target instance snap point
- visible connection point on the existing module

Therefore the green / recommended / selected marker does not currently mean:

"this exact visible point on the existing module is the target snap"

Instead it means approximately:

"the incoming module origin would be placed here"

That explains why a valid marker can appear visually detached from the existing structure.

### Reconciliation decision

Snap-target overlay presentation must later use the actual **target snap world position**.

That world point can be derived presentation-side from existing frozen snapshot data:

- `candidate.targetInstanceId`
- `candidate.targetSnapId`
- target instance transform
- target snap profile local position
- target instance rotation/scale

No DDS-04C authority change is needed.

The button still selects the same candidate key/request.

Only its visual screen position changes.

## 8. Ghost Position Rule

The Ghost sprite must continue to use:

`ghostPreview.transform.position`

because that is the authoritative incoming module origin.

However the visible Ghost artwork must be aligned around that origin through the corrected visual pivot.

Therefore:

- Ghost transform source = unchanged DDS-04C candidate transform
- Ghost visual anchor/pivot = DDS-05A presentation responsibility
- Ghost snap marker = actual target snap world point, not Ghost origin

## 9. Committed Module Position Rule

Committed sprites continue to use their authoritative module transforms.

No per-instance arbitrary screen offsets may be introduced to "make the screenshot look right."

Any alignment correction must come from one of:

- corrected common world→screen projection
- verified sprite pivot metadata
- actual snap-point overlay projection

This avoids hidden per-piece hacks.

## 10. Required Presentation-Side Snap World Calculation

The later implementation may add a pure DDS-05A helper that computes:

`targetSnapWorldPosition(instanceTransform, snapPoint)`

using the same transform principles already defined by DDS-04C:

- local snap position
- instance scale
- Y rotation
- instance world position

The helper is display-only.

It must be covered by tests against known DDS-04C examples.

DDS-04C source remains untouched.

## 11. Direction Mapping Status

The current yaw mapping:

- 0 → s
- 90 → e
- 180 → n
- 270 → w

is not proven wrong by the current screenshot.

The dominant visual defect is positional alignment, not conclusively orientation selection.

Therefore:

**yaw→direction correction is NOT authorized by this reconciliation.**

It remains a later visual verification item.

## 12. Crop Status

The current TESTBUILD 2 crops appear materially cleaner than the original atlas-grid state.

The screenshot does not provide enough evidence to declare all crops correct.

However the main structure-separation defect cannot be solved safely by further crop trimming alone.

Therefore:

**no further crop correction should be used as the first fix for this alignment problem.**

Projection/pivot/snap-overlay alignment must be corrected first.

## 13. Proposed Presentation Contract

The next implementation scope should establish:

### A. Scene metric

Read actual scene dimensions and derive a responsive but fixed-ratio pixel projection.

### B. Module origin projection

All committed modules and Ghosts use the same world→screen pixel projection.

### C. Visual pivot

Each sprite frame is placed so its verified pivot sits exactly on the projected module origin.

### D. Snap overlay point

Snap target marker is projected from the actual target snap world position.

### E. Depth

Depth order continues to derive from authoritative world position and remains presentation-only.

## 14. Likely File Scope for Later Implementation

Potential files:

- `src/dds-05a/sprite-presentation.mjs`
  - corrected projection contract
  - display-only target-snap world helper
  - optional visual-pivot helper

- `src/dds-04f/browser-app.mjs`
  - use pixel projection relative to scene bounds
  - position modules/Ghost with shared projector
  - position snap buttons from actual target snap point

- `tests/dds-05a/sprite-presentation.test.mjs`
  - projection vector tests
  - target snap world position tests
  - no-authority-mutation tests

Potential candidate JSON changes:

- only if device evidence after projection correction proves current anchors still incorrect

Candidate JSON anchor changes are **not yet part of the first recommended implementation pass**.

## 15. Explicitly Protected

No later alignment implementation should modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`

No new snap semantics are needed.

## 16. Explicit Exclusions

This reconciliation does not authorize:

- implementation
- crop edits
- anchor edits
- yaw mapping edits
- module category changes
- snap contract changes
- DDS-04 changes
- CSS layout redesign
- device-gate completion
- freeze

## 17. Reconciliation Result

**DDS-05A – Construction Sprite Projection / Anchor Alignment Reconciliation = DEFINED**

Root-cause classification:

- stale cache: NOT PRIMARY
- DDS-04C authoritative snap math: NOT REOPENED
- percent projection vs fixed-pixel sprite size: **PRIMARY ROOT CAUSE**
- aspect-ratio-dependent percentage geometry: **PRIMARY ROOT CAUSE**
- crop-relative visual anchor drift: **SECONDARY ROOT CAUSE**
- snap marker using incoming-module origin instead of target snap point: **CONFIRMED PRESENTATION DEFECT**
- yaw mapping: NOT YET PROVEN WRONG
- crop rectangles: NOT SUFFICIENT AS FIRST FIX

## 18. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Construction Sprite Projection / Anchor Alignment – Implementation Scope Reconciliation**

That step must determine the exact later file diff and the precise pixel-projection / snap-overlay / pivot contract.

No code or asset change may occur in that same step.
