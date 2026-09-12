# DDS-04C – Completion / Snap Determinism Gate – Re-Run

Status: **BLOCKED / 1 SNAP-OCCUPANCY ID-ENCODING BLOCKER / DDS-04D NOT AUTHORIZED**

Verified branch:

- `feature/dds-04c-snap-placement-foundation`

Authorized DDS-04C base:

- `95dad1378115a94ac1c2c032acecb4c917b58ee3`

Previous blocked gate:

- `docs/DDS-04C_COMPLETION_SNAP_DETERMINISM_GATE.md`
- previous result: **BLOCKED / 1 SNAP-OCCUPANCY INTEGRITY BLOCKER**

Correction commits under re-check:

- `a860915fc278e708ce6f131c268aac989ad40e89` – derive committed occupancy from authoritative connections
- `6ea26a5b784117678aa26ce4fc894688283a16f5` – occupancy reconstruction regression test

## 1. Full Branch Scope Gate

**PASS**

Compared with the DDS-04C authorization base, the branch remains limited to:

- DDS-04B undo primitives required by DDS-04C
- DDS-04C Snap & Placement foundation
- DDS-04C determinism / integrity tests
- previous DDS-04C gate documentation
- scoped occupancy reconstruction correction

No material behavior, Stability projection, Wolf force, collapse, final UI, engine selection, character integration or DDS-04D+ capability is present.

## 2. Correction Diff Gate

**PASS**

Compared with the previous blocked gate commit `38a9ae442af576431b4131a1ece82d2619ada619`, the correction changes only:

- `src/dds-04c/snap-placement.mjs`
- `tests/dds-04c/snap-placement.test.mjs`

The correction removes controller-local committed occupancy as the source of truth and derives committed occupancy from authoritative connection records.

## 3. Previous Reconstruction Blocker Re-Check

**PASS for ordinary current IDs**

The previously failing reconstruction path is corrected for normal current identifiers.

Verified sequence:

1. place WALL on a FLOOR snap through controller P1,
2. committed connection remains in DDS-04B Construction State,
3. create fresh controller P2 over the same Construction State,
4. register the same snap profiles,
5. P2 reconstructs the occupied snap IDs,
6. second placement onto the same snap is rejected as `TARGET_SNAP_OCCUPIED`,
7. authoritative state remains unchanged.

The original controller-reconstruction failure is therefore resolved for identifiers that do not collide with the connection-ID encoding separator.

## 4. Post-Fix Runtime Regression Check

**PASS**

Targeted post-fix runtime verification:

- ghost preview remains non-authoritative
- valid placement creates authoritative connection and derived occupancy
- same-controller occupied target is rejected
- reconstructed-controller occupied target is rejected
- undo releases occupancy automatically through authoritative connection removal
- FLOOR → WALL → CORNER → ROOF chain remains valid

Result:

- tests: 6
- pass: 6
- fail: 0

## 5. ID-Encoding Integrity Adversarial Check

**FAIL**

Committed snap occupancy is reconstructed by parsing connection IDs of the form:

`connection:<snap-identity-A><-><snap-identity-B>`

The current identifier contracts do not reserve or forbid the separator `<->`.

DDS-04B module-instance IDs accept any non-empty string.

DDS-04C snap-point IDs also accept any non-empty string.

Therefore identifiers such as:

- module instance ID: `floor<->1`
- snap-point ID: `wall<->north`

are currently valid inputs.

### Reproduction A – separator inside module instance ID

A valid placement can produce:

`connection:floor<->1::wall<->wall:1::bottom`

During reconstruction, splitting on `<->` yields more than two fragments.

Result:

- committed connection still exists,
- reconstructed occupancy is empty,
- the already-used snap is returned as **VALID**.

### Reproduction B – separator inside snap-point ID

A valid placement can produce:

`connection:floor:1::wall<->north<->wall:1::bottom`

The same ambiguity occurs.

Result:

- committed connection still exists,
- reconstructed occupancy is empty,
- the already-used snap is returned as **VALID**.

## 6. BLOCKER 1 – Occupancy reconstruction depends on an undeclared reserved ID separator

The reconstruction fix currently relies on parsing opaque stable IDs through a separator that the contracts do not reserve.

This means the Snap Occupancy authority is not yet deterministic for all currently valid DDS-04B / DDS-04C identifiers.

A valid identifier can still cause occupancy loss after controller reconstruction and permit duplicate snap use.

This remains inside DDS-04C because it concerns:

- stable snap identity,
- deterministic connection identity,
- committed occupancy reconstruction,
- occupied-target enforcement.

## 7. Required Correction Boundary

The next correction must remain strictly inside DDS-04C.

It may only make snap-endpoint encoding / reconstruction unambiguous.

Permitted approaches include either:

- introducing an explicit validated reserved-character rule for the identifiers involved in DDS-04C connection encoding, with regression coverage, or
- replacing separator-dependent parsing with an unambiguous deterministic encoding that can reconstruct both snap identities for all otherwise-valid IDs.

The correction must preserve:

- DDS-04B as structural authority,
- deterministic connection identity,
- existing Snap compatibility behavior,
- Ghost non-authority,
- Undo behavior,
- Reconstruction behavior.

It must not add:

- material behavior
- Stability logic
- Wolf force
- collapse
- UI
- physics-engine behavior
- DDS-04D capability

## 8. Gate Result

**DDS-04C COMPLETION / SNAP DETERMINISM GATE – RE-RUN = BLOCKED**

Summary:

- authorization fidelity: PASS
- branch scope: PASS
- correction diff: PASS
- ordinary occupancy reconstruction: PASS
- normal post-fix runtime regression: **6/6 PASS**
- delimiter-safe occupancy reconstruction: **FAIL**
- blockers: **1**

DDS-04C remains not implementation-complete.

DDS-04D remains unauthorized.

## Next Admissible Step

The next admissible step is exclusively:

**DDS-04C – Snap Occupancy Identity Encoding Fix**

That correction may only make committed snap-endpoint identity encoding and reconstruction unambiguous and add regression coverage for IDs containing the former separator.

After that correction:

**DDS-04C – Completion / Snap Determinism Gate – Re-Run**

must be executed again.

No DDS-04D work is authorized before a PASS.
