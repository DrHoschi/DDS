# DDS-05A – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Branch implementation-scope baseline:

- `7f428ee5fd05f4a58d048c65a55dca97e0a3a783`

Frozen authority baseline:

- DDS-04 frozen prototype foundation: `645926c4d4c792f6ec809ae21268b021c4ede9d4`

Scope authority:

- `docs/DDS-05A_SPRITE_BASED_CONSTRUCTION_PRESENTATION_ASSET_RECONCILIATION.md`
- `docs/DDS-05A_IMPLEMENTATION_SCOPE_ASSET_VERIFICATION_RECONCILIATION.md`

## 1. Authorization Decision

DDS-05A implementation is authorized strictly within the reconciled Sprite-Based Construction Presentation / Asset Integration scope.

This authorization does not itself implement code.

No DDS-04 authority may be expanded or rewritten.

## 2. Latest User Asset Input

After the DDS-05A branch was created, the user uploaded a newer atlas manifest on `main`.

Latest user-provided asset manifest:

- repository path: `constructionAtlas.json`
- main commit: `86030f32f812218e7a31effeb7233e0303b99447`
- blob SHA: `ad14efa500224ce71b0deb1f015fad2f81fa017e`
- format: `asset-lab-atlas-v1`
- textureKey: `constructionAtlas`
- image reference: `05A3CB9B-C605-4F92-A8AB-A1C1ACDAE32A.PNG`
- frame entries: **78**

This newer manifest already contains first manual crop refinements, including smaller and shifted frame rectangles for several FLOOR, WALL, CORNER and DOOR entries.

It is accepted as the **latest candidate asset input** for DDS-05A.

It is not declared final or pixel-perfect.

## 3. Branch Divergence Handling

Current `main` diverged from the DDS-05A branch only because of the user's atlas-manifest replacement.

DDS-05A implementation must **not merge current main wholesale** into the feature branch.

Instead, implementation may import the exact latest user manifest content from:

`constructionAtlas.json@86030f32f812218e7a31effeb7233e0303b99447`

into the already reconciled candidate asset package:

`assets/construction/dds-05a/candidate/construction-atlas.json`

while normalizing only the colocated image reference as required by the DDS-05A package contract.

This asset sync is part of the authorized DDS-05A implementation scope and must not alter unrelated mainline history.

## 4. Authorized Existing Runtime Files

Implementation may modify only:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`

No other existing runtime file is authorized.

## 5. Authorized New Runtime / Test Files

Implementation may add only:

- `src/dds-05a/atlas-loader.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `tests/dds-05a/atlas-loader.test.mjs`
- `tests/dds-05a/sprite-presentation.test.mjs`

Additional files require a new scope reconciliation.

## 6. Authorized Asset Package

Implementation may use/update within the candidate package only:

- `assets/construction/dds-05a/candidate/construction-atlas.png`
- `assets/construction/dds-05a/candidate/construction-atlas.json`

The PNG remains the existing exact repository image unless a later separately authorized asset replacement occurs.

The JSON may be synchronized to the latest user-provided candidate coordinates.

## 7. Protected Files

Implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`

`index.html` is not authorized for modification in the first DDS-05A implementation.

DDS-03A character authority remains protected.

## 8. Runtime Category Authorization

Sprite runtime mapping is authorized only for:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

Not authorized as new runtime categories:

- FOUNDATION
- STAIRS
- RAILING
- SUPPORT
- POST
- VERTICAL_BEAM
- HALF_WALL

`wall_window` remains a presentation candidate only.

## 9. Rendering Authorization

DDS-05A may replace the current successful-path technical CSS/glyph module visualization with sprite-based presentation.

Authorized presentation responsibilities include:

- atlas loading
- manifest validation
- required frame lookup
- fixed 2.5D construction projection
- yaw-to-direction mapping
- sprite anchor application
- deterministic visual depth ordering
- Ghost valid/invalid visual state
- selected state
- DETACHED state
- sprite-based piece thumbnails where useful
- visible technical fallback if an asset/frame fails

Sprite presentation must remain non-authoritative.

## 10. Snap / Placement Protection

DDS-04C remains the sole source of:

- snap identity
- valid/invalid placement
- occupancy
- placement transform
- commit
- undo

DDS-05A may project these values visually.

It may not derive snap placement from sprite pixels.

## 11. Material Protection

Frozen material IDs remain:

- STRAW
- WOOD
- STONE

DDS-05A may apply non-authoritative visual treatments so material remains distinguishable.

No material semantics may change.

## 12. Candidate Asset Quality Status

The latest user manifest is good enough to begin the first sprite integration pass, but still remains candidate data.

Therefore implementation is authorized to proceed while preserving these later verification requirements:

- crop visual correctness
- no cut-off
- no neighboring sprite contamination
- transparency/alpha quality
- anchor alignment
- exact yaw→direction visual correctness

A first integration may expose defects for iterative asset correction without reopening construction authority.

## 13. Direction Mapping

The manifest contains eight direction keys.

The frozen runtime uses four yaw rotations:

- 0°
- 90°
- 180°
- 270°

Implementation must establish one deterministic four-way mapping.

The mapping must remain presentation-only and may be corrected later if visual evidence shows a direction mismatch.

It must not change authoritative rotation values.

## 14. Responsive Protection

Implementation must preserve:

- iPhone stacked usability
- iPad three-column usability
- no blocking horizontal overflow
- touch-sized snap targets
- manual target selection
- readable Ghost/snap state
- reachable material/piece/action controls

Device verification is required at completion.

## 15. Failure-Safe Requirement

If the atlas or a required frame fails:

- construction logic must continue to operate
- a visible technical fallback may render
- no unrelated frame may be silently substituted
- no authoritative transform may be changed to compensate
- no structural state may depend on image success

## 16. Explicitly Not Authorized

This authorization does not permit:

- changes to DDS-04B/C/D/E
- changes to DDS-04F controller behavior
- new building categories
- POST / VERTICAL_BEAM gameplay
- FOUNDATION gameplay
- new snap classes
- new materials
- new physics
- character AI
- pig movement
- Wolf AI
- resource gathering
- free camera
- WebGL/Three.js/Babylon migration
- production-art freeze
- wholesale merge of post-branch main changes

## 17. Authorization Result

**DDS-05A – IMPLEMENTATION = AUTHORIZED**

Authorized target:

**Sprite-Based Construction Presentation / Asset Integration**

Authorized implementation boundary:

- exact runtime/test files listed above
- candidate atlas package only
- latest user candidate manifest from `86030f32…` may be synchronized into the candidate package
- frozen DDS-04 authority must remain untouched

Current status after this document:

**AUTHORIZED / NOT IMPLEMENTED**

## 18. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Sprite-Based Construction Presentation / Asset Integration – Implementation**

That step may implement only this authorized scope.

No additional capability may be added without a new reconciliation.
