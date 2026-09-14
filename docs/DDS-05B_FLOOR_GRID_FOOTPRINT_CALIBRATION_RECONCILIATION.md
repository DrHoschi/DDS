# DDS-05B – FLOOR/Grid Footprint Calibration Reconciliation

Status: RECONCILED – NO IMPLEMENTATION AUTHORIZED

## Basis

Current tested runtime: `DDS-05B · TESTBUILD 1` / `DDS-05B-TB1`.

## Target

Adjacent logical FLOOR modules must visually fill adjacent 1×1 construction-grid cells edge-to-edge. This step concerns presentation calibration only. WALL and all other categories are excluded.

## Findings

### 1. Grid / authoritative FLOOR spacing is correct and is not the defect

- Visible grid cell size is `GRID_CELL_WORLD_SIZE = 2` world units.
- Authoritative FLOOR neighbour snap points are exactly at `x/z = ±2` world units.
- Therefore adjacent FLOOR instances are already committed at the correct neighbouring logical cell centres.
- Do not change FLOOR snap positions, grid cell size, placement authority, occupancy or topology to solve the visible gap.

### 2. Projection is internally consistent

The visible grid and module positions use the same DDS-05A world-to-screen projection. A 2-world-unit FLOOR neighbour offset therefore maps to the same screen-space pitch used by the visible grid. Projection does not explain the gap and must remain unchanged for this calibration.

### 3. Current FLOOR atlas contract

The active directional FLOOR entries use:

- frame: `100 × 80 px`
- `anchorX = 0.5`
- `anchorY = 0.85`
- atlas entry `scale = 1`

The anchor controls placement of the image relative to the logical cell centre. It can correct vertical/footpoint alignment, but changing anchor alone cannot make neighbouring sprites physically wider/taller and therefore cannot remove the observed inter-tile gap.

### 4. Smartphone CSS introduces a definite additional scale reduction

For `max-width: 430px`, all sprite categories currently receive:

`--sprite-scale: 0.88`

The runtime applies the atlas scale to the same CSS variable before CSS cascade. On iPhone this media-query value therefore makes the rendered sprite smaller than its nominal atlas-frame size. This is a confirmed contributor to the FLOOR footprint being visibly smaller than one grid cell.

Because this rule affects every sprite category, a FLOOR calibration must not simply remove/change the global smartphone rule without separately reconciling effects on WALL/CORNER/DOOR/ROOF/BEAM.

### 5. Atlas transparent padding remains a possible secondary contributor

The JSON frame dimensions alone do not prove how much of each `100 × 80` FLOOR frame is occupied by non-transparent pixels. The device screenshots show the visible floor artwork smaller than the projected cell diamond, so transparent margin inside the frame may contribute in addition to the 0.88 mobile scale.

This must be treated as a presentation measurement issue, not as world/grid authority.

## Reconciliation conclusion

The visible FLOOR gap is a presentation calibration defect, not a placement/grid defect.

Confirmed cause:
- smartphone sprite down-scaling to 0.88.

Possible additional cause:
- transparent padding / effective artwork bounds inside the 100×80 FLOOR atlas frame.

Not the cause of inter-tile spacing:
- FLOOR snap distance,
- grid cell size,
- world-to-screen projection,
- anchor alone.

Anchor/pivot may still require a small follow-up adjustment after footprint size is corrected so the calibrated artwork sits exactly on the cell diamond.

## Required next definition before implementation

A separate FLOOR-only calibration definition must establish the intended rendered footprint against one projected 1×1 cell and choose the narrowest presentation-only mechanism. Preferred order:

1. preserve authoritative grid/snap/projection unchanged;
2. determine FLOOR-specific effective scale needed for edge-to-edge cell coverage on TESTBUILD 1;
3. if scale alone cannot produce correct edges because of transparent frame padding, adjust FLOOR presentation metadata/frame crop rather than world positions;
4. only after size is correct, tune FLOOR anchor if the artwork is vertically offset;
5. increase visible/cache identity to `DDS-05B · TESTBUILD 1.1` / `DDS-05B-TB1.1` for the first device-calibration implementation.

## Explicitly out of scope

- WALL calibration
- other construction categories
- changing FLOOR snap points
- changing `GRID_CELL_WORLD_SIZE`
- changing grid dimensions
- changing projection
- changing occupancy/topology
- changing placement authority
- Y stacking
- DDS-05C+
