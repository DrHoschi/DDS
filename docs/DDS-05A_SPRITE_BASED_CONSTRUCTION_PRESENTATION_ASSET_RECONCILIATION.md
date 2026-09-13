# DDS-05A – Sprite-Based Construction Presentation / Asset Integration – Scope / Asset Reconciliation

Status: **DEFINED / ASSET BASELINE RECONCILED / NOT IMPLEMENTED / NO DEVELOPMENT BRANCH CREATED**

Baseline:

- integrated main before this reconciliation: `1e3e96d403cf499e1426a6f4bf65f54c395100ed`
- DDS-04 frozen authority baseline: `645926c4d4c792f6ec809ae21268b021c4ede9d4`
- DDS-04G result: **PASS / FROZEN PROTOTYPE FOUNDATION / 0 BLOCKER**

This document defines the first new presentation line above frozen DDS-04.

It does not create a feature branch and does not implement runtime code.

## 1. Block Identity

The new development line is designated:

**DDS-05A – Sprite-Based Construction Presentation / Asset Integration**

DDS-05A is a presentation / asset-integration block only.

It is not a continuation of the old DDS-04F feature branch.

All future DDS-05A implementation must begin from integrated `main`, never from the historical DDS-04F branch.

## 2. Objective

Replace the current technical glyph / CSS-shape construction presentation with sprite-based construction pieces so the player can visually judge:

- which module is being placed
- its orientation
- which snap target is selected
- whether the part visually sits at the intended construction location
- how FLOOR / WALL / CORNER / DOOR_OPENING / ROOF / BEAM relate spatially

The new presentation must make the existing frozen construction logic easier to read.

It must not rewrite that logic.

## 3. Frozen Authority Boundary

DDS-05A must preserve the frozen DDS-04 authorities:

- DDS-04B → Construction State / module identity / transforms / connection records
- DDS-04C → snap identity / compatibility / occupancy / placement / rotation / undo
- DDS-04D → material assignment / advisory Stability
- DDS-04E → Wolf force / failure / detach / displacement
- DDS-04F → child-readable interaction flow / manual snap-target selection / responsive iPhone+iPad usability baseline

Presentation must remain downstream from authoritative state.

A sprite frame, sprite anchor, pixel position or visual overlap must never become structural authority.

## 4. Explicitly Protected Source Boundary

