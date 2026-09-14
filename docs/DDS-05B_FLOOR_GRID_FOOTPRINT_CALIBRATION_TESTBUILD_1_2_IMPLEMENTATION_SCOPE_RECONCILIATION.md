# DDS-05B – FLOOR/Grid Footprint Calibration TESTBUILD 1.2 Implementation Scope Reconciliation

Status: RECONCILED — NOT AUTHORIZED — NOT IMPLEMENTED

## Basis

- TESTBUILD 1.2 Definition commit: `0d194102fe1a6f70e6424333926f092ef5be4376`
- Current visible/device build: `DDS-05B · TESTBUILD 1.1`
- Current technical build id: `DDS-05B-TB1.1`
- Current authoritative runtime FLOOR calibration scale: `1.15`
- Intended TESTBUILD 1.2 calibration probe: `1.30`

## Current-state verification

The current atlas manifest contains `scale: 1.15` only on the four authoritative runtime FLOOR directions:

- `floor_s`
- `floor_e`
- `floor_n`
- `floor_w`

The diagonal FLOOR frames remain at `scale: 1`. FLOOR crop and anchor metadata remain unchanged.

The active browser/testbuild identity is still `DDS-05B-TB1.1`, and the visible label is still `DDS-05B · TESTBUILD 1.1`.

The existing sprite-presentation regression test explicitly asserts the TESTBUILD 1.1 FLOOR scale of `1.15`, so that test must be updated with the calibration probe.

The existing cache-busting regression test explicitly asserts `DDS-05B-TB1.1` / `DDS-05B · TESTBUILD 1.1`, so that test must be updated with the build identity.

## Exact implementation scope

The TESTBUILD 1.2 implementation can and should reuse the same exact five-file scope used for TESTBUILD 1.1:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
2. `tests/dds-05a/sprite-presentation.test.mjs`
3. `index.html`
4. `src/dds-04f/browser-app.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No additional production, presentation, controller, loader, CSS, grid, snap, projection, atlas-image, or workflow file is required.

## Permitted future changes within those files

### 1. construction-atlas.json

Only the four authoritative runtime FLOOR entries may change:

- `floor_s.scale`: `1.15` → `1.30`
- `floor_e.scale`: `1.15` → `1.30`
- `floor_n.scale`: `1.15` → `1.30`
- `floor_w.scale`: `1.15` → `1.30`

No `x/y/w/h`, `anchorX`, `anchorY`, diagonal FLOOR frame, other category, metadata, image filename, or formatting-wide rewrite is permitted.

### 2. sprite-presentation.test.mjs

Update only the existing FLOOR calibration assertion from TESTBUILD 1.1 / `1.15` to TESTBUILD 1.2 / `1.30`, while preserving assertions that:

- the four authoritative runtime FLOOR directions share the same scale;
- their existing anchors remain unchanged;
- diagonal FLOOR frames remain uncalibrated at `1`;
- non-FLOOR sprite families remain unchanged.

No projection, yaw, snap, depth, or descriptor behavior test may be changed.

### 3. index.html

Advance only the active build identity/cache references from:

- visible: `DDS-05B · TESTBUILD 1.1`
- technical: `DDS-05B-TB1.1`

to:

- visible: `DDS-05B · TESTBUILD 1.2`
- technical: `DDS-05B-TB1.2`

This includes the existing visible/meta/title/data-build-id/CSS/browser-entry cache-buster occurrences only.

### 4. browser-app.mjs

Advance only:

- the three active module-import cache ids;
- `EXPECTED_BUILD_ID`;

from `DDS-05B-TB1.1` to `DDS-05B-TB1.2`.

No grid, render, module, sprite-style, snap-target, projection, state, event, or atlas-loading behavior may be changed.

### 5. testbuild-cache-busting.test.mjs

Update only the existing TESTBUILD identity/cache-busting contract from 1.1 to 1.2, including expected atlas-image build query propagation and stale-build checks. Preserve all existing behavioral coverage.

## Explicitly outside scope

The following remain not authorized for TESTBUILD 1.2:

- FLOOR anchor/pivot changes;
- FLOOR frame crop changes;
- atlas PNG replacement or editing;
- diagonal FLOOR calibration;
- CSS changes;
- grid geometry or grid styling changes;
- FLOOR snap changes;
- construction controller changes;
- projection changes;
- atlas-loader changes;
- WALL/CORNER/DOOR/ROOF/BEAM changes;
- CI/workflow changes;
- iPad work;
- DDS-05C+;
- freeze/completion actions.

## Regression/device requirement after later implementation

After separately authorized implementation:

1. regression must run against the exact final implementation head;
2. all DDS-04F + DDS-05A + DDS-05B tests must pass;
3. the iPhone must visibly show `DDS-05B · TESTBUILD 1.2`;
4. FLOOR placement must then be evaluated specifically for edge-to-edge fit against adjacent 1×1 grid cells;
5. if `1.30` is still wrong, no WALL work starts — the device result is reconciled first;
6. if scale becomes limited by transparent padding or pivot placement, scale iteration stops and crop/anchor receives its own separate reconciliation.

## Reconciliation result

TESTBUILD 1.2 requires no scope expansion beyond the established five-file calibration/build-identity pattern. The later implementation may therefore be authorized against exactly these five files and no others.
