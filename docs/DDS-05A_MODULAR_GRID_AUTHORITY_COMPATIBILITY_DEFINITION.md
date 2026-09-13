# DDS-05A – Modular Grid Authority Compatibility Definition

Status: DEFINED / CONTRACT ONLY / NO IMPLEMENTATION / DDS-04 AUTHORITY UNCHANGED

## 1. Purpose

This document defines the minimum compatibility contract required so that the existing DDS-04 construction authority can later support a true modular 2D construction grid while DDS-05A remains presentation-focused.

This step does **not** implement or modify DDS-04 snap logic, runtime placement, atlas data, loader behavior, sprite calibration, movement, pathfinding, or TESTBUILD 4.

## 2. Core construction model

The minimum construction unit is one **1×1 grid cell**.

A grid cell consists of:

- one buildable floor area,
- four edge positions,
- four corner positions.

The grid is topologically orthogonal even though it is rendered in the fixed DDS construction projection.

A 9×9 field is the first diagnostic/test presentation target. It represents 81 possible 1×1 cells but is not itself construction authority and does not require 81 committed FLOOR instances.

## 3. Required cell identities

Each logical grid cell must be addressable by an integer coordinate pair:

- `gridX`
- `gridZ`

The exact world-unit spacing is derived from the authoritative construction dimensions and must not be guessed from sprite pixels.

The grid origin is a deterministic world-space reference. No device-specific or screen-pixel coordinate may become construction authority.

## 4. Required four-neighbour floor adjacency

A placed 1×1 FLOOR cell must be able to expose four orthogonal neighbour relations:

- `EAST`
- `WEST`
- `NORTH`
- `SOUTH`

These relations are logical world/grid relations. Their rendered screen direction depends on the DDS projection.

The current DDS-04 floor contract already contains east/west floor-edge connectivity but does not yet expose equivalent north/south floor-to-floor adjacency. Therefore a true 2D floor grid is **not currently authoritative**.

The later authority-compatible extension must provide all four relations without changing the meaning of existing committed DDS-04 connections.

## 5. Required four cell edges

Every 1×1 cell exposes four logical construction edges:

- north edge,
- east edge,
- south edge,
- west edge.

Each edge may later host compatible edge-mounted construction pieces such as WALL or DOOR_OPENING according to their existing connection-class rules.

Two adjacent cells share the same physical border. That shared border must resolve to one deterministic construction location, not two visually overlapping but independent authoritative locations.

## 6. Required four corners

Every 1×1 cell exposes four logical corner locations:

- north-east,
- south-east,
- south-west,
- north-west.

Adjacent cells share corner locations. A shared corner must resolve to one deterministic world-space position.

CORNER / POST-style elements may later bind to these positions through the existing authority model. This definition does not yet prescribe the exact DDS-04 snap-profile mutation needed to do so.

## 7. Free-form modular footprints

The grid must not restrict buildings to rectangular footprints.

Any connected set of cells may form a construction footprint, including:

- 1×1,
- 1×2,
- 2×2,
- L-shapes,
- U-shapes,
- T-shapes,
- larger irregular connected shapes.

The grid therefore defines reusable cell topology, not a fixed building-size template.

## 8. Presentation grid versus authority

The visible grid in DDS-05A is presentation/diagnostic only.

It may display:

- 9×9 projected cells,
- cell boundaries,
- corner nodes,
- edge highlights,
- currently selectable/valid construction positions,
- optional calibration/helper lines.

It must **not**:

- create placement legality by itself,
- bypass DDS-04 snap validation,
- create hidden module instances,
- infer committed state from screen pixels,
- replace connection-class compatibility,
- replace occupancy authority.

A visual location may be shown as available only when the authoritative placement layer can support the corresponding construction location.

## 9. Sprite alignment contract

Sprites are presentation assets and never define world geometry.

The authoritative order is:

`grid/world geometry → snap/world position → projection → calibrated sprite placement`

Sprite crop size is allowed to vary between frames and categories.

Different source-frame dimensions therefore do not require equal-sized atlas frames. Correct rendering depends on calibrated pivot/scale/landmarks, not on equal image rectangles.

