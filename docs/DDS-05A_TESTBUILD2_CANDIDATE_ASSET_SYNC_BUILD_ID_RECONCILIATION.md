# DDS-05A – TESTBUILD 2 Candidate Asset Sync / Build-ID Reconciliation

Status: **DEFINED / NOT IMPLEMENTED / TESTBUILD 2 NOT DEPLOYED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Current branch head before this reconciliation:

- `ded33dd9e16822c0ac0cb60d32c578c57664b8de`

TESTBUILD 1 identity:

- visible: `DDS-05A · TESTBUILD 1`
- technical: `DDS-05A-TB1`
- real iPad evidence already exists for this build

Latest user candidate manifest:

- repository path: `constructionAtlas.json`
- commit: `288ffc3ab94bd031e1e5190abcc3d1391c642dfc`
- generated: `2026-09-13T12:54:02.199Z`

## 1. Purpose

This step reconciles the next test-build identity after the user supplied a newer candidate atlas JSON.

No candidate file is synchronized in this reconciliation.

No runtime code is changed.

No visual/device gate is executed.

## 2. TESTBUILD 1 Preservation

TESTBUILD 1 remains a distinct historical test state.

It must not be silently mutated after real device evidence has been collected.

Therefore:

- `DDS-05A-TB1` remains tied to the previously deployed candidate manifest
- the existing iPad screenshot/evidence remains TESTBUILD 1 evidence only
- the newly uploaded manifest must not be served under `DDS-05A-TB1`

## 3. TESTBUILD 2 Identity

The next candidate test build is defined as:

**DDS-05A · TESTBUILD 2**

Canonical technical build ID:

`DDS-05A-TB2`

This ID must replace `DDS-05A-TB1` consistently for the next deployed test state.

## 4. TESTBUILD 2 Candidate Asset Source

The authoritative user-provided candidate source for TESTBUILD 2 is:

`constructionAtlas.json@288ffc3ab94bd031e1e5190abcc3d1391c642dfc`

This source contains further crop refinements.

Known relevant changes include:

- BEAM frame crops refined
- FOUNDATION frame crops refined
- HALF_WALL crop refined
- generated timestamp updated

These changes remain presentation-candidate data only.

## 5. Runtime Category Boundary

Only the six already-authorized DDS-05A runtime categories remain active:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

The updated JSON does not authorize new runtime categories.

Still not authorized as runtime construction categories:

- FOUNDATION
- STAIRS
- RAILING
- SUPPORT
- POST
- VERTICAL_BEAM
- HALF_WALL

The presence or refinement of those asset entries must not change construction capability.

## 6. Candidate Package Sync Target

The future TESTBUILD 2 implementation may synchronize the exact user JSON content into:

`assets/construction/dds-05a/candidate/construction-atlas.json`

Normalization remains limited to the already established colocated image reference:

`construction-atlas.png`

No other semantic rewrite of the user manifest is permitted during sync.

## 7. Candidate PNG Status

The atlas PNG remains unchanged for TESTBUILD 2 unless separately authorized later.

Current TESTBUILD 2 scope is JSON-only candidate refinement plus build-ID increment.

No image regeneration or replacement is part of this reconciliation.

## 8. Build-ID Upgrade Scope

For TESTBUILD 2, every previously cache-busted test resource must move together from:

`DDS-05A-TB1`

to:

`DDS-05A-TB2`

This includes:

- visible build metadata
- CSS URL query
- browser-app URL query
- DDS-05A module import queries
- candidate atlas JSON query
- resolved atlas PNG query
- test expectations

Mixed TB1/TB2 resource states are not allowed.

## 9. Visible Build Label

The visible label must change from:

`DDS-05A · TESTBUILD 1`

to:

`DDS-05A · TESTBUILD 2`

Page title and non-authoritative build metadata must identify the same build.

## 10. Cache-Busting Contract

TESTBUILD 2 must use:

`?build=DDS-05A-TB2`

for all test-sensitive resources already covered by the cache-busting contract.

The atlas loader must continue propagating that exact build parameter from manifest URL to PNG URL.

No new cache architecture is introduced.

## 11. Device Evidence Separation

Future screenshots produced after TESTBUILD 2 deployment must be treated as TESTBUILD 2 evidence only.

They must not be mixed with TESTBUILD 1 evidence when judging:

- crop quality
- anchor alignment
- yaw/direction correctness
- sprite visual placement

Build identity must remain visible or otherwise unambiguous.

## 12. Asset Verification Expectation

TESTBUILD 2 exists specifically to evaluate whether the new JSON crop adjustments improve visual alignment.

The updated JSON must still be treated as candidate data.

Its use does not imply:

- crop PASS
- anchor PASS
- direction mapping PASS
- production asset approval

Those remain device/visual-gate decisions.

## 13. Implementation Scope for the Follow-Up

A later TESTBUILD 2 sync implementation may modify only:

- `assets/construction/dds-05a/candidate/construction-atlas.json`
- `index.html`
- `src/dds-04f/browser-app.mjs`
- existing/new DDS-05A tests needed to update TB1 expectations to TB2

`src/dds-05a/atlas-loader.mjs` does not require behavioral change if its generic build propagation remains valid.

`src/dds-05a/sprite-presentation.mjs` does not require change.

## 14. Protected Files

Still protected:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-04f/prototype.css`
- candidate PNG

## 15. Explicit Exclusions

This reconciliation does not authorize:

- immediate JSON sync
- runtime implementation
- PNG replacement
- anchor correction
- yaw/direction correction
- projection correction
- layout change
- new module categories
- DDS-04 authority changes
- TESTBUILD 2 device gate
- completion/freeze decision

## 16. Reconciliation Result

**DDS-05A – TESTBUILD 2 Candidate Asset Sync / Build-ID Reconciliation = DEFINED**

Resolved:

- latest candidate source: `288ffc3a…`
- TESTBUILD 1 preserved as historical evidence state: YES
- next visible build label: **DDS-05A · TESTBUILD 2**
- next technical build ID: **DDS-05A-TB2**
- Candidate JSON sync required: YES
- Candidate PNG change required: NO
- runtime categories expanded: NO
- device gate started: NO
- implementation performed: NO

## 17. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – TESTBUILD 2 Candidate Asset Sync / Build-ID Implementation Authorization**

That authorization may permit only:

- syncing `constructionAtlas.json@288ffc3a…` into the candidate package
- incrementing all TESTBUILD identity/cache references from TB1 to TB2
- updating the corresponding tests

No visual correction beyond the uploaded JSON and no device-gate decision may occur in the same step.