DDS-05A is not authorized to change the behavior contracts of:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`

The DDS-04F controller behavior is also protected by default:

- `src/dds-04f/construction-ui-controller.mjs`

It may only be touched later if an implementation-scope reconciliation proves that presentation metadata cannot be derived without a narrow non-authoritative adapter. No placement, material, Stability or Wolf semantics may change.

## 5. Current Presentation Problem

The frozen prototype currently renders modules as technical DOM/CSS glyph shapes.

That was sufficient to prove mechanics, but it is not sufficient as the intended game presentation.

The primary problem is not missing construction logic.

The primary problem is visual interpretation:

- module geometry is abstract
- orientation is difficult to judge
- snap location is harder to judge against the visible object
- the result does not resemble the intended Three Little Pigs game presentation

DDS-05A therefore treats sprite replacement as the main presentation path.

## 6. Primary Rendering Decision

For DDS-05A:

**construction sprites are the primary visible representation**

The technical CSS/glyph geometry is no longer the target representation.

Existing glyph/CSS shapes may remain temporarily only as:

- technical fallback for a missing/failed asset
- debug representation
- failure-safe representation during asset loading

They must not remain the normal final scene representation for a successfully loaded construction asset.

## 7. View / Camera Boundary

DDS-05A uses a:

**fixed 2.5D three-quarter / isometric-style construction view**

Required principles:

- no free camera
- no player camera rotation
- no perspective zoom system
- module `Drehen` rotates the building piece, not the camera
- authoritative world x/y/z remains unchanged
- the fixed view must visually match the sprite artwork

The previously parked DDS-04F isometric documents may be consulted as design history, but they are not active implementation authorization.

Their exact 2:1 projection constants are **not automatically inherited**.

The final world-to-screen projection for DDS-05A must be reconciled against the actual approved sprite perspective before implementation is frozen.

## 8. Runtime Category → Sprite Family Contract

Only the six frozen construction categories may participate in the first sprite runtime mapping:

| Frozen category | Sprite family |
| --- | --- |
| `FLOOR` | `floor_*` |
| `WALL` | `wall_*` |
| `CORNER` | `corner_*` |
| `DOOR_OPENING` | `door_*` |
| `ROOF` | `roof_*` |
| `BEAM` | `beam_*` |

No sprite key may create a new authoritative module category by itself.

## 9. Existing Atlas Package on main

Current files:

- `05A3CB9B-C605-4F92-A8AB-A1C1ACDAE32A.PNG`
- `bauteil_atlas.json`

Current JSON metadata declares:

- format: `asset-lab-atlas-v1`
- textureKey: `constructionAtlas`
- declared size: 1536 × 1024
- declared cell: 128 × 128
- declared grid: 12 × 8
- direction order: `s, se, e, ne, n, nw, w, sw`
- total frame entries: **78**

Frame-family inventory:

- floor: 12
- wall: 12
- corner: 11
- door: 8
- roof: 11
- beam: 8
- foundation: 11
- stairs: 1
- railing: 1
- support: 1
- post: 1
- half_wall: 1

## 10. Current Asset Classification

### 10.1 Atlas PNG

`05A3CB9B-C605-4F92-A8AB-A1C1ACDAE32A.PNG`

Classification:

**PROTOTYPE PRESENTATION ASSET / AVAILABLE / NOT YET RUNTIME-VERIFIED**

It may be used as the visual source for asset validation and integration work.

It is not yet approved as a final production atlas.

### 10.2 Atlas JSON

`bauteil_atlas.json`

Classification:

**PROVISIONAL ATLAS MANIFEST / SCHEMA USEFUL / FRAME MAP NOT YET AUTHORITATIVE**

The JSON is structurally usable as an atlas manifest.

Its current frame coordinates must not yet be treated as pixel-authoritative.

## 11. Known Atlas Package Inconsistency

The JSON currently references:

`isometrischer_bauwerkzeug_atlas.png`

but the actual repository image is:

`05A3CB9B-C605-4F92-A8AB-A1C1ACDAE32A.PNG`

Therefore the current pair cannot be treated as a verified runtime package without normalization.

DDS-05A must later resolve this by either:

- renaming/moving the image and updating the manifest, or
- changing the manifest image reference to the actual normalized asset path

No silent filename guessing is permitted at runtime.

## 12. Frame Coordinate / Grid Status

The current JSON assumes a uniform 128 × 128 grid.

That grid is useful as a provisional organization model but has not been proven pixel-perfect against the current PNG.

Therefore:

- current `x/y/w/h` = provisional
- current 128 × 128 cells = provisional
- exact crop bounds = must be validated
- neighboring-sprite contamination = must be checked
- transparency = must be verified
- anchors = must be visually verified

DDS-05A must not make gameplay correctness depend on unverified crop coordinates.

## 13. Direction Contract

The eight-direction vocabulary is retained as the asset vocabulary:

- S
- SE
- E
- NE
- N
- NW
- W
- SW

However, current frozen module rotation uses four yaw rotations:

- 0°
- 90°
- 180°
- 270°

Therefore the first DDS-05A runtime integration only requires four visually correct orientation mappings per module category.

The exact relation:

`yaw → sprite direction key`

is **not yet frozen** because it depends on how the approved atlas artwork defines its facing/orientation.

The implementation-scope step must visually validate the mapping rather than assume that 0° means `s`, `se`, or any other key.

The remaining four direction frames may stay available for later use.

## 14. Sprite Anchor Contract

Sprite anchors are presentation metadata only.

They may control:

- visual placement origin
- floor contact
- snap marker projection
- depth ordering tie position

They must not alter:

- authoritative transform
- snap transform
- occupancy
- connection topology

Current JSON anchor examples such as:

- default `anchorX = 0.5`
- default `anchorY = 1`
- FLOOR `anchorY = 0.85`

remain provisional until visual verification.

## 15. Ghost / Valid / Invalid / Selected States

DDS-05A must keep the frozen placement semantics.

Visual states must be derived from those semantics.

Required presentation states:

- normal committed module
- selected committed module
- Ghost valid
- Ghost invalid
- recommended snap target
- alternative valid snap target
- manually selected snap target
- DETACHED module

The existing atlas contains dedicated state frames only for some families.

Therefore DDS-05A must **not require dedicated state sprites for every category**.

The common baseline may use the same orientation sprite plus presentation effects such as:

- opacity
- outline
- glow
- tint
- ring/marker
- non-geometric overlay

Dedicated `*_ghost`, `*_invalid`, `*_hover` frames may be used only after they are asset-verified and only when they remain semantically equivalent.

Hover must never be required for iPhone/iPad core use.

## 16. Snap Marker Contract

Snap markers remain interaction overlays.

They must be positioned from:

- authoritative module transform
- DDS-04C snap-point data
- the shared DDS-05A world-to-screen projection

They must not be positioned by hand against sprite pixels.

Sprite anchor metadata may be used to align the rendered image around the authoritative projected position, but it may not redefine where the snap point is.

This is critical for judging whether a sprite appears to sit on the correct snap.

## 17. Depth / Occlusion Contract

DDS-05A may introduce deterministic presentation depth ordering so front objects visually overlap rear objects correctly.

Depth order may use:

- authoritative x/y/z
- projected ground depth
- stable instance ID as a presentation tie-breaker

Depth order must not modify authoritative construction state.

## 18. Material Presentation Boundary

Frozen material IDs remain:

- STRAW
- WOOD
- STONE

The current atlas package does not yet establish a verified complete three-material sprite set.

Therefore DDS-05A must preserve visible material distinction through one of the following later-approved presentation strategies:

1. material-specific verified sprite frames/atlases, or
2. a non-authoritative sprite treatment/overlay that clearly differentiates STRAW / WOOD / STONE

No final strategy is selected by this reconciliation.

Material presentation must remain downstream from authoritative `materialRef`.

## 19. Palette / Toolbar Presentation

DDS-05A may replace text/glyph build-piece thumbnails with sprite thumbnails for the six frozen categories.

The palette must still expose exactly:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

unless a later separately authorized capability changes the building-system category set.

## 20. Extra Atlas Entries – Presentation Candidates Only

The current atlas also contains:

- `foundation_*`
- `stairs`
- `railing`
- `support`
- `post`
- `half_wall`
- `wall_window`

These entries do **not** create new DDS construction capabilities.

Current classification:

### foundation_*

**PARKED ASSET FAMILY**

No `FOUNDATION` category exists in frozen DDS-04.

### stairs

**PARKED / NOT AUTHORIZED AS MODULE**

### railing

**PARKED / NOT AUTHORIZED AS MODULE**

### support

**PARKED / NOT AUTHORIZED AS MODULE**

### post

**PARKED ASSET CANDIDATE**

This may later become a visual candidate for a vertical post / vertical beam capability, but no such authoritative category exists yet.

It must not be silently mapped to BEAM if doing so would imply a vertical structural orientation that frozen DDS-04 does not represent.

### half_wall

**PARKED / NOT AUTHORIZED AS MODULE**

### wall_window

**VISUAL VARIANT CANDIDATE ONLY**

It may only be used as a presentation variant if it does not imply a new semantic module, opening behavior, snap contract or gameplay capability.

## 21. Vertical Beam / Post Decision

The user's proposed vertical corner beam/post is recognized as useful.

Current status:

**ASSET CANDIDATE / NOT A DDS-05A AUTHORITY CHANGE**

DDS-05A may keep artwork for it available.

It may not add:

- `POST`
- `VERTICAL_BEAM`
- new vertical snap behavior
- new support semantics

without a separate future construction-capability reconciliation.

## 22. Character Asset Boundary

Pig and Wolf sprites are not required for DDS-05A construction asset integration.

DDS-05A does not authorize:

- pig movement
- pig worker AI
- autonomous construction
- resource gathering
- Wolf AI
- Wolf animation authority

Static character decoration is also outside the minimum DDS-05A scope unless separately reconciled.

The initial goal is to make the **construction itself** visually trustworthy.

## 23. Environment Boundary

DDS-05A may later use minimal non-authoritative environment presentation needed to make the scene readable, such as:

- ground/build plot
- background
- simple decorative landscape

Environment presentation must not become:

- navigation authority
- collision authority
- level-design authority
- resource-node authority

Production environment art is outside this first block.

## 24. Responsive Boundary

The frozen iPhone/iPad usability baseline must be preserved.

DDS-05A may adjust scene presentation scaling and layout only as needed to make sprites readable.

It must preserve:

- no required horizontal page scrolling
- reachable materials
- reachable build-piece selection
- reachable rotate/place/undo/reset/Wolf-Test
- readable snap feedback
- touch-sized snap targets
- dedicated iPhone and iPad responsive behavior

A visually improved iPad scene that breaks iPhone usability is not acceptable.

## 25. Files Expected to Be Presentation-Side Candidates

The later implementation-scope reconciliation may consider changes around:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`
- `index.html`
- new DDS-05A presentation/atlas loader modules
- normalized construction asset files / atlas manifest
- DDS-05A tests

