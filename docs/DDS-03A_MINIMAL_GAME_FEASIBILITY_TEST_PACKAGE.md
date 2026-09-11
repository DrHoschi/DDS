# DDS-03A – Minimal Game Feasibility Test Package

Status: **DEFINED / DOCUMENTED / NOT YET EXECUTED**

Authority chain:
- DDS-00 – Repository & Character Foundation: FROZEN
- DDS-01A – Shared Asset Baseline Contract
- DDS-01C – Game Feasibility Test Contract
- DDS-01D – Comparison & Decision Gate Contract
- DDS-02A – Film Feasibility Execution: COMPLETE / PASS WITH LIMITATIONS

Test character:
- `DDS-CHR-001` / PIG-01 / Schweinchen 1
- authoritative identity reference: `assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

## Purpose

DDS-03A defines the smallest controlled game-side feasibility package capable of producing useful evidence against DDS-01C without building a production game pipeline.

The game path must be tested against the same frozen character identity used for the film path.

DDS-03A deliberately does not yet select a permanent game representation. The test package is designed to determine whether a stable controllable asset route can exist at all.

## Representation Rule

The first execution path may use a temporary technical representation suitable for proving controllability and reuse.

Permitted candidate representations include:

- full 3D character,
- layered / articulated 2D character,
- another deterministic reusable representation that can satisfy DDS-01C.

The execution path must be explicitly recorded before the first asset is produced.

A sequence of unrelated generated still images is not sufficient because it does not prove reusable game-asset construction.

## Test 01 – STABLE ASSET CONSTRUCTION

### Objective

Determine whether DDS-CHR-001 can be represented as a persistent reusable game-side asset rather than as a one-off generated image.

### Required evidence

The asset must:

- preserve the core DDS-01A identity,
- have a reproducible stored form,
- be reopenable or reusable without rebuilding the character from scratch,
- expose enough structure for later controlled pose or motion work,
- keep identity-defining clothing and proportions separate from accidental generation drift.

### Examples of valid evidence

Depending on the selected route, valid evidence may include:

- a stored 3D mesh with materials and a controllable skeleton or rig-ready structure,
- a layered 2D puppet with persistent separated body parts and joints,
- another deterministic asset structure demonstrating comparable control.

### Gate

A visually good static render without a reusable underlying asset is `FAIL` for this test.

## Test 02 – ORIENTATION / VIEW CONTROL

### Objective

Determine whether the same stored asset can be viewed from materially different orientations while remaining recognizably DDS-CHR-001.

### Minimum evidence

At least three materially different views are required from the same underlying asset:

- front or near-front,
- side / three-quarter,
- rear or opposite-side orientation.

The exact views may be adapted to the selected representation, but they must prove that the asset is not only valid from one presentation angle.

### Required observation points

Inspect:

- head and snout proportions,
- ear placement,
- body silhouette,
- hat shape and placement,
- shirt and overall structure,
- limbs and hooves,
- tail,
- identity consistency between orientations.

## Test 03 – CONTROLLED POSE / MINIMAL MOTION

### Objective

Determine whether the same reusable asset can be deliberately changed into at least one different controlled pose or minimal motion state without regenerating or redesigning the character.

### Minimum requirement

The asset must demonstrate one controlled transformation beyond its baseline state, for example:

- neutral → walking pose,
- neutral → arm raised,
- neutral → one-step animation,
- equivalent controlled articulation appropriate to the chosen representation.

### Gate

The change must be driven by the reusable asset structure. Re-generating a new unrelated character image does not satisfy this test.

## Test 04 – SAVE / REOPEN / REUSE STABILITY

### Objective

Determine whether the game-side asset survives a basic production reuse cycle.

### Minimum cycle

The selected representation must be:

1. saved or exported,
2. closed / released from the immediate creation state where meaningful,
3. reopened or re-imported,
4. verified to retain its identity-defining structure and appearance sufficiently for continued work.

### Required observations

Record any:

- missing geometry or layers,
- lost rig / articulation data,
- broken textures or materials,
- scale or orientation corruption,
- changed identity proportions,
- manual reconstruction required after reopening.

## Test 05 – GAME-SCALE READABILITY

### Objective

Determine whether DDS-CHR-001 remains recognizable at a plausible game presentation size rather than only in a large close-up.

### Minimum evidence

Produce one representative presentation at a deliberately reduced gameplay-oriented scale or framing appropriate to the chosen representation.

The character must remain readable by silhouette, clothing and major identity markers.

DDS-03A does not define a final game camera, resolution, engine or UI.

## Evidence Recording

Each test must record:

- test ID,
- selected representation and tool(s),
- authoritative input reference,
- underlying asset used,
- relevant export / reopen format where applicable,
- meaningful attempt count,
- manual correction effort,
- observed identity deviations,
- technical defects,
- result classification.

Permitted per-test classifications:

- `PASS`
- `PASS WITH LIMITATIONS`
- `FAIL`
- `INCONCLUSIVE`

Failed attempts, abandoned technical routes and substantial manual corrections must not be hidden. They are part of feasibility evidence.

## Scalability Observation

Throughout DDS-03A, the test must record whether the selected construction method appears realistically repeatable for DDS-CHR-002 through DDS-CHR-006.

DDS-03A does not require building the remaining five characters.

## Explicit Exclusions

DDS-03A does not authorize:

- a production-ready character model,
- final topology optimization,
- full animation libraries,
- gameplay,
- controls,
- level design,
- game UI,
- physics systems,
- multiplayer,
- engine architecture,
- mass production of all six characters,
- a FILM vs GAME decision.

## DDS-00 Protection

The frozen V1 reference remains the identity authority.

No game-side derivative may overwrite:

`assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

If the chosen technical route cannot preserve the frozen design, that limitation must be recorded instead of changing the identity baseline.

## Execution Order

The default execution order is:

`TEST-01 STABLE ASSET` → `TEST-02 VIEW CONTROL` → `TEST-03 POSE/MOTION` → `TEST-04 SAVE/REOPEN` → `TEST-05 GAME-SCALE`

The package must not be expanded into general game development during execution.

## Completion Gate

DDS-03A is execution-complete only when sufficient evidence exists to classify the game-side route under DDS-01C as:

- `PASS`,
- `PASS WITH LIMITATIONS`,
- `FAIL`, or
- `INCONCLUSIVE`.

Completion of DDS-03A does not select GAME.

The game-side result must later be compared with DDS-02A under DDS-01D.

## Immediate Next Boundary

After this document is committed, the next admissible step is **DDS-03A / Execution Route Selection**.

That step must select exactly one initial reusable game-asset route for DDS-CHR-001 before TEST-01 begins.

No 3D model, layered puppet, rig, sprite or game code is created in the same step as this package definition.