No sprite edge, alpha bound, crop edge, anchor, or pixel size may become construction authority.

## 10. Logical directions and visual direction reuse

DDS uses **four logical construction/movement directions** as the minimum directional model.

For the fixed projected game presentation these may be named consistently as:

- `NE`
- `SE`
- `SW`
- `NW`

This naming is a presentation-facing convention only; the authoritative rotational model may continue to use the existing four quarter-turn rotations `0° / 90° / 180° / 270°` as long as the mapping is deterministic and documented.

The same four-direction convention may later be used for character movement/animation. Movement implementation is outside this definition.

### 10.1 Logical direction is not sprite count

Four logical directions do **not** require four unique construction sprites.

For visually axis-symmetric construction pieces, opposite directions may reuse one physical sprite frame where appearance is equivalent:

- `NE ↔ SW`
- `NW ↔ SE`

Therefore two unique visual orientations may be sufficient for many construction assets.

This reuse is presentation mapping only. It must not collapse distinct world rotations, snap orientations, movement directions, or occupancy identities.

Asymmetric assets may still require more than two unique frames.

## 11. Compatibility requirement for the existing DDS-04 authority

The later minimal authority extension must preserve:

- existing module identities,
- existing committed construction state,
- connection identity semantics,
- deterministic occupancy,
- existing connection-class validation,
- deterministic undo behavior,
- existing material/stability authority,
- existing wolf/dynamic-response authority.

No existing DDS-04 authority may be replaced by a screen-grid implementation.

The preferred compatibility direction is to extend the authoritative snap/grid topology while leaving DDS-05A responsible only for projection and presentation.

## 12. Required authority capabilities before a true 9×9 construction grid can be declared functional

A later implementation must be able to demonstrate all of the following:

1. A FLOOR may be placed in each of the four orthogonal neighbouring cells.
2. Repeated placement can produce at least a 2×2 floor area.
3. Placement can produce an L-shaped floor footprint.
4. Shared edges resolve deterministically.
5. Shared corners resolve deterministically.
6. WALL/DOOR-compatible positions correspond to cell edges.
7. CORNER/POST-compatible positions correspond to cell corners.
8. Occupancy prevents incompatible double-use of one authoritative location.
9. Undo restores the previous deterministic occupancy state.
10. The visible grid remains derived from world geometry and never becomes authority.

## 13. Explicitly unresolved in this definition

This step intentionally does **not** decide:

- exact new DDS-04 snap IDs,
- exact code files to modify,
- whether grid coordinates are persisted directly or derived from transforms,
- exact world-unit size of the final 1×1 cell,
- exact edge/corner connection-class additions,
- exact migration strategy for existing FLOOR snap profiles,
- exact implementation block number,
- pathfinding or character movement,
- animation frame naming,
- final sprite-frame reuse tables by asset category,
- TESTBUILD 4 implementation details.

Those require a separate implementation-scope reconciliation if this authority extension is authorized.

## 14. Scope conclusion

A true 9×9 modular construction grid cannot be completed purely inside DDS-05A presentation because the current authoritative FLOOR topology is only partially two-dimensional.

The correct architecture is:

- DDS-04 authority (or a narrowly scoped successor construction-authority block) owns real cell/edge/corner placement legality and occupancy.
- DDS-05A owns projection, visual grid rendering, sprite calibration, sprite direction reuse, and diagnostic helpers.

Therefore the modular-grid authority extension is a **prerequisite for full free-form 2D building placement**, but it is not automatically authorized as part of the already-defined DDS-05A TB4 sprite-calibration implementation.

## 15. Gate status

**DDS-05A – Modular Grid Authority Compatibility Definition = DEFINED / FOUR-NEIGHBOUR GRID CONTRACT SET / FOUR EDGE + FOUR CORNER MODEL SET / FOUR LOGICAL DIRECTION MODEL SET / TWO-SPRITE AXIS REUSE PERMITTED / DDS-04 CODE UNCHANGED / NO IMPLEMENTATION AUTHORIZED**
