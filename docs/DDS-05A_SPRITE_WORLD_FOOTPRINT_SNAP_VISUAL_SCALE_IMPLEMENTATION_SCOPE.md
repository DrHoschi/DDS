# DDS-05A – Sprite World Footprint / Snap-Visual Scale – Implementation Scope Reconciliation

Status: **DEFINED / EXACT CALIBRATION SCOPE SET / PRE-AUTHORIZATION BASELINE BLOCKER IDENTIFIED / NOT IMPLEMENTED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Input reconciliation:

- `docs/DDS-05A_SPRITE_WORLD_FOOTPRINT_SNAP_VISUAL_SCALE_RECONCILIATION.md`
- commit `dc81a4cf8724901328e2db25422ffedf4b444460`

TESTBUILD 3 evidence:

- implementation: `6c32ca6875c109aaf5a884325138efa442d48e90`
- iPhone verification: `2648ce54a8a86ea85fddfd7fee0f44db8b66d3e5`
- result: visual footprint alignment NOT PASS

## 1. Purpose

This step defines the exact implementation scope for the first sprite/world-footprint calibration pass.

It determines only:

- where calibration data belongs
- how visual snap pixel landmarks are recorded
- which runtime categories/directions enter the first pass
- how `assetPPU` and visual pivot are solved and validated
- which files a later TESTBUILD 4 implementation may modify

No calibration data is authored in this step.

No runtime, CSS, atlas or build identity is changed in this step.

## 2. Current Branch Baseline Finding

After the preceding footprint reconciliation, the feature branch received one additional asset-manifest commit:

`aad761c416b71fb9bfeea80dfec07bc75dd76bce`

It changes only:

`assets/construction/dds-05a/candidate/construction-atlas.json`

from the TESTBUILD 3 candidate manifest to a newer candidate manifest.

Current manifest state:

- Git blob SHA: `2085d311a179e819fdd536c1fca96bbdebd8daf0`
- `meta.format = asset-lab-atlas-v2`
- `meta.image = constructionAtlas.png`
- `meta.generated = 2026-09-13T13:44:23.889Z`

Current candidate PNG actually present:

- path: `assets/construction/dds-05a/candidate/construction-atlas.png`
- Git blob SHA: `98ec9679daf5623713327f4812202d63a95b9607`

No file currently exists at:

`assets/construction/dds-05a/candidate/constructionAtlas.png`

## 3. Current Loader Compatibility Finding

The existing:

`src/dds-05a/atlas-loader.mjs`

accepts only:

`asset-lab-atlas-v1`

The current branch manifest now declares:

`asset-lab-atlas-v2`

Therefore the current branch contains a post-TB3 candidate-manifest state that is not compatible with the currently frozen/implemented atlas loader.

This discrepancy is not caused by the footprint calibration work.

It must not be silently corrected inside this scope reconciliation.

## 4. TESTBUILD 3 Evidence Binding

The real TESTBUILD 3 iPhone evidence was produced against the earlier candidate manifest:

- blob SHA: `a096abf9945e625b4d9a7c33d26825847164d5fc`
- format: `asset-lab-atlas-v1`
- image: `construction-atlas.png`
- generated: `2026-09-13T12:54:02.199Z`

Therefore:

**TESTBUILD 3 device evidence does not validate the newer atlas-v2 crop set.**

The newer atlas-v2 candidate must not be treated as visually verified merely because it is now on the branch.

## 5. Pre-Authorization Baseline Blocker

Before the later footprint implementation may be authorized, a separate narrow reconciliation must decide the candidate atlas baseline.

It must decide only whether the new atlas-v2 manifest:

- is accepted as the next candidate baseline
- has its image reference normalized/reconciled
- requires loader v2 support
- or is not yet suitable and must not be used for TESTBUILD 4

Until that decision exists:

**TESTBUILD 4 implementation authorization is blocked.**

This scope document can still define the complete footprint-calibration architecture.

## 6. Calibration Data Location

The preferred separate presentation-data file is fixed as:

`assets/construction/dds-05a/candidate/construction-calibration.json`

It must remain separate from:

- DDS-04 snap authority
- raw atlas crop data
- PNG image data

Reason:

the atlas manifest answers:

**which pixels belong to a frame**

