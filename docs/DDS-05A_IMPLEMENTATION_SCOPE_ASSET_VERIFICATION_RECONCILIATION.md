# DDS-05A – Implementation Scope / Asset Verification Reconciliation

Status: **DEFINED / CANDIDATE ATLAS PACKAGE NORMALIZED / RUNTIME NOT AUTHORIZED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Branch base:

- `bf3cc9eabc217486271b57f93ad714381dfc1162`

Frozen authority:

- DDS-04 frozen baseline: `645926c4d4c792f6ec809ae21268b021c4ede9d4`
- DDS-04 integrated mainline preserved
- DDS-05A scope/asset reconciliation already defined

## 1. Purpose

This step determines the exact later DDS-05A implementation surface and verifies/normalizes the current construction atlas package before any sprite runtime code is written.

No runtime implementation is authorized by this document.

## 2. Current Branch Integrity

At the beginning of this step the DDS-05A branch was identical to its authorized base:

- ahead: 0
- behind: 0
- file differences: 0

No branch-from-branch drift existed.

## 3. Source Atlas Inputs

Existing root inputs:

- `05A3CB9B-C605-4F92-A8AB-A1C1ACDAE32A.PNG`
- `bauteil_atlas.json`

These root files remain unchanged as source/prototype inputs.

## 4. Structural Manifest Verification

The existing JSON was parsed and checked programmatically.

Result:

- JSON parse: PASS
- total frame entries: 78
- frame rectangles outside declared 1536×1024 atlas: 0
- duplicate frame rectangles: 0
- malformed frame rectangles: 0

Eight-direction key coverage for the six frozen runtime categories:

- `floor_*`: PASS
- `wall_*`: PASS
- `corner_*`: PASS
- `door_*`: PASS
- `roof_*`: PASS
- `beam_*`: PASS

Therefore the manifest is structurally coherent enough to serve as a candidate atlas contract.

## 5. What Is Not Yet Pixel-Verified

The structural checks do not prove that the current 128×128 crops visually isolate the intended sprites.

Still not proven:

- exact crop fit
- no visual cut-off
- no neighboring sprite contamination
- final alpha/transparency quality
- final per-frame anchor quality
- exact visual yaw→direction mapping

Therefore:

**STRUCTURAL MANIFEST = PASS**

but:

**PIXEL CROP / VISUAL ASSET VERIFICATION = NOT YET PASS**

No runtime code may assume the candidate frame map is production-correct until this visual verification is completed.

## 6. Candidate Package Normalization

A normalized candidate package is created under:

`assets/construction/dds-05a/candidate/`

Files:

- `construction-atlas.png`
- `construction-atlas.json`

The PNG is the exact existing repository blob; it is not regenerated or edited.

The JSON preserves the existing 78-frame mapping and changes only the image reference to the colocated exact filename:

`construction-atlas.png`

This removes the previous manifest/file-name mismatch without pretending that the frame crops are already visually approved.

## 7. Root Input Preservation

The existing root files are not deleted, renamed or rewritten in this step.

They remain historical/source inputs:

- `05A3CB9B-C605-4F92-A8AB-A1C1ACDAE32A.PNG`
- `bauteil_atlas.json`

DDS-05A runtime, when later authorized, must use the normalized package path rather than guessing between root filenames.

## 8. Exact Later Runtime File Scope

The later sprite implementation may modify:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`

It may add:

- `src/dds-05a/atlas-loader.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `tests/dds-05a/atlas-loader.test.mjs`
- `tests/dds-05a/sprite-presentation.test.mjs`

It may consume:

- `assets/construction/dds-05a/candidate/construction-atlas.png`
- `assets/construction/dds-05a/candidate/construction-atlas.json`

`index.html` is **not currently required to change** for the first runtime integration because the existing module entry point can import DDS-05A presentation modules from `browser-app.mjs`.

If a later implementation proves an HTML change genuinely necessary, that must be separately justified before modification.

## 9. Protected Files

