# DDS-04F – Construction View / Isometric Presentation – Implementation Scope Reconciliation

Status: **DEFINED / IMPLEMENTATION SCOPE FIXED / NO IMPLEMENTATION IN THIS STEP / DDS-04G NOT AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Upstream presentation contract:

- `docs/DDS-04F_CONSTRUCTION_VIEW_ISOMETRIC_PRESENTATION_RECONCILIATION.md`
- status: DEFINED / PRESENTATION CONTRACT FIXED / NOT IMPLEMENTED

## 1. Scope Objective

This step defines the exact implementation boundary for converting the current technical DDS-04F scene into the reconciled fixed 2.5D isometric-style construction presentation.

No implementation is authorized in this step.

The implementation must remain presentation-only and must not alter DDS-04B/C/D/E authority.

## 2. Chosen First Rendering Technique

The first implementation shall use:

**DOM + CSS + lightweight inline SVG / CSS polygon geometry**

It shall not use pre-rendered 2.5D sprite sheets as the first implementation.

Reason:

- deterministic projection can be tested directly against authoritative transforms
- module rotations remain inspectable
- material skins can be switched without generating 72+ asset variants
- Ghost / selected / invalid states can reuse the same geometry
- snap markers can be anchored to projected world positions
- iPad responsiveness remains easy to inspect
- artwork can later replace the geometry without changing the projection contract

Canvas is not required for the first implementation.

A future asset-rendered implementation remains replaceable.

## 3. Explicitly Deferred Rendering Techniques

Not part of the first implementation:

- WebGL
- Three.js
- Babylon.js
- Canvas scene engine
- imported GLB / FBX
- prerendered sprite atlas
- physics-render integration
- free 3D camera

These require separate authorization if later needed.

## 4. Current Rendering Functions to Replace / Extend

### `src/dds-04f/browser-app.mjs`

The following current functions are presentation-specific and are inside scope:

#### Replace

- `scenePoint(position)`
  - current ad-hoc projection must be replaced by one shared dimetric projection function

- `makeModule(...)`
  - current glyph-box rendering must be replaced by category-specific 2.5D geometry

- `makeSnapTarget(...)`
  - current marker center from Ghost transform must be replaced by true projected target-snap world position

#### Extend

- `renderScene(state)`
  - sort modules deterministically by projected depth
  - render environment/build plot layer
  - render modules in depth order
  - render world-anchored snap targets
  - render Ghost from the same module renderer
  - preserve module selection touch behavior

#### May add presentation helpers

Examples:

- `projectWorld(position, sceneMetrics)`
- `rotateLocalPoint(point, rotationY)`
- `moduleRenderKey(instance)`
- `worldPointForSnap(instance, snapPoint)`
- `makeModuleGeometry(instance, options)`
- `makeFloorGeometry(...)`
- `makeWallGeometry(...)`
- `makeCornerGeometry(...)`
- `makeDoorGeometry(...)`
- `makeRoofGeometry(...)`
- `makeBeamGeometry(...)`
- `applyMaterialVisual(...)`

Exact names are implementation details.

## 5. Projection Module Decision

The fixed dimetric projection should not remain embedded only inside `browser-app.mjs`.

A new presentation-only module is authorized:

`src/dds-04f/isometric-view.mjs`

It may contain only presentation mathematics / render metadata, such as:

- `projectWorldPoint`
- `rotateGroundPoint`
- `projectSnapWorldPoint`
- `renderDepthKey`
- presentation constants / baseline scale

It must not:

- mutate Construction State
- call placement commit APIs
- create connection identity
- decide occupancy
- decide snap compatibility
- calculate Stability
- calculate Wolf force

## 6. Module Visual Technique

Each building piece shall be represented by DOM/SVG/CSS faces rather than a single symbol.

The first implementation may use:

- `div` wrappers
- nested face elements
- inline `svg`
- CSS `clip-path: polygon(...)`
- CSS transforms only for visual faces

The authoritative world transform is projected first.

CSS face transforms may shape the visual object but may not offset the authoritative object anchor.

## 7. Minimum Geometry Per Category

### FLOOR

Required minimum geometry:

- top diamond/parallelogram face
- front thickness face
- side thickness face

No external image asset required.

### WALL

Required minimum geometry:

- main vertical panel
- visible side thickness
- top edge/cap
- ground-contact/base line

### CORNER

Required minimum geometry:

- two perpendicular wall planes
- visible corner join

### DOOR_OPENING

Required minimum geometry:

- wall/frame outer geometry
- transparent/empty center opening
- lintel/top frame
- two side posts

### ROOF

Required minimum geometry:

- two sloped roof faces
- ridge
- visible thickness/edge

### BEAM

Required minimum geometry:

- elongated rectangular prism
- top/side/front faces sufficient to show orientation

No production detail is required.

## 8. Rotation Implementation Boundary

0° / 90° / 180° / 270° remain the only rotations.

The renderer must visually rotate category geometry based on authoritative `transform.rotation.y`.

Implementation may either:

1. rotate local geometry points before projection, or
2. choose between four deterministic face-layout variants.

Preferred first approach:

**rotate local geometry points before projection**

because it preserves one geometry definition per category.

No category-specific arbitrary screen rotation is allowed.

## 9. Material Visual Implementation

Material remains applied as presentation skin classes / CSS variables.

Authorized classes:

- `.material-straw`
- `.material-wood`
- `.material-stone`

or equivalent data attributes.

Minimum visual differentiation:

### STRAW

- gold/yellow base
- layered/bundle line texture

### WOOD

- brown base
- plank/grain lines

### STONE

- gray base
- masonry/block pattern

No external image textures are required for the first implementation.

## 10. Ghost Reuse Contract

The same category renderer used for committed modules must render Ghost modules.

Ghost variation is limited to presentation overlays:

- opacity
- outline
- glow
- material tint
- valid / invalid color state

There must not be a separate Ghost geometry that can drift from committed geometry.

## 11. Snap-Point Rendering Data Requirement

Current target candidates contain:

- target instance id
- target snap id
- source snap id
- placement transform

The new world-anchored marker needs the actual target snap local position.

This information already exists in DDS-04C `snapProfiles`.

DDS-04F may derive the marker world point by combining:

- target instance authoritative transform
- target snap local position
- target instance rotation
- shared projection function

No DDS-04C source change is required.

## 12. Snap-Point Calculation Boundary

Presentation computation may do:

1. find target instance
2. find its DDS-04C snap profile
3. find target snap local position
4. rotate local snap offset by target instance Y rotation
5. add offset to authoritative target instance position
6. project resulting world point

This is visual position reconstruction only.

It must not decide whether the snap is valid.

Validity still comes only from DDS-04C candidate enumeration.

## 13. Draw-Order Implementation

`renderScene(state)` must render committed modules in deterministic presentation order.

Authorized depth inputs:

- projected / authoritative position
- instance id tie-breaker

Minimum stable ordering:

1. ascending `x + z`
2. ascending `y`
3. stable lexical instance id

The renderer may refine vertical face ordering internally, but module authority order is presentation-only.

## 14. Scene Origin / Scale

The first implementation may use presentation metrics derived from the central scene element.

Authorized inputs:

- element width
- element height
- reference iPad baseline

Initial baseline:

- `S = 44`
- `H = 44`

Responsive scale may be:

- clamped based on scene width/height
- shared by modules, Ghosts and snap projection

The 2:1 ground projection ratio remains fixed.

## 15. Build Plot Layer

`src/dds-04f/browser-app.mjs` / CSS may replace the current generic ground ellipse with a visual build plot using:

- isometric ground diamond
- subtle platform/foundation area
- decorative grass around it

No build-area gameplay rule is introduced.

## 16. Background / Environment Decision

The first implementation shall **not require an external generated background image**.

Use CSS/SVG placeholder environment first:

- soft grass field
- path patches
- simple fence/tree silhouettes if useful
- visual depth background

Reason:

- house readability must be validated before artwork investment
- generated background must not hide projection errors

A later asset pass may replace this environment after the geometry is approved.

## 17. Schweinchen / Wolf Asset Decision

No new pig or Wolf image asset is required for this first isometric implementation.

Optional presentation placeholders may be simple silhouettes/badges only if they do not distract.

The first implementation priority is:

1. building geometry
2. Ghost
3. snap placement
4. materials
5. UI piece palette

Character presentation comes later.

## 18. Bottom Piece Palette Scope

The existing six bottom buttons remain.

Inside scope:

- replace abstract glyphs with small CSS/SVG isometric previews of the same six module geometries
- reuse category geometry definitions where practical
- preserve labels
- preserve selection state

No additional category is added.

## 19. Material Control Scope

Existing left-side material controls remain structurally intact.

Inside scope:

- improve material icon/pattern presentation with CSS/SVG
- keep labels
- keep current authoritative behavior

No new material is added.

## 20. Existing HTML Scope

### `index.html`

May be minimally extended only if needed for:

- additional scene presentation container/layers
- clearer piece thumbnail wrappers
- presentation accessibility labels

The broad layout structure remains:

- top
- material left
- scene center
- actions right
- pieces bottom on iPad

