# DDS-04F – Construction View / Isometric Presentation – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED / DDS-04G NOT AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Authority chain:

- DDS-04F – Child-Readable Construction UI & Responsive Prototype – Implementation Authorization
- DDS-04F – Manual Placement / Snap Target Selection Reconciliation
- DDS-04F – Construction View / Isometric Presentation Reconciliation
- DDS-04F – Construction View / Isometric Presentation – Implementation Scope Reconciliation

## 1. Authorized Block

This document authorizes implementation of exactly:

**DDS-04F – Construction View / Isometric Presentation**

No other DDS-04F capability extension and no DDS-04G capability is authorized by this document.

## 2. Authorized Objective

Replace the current technical DDS-04F scene presentation with the already-reconciled fixed 2.5D isometric-style construction presentation while preserving all existing DDS-04B/C/D/E authority and the already-implemented manual snap-target interaction.

The implementation is presentation-only.

## 3. Authorized Projection Contract

The implementation must use the reconciled fixed orthographic dimetric 2:1 projection.

World convention remains:

- `x` = ground-plane axis 1
- `z` = ground-plane axis 2
- `y` = vertical height

Shared presentation projection:

`screenX = OX + (x - z) * S`

`screenY = OY + (x + z) * (S / 2) - y * H`

Prototype baseline:

- `S = 44`
- `H = 44`

Responsive scaling may adjust `S` and `H` together.

The ground projection ratio remains 2:1.

## 4. Authorized Rendering Technique

The first implementation is authorized to use:

**DOM + CSS + lightweight inline SVG / CSS polygon geometry**

Authorized:

- DOM wrappers
- inline SVG
- CSS `clip-path`
- CSS presentation transforms
- CSS material skins
- deterministic presentation helpers

Not authorized:

- Canvas scene engine
- WebGL
- Three.js
- Babylon.js
- imported GLB / FBX
- pre-rendered production sprite atlas
- free 3D camera

## 5. Authorized New Presentation Module

The following new file is authorized:

`src/dds-04f/isometric-view.mjs`

It may contain presentation-only helpers such as:

- world-to-screen projection
- local ground rotation
- snap world-point reconstruction
- deterministic render-depth calculation
- presentation metrics/constants

It must not mutate or replace DDS-04B/C/D/E authority.

## 6. Authorized Renderer Changes

### `src/dds-04f/browser-app.mjs`

Authorized to replace / extend the current presentation functions, including:

- current ad-hoc `scenePoint(...)`
- current glyph-box `makeModule(...)`
- current Ghost-position-based `makeSnapTarget(...)`
- current `renderScene(...)` presentation ordering/layers

The implementation may add category-specific geometry helpers and material-presentation helpers.

No authoritative placement or structural decision may move into this file.

## 7. Authorized Module Geometry

Exactly these six existing module categories may receive new procedural 2.5D presentation geometry:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

Minimum visual forms remain those defined by the reconciled presentation contract.

No additional module category is authorized.

## 8. Authorized Rotation Presentation

The renderer may visually represent exactly:

- 0°
- 90°
- 180°
- 270°

Preferred implementation:

- rotate local module geometry before projection

No free-angle rotation is authorized.

The visual rotation must remain derived from the authoritative module transform / DDS-04C Ghost transform.

## 9. Authorized Material Presentation

DDS-04F may visually skin modules as:

- STRAW
- WOOD
- STONE

Using CSS/SVG presentation patterns only.

No new material authority or material type is authorized.

Mixed-material construction must remain visually possible.

## 10. Ghost Presentation Authorization

The same category geometry used for committed modules must be reused for Ghost rendering.

Authorized Ghost differences:

- opacity
- edge/outline
- glow
- valid/invalid tint

Ghost geometry must not become independent from committed module geometry.

The Ghost transform remains DDS-04C-authoritative.

## 11. Snap Marker Authorization

DDS-04F may reconstruct a target snap marker world position using:

1. authoritative target instance transform
2. DDS-04C snap profile
3. target snap local position
4. target instance Y rotation
5. the shared dimetric projection

This is presentation-only.

Snap validity remains exclusively DDS-04C-authoritative.

The already-implemented states remain required:

- automatic recommended target
- other valid target
- manually selected target
- invalid selected target

## 12. Manual Snap-Target Interaction Preservation

The existing DDS-04F manual target-selection behavior is explicitly protected.

Implementation must preserve:

- automatic first valid recommendation
- multiple visible valid targets
- manual target selection
- target lock
- same-target rotation revalidation
- invalid placement fail-safe
- candidate regeneration after placement
- candidate regeneration after undo
- candidate regeneration after Wolf-Test

This authorization does not permit changing the interaction semantics.

## 13. Authorized Draw Order

DDS-04F may compute deterministic presentation draw order from:

1. `x + z`
2. `y`
3. stable instance-id tie-breaker

This ordering remains presentation-only.

It must not mutate construction state.

## 14. Authorized Scene Presentation

DDS-04F may replace the current generic ground presentation with:

- fixed isometric-style build plot
- simple grass/background layers
- minimal decorative CSS/SVG environment

No build-boundary gameplay rule is authorized.

No external generated background image is required in this implementation.

## 15. Authorized Bottom Palette / Material UI Presentation

The existing six piece controls may receive improved 2.5D procedural previews.

The existing three material controls may receive improved CSS/SVG material iconography.

Existing labels, selection semantics and authority flow must remain intact.

## 16. Authorized CSS Scope

### `src/dds-04f/prototype.css`

Authorized changes include:

- category-specific 2.5D face styles
- material presentation skins
- Ghost presentation
- world-anchored snap-marker appearance
- build plot / environment presentation
- piece thumbnail presentation
- responsive scene scaling

Existing touch usability and responsive shell behavior must remain preserved.

## 17. Existing HTML Boundary

### `index.html`

May be changed minimally only if needed for:

- presentation layers
- palette preview wrappers
- accessibility labels

A wholesale page-layout redesign is not authorized.

The broad iPad composition remains:

- title/status top
- materials left
- scene center
- actions right
- piece palette bottom

## 18. Controller Boundary

### `src/dds-04f/construction-ui-controller.mjs`

**DO NOT MODIFY by default.**

A change is permitted only if presentation metadata required for world-anchored snap rendering cannot be derived from the already-exposed snapshots.

Any such change must:

- expose immutable presentation data only
- not alter placement behavior
- not alter target-selection semantics
- not alter authority boundaries

If the presentation can be implemented from current snapshots, the controller must remain unchanged.

## 19. Authorized Tests

Existing tests must remain PASS:

- `tests/dds-04f/construction-ui-controller.test.mjs`
- `tests/dds-04f/responsive-contract.test.mjs`

Authorized new test file:

- `tests/dds-04f/isometric-view.test.mjs`

It must cover at minimum:

- +x projects down-right
- +z projects down-left
- +y projects upward
- 2:1 ground projection
- 0/90/180/270 local rotation
- deterministic projection
- deterministic depth ordering
- snap local point → world/projected point
- no input mutation

Responsive-contract tests may be extended only for the new presentation classes/contracts.

## 20. Authorized Files to Change

Primary:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`

Authorized new files:

- `src/dds-04f/isometric-view.mjs`
- `tests/dds-04f/isometric-view.test.mjs`

Conditional/minimal:

- `index.html`
- `tests/dds-04f/responsive-contract.test.mjs`

Conditional controller file:

- `src/dds-04f/construction-ui-controller.mjs`
  - only if immutable presentation metadata exposure proves necessary
  - no behavior change permitted

## 21. Files Explicitly Not Authorized to Change

The implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`

It must not weaken or rewrite DDS-04B/C/D/E tests.

It must not create DDS-04G implementation files.

It must not modify frozen character Identity Master / reference assets.

## 22. Explicitly Not Authorized

This authorization does not permit:

- free camera rotation
- camera orbit
- free camera zoom gameplay
- perspective 3D camera
- arbitrary drag placement
- world-coordinate free placement
- movement of already committed modules
- new snap authority
- new construction authority
- new materials
- new module categories
- stairs
- raised platforms
- map exploration
- resource gathering
- pig worker AI
- pig navigation
- Wolf AI
- production character animation
- final production artwork
- production sprite atlas
- generated countryside background as a required dependency
- physics-engine changes
- DDS-04G

## 23. Required Implementation Result

After implementation, the running iPad prototype must be technically capable of showing:

- coherent fixed three-quarter 2.5D scene
- readable FLOOR
- readable WALL
- readable CORNER
- readable DOOR_OPENING
- readable ROOF
- readable BEAM
- visually distinct STRAW / WOOD / STONE
- coherent 0/90/180/270 orientation
- Ghost matching committed geometry
- world-anchored snap markers
- preserved manual target selection
- deterministic visual overlap
- coherent DDS-04E displacement in the same projection

Production art is not required.

## 24. Required Post-Implementation Step

After implementation, the next admissible step must be:

**DDS-04F – Construction View / Isometric Presentation – Completion / iPad Presentation Gate**

That gate must verify the actual result on the iPad before iPhone testing resumes.

No DDS-04G work may occur before that presentation gate and the later DDS-04F completion process permit it.

## 25. Authorization Result

**DDS-04F – CONSTRUCTION VIEW / ISOMETRIC PRESENTATION IMPLEMENTATION = AUTHORIZED**

**IMPLEMENTATION STATUS = NOT YET STARTED**

**DDS-04G = NOT AUTHORIZED**