while the calibration sidecar answers:

**where authoritative world landmarks appear inside those frame pixels**

These are different semantic layers.

## 7. Calibration Sidecar Format

The later file must use:

`meta.format = dds-05a-sprite-world-calibration-v1`

Conceptual schema:

```json
{
  "meta": {
    "format": "dds-05a-sprite-world-calibration-v1",
    "atlasFormat": "<resolved baseline format>",
    "atlasGenerated": "<resolved baseline generated id>",
    "atlasImage": "<resolved candidate image filename>",
    "coordinateSpace": "frame-local-pixels",
    "runtimeDirections": ["s", "e", "n", "w"],
    "stage": "FLOOR_TB4"
  },
  "frames": {
    "floor_s": {
      "category": "FLOOR",
      "definitionId": "dds04f:floor",
      "yaw": 0,
      "frame": { "x": 0, "y": 0, "w": 0, "h": 0 },
      "visualSnaps": {
        "floor-east": { "x": 0, "y": 0 },
        "floor-west": { "x": 0, "y": 0 },
        "wall-north": { "x": 0, "y": 0 },
        "wall-south": { "x": 0, "y": 0 }
      }
    }
  }
}
```

The zeros above are schema examples only.

This reconciliation does not authorize guessed coordinates.

## 8. Coordinate Contract

Every visual landmark coordinate is measured:

- relative to the top-left of its cropped frame
- x increasing rightward
- y increasing downward
- before runtime scaling
- before CSS transform
- in source-frame pixel units

Atlas-global coordinates are not permitted in the sidecar.

Runtime-screen coordinates are not permitted in the sidecar.

## 9. Frame Binding Contract

Each calibration frame entry must repeat the exact crop rectangle:

`{ x, y, w, h }`

from the resolved candidate atlas manifest.

The calibration validator must reject the frame if the current atlas crop no longer exactly matches the stored calibration crop.

This prevents silently applying old visual landmarks to a newly recropped frame.

## 10. Candidate Asset Revision Binding

The sidecar metadata must also identify:

- atlas format
- atlas generated identifier
- atlas image filename

The implementation tests must additionally bind calibration to the exact candidate image content used for measurement.

Preferred CI binding:

- calculate a deterministic image digest from the candidate PNG
- assert that the expected calibration source digest matches

The exact digest value is populated only after the candidate atlas baseline blocker is resolved.

## 11. Visual Landmark Capture Procedure

The calibration coordinates must be captured from the exact resolved candidate PNG.

Procedure:

1. use the exact crop rectangle from the candidate manifest
2. display the crop at 1:1 source-pixel scale
3. do not resample or stretch the crop
4. mark the visible geometric center of each corresponding connection location
5. record coordinates in frame-local pixels
6. repeat the measurement independently a second time
7. if the two measurements differ by more than 2 px Euclidean distance, remeasure
8. accept the average of the two consistent measurements

The procedure may later be assisted by Sprite Lab / DevForge tooling, but such tooling is not part of this DDS-05A implementation scope.

## 12. No Automatic Edge Guessing

The first calibration pass must not derive visual snap landmarks from:

- alpha bounding boxes
- crop edges
- frame center
- current anchor values
- automatic image-edge detection

Those may not correspond to the actual intended construction connection point.

The landmarks are explicit asset-authoring data.

## 13. First Calibration Pass – Category Boundary

TESTBUILD 4 first calibration pass is limited to:

**FLOOR only**

Reason:

- FLOOR ↔ FLOOR is the strongest confirmed TESTBUILD 3 blocker
- FLOOR has authoritative snap geometry on both ground axes
- one category is sufficient to validate the complete calibration mechanism
- this avoids mixing five asset families into the first calibration correction

No WALL/CORNER/DOOR/BEAM/ROOF calibration is implemented in the first pass.

## 14. First Calibration Pass – Runtime Directions

Only the four directions currently used by the runtime yaw mapping are included:

- `floor_s` – yaw 0°
- `floor_e` – yaw 90°
- `floor_n` – yaw 180°
- `floor_w` – yaw 270°

The unused diagonal atlas frames remain untouched:

- `floor_se`
- `floor_ne`
- `floor_nw`
- `floor_sw`