A wholesale page-layout rewrite is not in scope.

## 21. CSS Scope

### `src/dds-04f/prototype.css`

Inside scope:

- replace current generic module-box styles
- add category-specific isometric face styles
- add material skin styles
- add Ghost styles compatible with new geometry
- add true world-anchored snap marker presentation
- improve build plot / background
- improve bottom thumbnail presentation
- preserve iPad/iPhone responsive contracts
- preserve touch target sizes

No production brand system is required.

## 22. Controller Scope

### `src/dds-04f/construction-ui-controller.mjs`

**Default: DO NOT MODIFY**

Reason:

- it already exposes authoritative construction snapshot
- manual target candidates
- selected/recommended target state
- placement / material / Wolf-Test behavior

A controller change is allowed only if implementation proves that immutable presentation metadata already available from DDS-04C is not exposed sufficiently for snap-marker world reconstruction.

Before changing controller behavior, implementation must prefer deriving from:

- `state.construction`
- `state.placement.snapProfiles`
- `state.ui.targetSelection`

No interaction semantics may change.

## 23. Tests Scope

### Existing tests to preserve

- `tests/dds-04f/construction-ui-controller.test.mjs`
- `tests/dds-04f/responsive-contract.test.mjs`

Existing manual-target tests must remain PASS.

### New authorized test file

`tests/dds-04f/isometric-view.test.mjs`

It should verify at minimum:

- +x projects down-right
- +z projects down-left
- +y projects upward
- 2:1 ground projection ratio
- rotation of local offsets at 0/90/180/270
- deterministic projection
- deterministic depth key
- snap local position → world point
- no mutation of input data

### Responsive tests may be extended for

- new scene-layer classes
- new piece thumbnail classes
- new material visual classes
- no hover dependency

## 24. Minimum External Assets Required

**None.**

The first implementation must be able to run with zero new binary image assets.

This is intentional.

It allows the presentation system to be validated before AI-generated/background/module artwork is introduced.

## 25. Optional Later Assets – Explicitly Deferred

Not part of this implementation:

- countryside background PNG/WebP
- pig sprites
- Wolf sprite
- production material textures
- production module sprites
- shader assets
- animation atlas

These may be a later visual asset block after the procedural geometry passes real-device verification.

## 26. Files Authorized to Change

Primary implementation files:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`

Authorized new files:

- `src/dds-04f/isometric-view.mjs`
- `tests/dds-04f/isometric-view.test.mjs`

Conditional/minimal:

- `index.html`
- `tests/dds-04f/responsive-contract.test.mjs`

Controller:

- `src/dds-04f/construction-ui-controller.mjs`
  - **DO NOT MODIFY unless presentation data cannot be derived from existing snapshots**
  - no behavior change allowed

## 27. Files Explicitly Untouched

The implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`

No test belonging to DDS-04B/C/D/E may be weakened or rewritten.

No DDS-04G file may be created.

No character Identity Master / reference asset may be modified.

## 28. Authority Preservation

The new render layer consumes authoritative state.

It does not become authoritative.

Specifically:

- module screen position ≠ committed transform
- CSS/SVG face orientation ≠ authoritative rotation
- snap marker position ≠ snap validity
- visual material pattern ≠ material assignment
- visual fall/tilt cue ≠ DDS-04E result authority

The authoritative source remains DDS-04B/C/D/E.

## 29. First Implementation Deliverable

The first implementation is considered technically complete only when the running iPad prototype shows:

- fixed coherent three-quarter 2.5D scene
- real readable floor pieces
- real readable walls
- readable corners
- door openings
- roofs
- beams
- visible material differences
- coherent module rotation
- Ghost identical in form to final part
- snap markers attached to module geometry
- manual target selection still works
- module overlap/depth visually coherent
- Wolf-Test displacement remains coherent

It does not need production artwork.

## 30. Implementation Scope Result

**DDS-04F CONSTRUCTION VIEW / ISOMETRIC PRESENTATION IMPLEMENTATION SCOPE = RECONCILED**

Chosen implementation:

- DOM/CSS + lightweight SVG/CSS geometry
- new shared `isometric-view.mjs`
- no external binary assets
- no Canvas/WebGL
- no DDS-04B/C/D/E source changes
- controller behavior preserved
- current responsive shell preserved
- procedural geometry first, artwork later

## Next Admissible Step

The next admissible step is exclusively:

**DDS-04F – Construction View / Isometric Presentation – Implementation Authorization**

That step authorizes only this exact reconciled implementation scope.

No code implementation may occur in the authorization step.

DDS-04G remains unauthorized.
