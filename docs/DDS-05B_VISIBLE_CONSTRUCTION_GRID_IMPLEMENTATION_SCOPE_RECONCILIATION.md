# DDS-05B – Visible Construction Grid / Placement Presentation – Implementation Scope Reconciliation

Status: RECONCILED / EXACT MINIMAL IMPLEMENTATION SCOPE IDENTIFIED / NOT IMPLEMENTED / NOT AUTHORIZED

Baseline branch: `feature/dds-05a-sprite-construction-presentation`
Baseline HEAD at reconciliation start: `3607a904cc674f069280bb2f014148746b70885b`
DDS-05A remains FROZEN.

## 1. Purpose

Reconcile the already defined DDS-05B visible 9×9 construction-grid presentation against the actual frozen runtime and identify the smallest later implementation scope. This step does not authorize or perform implementation.

## 2. Frozen-code findings

### `src/dds-04f/browser-app.mjs`

This file already owns the browser scene rendering path:

- `currentSceneProjection()` creates the active scene projection.
- `scenePoint()` delegates world-to-screen conversion to `projectWorldPoint()`.
- `renderScene(state)` clears and rebuilds all visual scene layers.
- existing modules, snap targets and ghost preview are all created from the same projection/state snapshot.

Therefore DDS-05B does not need a new rendering authority or a new projection module. The visible grid can be derived and rendered inside this presentation path from the existing state and projection.

Required later DDS-05B change in this file:

1. derive the fixed logical 9×9 cell set around the DDS construction-grid origin, with 1 cell = 2 world units in X/Z;
2. project grid-cell corners/centres through the existing scene projection only;
3. derive OCCUPIED cells from existing placed FLOOR instances only;
4. derive VALID TARGET / SELECTED TARGET visual states only from existing target-selection/ghost state;
5. append a non-interactive grid presentation layer before modules/snap controls so authority and input remain unchanged;
6. preserve all existing atlas, sprite, snap-target, ghost, placement, material and wolf behavior.

No controller mutation and no new placement/occupancy state may be introduced here.

### `src/dds-04f/prototype.css`

This file already owns:

- `.construction-scene` clipping and background;
- `.scene-ground` presentation;
- module, ghost and snap-target visual layers;
- touch behavior;
- iPhone and iPad responsive contracts.

Required later DDS-05B change in this file:

1. add styling for the presentation-only grid layer/cells/lines;
2. ensure `pointer-events: none` for the full grid presentation;
3. visually distinguish FREE, OCCUPIED, VALID TARGET and SELECTED TARGET without obscuring sprites or snap buttons;
4. keep the grid beneath modules/ghost/snap targets in stacking order;
5. allow natural scene clipping on iPhone while retaining the same world geometry on iPad/desktop;
6. do not introduce a separate phone grid geometry or hover-only behavior.

### `tests/dds-05b/visible-construction-grid.test.mjs` – new file

A dedicated DDS-05B regression test is appropriate and sufficient for the new presentation contract.

The later test must verify at minimum:

- logical grid contract is 9×9;
- cell pitch is 2 world units;
- grid presentation uses the shared world-to-screen projection path rather than a separate CSS-only authority;
- grid is presentation-only/non-interactive;
- occupied-state derivation is tied to FLOOR instances rather than a duplicate occupancy table;
- target states come from existing placement/selection state;
- grid layer is rendered beneath modules/snap controls;
- smartphone clipping does not redefine the grid geometry;
- no Y stacking/elevation authority is introduced.

## 3. Existing files that do NOT need modification

The actual frozen code confirms that DDS-05B does not require changes to:

- `index.html`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-05a/atlas-loader.mjs`
- Candidate Atlas JSON/image assets
- `tests/dds-04f/construction-ui-controller.test.mjs`
- `tests/dds-04f/responsive-contract.test.mjs`
- existing DDS-05A tests
- `.github/workflows/dds-05a-regression.yml`

The existing responsive test already protects the separate iPhone/iPad layout contracts. DDS-05B-specific responsive/grid assertions can be contained in the new DDS-05B test file; changing the frozen DDS-04F responsive test is therefore not required by the reconciled minimum scope.

## 4. Exact later implementation scope

Only the following files are required for the minimal DDS-05B implementation:

1. MODIFY `src/dds-04f/browser-app.mjs`
2. MODIFY `src/dds-04f/prototype.css`
3. ADD `tests/dds-05b/visible-construction-grid.test.mjs`

No other runtime, test, asset, workflow or document file is required for the implementation itself unless a later separate reconciliation explicitly proves otherwise.

## 5. Authority boundaries

DDS-05B must remain presentation-only.

The following remain authoritative and unchanged:

- DDS-05A/Frozen construction transforms;
- DDS-04C placement and occupancy authority;
- current snap candidate generation and selection;
- current world-to-screen projection;
- current sprite descriptor/atlas contract;
- current module Y values and depth rules.

The visible grid must never become a second source of truth for placement, occupancy, snapping, rotation or world coordinates.

## 6. Explicit exclusions

Not authorized by DDS-05B:

- Y stacking/storeys/elevation;
- camera pan/zoom;
- drag placement;
- clickable grid cells as a new placement mechanism;
- new occupancy data structures;
- projection changes;
- sprite calibration / TESTBUILD 4;
- atlas edits;
- DDS-05C+ capabilities;
- changes to DDS-05A FROZEN behavior.

## 7. Reconciliation result

DDS-05B can be implemented with a strict three-file scope: two existing presentation files plus one new dedicated regression test. No engine, controller, snap, atlas, projection or existing responsive-test change is required.

Status: **RECONCILED / THREE-FILE MINIMAL SCOPE / DDS-05A FROZEN UNCHANGED / NO IMPLEMENTATION AUTHORIZED**
