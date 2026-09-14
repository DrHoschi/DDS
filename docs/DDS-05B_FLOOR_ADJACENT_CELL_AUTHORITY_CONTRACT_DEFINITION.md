# DDS-05B – FLOOR Adjacent-Cell Authority Contract Definition

Status: DEFINED — NOT AUTHORIZED — NOT IMPLEMENTED

This definition follows the TESTBUILD 1.5 iPhone evidence and the DDS-05B FLOOR Adjacent-Cell / Snap-vs-Grid Spacing Reconciliation. It defines the intended authoritative meaning of one FLOOR cell, its edge snaps, and its rotation center. It does not implement any change.

## 1. Authoritative 1×1 FLOOR cell contract

The existing DDS-05A conceptual 1×1 FLOOR cell model remains the intended authority.

For one 1×1 FLOOR cell:

- the authoritative cell center is the FLOOR instance world position;
- adjacent cell centers are separated by exactly 2 world units along X or Z;
- therefore one cell extends exactly 1 world unit from its center to each logical edge;
- a directly adjacent FLOOR occupies the immediately neighboring grid cell and must not leave an empty logical cell between the two FLOOR centers.

Consequently:

- center-to-center pitch = 2 world units;
- logical half-extent = 1 world unit;
- FLOOR edge positions relative to the local cell center are at ±1 world unit.

The visible DDS-05B 9×9 grid is still presentation-only, but its 2-world-unit cell pitch represents this same authoritative 1×1-cell spacing and must not redefine authority independently.

## 2. FLOOR_EDGE snap contract

The current implementation stores the four FLOOR_EDGE snap positions at ±2 world units from the FLOOR center. Because DDS-04C aligns a source snap and a target snap by subtracting the incoming source-snap offset from the target-snap world position, two opposite ±2 edge snaps yield a 4-world-unit center separation. That is why the current implementation skips one visible cell.

Under the corrected authority contract, the four logical FLOOR edge snaps are defined at the actual cell edges:

- east edge:  { x: +1, y: 0, z: 0 }
- north edge: { x: 0, y: 0, z: +1 }
- west edge:  { x: -1, y: 0, z: 0 }
- south edge: { x: 0, y: 0, z: -1 }

When opposite source and target edges are aligned, the resulting adjacent FLOOR center must be exactly 2 world units from the target FLOOR center.

Example along +X:

- target FLOOR center = x 0
- target east edge = x +1
- incoming FLOOR west edge = local x -1
- incoming FLOOR center = x +2

This places the new FLOOR in the immediately neighboring 1×1 cell.

## 3. Rotation-center contract

The iPhone TESTBUILD 1.5 evidence also reports that rotating an incoming FLOOR feels as if it orbits around an outer grid field rather than rotating in place.

The intended authority is now defined explicitly:

- a FLOOR rotates around its own authoritative cell center;
- changing yaw between 0°, 90°, 180°, and 270° must not, by itself, move the selected FLOOR to another grid-cell center;
- for a locked adjacent-cell placement, rotation changes orientation and edge correspondence, not the chosen cell center;
- the selected/occupied logical cell remains the same unless the user explicitly selects another placement target;
- rotation must therefore never create a one-cell orbit around the target FLOOR merely because a source edge vector rotates.

This is an authority requirement, not a sprite-anchor requirement. Sprite anchor, crop, scale, `scaleY(0.79)`, and rendering depth must not be used to compensate for a world-position change caused by rotation.

## 4. Relationship to the frozen DDS-05A state

This definition exposes a real inconsistency inside the previously frozen DDS-05A implementation state:

- the frozen conceptual/world contract treats a 1×1 FLOOR as one logical cell and DDS-05B now visualizes those cell centers with a 2-world-unit pitch;
- the frozen implementation currently uses FLOOR_EDGE snaps at ±2, which, with the existing DDS-04C source/target alignment formula, produces 4-world-unit FLOOR center spacing;
- the resulting empty-cell gap contradicts the intended adjacent-cell behavior demonstrated by the 1×1 modular-grid contract.

Therefore a future correction of FLOOR_EDGE ±2 → ±1 would not be a presentation tweak. It would be an explicit corrective amendment to the frozen DDS-05A FLOOR placement authority.

The correction must not be smuggled in under DDS-05B visual calibration. Before implementation it requires a separate implementation-scope reconciliation and explicit authorization that names the affected DDS-05A authority/tests.

The freeze remains historically valid as evidence of what passed at that time, but this newly evidenced defect means the affected FLOOR adjacency behavior cannot be treated as semantically correct merely because the old regression was green.

## 5. What remains unchanged by this definition

This definition does not change or authorize changes to:

- the 9×9 visible grid size;
- the 2-world-unit grid-cell pitch;
- world-to-screen projection;
- sprite atlas crops or anchors;
- `anchorY=0.419` from TESTBUILD 1.5;
- FLOOR-only `scaleY(0.79)`;
- sprite scaling;
- depth ordering;
- WALL/CORNER/DOOR/ROOF/BEAM placement contracts;
- vertical/Y stacking;
- occupancy implementation details beyond the requirement that adjacent FLOOR centers differ by one cell;
- current build/test identity.

## 6. Future implementation acceptance contract

A later separately authorized correction must demonstrate all of the following:

1. Starter FLOOR at `(0,0,0)` can place direct neighbors at exactly `(±2,0,0)` and `(0,0,±2)`.
2. No empty logical grid cell exists between two directly connected FLOORs.
3. An L-shape and a 2×2 FLOOR block still form deterministically under the corrected edge positions.
4. Occupancy still prevents duplicate use of an already connected FLOOR edge.
5. Rotating a locked incoming FLOOR through the four authoritative yaw values preserves its selected cell center unless the user selects another target.
6. Grid, snap authority, world positions, and rendered FLOOR center agree without sprite-position compensation.
7. The complete DDS-04F + DDS-05A + DDS-05B regression suite passes on the exact final implementation SHA.
8. A real iPhone device gate confirms adjacent FLOOR placement and in-cell rotation visually.

## 7. Defined conclusion

The authority contract is defined as follows:

- `2 world units = one 1×1 FLOOR center-to-center cell step`;
- `1×1 FLOOR half-extent = 1 world unit`;
- `FLOOR_EDGE = ±1 world unit from the FLOOR center`;
- `FLOOR rotation pivot = FLOOR cell center`;
- rotation may change orientation/edge mapping but must not orbit the FLOOR into another cell.

These values and behaviors are DEFINED by this document, but they are not yet authorized for implementation.
