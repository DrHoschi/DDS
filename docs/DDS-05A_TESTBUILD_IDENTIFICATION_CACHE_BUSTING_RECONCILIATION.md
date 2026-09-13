# DDS-05A – Test-Build Identification / Cache-Busting Reconciliation

Status: **DEFINED / NOT IMPLEMENTED / DEVICE GATE NOT STARTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Current implementation head before this reconciliation:

- `a340d36d0f3d08cae8be605226d1abadbf02ff89`

Authority:

- DDS-05A Implementation Authorization
- DDS-05A Sprite-Based Construction Presentation implementation
- DDS-04 frozen authority remains unchanged

## 1. Purpose

Before visual/device verification, DDS-05A needs an unambiguous test-build identity and deterministic browser cache busting.

The goal is to distinguish:

- an actual sprite/crop/anchor defect
- from an iPhone/iPad/Safari stale-cache artifact

No construction capability is changed by this step.

## 2. Test-Build Identity

The first sprite presentation device build is defined as:

**DDS-05A · TESTBUILD 1**

Canonical technical build ID:

`DDS-05A-TB1`

The human-readable label and technical build ID represent the same build.

## 3. Visible Build Identification

The test build must visibly show:

`DDS-05A · TESTBUILD 1`

The existing visible:

`DDS-04F · Prototype`

must no longer be the primary visible build identifier for this test.

The page title/metadata may also be updated from DDS-04F to DDS-05A test-build wording so screenshots and browser tabs identify the same build.

This is presentation/test metadata only.

## 4. Shared Build-ID Contract

The exact same technical value:

`DDS-05A-TB1`

must be used for every cache-busted resource participating in the DDS-05A visual test.

A test must fail if visible/test resource identifiers drift to different build IDs.

For this first narrow implementation the build ID may be repeated as an explicit literal where browser bootstrap constraints require it, provided automated tests verify equality.

No general production versioning system is introduced here.

## 5. index.html Scope Correction

The previous DDS-05A implementation authorization explicitly protected `index.html`.

For this narrow test-build requirement only, later implementation is permitted to modify:

- `index.html`

Authorized changes are restricted to:

- visible DDS-05A TESTBUILD 1 identification
- page title/description identification
- CSS cache-buster query
- browser-app module cache-buster query
- optional non-authoritative `data-build-id` metadata

No controls, gameplay flow, module categories or layout structure may be added/removed in this correction.

## 6. CSS Cache Busting

The stylesheet URL must include the canonical build ID, for example:

`./src/dds-04f/prototype.css?build=DDS-05A-TB1`

The CSS file contents do not require modification merely to enable cache busting.

The existing responsive contracts remain unchanged.

## 7. Browser Entry-Module Cache Busting

The browser entry module URL must include the same build ID, for example:

`./src/dds-04f/browser-app.mjs?build=DDS-05A-TB1`

This guarantees that a new TESTBUILD identifier forces Safari to request the current entry module rather than reuse the previous entry response.

## 8. DDS-05A Imported Module Cache Busting

Because static ES-module imports do not automatically inherit the entry module's query string, the DDS-05A implementation must explicitly use the same build ID for presentation modules that can change during test iterations.

Authorized targets:

- `../dds-05a/atlas-loader.mjs?build=DDS-05A-TB1`
- `../dds-05a/sprite-presentation.mjs?build=DDS-05A-TB1`

The frozen DDS-04 authority modules do not need independent iterative cache versioning for this visual test because their source is not changing.

The imported `construction-ui-controller.mjs` may also receive the same query if needed for deterministic browser loading, but its source code must remain unchanged.

## 9. Atlas Manifest Cache Busting

The candidate manifest URL must include:

`?build=DDS-05A-TB1`

Example:

`assets/construction/dds-05a/candidate/construction-atlas.json?build=DDS-05A-TB1`

This is mandatory because the user is actively refining frame coordinates between test builds.

## 10. Atlas PNG Cache Busting

The atlas image URL must also receive:

`?build=DDS-05A-TB1`

This must not depend on the browser implicitly copying the JSON URL query.

The atlas loader must deliberately propagate the build parameter from the manifest URL to the resolved atlas image URL.