They may be calibrated only when runtime direction support actually requires them.

## 15. Required FLOOR Visual Landmarks

Each of the four first-pass FLOOR frames must provide all four authoritative FLOOR landmarks:

- `floor-east`
- `floor-west`
- `wall-north`
- `wall-south`

No partial first-pass FLOOR frame is accepted.

These four points provide two independent ground-axis spans.

## 16. Authoritative FLOOR Local Positions

The calibration solver uses the existing frozen profile positions:

- `floor-east = { x: 2, y: 0, z: 0 }`
- `floor-west = { x: -2, y: 0, z: 0 }`
- `wall-north = { x: 0, y: 0, z: 1.3 }`
- `wall-south = { x: 0, y: 0, z: -1.3 }`

These values are read from existing placement snapshot/profile data.

They are not duplicated as new authority in the sidecar.

## 17. Required New Pure Calibration Module

The later implementation may add:

`src/dds-05a/sprite-calibration.mjs`

Its responsibility is presentation-only.

It may contain pure helpers equivalent to:

- `validateCalibrationManifest(...)`
- `loadSpriteCalibration(...)`
- `solveFrameCalibration(...)`
- `solveFamilyCalibration(...)`
- `renderScaleForProjection(...)`

It must not import or mutate DDS-04 authority.

## 18. Unit Projection For Calibration

For a local snap position:

`Q = { x, y, z }`

and authoritative frame yaw `r`:

1. rotate Q around world Y by r
2. project the rotated delta with `S = 1`

The unit screen vector is:

`U = { x: dx - dz, y: (dx + dz)/2 - dy }`

for the rotated delta.

Because these are deltas, scene origin is irrelevant.

## 19. Joint Scale + Pivot Fit

The first-pass solver must not assume the atlas anchor is the correct world-origin pivot.

For one frame with measured landmarks:

`Li = { xi, yi }`

and corresponding unit-projected authoritative snap vectors:

`Ui`

the solver fits:

`Li ≈ P + a * Ui`

where:

- `P` = derived visual pivot in frame-local pixels
- `a` = derived frame asset pixels per projected world unit

Compute means:

`Ubar = mean(Ui)`

`Lbar = mean(Li)`

Then:

`a = Σ dot(Ui - Ubar, Li - Lbar) / Σ ||Ui - Ubar||²`

and:

`P = Lbar - a * Ubar`

This is a uniform-scale + translation fit only.

No extra rotation is fitted.

No non-uniform X/Y scale is fitted.

## 20. Why No Extra Rotation Is Fitted

Yaw/direction selection already defines frame orientation.

Allowing an additional free image rotation would hide:

- wrong yaw mapping
- wrong landmark assignment
- geometrically incompatible artwork

Therefore the calibration fit is deliberately restricted to:

- one positive scalar
- one 2D pivot translation

## 21. Per-Frame Validation

A first-pass FLOOR frame passes only if:

- all four landmarks exist
- all landmark coordinates are finite
- all landmark coordinates are inside the crop rectangle
- derived `assetPPU` is finite
- derived `assetPPU > 0`
- derived pivot is finite
- RMS residual ≤ 2.5 source pixels
- maximum single-landmark residual ≤ 4 source pixels

If any condition fails:

**that frame is not calibration-compatible.**

Runtime must not force-fit it.

## 22. Cross-Direction Family Validation

After all four FLOOR frames pass individually:

- derive one provisional `assetPPU` per frame
- calculate the family mean assetPPU
- require every frame's provisional assetPPU to be within ±5% of the family mean

If the spread exceeds ±5%:

**FLOOR family calibration fails.**

Reason:

rotation must not visibly change the world size of the same module.

## 23. Final FLOOR Family assetPPU

When cross-direction validation passes:

`familyAssetPPU = mean(frameAssetPPU_s, frameAssetPPU_e, frameAssetPPU_n, frameAssetPPU_w)`

Runtime uses the single family value for all four FLOOR directions.

This avoids scale breathing during rotation.

## 24. Final Per-Frame Pivot

After fixing the shared FLOOR `familyAssetPPU`, each frame pivot is recomputed as:

`Pframe = mean(Li - familyAssetPPU * Ui)`

Residuals are then recalculated against the shared family scale.

The same:

