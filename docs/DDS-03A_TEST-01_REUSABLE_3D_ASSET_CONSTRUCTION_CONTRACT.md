# DDS-03A / TEST-01 — Reusable 3D Asset Construction Contract

Status: **DEFINED / NOT EXECUTED**

## Purpose

This contract defines the minimum evidence required to determine whether the frozen identity `DDS-CHR-001` (Schweinchen 1) can be converted into a reusable 3D character asset suitable for later game-feasibility tests.

This step defines the construction target and evaluation rules only. It does **not** authorize 3D asset generation, modeling, rigging, animation, game integration, or production work.

## Authoritative Identity Source

The sole identity authority for this test remains the frozen V1 character reference:

`assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

No redesign is permitted merely to simplify the 3D workflow.

## Minimum 3D Asset Scope

The asset must represent exactly one character: `DDS-CHR-001` / Schweinchen 1.

The minimum visible character package must include:

- head
- snout
- ears
- torso/body
- arms
- hands / hoof treatment
- legs
- feet / hoof treatment
- corkscrew tail
- straw hat with blue band
- white shirt
- blue short overalls

The following identity anchors must remain recognizably consistent with the frozen V1 reference:

- species and stylized pig design
- head and facial proportions
- ear shape and placement
- snout shape and proportions
- body proportions and silhouette
- pink skin treatment
- brown hoof treatment
- straw hat and blue band
- white shirt
- blue short overalls
- established color relationships
- corkscrew tail
- overall friendly, clever, dependable character impression

## Reusability Requirement

A visually convincing single render is not sufficient.

TEST-01 requires a persistent, reusable 3D asset that can serve as the same character source for later DDS-03A evidence cases.

At minimum, the resulting asset must be structurally usable enough to support later testing of:

- multiple controlled viewpoints
- controlled posing or minimal motion
- save / reopen stability
- practical game-scale readability

The test asset must therefore exist as actual 3D geometry with persistent material / color information. A rendered 2D image, billboard, flattened sprite, or one-off generated view does not satisfy this contract.

## Explicitly Not Required in TEST-01

TEST-01 does not require:

- final production topology
- full optimization
- final polygon budget
- final UV layout
- production-grade textures
- facial rigging
- complete skeleton / rig
- animation library
- LOD system
- final shaders
- game-engine integration
- gameplay code
- additional characters

These may become relevant later but are outside this test.

## Evaluation

### PASS

Assign `PASS` only when:

- a real reusable 3D asset exists,
- Schweinchen 1 remains clearly the same frozen character,
- no material redesign was required,
- the asset is structurally suitable to continue into the later DDS-03A tests,
- no severe technical defect prevents reuse.

### PASS WITH LIMITATIONS

Assign `PASS WITH LIMITATIONS` when:

- a reusable 3D asset exists,
- the frozen identity remains clearly recognizable,
- but limited identity deviations, structural limitations, correction work, or non-trivial production effort remain.

All limitations must be recorded explicitly rather than hidden by selecting only favorable views.

### FAIL

Assign `FAIL` when one or more of the following is true:

- the asset cannot preserve the frozen identity without substantial redesign,
- major head, facial, proportion, clothing, color, silhouette, or character-identity anchors are lost,
- the result is not genuinely reusable 3D,
- structural defects make later orientation, pose, reopen, or game-scale testing impractical,
- obtaining an acceptable result would require disproportionate manual reconstruction relative to the intended workflow.

### INCONCLUSIVE

Assign `INCONCLUSIVE` when tool, export, access, or technical limitations prevent a meaningful judgment of the required criteria.

An incomplete test caused by tooling is not automatically a character-feasibility failure.

## Evidence Rules

Evidence must identify:

- tool / workflow used
- authoritative input reference
- generated or constructed asset version
- meaningful attempts and retries
- visible identity deviations
- structural or technical defects
- manual correction effort
- resulting classification

Failed attempts and retries must not be silently discarded.

## Protection of Frozen Foundation

The frozen V1 reference remains the identity authority throughout the test.

Any 3D output created later under this contract is a derivative feasibility asset only. It does not automatically replace or modify the frozen V1 identity reference.

## Gate

`DDS-03A / TEST-01 — Reusable 3D Asset Construction = DEFINED / NOT EXECUTED`

The next allowable step after this documentation gate is a separate explicit authorization to execute TEST-01. No 3D generation is permitted as part of this documentation step.