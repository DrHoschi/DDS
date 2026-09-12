# DDS-04C – Completion / Snap Determinism Gate – Re-Run 2

Status: **BLOCKED / 1 SNAP-IDENTITY ENCODING BLOCKER / DDS-04D NOT AUTHORIZED**

Verified branch:

- `feature/dds-04c-snap-placement-foundation`

Authorized DDS-04C base:

- `95dad1378115a94ac1c2c032acecb4c917b58ee3`

Previous blocked re-run:

- `docs/DDS-04C_COMPLETION_SNAP_DETERMINISM_GATE_RERUN.md`
- previous result: **BLOCKED / 1 SNAP-OCCUPANCY ID-ENCODING BLOCKER**

Correction commits under re-check:

- `c4d913939dedcb8d0b711fec8c2ab6dab7c7b95a` – versioned length-prefixed connection endpoint encoding
- `3741c5c692091e6dc0ab01b362a50d3ce962b858` – separator-safe occupancy reconstruction regression coverage
- `43d3c8d7fe644e25dd4456e536d4588b9cf0de2a` – decoder regex correction

## 1. Full Branch Scope Gate

**PASS**

Compared with the DDS-04C authorization base, the branch remains limited to:

- DDS-04B undo primitives required by DDS-04C
- DDS-04C Snap & Placement foundation
- DDS-04C determinism / integrity tests
- DDS-04C gate documentation
- occupancy reconstruction correction
- snap-endpoint connection encoding correction

No material behavior, Stability projection, Wolf force, collapse, final UI, engine selection, character integration or DDS-04D+ capability is present.

## 2. Latest Correction Diff Gate

**PASS**

Compared with `9528190d862a223e4e153486251311d876f33db4`, the latest correction changes only:

- `src/dds-04c/snap-placement.mjs`
- `tests/dds-04c/snap-placement.test.mjs`

No DDS-04B state contract or later DDS-04 capability was expanded.

## 3. Previous <-> Encoding Blocker Re-Check

**PASS**

The previous ambiguous connection endpoint encoding has been replaced for new DDS-04C connections by a versioned, length-prefixed format:

`connection:v2:<length>:<snap-identity><length>:<snap-identity>`

The decoder no longer depends on `<->` as a structural separator.

Verified:

- ordinary IDs reconstruct occupancy correctly,
- module-instance IDs containing `<->` reconstruct correctly,
- snap-point IDs containing `<->` reconstruct correctly,
- a reconstructed placement controller rejects the already occupied target as `TARGET_SNAP_OCCUPIED`,
- authoritative Construction State remains unchanged on rejection.

The previous ID-separator blocker is resolved.

## 4. Main Post-Fix Runtime Regression

**PASS**

Targeted runtime checks after the v2 correction:

1. ghost preview remains non-authoritative,
2. repeated placement input remains deterministic,
3. committed placement creates authoritative connection and derived occupancy,
4. reconstructed controllers preserve occupancy,
5. the former `<->` separator inside valid IDs is safe,
6. undo releases derived occupancy,
7. the minimum FLOOR → WALL → CORNER → ROOF path remains functional except where intentionally tested otherwise.

For the non-adversarial completion path:

- pass: 6
- fail: 0

## 5. Snap Identity Injectivity Adversarial Check

**FAIL**

DDS-04C still creates snap identities as:

`<instanceId>::<snapPointId>`

Both components currently accept arbitrary non-empty strings.

Therefore the composition is not injective.

Example:

- endpoint A:
  - instance ID = `a::b`
  - snap-point ID = `c`

produces:

`a::b::c`

while endpoint B:

- instance ID = `a`
- snap-point ID = `b::c`

also produces:

`a::b::c`

These are two different snap endpoints but the current DDS-04C identity function assigns them the same snap identity.

Runtime verification result:

- `snapIdentity("a::b", "c") === "a::b::c"`
- `snapIdentity("a", "b::c") === "a::b::c"`

Result:

- distinct snap endpoints can collide,
- occupancy for one endpoint can falsely mark another distinct endpoint as occupied,
- deterministic connection identity can therefore also collide at the snap-identity layer.

## 6. BLOCKER 1 – Snap identity composition is ambiguous

The v2 connection encoding is now unambiguous, but it currently encodes an already-ambiguous snap identity.

DDS-04C requires explicit stable snap-point identities.

That requirement is not fully satisfied while two otherwise-valid `instanceId + snapPointId` pairs can map to the same identity.

This blocker remains strictly inside DDS-04C:

- snap-point identity,
- occupancy identity,
- deterministic connection identity,
- reconstruction integrity.

## 7. Required Correction Boundary

The next correction must remain strictly inside DDS-04C.

It may only make snap identity composition unambiguous.

Permitted correction:

- replace `<instanceId>::<snapPointId>` composition with a deterministic injective encoding, preferably length-prefixed or equivalently reversible,
- preserve the ability for IDs themselves to contain `::`, `<->`, Unicode and other otherwise-valid characters,
- update the connection encoding / occupancy reconstruction only as required to consume the corrected snap identity,
- add regression coverage proving distinct endpoint pairs cannot collide for the discovered `::` case.

The correction must preserve:

- DDS-04B authority,
- compatibility rules,
- Ghost non-authority,
- deterministic transforms,
- occupancy reconstruction,
- Undo behavior,
- v2 connection decoding.

It must not add:

- material behavior,
- Stability logic,
- Wolf force,
- collapse,
- UI,
- physics-engine behavior,
- DDS-04D capability.

## 8. Gate Result

**DDS-04C COMPLETION / SNAP DETERMINISM GATE – RE-RUN 2 = BLOCKED**

Summary:

- authorization fidelity: PASS
- full branch scope: PASS
- latest correction diff: PASS
- previous `<->` connection-encoding blocker: RESOLVED
- main post-fix runtime path: PASS
- snap identity injectivity: **FAIL**
- blockers: **1**

DDS-04C remains not implementation-complete.

DDS-04D remains unauthorized.

## Next Admissible Step

The next admissible step is exclusively:

**DDS-04C – Snap Identity Encoding Fix**

That correction may only make `instanceId + snapPointId` identity composition unambiguous and add the corresponding regression test.

After the fix:

**DDS-04C – Completion / Snap Determinism Gate – Re-Run**

must be executed again.

No DDS-04D work is authorized before a PASS.