- RMS ≤ 2.5 px
- max residual ≤ 4 px

gate applies again.

## 25. Runtime Scale Contract

For the active scene projection:

`S = projection.groundScale`

and accepted FLOOR calibration:

`renderScale = S / familyAssetPPU`

This scale is applied uniformly to the rendered FLOOR sprite around the solved frame pivot.

No independent device-specific sprite scale is permitted.

## 26. Runtime Pivot Contract

For a calibrated FLOOR frame:

- atlas anchor is no longer the runtime pivot authority
- solved calibration pivot becomes the presentation pivot

The raw atlas anchor remains unchanged in the atlas manifest.

Uncalibrated categories continue using existing TB3 anchor behavior.

This avoids changing raw asset metadata during the first calibration proof.

## 27. First-Pass Fallback Boundary

In TESTBUILD 4:

- calibrated FLOOR frames use calibrated scale + pivot
- WALL remains TB3 behavior
- CORNER remains TB3 behavior
- DOOR_OPENING remains TB3 behavior
- BEAM remains TB3 behavior
- ROOF remains TB3 behavior

Missing FLOOR calibration is not allowed to silently fall back.

If the selected runtime FLOOR frame lacks valid calibration:

- render technical fallback for that FLOOR frame
- surface a diagnostic warning
- do not silently use scale 1 and claim calibrated behavior

Other uncalibrated categories remain intentionally unchanged.

## 28. Atlas `scale` Field During First Pass

For calibrated FLOOR frames, the current atlas `scale` field must not be applied as an independent multiplier.

The geometric scale is solely:

`S / familyAssetPPU`

The current value `1` remains present in raw atlas metadata and remains unchanged.

## 29. Exact TESTBUILD 4 Identity

Because real TESTBUILD 3 evidence exists and runtime presentation will change, the later calibrated implementation must use:

Visible:

**DDS-05A · TESTBUILD 4**

Technical:

`DDS-05A-TB4`

All cache-sensitive active resources introduced or touched by the calibration implementation must use TB4 consistently.

## 30. Exact Later File Scope – New Files

After the atlas baseline blocker is separately resolved, the first FLOOR calibration implementation may add exactly:

1. `assets/construction/dds-05a/candidate/construction-calibration.json`
2. `src/dds-05a/sprite-calibration.mjs`
3. `tests/dds-05a/sprite-calibration.test.mjs`

## 31. Exact Later File Scope – Existing Files

The first FLOOR calibration implementation may modify exactly:

4. `src/dds-05a/sprite-presentation.mjs`
5. `src/dds-04f/browser-app.mjs`
6. `index.html`
7. `tests/dds-05a/sprite-presentation.test.mjs`
8. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No CSS change is required for the first calibration implementation.

## 32. Calibration Loading Contract

`browser-app.mjs` may load:

`../../assets/construction/dds-05a/candidate/construction-calibration.json`

with the active TB4 build query.

`sprite-calibration.mjs` may provide the loading/validation helper.

No change to `atlas-loader.mjs` belongs to the footprint-calibration implementation itself.

## 33. sprite-presentation Integration Boundary

`sprite-presentation.mjs` may be extended only to consume an already validated calibration result.

For calibrated FLOOR it may expose:

- solved pivot
- calibrated renderScale
- calibration status

It must not:

- rewrite authoritative transforms
- alter yaw mapping
- alter renderDepth
- alter snap compatibility

## 34. Browser Integration Boundary

`browser-app.mjs` may:

- load the calibration sidecar
- derive/build the FLOOR calibration registry from existing snapshot snapProfiles
- pass calibrated FLOOR presentation data into sprite rendering
- apply calibrated pivot and uniform scale
- preserve the same world screen position from TESTBUILD 3

It must not change:

- scene projection formula
- controller behavior
- target candidate selection
- actual target snap marker world calculation

## 35. Required Calibration Tests

The later implementation must prove at minimum:

1. calibration manifest format validation
2. frame-local coordinate validation
3. exact crop rectangle binding
4. all four FLOOR runtime frames present
5. all four required landmarks present per FLOOR frame
6. two-pass measurement source data accepted only after authoring gate
7. positive finite frame assetPPU
8. joint scale+pivot solution deterministic
9. no extra rotation fitted
10. no non-uniform scale fitted
11. per-frame RMS residual ≤ 2.5 px
12. per-frame max residual ≤ 4 px
13. four-direction assetPPU spread within ±5%
14. one common FLOOR familyAssetPPU is used
15. final per-frame pivots recomputed against shared family scale
16. runtime `renderScale = S / familyAssetPPU`
17. renderScale changes proportionally between S=24 and S=44
18. calibrated FLOOR does not independently multiply atlas scale
19. calibrated FLOOR missing-data path does not silently use scale 1
20. uncalibrated categories retain TB3 presentation behavior
21. DDS-04 protected files unchanged
22. active build identity = TB4
23. no active TB3 cache identity remains in the changed runtime/testbuild files

## 36. TESTBUILD 4 Device Gate Scope

TESTBUILD 4 is a narrow proof of the FLOOR calibration mechanism.

Required real-device evidence:

### iPhone

- at least three connected FLOOR modules
- valid FLOOR Ghost
- visible snap target
- rotation through all four runtime yaw directions at least once

### iPad

- same core floor chain test
- confirm world footprint scales proportionally with larger S
- confirm floor continuity does not diverge due device size

The first TB4 gate judges:

- FLOOR ↔ FLOOR continuity
- FLOOR Ghost continuity
- snap marker ↔ calibrated floor-art landmark
- rotation scale consistency
- iPhone/iPad world-size consistency

It does not yet gate:

- WALL
- CORNER
- DOOR
- BEAM
- ROOF

## 37. Explicitly Protected From Footprint Implementation

The later first-pass footprint implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04f/prototype.css`
- candidate PNG
- raw atlas crop/anchor/scale data
- yaw mapping
- scene projection formula
- renderDepth behavior

## 38. Atlas Baseline Files Are Not Footprint-Scope Files

The footprint implementation itself does not authorize modification of:

- `assets/construction/dds-05a/candidate/construction-atlas.json`
- `src/dds-05a/atlas-loader.mjs`

Any required reconciliation of:

- atlas v1 vs v2
- manifest image filename
- loader-supported format

must be completed separately before footprint implementation authorization.

## 39. Deferred Calibration Families

After a successful FLOOR TB4 proof, later separately reconciled calibration stages may cover:

1. WALL
2. DOOR_OPENING
3. CORNER
4. BEAM

Each must use only the runtime directions actually consumed at that time.

ROOF remains deferred until an explicit second authoritative visual footprint reference exists.

## 40. Scope Result

**DDS-05A – Sprite World Footprint / Snap-Visual Scale – Implementation Scope Reconciliation = DEFINED**

Exact decisions:

- calibration storage: separate candidate sidecar JSON
- first category: FLOOR only
- first directions: S / E / N / W only
- required visual landmarks per frame: 4
- measurement space: frame-local source pixels
- measurement repeat tolerance: ≤2 px
- calibration fit: uniform scale + pivot translation
- extra image rotation: FORBIDDEN
- non-uniform scale: FORBIDDEN
- per-frame RMS residual: ≤2.5 px
- per-frame max residual: ≤4 px
- cross-yaw assetPPU spread: ±5%
- runtime scale: `S / familyAssetPPU`
- runtime calibrated pivot: solved from visual landmarks
- atlas anchor modified: NO
- raw atlas modified by footprint implementation: NO
- TESTBUILD 4 files after prerequisite resolution: exactly 8
- current atlas-v2 continuity discrepancy: **BLOCKER BEFORE IMPLEMENTATION AUTHORIZATION**

## 41. Next Admissible Step

Because the feature branch currently contains the post-TB3 atlas-v2 manifest discrepancy, the next admissible step is exclusively:

**DDS-05A – Candidate Atlas V2 Baseline / Loader / Image-Reference Continuity Reconciliation**

That step must decide whether `aad761c4…` becomes the candidate baseline and reconcile only:

- manifest format compatibility
- manifest image reference
- loader compatibility boundary
- relationship to TESTBUILD 3 evidence

No footprint calibration implementation may occur in that step.

Only after that baseline continuity is resolved may the separate:

**DDS-05A – Sprite World Footprint / Snap-Visual Scale – Implementation Authorization**

be considered.