Example result:

`construction-atlas.png?build=DDS-05A-TB1`

This allows later image replacements under the same normalized filename without Safari serving an older atlas image.

## 11. Build-ID Source at Runtime

`browser-app.mjs` may derive the active build ID from its own module URL:

`import.meta.url`

The `build` query parameter is therefore the runtime test-build identity.

The atlas manifest URL must be generated using that same value.

This avoids an unrelated second runtime build-ID source.

If the build parameter is missing, DDS-05A test mode must fail visibly or use an explicit diagnostic fallback; it must not silently claim TESTBUILD 1 while loading unversioned candidate assets.

## 12. Atlas Loader Narrow Extension

`src/dds-05a/atlas-loader.mjs` may be modified only to:

- preserve existing manifest validation
- extract/receive the build query
- append the same build query to the PNG URL
- expose the resolved versioned image URL for tests

It must not acquire any construction-state responsibility.

## 13. Test Scope

The narrow implementation may add/update tests only to prove:

1. visible build label = `DDS-05A · TESTBUILD 1`
2. HTML CSS URL uses `DDS-05A-TB1`
3. HTML browser-app URL uses `DDS-05A-TB1`
4. browser runtime derives build ID from its module URL
5. candidate JSON URL uses the same build ID
6. resolved PNG URL uses the same build ID
7. DDS-05A presentation module imports use the same build ID
8. existing iPhone/iPad responsive markers remain present
9. no protected DDS-04 authority file changes

## 14. Authorized File Scope for the Narrow Follow-Up

Existing files that may be modified:

- `index.html`
- `src/dds-04f/browser-app.mjs`
- `src/dds-05a/atlas-loader.mjs`
- existing DDS-05A test files as necessary

A dedicated narrow test file may be added under:

- `tests/dds-05a/`

No other existing runtime file is required by this cache-busting correction.

In particular, this reconciliation does not authorize changes to:

- `src/dds-04f/prototype.css` for unrelated styling
- `src/dds-05a/sprite-presentation.mjs`
- candidate crop coordinates
- candidate PNG contents

## 15. Protected Authority Boundary

Still explicitly protected:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs` source behavior

Cache-busting query strings do not alter those authorities.

## 16. Build Number Progression

`DDS-05A-TB1` is valid only for the first real sprite-presentation test build.

If visual asset coordinates, image content, runtime presentation code or CSS are changed after device evidence is collected, the next deployed test build must increment:

- visible label: `DDS-05A · TESTBUILD 2`
- technical ID: `DDS-05A-TB2`

and so on.

This prevents screenshots from different deployed states being mixed into one gate result.

## 17. Device Evidence Rule

Every iPhone/iPad screenshot used for DDS-05A visual/device completion must visibly prove the active TESTBUILD number or otherwise contain unambiguous evidence of that build ID.

Device evidence without a resolvable build identity must not be used to approve sprite crop/anchor correctness.

## 18. Explicit Exclusions

This reconciliation does not authorize:

- sprite crop corrections
- anchor corrections
- yaw-direction corrections
- layout redesign
- new construction categories
- new gameplay
- DDS-04 authority changes
- production service-worker/cache architecture
- offline cache
- PWA installation
- general asset hashing pipeline
- Completion / Device Gate execution

## 19. Reconciliation Result

**DDS-05A – Test-Build Identification / Cache-Busting Reconciliation = DEFINED**

Resolved:

- visible test-build label: **DDS-05A · TESTBUILD 1**
- canonical build ID: **DDS-05A-TB1**
- index.html narrow scope correction required: YES
- CSS cache busting: REQUIRED
- browser-app cache busting: REQUIRED
- DDS-05A module cache busting: REQUIRED
- atlas JSON cache busting: REQUIRED
- atlas PNG cache busting: REQUIRED
- same build ID across all: REQUIRED
- production cache system introduced: NO
- construction authority change: NO
- device gate started: NO

## 20. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Test-Build Identification / Cache-Busting Implementation Authorization**

That authorization may permit only the narrow file scope defined here.

No cache-busting implementation is performed by this reconciliation.