This document does not authorize those edits yet.

## 26. Files Explicitly Protected

Unless a separate authority reconciliation proves otherwise, DDS-05A must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- DDS-03A character authority documents/assets

DDS-04F controller behavior remains protected by default.

## 27. Required Asset Verification Before Runtime Integration

Before an atlas is considered runtime-ready, DDS-05A must verify:

1. image file exists
2. manifest references the exact real image path/name
3. image decodes successfully
4. transparency/alpha is correct
5. declared image dimensions match the image
6. every frame is in bounds
7. frame crops do not cut off the intended sprite
8. frame crops do not contain unintended neighboring sprites
9. anchors align the sprite consistently to world placement
10. four runtime yaw orientations map to visually correct sprite directions
11. all six frozen module categories have usable frames
12. Ghost/invalid/selected presentation remains readable
13. material state remains visibly distinguishable
14. the atlas works on iPhone and iPad without layout breakage

## 28. Asset Failure-Safe Rule

If a sprite asset is:

- missing
- invalid
- undecodable
- out of bounds
- unmapped

the presentation layer must fail visibly and safely.

It must never:

- create a structural module because an image exists
- alter authoritative transform to compensate for bad artwork
- invent snap points from pixels
- silently use the wrong category

A technical placeholder fallback may be used for failure diagnosis, but it is not the successful target presentation.

