# DDS-01C – Game Feasibility Test Contract

Status: **DEFINED / DOCUMENTED / NOT EXECUTED**

Authority chain:
- DDS-00 Foundation: FROZEN
- DDS-01A Shared Asset Baseline Contract: authoritative shared identity baseline
- Test character: `DDS-CHR-001` / PIG-01 / Schweinchen 1
- Identity reference: `assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

## Purpose

DDS-01C defines what a later game-side feasibility test must prove before DDS may treat a game production path as technically and visually viable.

DDS-01C performs no implementation. It creates no 3D model, rig, sprite, animation, engine integration, gameplay, or game code.

## Core Question

The later test must answer:

> Can the frozen DDS-CHR-001 identity be converted into a controllable, reproducible and production-usable game character without redesigning the character merely to satisfy technical limitations?

A visually attractive generic pig is not sufficient. The tested asset must remain recognizably the same frozen DDS character defined by DDS-01A.

## Required Feasibility Evidence

### 1. Identity Preservation

The game-side derivative must preserve the binding DDS-01A identity package, including silhouette, proportions, head/snout/ear relationship, clothing concept, palette and persistent identifiers.

Any unavoidable visible deviation must be recorded rather than hidden by modifying the frozen reference.

### 2. Reproducible Character Construction

The chosen game-production method must provide a character representation that can be stored, reopened and reproduced without relying on a fresh uncontrolled generation for every pose or frame.

The test must distinguish between a stable production asset and a one-off generated image.

### 3. View / Orientation Control

The character must support the views or camera orientations required by the tested game representation without becoming a different-looking character.

The feasibility test must expose major identity drift between front, side, rear and intermediate orientations when those orientations are relevant to the chosen representation.

DDS-01C does not prescribe whether the eventual solution is 2D, 2.5D or 3D.

### 4. Pose and Animation Readiness

The representation must be capable in principle of controlled pose changes and repeatable animation states while preserving identity.

The later test may use a minimal motion sample solely to prove this capability. It does not need to create a production animation library.

### 5. Structural Controllability

The chosen representation must offer sufficient control over body parts or animation-driving structure to avoid regenerating the entire character unpredictably for routine motion changes.

For a 3D route this may be demonstrated through mesh/rig suitability. For a layered 2D route it may be demonstrated through controlled body-part articulation. Other approaches are permitted if they satisfy the same requirement.

### 6. Visual Quality at Intended Game Scale

The character must remain readable and recognizably DDS-CHR-001 at a plausible gameplay presentation scale.

The test must not judge only a large close-up render if the intended game representation would normally show the character substantially smaller.

### 7. Technical Asset Stability

The produced test asset must survive the minimum relevant production cycle for its chosen representation, such as save/reopen, export/import, or equivalent deterministic reuse.

Visible corruption, lost identity-defining parts, unstable material/texture assignment or non-repeatable reconstruction must be recorded as limitations.

### 8. Production Effort and Scalability

The test must record the practical effort required to produce and correct the test character.

The result must consider whether the method could realistically be repeated for the remaining five frozen DDS characters. A route that works once but requires uncontrolled manual reconstruction for every character or animation state is not automatically production-feasible.

## Fair-Test Rule

The game path may optimize topology, rig structure, layer structure, texture resolution, technical geometry and other non-identity implementation details.

It may not simplify or redesign DDS-CHR-001 merely to obtain a PASS.

If the frozen design itself creates a technical difficulty, that difficulty is evidence for the feasibility comparison.

## Representation Neutrality

DDS-01C deliberately does not select:

- 2D sprites,
- layered 2D rigs,
- 2.5D,
- full 3D,
- a particular game engine,
- CyberMotion,
- Blender,
- Mixamo,
- any specific AI generation system.

Tool and representation selection belongs to the later execution planning and must serve this contract rather than redefine it.

## Minimum Later Test Package

Before a game-side feasibility result may be declared, the later execution must provide enough evidence to judge:

- identity preservation,
- stable/reusable asset construction,
- orientation/view consistency where applicable,
- controlled pose or minimal motion capability,
- game-scale readability,
- technical reuse stability,
- observed manual correction effort,
- likely scalability from one test character to all six characters.

The exact technical test sequence is intentionally not executed or fixed by DDS-01C.

## Result Classification

The later game feasibility execution must end in exactly one of these classifications:

- **PASS** – identity and required technical controllability are demonstrated with a credible scalable production route.
- **PASS WITH LIMITATIONS** – viable, but material limitations or production costs must be carried into the final comparison.
- **FAIL** – the tested route cannot preserve the shared identity and required controllability at an acceptable feasibility level.
- **INCONCLUSIVE** – evidence is insufficient; no positive or negative production decision may be inferred.

A successful still image alone cannot produce PASS.

## Scope Exclusions

DDS-01C does not create or authorize:

- a production 3D model,
- a production rig,
- a sprite atlas,
- animation sets,
- gameplay mechanics,
- player controls,
- level design,
- game UI,
- multiplayer,
- game-engine architecture,
- a FILM vs GAME decision.

## Completion Condition

DDS-01C is complete when this contract is documented without adding a game asset or implementation in the same step.

## Next Boundary

After DDS-01C completion, the next admissible definition step is **DDS-01D – Comparison & Decision Gate Contract**.

DDS-01D must define how film-side and game-side evidence will later be compared before either production direction is selected.
