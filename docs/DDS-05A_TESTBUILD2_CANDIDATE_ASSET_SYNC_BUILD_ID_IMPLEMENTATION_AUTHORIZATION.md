# DDS-05A – TESTBUILD 2 Candidate Asset Sync / Build-ID Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED / TESTBUILD 2 NOT DEPLOYED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Reconciliation authority:

- `docs/DDS-05A_TESTBUILD2_CANDIDATE_ASSET_SYNC_BUILD_ID_RECONCILIATION.md`

Reconciliation commit:

- `7d70b55b4260db8e8179e974d9204c11a8def4a3`

Current implemented TESTBUILD 1 baseline:

- `ded33dd9e16822c0ac0cb60d32c578c57664b8de`

Latest user candidate manifest:

- `constructionAtlas.json@288ffc3ab94bd031e1e5190abcc3d1391c642dfc`

## 1. Authorization Decision

The narrow TESTBUILD 2 candidate asset sync and build-ID increment is authorized.

This authorization exists only to:

1. synchronize the user's latest candidate JSON into the DDS-05A candidate package
2. increment all TESTBUILD identity/cache references from TB1 to TB2
3. update the corresponding tests

No other visual or gameplay change is authorized.

## 2. Authorized TESTBUILD 2 Identity

Visible label:

**DDS-05A · TESTBUILD 2**

Canonical technical build ID:

`DDS-05A-TB2`

All test-sensitive resources must use this exact technical ID consistently.

## 3. Authorized Candidate Source

The only authorized user candidate source for this implementation is:

`constructionAtlas.json@288ffc3ab94bd031e1e5190abcc3d1391c642dfc`

The implementation may copy that manifest content into:

`assets/construction/dds-05a/candidate/construction-atlas.json`

Normalization is limited to the already-established colocated image reference:

`construction-atlas.png`

No other semantic rewrite is authorized.

## 4. Authorized Existing Files

Implementation may modify only:

- `assets/construction/dds-05a/candidate/construction-atlas.json`
- `index.html`
- `src/dds-04f/browser-app.mjs`
- existing DDS-05A test files required to update TESTBUILD expectations

## 5. Authorized Test Updates

Tests may be updated only to prove:

- visible build label is TESTBUILD 2
- technical build ID is `DDS-05A-TB2`
- CSS URL uses TB2
- browser-app URL uses TB2
- DDS-05A module import URLs use TB2
- candidate JSON request uses TB2
- resolved PNG URL receives TB2 through the existing generic loader behavior
- synchronized candidate JSON matches the authorized source except for normalized image filename
- no protected files changed

No new behavioral test domain is authorized.

## 6. Candidate PNG Protection

The PNG remains unchanged.

Implementation must not modify:

- `assets/construction/dds-05a/candidate/construction-atlas.png`

No image regeneration, replacement or optimization is authorized.

## 7. Atlas Loader Protection

`src/dds-05a/atlas-loader.mjs` must not be behaviorally modified in this block.

Its existing generic propagation of:

`?build=<active-build-id>`

from manifest URL to PNG URL is already sufficient.

TESTBUILD 2 only changes the value from TB1 to TB2 upstream.

## 8. Sprite Presentation Protection

`src/dds-05a/sprite-presentation.mjs` must remain unchanged.

This authorization does not permit:

- projection changes
- yaw-direction changes
- anchor logic changes
- depth-order changes
- sprite scaling changes

## 9. Runtime Category Boundary

Only the existing six DDS-05A runtime categories remain active:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

No newly refined atlas entry may become a runtime category.

Not authorized:

- FOUNDATION
- STAIRS
- RAILING
- SUPPORT
- POST
- VERTICAL_BEAM
- HALF_WALL

## 10. TESTBUILD 1 Preservation

TESTBUILD 1 remains a distinct historical evidence state.

Implementation must not rewrite or relabel existing TESTBUILD 1 evidence.

The new deployed state becomes TESTBUILD 2 only after this authorized implementation is performed.

## 11. Build-ID Upgrade Requirement

Every active TESTBUILD identifier/cache reference must move together from:

`DDS-05A-TB1`

to:

`DDS-05A-TB2`

Mixed TB1/TB2 references are forbidden.

This includes:

- visible page label
- page title/metadata
- non-authoritative `data-build-id`
- CSS query
- browser-app query
- DDS-05A module import queries
- atlas JSON query
- test expectations

The PNG receives TB2 through the already implemented atlas-loader propagation.

## 12. Protected Authority Files

Implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-05a/atlas-loader.mjs`
- `src/dds-04f/prototype.css`
- candidate PNG

## 13. Explicit Exclusions

This authorization does not permit:

- any JSON correction beyond the exact user upload
- manual crop changes
- anchor changes
- yaw/direction corrections
- projection corrections
- CSS/layout changes
- PNG changes
- new runtime categories
- DDS-04 authority changes
- TESTBUILD 2 device-gate execution
- completion/freeze decision

## 14. Authorization Result

**DDS-05A – TESTBUILD 2 CANDIDATE ASSET SYNC / BUILD-ID IMPLEMENTATION = AUTHORIZED**

Authorized scope:

- sync `constructionAtlas.json@288ffc3a…`
- normalize only its candidate image reference to `construction-atlas.png`
- change all active TESTBUILD identity/cache references from TB1 to TB2
- update corresponding DDS-05A tests

Current status after this document:

**AUTHORIZED / NOT IMPLEMENTED / TESTBUILD 2 NOT DEPLOYED**

## 15. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – TESTBUILD 2 Candidate Asset Sync / Build-ID Implementation**

That step may perform only the authorized JSON sync, TB1→TB2 identity/cache update and test update.

No additional visual correction and no device-gate decision may occur in the same step.