The later DDS-05A sprite implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`

The controller remains the frozen interaction projection source.

Sprite code consumes controller snapshots; it does not change their authority.

## 10. Atlas Loader Responsibility

The later `atlas-loader.mjs` may only own presentation asset concerns:

- load manifest
- validate manifest shape
- resolve exact colocated PNG path
- validate required runtime frame keys
- validate frame bounds against declared atlas dimensions
- expose frame/anchor metadata
- fail visibly/safely when required asset metadata is invalid

It must not know or mutate:

- ConstructionState
- snap occupancy
- placement commit
- material authority
- Stability authority
- Wolf force/failure

## 11. Sprite Presentation Responsibility

The later `sprite-presentation.mjs` may own:

- fixed world→screen presentation projection
- yaw→sprite direction mapping
- sprite frame selection
- sprite anchor application
- presentation depth ordering
- Ghost/selected/invalid/DETACHED visual classes/state descriptors
- palette thumbnail frame selection

It must not mutate authoritative transforms.

## 12. Runtime Category Scope

Only these six frozen categories may render through DDS-05A runtime mapping:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

No runtime mapping is authorized for:

- FOUNDATION
- STAIRS
- RAILING
- SUPPORT
- POST
- VERTICAL_BEAM
- HALF_WALL

`wall_window` remains only a visual candidate and is not required for the first implementation.

## 13. Direction Mapping Scope

The manifest may retain all eight direction keys.

The first runtime only needs a deterministic mapping for the four frozen yaw values:

- 0°
- 90°
- 180°
- 270°

The exact four direction keys are **not fixed by this document** because they require visual comparison against the atlas artwork.

The runtime implementation must not guess this mapping silently.

## 14. Ghost / Invalid / Selected Scope

Dedicated atlas state frames are not mandatory.

The first implementation may derive state visually from the normal directional frame using presentation-only:

- opacity
- outline
- glow
- tint
- marker

This provides one consistent behavior across all six categories.

Dedicated `*_ghost`, `*_invalid` or `*_hover` frames remain optional until visually verified.

## 15. Snap Marker Rule

DDS-04C remains the source of snap-point location.

The sprite system may use the shared projection and sprite anchor to position artwork around the authoritative world point.

It may not place snap markers by measuring or hardcoding visible sprite pixels.

## 16. Material Rule

DDS-05A must continue to display STRAW / WOOD / STONE distinctly.

The current atlas does not yet prove a complete three-material art set.

Therefore the first implementation must preserve material readability with a presentation-only treatment unless verified material-specific sprite frames become available.

No material semantics may change.

## 17. Responsive Scope

The later implementation must preserve the frozen iPhone/iPad interaction baseline.

The exact responsive CSS may be adjusted only inside `prototype.css`.

Acceptance still requires:

- no horizontal page overflow
- touch-sized snap targets
- readable Ghost/snap state
- reachable material and piece controls
- reachable rotate/place/undo/reset/Wolf-Test
- iPhone and iPad device verification

## 18. Asset Failure Behavior

If the candidate atlas cannot be loaded or a required frame is invalid:

- show a visible technical fallback
- keep construction state operational
- do not invent a sprite key
- do not change transform/snap/material/Wolf state
- do not silently display an unrelated frame

## 19. Implementation Diff Boundary

Authorized later implementation target set, subject to separate implementation authorization:

Existing files:

- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`

New files:

- `src/dds-05a/atlas-loader.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `tests/dds-05a/atlas-loader.test.mjs`
- `tests/dds-05a/sprite-presentation.test.mjs`

Asset inputs:

- `assets/construction/dds-05a/candidate/construction-atlas.png`
- `assets/construction/dds-05a/candidate/construction-atlas.json`

No other runtime file is currently justified.

## 20. Verification Gates Required Before Implementation Completion

Later DDS-05A completion must prove:

1. atlas loader contract tests PASS
2. all six runtime categories resolve frames
3. four yaw directions resolve deterministically
4. no frame lookup changes authoritative state
5. Ghost valid/invalid remains semantically correct
6. manual snap-target selection remains correct
7. placement/undo/material/Wolf regressions remain PASS
8. selected/DETACHED visuals remain readable
9. iPad presentation PASS
10. iPhone responsive PASS
11. actual sprite crop/anchor appearance visually PASS
12. no protected DDS-04 source changed

## 21. Result

**DDS-05A – Implementation Scope / Asset Verification Reconciliation = DEFINED**

Asset status:

- source image exists in repository: PASS
- source manifest exists: PASS
- manifest JSON structure: PASS
- frame bounds against declared dimensions: PASS
- duplicate frame rectangles: PASS
- six-category eight-direction key coverage: PASS
- normalized colocated candidate filename/path: PASS
- exact visual crop correctness: NOT YET PASS
- alpha/transparency visual verification: NOT YET PASS
- anchor visual verification: NOT YET PASS
- yaw→direction visual mapping: NOT YET PASS
- runtime integration: NOT STARTED

## 22. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Implementation Authorization**

That authorization may permit only the exact runtime file scope defined here and must preserve all protected DDS-04 boundaries.

No runtime implementation is performed by this reconciliation.
