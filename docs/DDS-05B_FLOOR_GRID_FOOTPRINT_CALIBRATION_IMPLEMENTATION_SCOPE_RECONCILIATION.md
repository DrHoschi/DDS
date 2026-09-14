# DDS-05B – FLOOR/Grid Footprint Calibration Implementation Scope Reconciliation

Status: RECONCILED – NO IMPLEMENTATION AUTHORIZED

## Basis

- Active device baseline: `DDS-05B · TESTBUILD 1` / `DDS-05B-TB1`
- Last verified implementation head before calibration documentation: `760c887dbdd1d4678026cc8a6fa160bbed201f4a`
- FLOOR/Grid Footprint Calibration Reconciliation: `6b4be70475b602a0506d7273b2309383a89686a9`
- FLOOR/Grid Footprint Calibration Definition: `3f063a399acceeb76e3ef5d2e948d235cb41b980`

## Reconciliation correction

The prior reconciliation treated the iPhone CSS rule `.scene-module__sprite { --sprite-scale: 0.88; }` as an active cause of the small FLOOR rendering. That conclusion is corrected here.

`browser-app.mjs` applies `sprite.style.setProperty("--sprite-scale", String(descriptor.scale))` directly on each sprite element. The descriptor scale currently comes from the atlas entry/defaults. Because the custom property is set inline on the same element, the inline value wins over the stylesheet declaration. Therefore the current atlas sprites are not actually being reduced to 0.88 by that media-query rule.

The active FLOOR entries currently carry `scale: 1` and `anchorX: 0.5`, `anchorY: 0.85`. The logical FLOOR neighbour spacing remains exactly two world units and matches the visible grid cell pitch. The remaining mismatch is presentation calibration: visible FLOOR footprint versus projected 1x1 grid footprint.

## Implementation strategy boundary

The first implementation must use the already-supported per-frame atlas `scale` metadata. No new scaling system is required.

The implementation may calibrate only the four authoritative FLOOR directions used by runtime yaw mapping:

- `floor_s`
- `floor_e`
- `floor_n`
- `floor_w`

The non-authoritative/export convenience FLOOR frames (`floor_se`, `floor_ne`, `floor_nw`, `floor_sw`, `floor_normal`, `floor_hover`, `floor_ghost`, `floor_invalid`) must not be changed unless a later separate reconciliation demonstrates that runtime or tooling requires them for this calibration.

Anchor values remain unchanged during the first scale calibration. Anchor adjustment is a later fine-calibration action only if correct footprint size still leaves visible positional offset.

## Exact file scope – first calibration implementation

The following existing files are sufficient and are the maximum normal scope for the first implementation:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
   - change only `scale` for the four authoritative FLOOR runtime frames;
   - do not change WALL or any other category;
   - do not change FLOOR anchors in the first implementation;
   - do not change frame rectangles in the first implementation unless the conditional crop path below is separately triggered.

2. `tests/dds-05a/sprite-presentation.test.mjs`
   - add/adjust presentation-only assertions proving the four authoritative FLOOR descriptors resolve the calibrated scale;
   - prove at least one non-FLOOR category remains unaffected;
   - do not change projection, snap or authority expectations.

3. `index.html`
   - advance visible identity from `DDS-05B · TESTBUILD 1` to `DDS-05B · TESTBUILD 1.1`;
   - advance CSS/browser cache id to `DDS-05B-TB1.1`.

4. `src/dds-04f/browser-app.mjs`
   - advance `EXPECTED_BUILD_ID` and the existing module-import cache ids to `DDS-05B-TB1.1`;
   - no FLOOR placement or rendering algorithm change is authorized here.

5. `tests/dds-05a/testbuild-cache-busting.test.mjs`
   - update only existing build identity/cache-busting expectations and example URLs to TESTBUILD 1.1.

## Conditional crop path – not part of first implementation by default

Atlas frame rectangle changes are allowed only if the first scale calibration or direct alpha-bound evidence demonstrates that transparent padding prevents a clean 1x1 footprint calibration.

If and only if that condition is established, these files may additionally require changes in a separately authorized crop implementation:

6. `assets/construction/dds-05a/candidate/construction-atlas.json`
   - authoritative FLOOR frame `x/y/w/h` only, with anchor recalculation only if crop geometry mathematically requires preserving the same visual pivot.

7. `tests/dds-05a/atlas-loader.test.mjs`
   - only assertions tied directly to changed authoritative FLOOR frame coordinates/dimensions.

The PNG atlas image itself is not authorized to change for metadata-only crop calibration. A regenerated image would require a separate asset-pipeline authorization.

## Explicitly outside scope

The following must remain unchanged during the first FLOOR scale calibration:

- `src/dds-04f/construction-ui-controller.mjs`
- FLOOR snap points / two-world-unit neighbour spacing
- `GRID_CELL_WORLD_SIZE = 2`
- grid geometry and state derivation
- `src/dds-05a/sprite-presentation.mjs` logic
- `src/dds-05a/atlas-loader.mjs` logic
- `src/dds-04f/prototype.css`
- WALL, CORNER, DOOR_OPENING, ROOF and BEAM atlas metadata
- all WALL calibration
- projection constants / world-to-screen mapping
- placement authority / occupancy / undo / rotation
- workflow and CI topology
- atlas PNG
- DDS-05C+ work

The existing iPhone CSS `--sprite-scale: 0.88` rule is deliberately left untouched because it is not active over the inline atlas scale in the current sprite path; removing dead/legacy styling is cleanup, not part of this calibration.

## Required first implementation result

After separate authorization and implementation:

- visible build identity is `DDS-05B · TESTBUILD 1.1`;
- the four authoritative FLOOR runtime directions use one common calibrated presentation scale unless evidence requires direction-specific values;
- adjacent logical FLOOR cells remain exactly two world units apart;
- no controller/grid/snap/projection authority changes occur;
- iPhone device evidence can then determine whether visible FLOOR construction edges meet edge-to-edge for the 1x1 grid footprint;
- if scale alone cannot achieve this because of transparent padding, stop and reconcile the conditional crop path before changing frame rectangles.