## 29. Historical DDS-04F Presentation Documents

The existing documents:

- `DDS-04F_CONSTRUCTION_VIEW_ISOMETRIC_PRESENTATION_RECONCILIATION.md`
- `DDS-04F_CONSTRUCTION_VIEW_ISOMETRIC_PRESENTATION_IMPLEMENTATION_SCOPE.md`
- `DDS-04F_CONSTRUCTION_VIEW_ISOMETRIC_PRESENTATION_IMPLEMENTATION_AUTHORIZATION.md`

remain repository history.

Status for DDS-05A:

**HISTORICAL / PARKED / NOT ACTIVE AUTHORIZATION**

Compatible design intent may be reused, but DDS-05A must not implement from those old branch-era authorizations.

This DDS-05A reconciliation is the new starting authority for presentation work above frozen DDS-04.

## 30. Explicit Exclusions

DDS-05A Scope / Asset Reconciliation does not authorize:

- implementation
- feature-branch creation in this same step
- changes to frozen construction authorities
- new module categories
- POST / VERTICAL_BEAM gameplay
- FOUNDATION gameplay
- stairs / railings / half walls
- new material types
- new snap classes
- free camera
- 3D engine migration
- WebGL/Three.js/Babylon migration
- new physics
- character AI
- resource gathering
- progression/campaign
- production art freeze

## 31. Reconciliation Result

**DDS-05A – Sprite-Based Construction Presentation / Asset Integration – Scope / Asset Reconciliation = DEFINED**

Resolved:

- new work is a post-DDS-04 line: YES
- branch-from-branch continuation: FORBIDDEN
- sprites are primary construction presentation: YES
- frozen DDS-04 authority remains unchanged: YES
- six existing construction categories are the only initial runtime mapping: YES
- current atlas/JSON may be used as prototype input: YES
- current atlas/JSON is runtime-ready as-is: NO
- filename mismatch exists: YES
- frame/grid/anchors still require verification: YES
- eight-direction vocabulary retained: YES
- four runtime yaw mappings still require visual validation: YES
- extra atlas parts create gameplay categories: NO
- POST/VERTICAL_BEAM is currently only an asset candidate: YES
- CSS/glyph geometry remains normal successful presentation: NO
- technical fallback may remain for asset failure/debug: YES
- iPhone/iPad baseline must be preserved: YES

## 32. Next Admissible Step

The next admissible step is exclusively:

**Create the dedicated DDS-05A presentation development branch from the integrated main baseline containing this reconciliation.**

Recommended branch name:

`feature/dds-05a-sprite-construction-presentation`

No implementation should occur in the same branch-creation step.

After the branch exists, the next separate step should be:

**DDS-05A – Implementation Scope / Asset Verification Reconciliation**

That step must determine the exact file diff and verify/normalize the atlas package before runtime sprite code is written.
