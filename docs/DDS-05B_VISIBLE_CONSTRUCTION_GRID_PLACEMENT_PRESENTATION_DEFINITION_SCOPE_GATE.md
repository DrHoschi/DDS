# DDS-05B – Visible Construction Grid / Placement Presentation Definition / Scope Gate

## Status

DEFINED / SCOPE-GATED / NOT AUTHORIZED / NOT IMPLEMENTED

## Baseline

- DDS-05A completion baseline is FROZEN.
- DDS-05B reconciliation baseline commit: `41da6ee880aaba1d6a6dfe65d17f1207222f86a7`.
- DDS-05B is presentation-only and MUST NOT introduce a second grid, occupancy, placement, snap, or construction authority.

## Purpose

Make the already authoritative DDS-05A construction grid visually readable in the 45° / 2.5D construction scene so that FLOOR placement, occupied cells, valid placement targets, and the relation between sprites and snap positions can be understood spatially on iPhone, iPad, and larger layouts.

## Grid geometry contract

- Logical grid extent: 9 × 9 cells.
- Cell size: 2 world units × 2 world units in X/Z.
- Logical center: world origin `(0, 0, 0)`.
- Grid cell centers therefore lie on even X/Z world coordinates relative to the origin.
- Grid corners/edges MUST be generated in world coordinates and projected with the existing DDS-05A scene projection.
- No CSS-only skewed square, static background image, SVG approximation, or independent pixel grid may become authoritative.
- The visible viewport may clip the 9 × 9 grid. Clipping MUST NOT change logical grid extent or cell identity.

## Presentation layers

Rendering order is defined conceptually as:

1. existing scene background / ground presentation,
2. DDS-05B grid surface and grid lines,
3. optional cell-state fills/highlights,
4. existing placed construction sprites,
5. existing ghost preview,
6. existing snap-target controls and HUD.

The grid layer is non-interactive and MUST use `pointer-events: none` or an equivalent guarantee.

## Cell visual states

### FREE

- Default grid cell.
- Very low-contrast translucent surface/outline.
- Must remain readable without visually competing with sprites.
- No implication that every FREE cell is currently a valid placement target.

### OCCUPIED

- Derived only from existing placed FLOOR instances / authoritative construction state.
- Slightly stronger neutral shading than FREE.
- No new occupancy registry or cached authority may be introduced.

### VALID TARGET

- Derived only from existing current placement candidates that correspond to FLOOR-cell placement.
- Highlighted with a restrained positive/green treatment.
- Existing snap-target buttons remain the actionable target control.
- A highlighted cell MUST NOT create a new clickable placement path.

### SELECTED TARGET

- Derived only from the existing selected target candidate.
- Stronger than VALID TARGET and visually tied to the existing selected snap marker.
- Must remain distinguishable underneath the ghost sprite.

### INVALID

- DDS-05B does not paint the entire grid as invalid by default.
- An invalid ghost may retain the existing invalid ghost/snap presentation.
- No new per-cell invalidity engine is authorized.

## Grid-line appearance

- Lines follow the projected 2-world-unit cell boundaries.
- Line weight must remain visually light; no heavy editor/CAD appearance.
- Outer 9 × 9 boundary may be slightly stronger than internal cell boundaries.
- Grid must visually sit on the ground plane and preserve the established 45° / 2.5D projection.
- Grid presentation must not rotate independently of the world projection.

## iPhone / iPad responsive contract

### iPhone

- The logical grid remains 9 × 9.
- It is acceptable and expected that the scene viewport shows only the relevant central portion at once.
- No reduction to a smaller logical grid is permitted.
- Grid must not force horizontal page overflow or resize the overall application shell.
- Snap controls retain touch-sized targets and remain above the grid.

### iPad / larger layouts

- More of the 9 × 9 extent may naturally be visible because of the larger scene viewport.
- Geometry, cell size, and authority must remain identical to iPhone.
- No separate tablet grid model or alternate cell spacing is permitted.

## Relationship to sprites and TESTBUILD 4 calibration

- DDS-05B does not calibrate sprite scale, pivot, crop, or atlas coordinates.
- Existing sprites may still look visually imperfect relative to the grid until the later sprite-calibration block.
- DDS-05B provides the spatial reference needed to evaluate that later calibration.
- No TESTBUILD 4 calibration logic is authorized by this gate.

## Runtime implementation scope – permitted later, only after separate authorization

Existing files that may be modified:

1. `src/dds-04f/browser-app.mjs`
   - derive visible 9 × 9 grid geometry from world coordinates;
   - project grid vertices through the existing scene projection;
   - derive presentation states from existing construction/placement snapshot data;
   - insert the non-interactive grid layer at the correct render depth.

2. `src/dds-04f/prototype.css`
   - visual styling for grid lines, cells, occupied/valid/selected presentation;
   - responsive clipping/readability rules only;
   - no authority logic.

Test scope permitted later:

3. A dedicated DDS-05B test file under `tests/dds-05b/` MAY be added for pure presentation/contract checks.

4. Existing `tests/dds-04f/responsive-contract.test.mjs` MAY be modified only if needed to assert that the grid does not break the already frozen iPhone/iPad responsive contract.

## Explicitly excluded files / behavior

Unless a later reconciliation explicitly proves otherwise, DDS-05B MUST NOT modify:

- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04b/construction-state.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-05a/atlas-loader.mjs`
- Candidate atlas JSON or PNG
- material/stability authority
- wolf-response authority
- placement occupancy rules
- snap profile coordinates
- sprite frame selection
- sprite scale/pivot calibration
- Y stacking / storeys / elevation authority
- TESTBUILD 4 calibration implementation
- DDS-05A frozen contracts

## Acceptance contract for a later implementation

A future DDS-05B implementation can pass only when all of the following are evidenced:

- visible projected grid uses the existing world projection;
- logical extent is 9 × 9 with 2-world-unit cells;
- central/start FLOOR aligns to its corresponding grid cell;
- four orthogonal neighbouring FLOOR targets align to adjacent grid cells;
- occupied FLOOR cells are derived from existing construction instances;
- valid and selected target highlighting follows existing placement candidate state;
- no grid element captures pointer/touch input;
- existing snap selection, rotation, place, undo, reset, material, and wolf behavior remains unchanged;
- iPhone does not gain horizontal page overflow and touch targets remain usable;
- iPad remains readable with the same logical geometry;
- DDS-04F/DDS-05A regression suite remains green;
- no TESTBUILD 4 calibration or Y-stacking capability is introduced.

## Gate result

DDS-05B presentation behavior and later implementation scope are sufficiently defined for a separate Implementation Scope Reconciliation / Authorization sequence.

No implementation is authorized by this document.
