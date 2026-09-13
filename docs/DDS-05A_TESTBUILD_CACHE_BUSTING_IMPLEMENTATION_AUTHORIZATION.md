# DDS-05A – Test-Build Identification / Cache-Busting Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED / DEVICE GATE NOT STARTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Reconciliation authority:

- `docs/DDS-05A_TESTBUILD_IDENTIFICATION_CACHE_BUSTING_RECONCILIATION.md`

Reconciliation commit:

- `9358dd00eece01af8b910169af9d7fe3a435e0c6`

Current DDS-05A implementation baseline before this narrow authorization:

- `a340d36d0f3d08cae8be605226d1abadbf02ff89`

Frozen construction authority:

- DDS-04 frozen prototype foundation: `645926c4d4c792f6ec809ae21268b021c4ede9d4`

## 1. Authorization Decision

The narrow DDS-05A Test-Build Identification / Cache-Busting implementation is authorized.

This authorization exists only to make real iPhone/iPad visual testing unambiguous.

It does not authorize any construction, sprite-crop, anchor, layout or gameplay capability change.

## 2. Authorized Build Identity

Human-readable label:

**DDS-05A · TESTBUILD 1**

Canonical technical build ID:

`DDS-05A-TB1`

The exact same technical ID must be used across all cache-busted DDS-05A TESTBUILD 1 resources.

## 3. Authorized Existing Files

Implementation may modify only:

- `index.html`
- `src/dds-04f/browser-app.mjs`
- `src/dds-05a/atlas-loader.mjs`
- existing DDS-05A tests where required for this cache/build contract

## 4. Authorized New Test File

Implementation may add one dedicated narrow test file under:

- `tests/dds-05a/`

Its scope must be limited to build identification / cache-busting verification.

## 5. index.html Authorization

`index.html` is authorized for modification only for:

- visible label `DDS-05A · TESTBUILD 1`
- page title / description update to DDS-05A TESTBUILD 1 wording
- optional non-authoritative `data-build-id="DDS-05A-TB1"`
- stylesheet URL cache query
- browser entry-module URL cache query

No control, layout-structure or gameplay change is authorized.

## 6. CSS URL Authorization

The existing stylesheet may be referenced as:

`./src/dds-04f/prototype.css?build=DDS-05A-TB1`

The CSS source file itself is not authorized for unrelated modification in this narrow block.

## 7. Browser Entry Module Authorization

The existing browser entry may be referenced as:

`./src/dds-04f/browser-app.mjs?build=DDS-05A-TB1`

`browser-app.mjs` may derive the active build ID from `import.meta.url`.

The runtime must use that exact build ID for candidate atlas loading.

## 8. DDS-05A Module Import Authorization

`browser-app.mjs` may cache-bust DDS-05A presentation modules with the same ID:

- `../dds-05a/atlas-loader.mjs?build=DDS-05A-TB1`
- `../dds-05a/sprite-presentation.mjs?build=DDS-05A-TB1`

The source behavior of `sprite-presentation.mjs` is not authorized for modification in this narrow step.

The frozen `construction-ui-controller.mjs` source must remain unchanged.

## 9. Atlas Manifest Authorization

The candidate atlas manifest request must use the same build ID:

`construction-atlas.json?build=DDS-05A-TB1`

This is required because frame coordinates are actively being refined between test builds.

No frame-coordinate changes are authorized by this block.

## 10. Atlas PNG Authorization

The resolved atlas image URL must also use:

`?build=DDS-05A-TB1`

The atlas loader is authorized to propagate the manifest's build query to the PNG URL.

The PNG content itself must remain unchanged in this block.

## 11. Missing Build-ID Behavior

DDS-05A TESTBUILD mode must not silently claim TESTBUILD 1 while loading unversioned assets.

If the expected `build` query is missing, implementation must expose a clear diagnostic/failure state rather than silently continuing as a valid TESTBUILD 1.

This behavior must remain presentation/test-only and must not affect authoritative construction state.

## 12. Build Progression Contract

After TESTBUILD 1 device evidence exists, any later change to:

- sprite runtime presentation code
- sprite crop coordinates
- sprite image content
- anchor values
- yaw-direction mapping
- CSS presentation

requires the next deployed test identity:

- visible: `DDS-05A · TESTBUILD 2`
- technical: `DDS-05A-TB2`

Further test builds increment analogously.

## 13. Test Authorization

Tests must verify at minimum:

1. visible label = `DDS-05A · TESTBUILD 1`
2. canonical ID = `DDS-05A-TB1`
3. CSS URL uses `DDS-05A-TB1`
4. browser-app URL uses `DDS-05A-TB1`
5. browser runtime derives the active build ID from its module URL
6. candidate JSON URL uses the same build ID
7. resolved PNG URL uses the same build ID
8. DDS-05A presentation imports use the same build ID
9. existing iPhone/iPad responsive contract markers remain present
10. no protected DDS-04 source changes

## 14. Explicitly Protected Files

This authorization does not permit source modifications to:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-04f/prototype.css` except that its URL may receive the build query from HTML
- candidate atlas frame coordinates
- candidate atlas PNG content

## 15. Explicit Exclusions

This authorization does not permit:

- crop corrections
- anchor corrections
- direction/yaw corrections
- scene-layout redesign
- sprite scaling redesign
- new module categories
- new gameplay
- DDS-04 authority changes
- service worker
- PWA cache
- offline support
- production hashing/build pipeline
- Completion / Regression / Visual Asset / Device Gate execution

## 16. Authorization Result

**DDS-05A – TEST-BUILD IDENTIFICATION / CACHE-BUSTING IMPLEMENTATION = AUTHORIZED**

Authorized target:

**DDS-05A · TESTBUILD 1 / DDS-05A-TB1**

Current status after this document:

**AUTHORIZED / NOT IMPLEMENTED / DEVICE GATE NOT STARTED**

## 17. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Test-Build Identification / Cache-Busting Implementation**

That step may implement only the narrow file and behavior scope defined here.

No visual asset correction and no device-gate decision may occur in the same step.
