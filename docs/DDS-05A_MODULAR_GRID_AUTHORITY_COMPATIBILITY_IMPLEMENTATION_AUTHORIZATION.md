# DDS-05A – Modular Grid Authority Compatibility Implementation Authorization

Status: AUTHORIZED / SCOPE-LOCKED / NOT IMPLEMENTED

## 1. Authorization target

This authorization applies only to the previously reconciled minimal grid-authority extension required to support a true modular 1×1 construction grid.

The authorized implementation may modify only:

1. `src/dds-04f/construction-ui-controller.mjs`
2. `tests/dds-04f/construction-ui-controller.test.mjs`

No other runtime, presentation, asset, loader, calibration, CSS, projection, material, wolf, or state-authority file is authorized by this step.

## 2. Authorized capability

The implementation is authorized to reconcile the DDS-04F FLOOR snap profile so that one FLOOR module can expose the complete minimum modular-grid contract:

- four orthogonal FLOOR-neighbour positions,
- four WALL/DOOR edge positions,
- four CORNER/POST corner positions,
- existing beam/base relations only where already supported by the reconciled scope,
- existing four logical rotations `0 / 90 / 180 / 270`.

The resulting authority must make 2D modular arrangements such as 1×2, 2×2 and L-shaped FLOOR layouts possible without changing the generic DDS-04C snap engine.

## 3. Scope constraints

The implementation must not:

- modify `src/dds-04c/snap-placement.mjs`,
- modify `src/dds-04b/construction-state.mjs`,
- modify DDS-04D material/stability behavior,
- modify DDS-04E wolf/dynamic-response behavior,
- alter generic snap identity or occupancy semantics,
- introduce diagonal FLOOR adjacency,
- introduce free-form placement outside authoritative snaps,
- implement the visible 9×9 grid,
- implement sprite/grid calibration,
- change atlas JSON/PNG data,
- change atlas loader behavior,
- change sprite direction reuse,
- implement TESTBUILD 4 presentation behavior,
- introduce DDS-05B+ capability.

## 4. Existing identity protection

Existing snap identifiers must be preserved where practical.

In particular, existing `corner-east` behavior must not be silently removed or renamed in a way that breaks current deterministic placement behavior. If the four-corner reconciliation requires an identity transition, that transition must be explicit, narrowly scoped and covered by regression tests.

## 5. Required regression evidence

The authorized implementation must add or adapt tests proving at minimum:

- all four orthogonal FLOOR neighbour targets can be produced,
- no diagonal FLOOR neighbour target is produced,
- a 2×2 FLOOR arrangement is reachable through authoritative snaps,
- an L-shaped FLOOR arrangement is reachable through authoritative snaps,
- all four FLOOR edge positions support the intended wall/base contract,
- all four FLOOR corner positions support the intended corner/base contract,
- occupied snaps remain unavailable,
- existing manual target selection still resolves to the exact DDS-04C candidate,
- rotation does not corrupt the selected target contract,
- undo restores occupancy correctly,
- reset restores the starter-floor baseline,
- existing material and wolf regressions remain unaffected.

## 6. Height / Y-axis exclusion

No new Y-placement, stacking, storey, elevation, vertical occupancy or layer-order rule is authorized here.

This authorization is deliberately limited to the horizontal modular-grid authority required for the ground-plane construction topology.

Future rules deciding whether a FLOOR, WALL, ROOF, beam or other module belongs below, above or on a specific construction level require a separate reconciliation/definition and authorization block.

## 7. Direction naming

The construction authority may continue to use numeric yaw values `0 / 90 / 180 / 270`.

Presentation-facing names such as `NE / SE / SW / NW` are not part of this implementation and must not change authority semantics in this block.

## 8. Completion boundary

This authorization permits the implementation of exactly the scope above.

It does not itself declare the implementation complete, PASS, frozen or integrated.

After implementation, a separate Completion / Regression Gate is required before the modular-grid authority can be treated as stable.
