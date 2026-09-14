# DDS-05B – FLOOR/Grid Footprint Calibration TESTBUILD 1.2 Definition

Status: DEFINED — NOT IMPLEMENTED

## Basis

- Current verified device build: `DDS-05B · TESTBUILD 1.1`
- Current technical build id: `DDS-05B-TB1.1`
- Current FLOOR runtime scale: `1.15`
- TESTBUILD 1.1 regression: PASS
- iPhone device result: build identity confirmed; FLOOR footprint still visibly undersized relative to one 1×1 grid cell.

## Purpose

Define exactly one next calibration probe for FLOOR presentation. This definition does not authorize or implement any code, atlas, build-id, cache-buster, grid, snap, anchor, crop, projection, CSS, WALL, or other runtime change.

## TESTBUILD 1.2 calibration target

For the four authoritative runtime FLOOR frames only:

- `floor_s`
- `floor_e`
- `floor_n`
- `floor_w`

set the next intended calibration test value to:

- `scale: 1.30`

`1.30` is a deliberate device-calibration probe, not a frozen final scale.

## Footprint acceptance target

One visible FLOOR construction footprint must correspond to exactly one logical 1×1 grid cell.

For two orthogonally adjacent occupied FLOOR cells:

- their visible constructive edges should meet edge-to-edge;
- there should be no intentional visible construction gap;
- there should be no material footprint overlap;
- sprite shadows may extend beyond the logical footprint and are not used as the footprint boundary.

## Explicitly unchanged for TESTBUILD 1.2

- grid cell pitch remains 2 world units;
- FLOOR snap offsets remain the existing authoritative ±2 world-unit positions;
- world/grid authority remains unchanged;
- projection remains unchanged;
- FLOOR frame `x/y/w/h` crop metadata remains unchanged;
- FLOOR anchor/pivot metadata remains unchanged;
- atlas image remains unchanged;
- CSS remains unchanged;
- WALL, CORNER, DOOR, ROOF and BEAM presentation remains unchanged;
- no WALL calibration is included;
- no new placement authority is introduced.

## Build identity for the later implementation

The next implemented calibration probe must use:

- visible label: `DDS-05B · TESTBUILD 1.2`
- technical/cache id: `DDS-05B-TB1.2`

The build identity/cache-buster must be advanced together with the calibration change so the iPhone device test can unambiguously identify the loaded version.

## Device evaluation rule

After separate authorization and implementation, regression must pass before device acceptance. On iPhone, TESTBUILD 1.2 must then be evaluated specifically for FLOOR-to-grid footprint fit.

Possible outcomes:

1. `1.30` reaches the edge-to-edge target → candidate scale can proceed toward completion verification.
2. `1.30` remains undersized or becomes oversized → reconcile the observed device result and choose a narrower next scale value.
3. Scale cannot achieve a clean footprint because transparent padding or pivot placement becomes the limiting factor → stop scale iteration and open a separate crop/anchor reconciliation before changing those properties.

## Scope boundary

This step is definition only. No implementation is authorized by this document.
