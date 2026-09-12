# DDS-04 – Construction & Wolf Physics Prototype Implementation Plan

Status: **DEFINED / DOCUMENTED / NOT IMPLEMENTED / NO IMPLEMENTATION BLOCK AUTHORIZED**

Authority:

- DDS-00 character foundation: protected
- DDS-03A character feasibility: separate / independently resumable
- DDS-04A Scope / Architecture Reconciliation: PASS
- DDS-04A Documentation Verification / Scope Gate Re-Run: PASS / 0 BLOCKER
- DDS Construction Prototype concept: concept authority for the prototype experience

## Purpose

This document defines only the ordered implementation structure for the already-approved DDS-04 scope.

It does not implement code, select an engine, select a physics engine, create production assets, or authorize any implementation block by itself.

The plan is deliberately ordered so that later visual assets can replace technical placeholders without rewriting the Construction rules.

## Global Implementation Rules

All future DDS-04 implementation blocks must preserve these rules:

1. Character assets are not structural authorities for DDS-04.
2. Construction state is independent from rendering.
3. Snap behavior is data-driven.
4. Material behavior is data-driven.
5. Connections are explicit and inspectable.
6. Wolf force input is independent from the Wolf visual asset.
7. Structural response derives from construction state plus force input.
8. Neutral placeholder geometry is valid for the prototype.
9. No DDS-04 block may satisfy or replace DDS-03A evidence.
10. No final pig or Wolf production asset is authorized by DDS-04.
11. No implementation block may silently expand the feature set.
12. Each implementation block requires separate explicit authorization before code or runtime work begins.

## Initial Prototype Boundary

The initial DDS-04 implementation series is limited to the minimum proof needed to demonstrate:

`place → snap → connect → assign material → apply Wolf force → evaluate failure → detach / move → reset → repeat`

Initial module baseline:

- FLOOR
- WALL
- CORNER
- DOOR / OPENING
- ROOF
- BEAM

Initial material baseline:

- STRAW
- WOOD
- STONE

Not required for the first integrated proof:

- STAIR
- RAISED_PLATFORM
- additional roof variants
- decorative parts
- production building library

Those optional items remain parked unless a later separately scoped DDS-04 extension authorizes them.

---

# DDS-04B – Construction State & Module Foundation

Status: **PLANNED / NOT AUTHORIZED / NOT IMPLEMENTED**

## Objective

Create the smallest model-independent construction state capable of representing a house assembled from neutral placeholder modules.

## Planned scope

Define and implement prototype-level concepts for:

- module definition identity
- module instance identity
- module category
- transform / placement state
- assigned material reference
- explicit connection references
- connection state
- construction collection / current build state
- reset to empty construction state

The state must remain independent from the rendered placeholder geometry.

## Placeholder requirement

DDS-04B may use only neutral technical shapes sufficient to distinguish module categories.

No final house art is required or authorized.

## Explicit exclusions

DDS-04B does not implement:

- snap compatibility
- ghost placement
- rotation interaction
- Wolf force
- material strength behavior
- collapse
- final UI
- character integration

## Completion evidence

DDS-04B is complete only when a small construction state can be created, inspected and reset with multiple placeholder module instances and explicit identities.

## Gate

A separate **DDS-04B Completion / State Integrity Gate** is required before DDS-04C begins.

---

# DDS-04C – Snap & Placement Foundation

Status: **PLANNED / NOT AUTHORIZED / NOT IMPLEMENTED**

Dependency:

- DDS-04B Completion / State Integrity Gate = PASS

## Objective

Implement deterministic placement and connection behavior on top of the DDS-04B construction state.

## Planned scope

Implement:

- snap-point identity
- compatible connection classes
- snap occupancy
- valid / invalid candidate detection
- deterministic placement transform
- permitted prototype rotation
- ghost-preview state
- place operation
- undo of the last placement operation
- creation of explicit connection records after valid placement

Minimum interaction sequence:

`select placeholder → ghost preview → approach snap → valid snap feedback → rotate if permitted → place → undo`

## Required behavior

- already occupied snap points cannot accept a second incompatible connection
- invalid candidates cannot create structural connections
- placement must not depend on hidden manual per-house offsets
- the same input state must produce the same snap result

## Explicit exclusions

DDS-04C does not implement:

- material strength
- Wolf force
- failure thresholds
- collapse
- final responsive UI styling
- free-form CAD placement
- production building tools

## Completion evidence

At minimum, using placeholders:

1. FLOOR can be placed.
2. WALL can snap to FLOOR.
3. another WALL or CORNER can connect.
4. ROOF can connect to a valid support location.
5. invalid placement is rejected.
6. undo removes the latest placement cleanly.

## Gate

A separate **DDS-04C Completion / Snap Determinism Gate** is required before DDS-04D begins.

---

# DDS-04D – Material & Stability Foundation

Status: **PLANNED / NOT AUTHORIZED / NOT IMPLEMENTED**

Dependency:

- DDS-04C Completion / Snap Determinism Gate = PASS

## Objective

Add simple gameplay material behavior and a coarse structural-stability projection without yet applying the Wolf force.

## Planned scope

Define prototype material profiles for:

- STRAW
- WOOD
- STONE

Candidate prototype properties:

- mass
- connection resistance
- force resistance
- detach / break threshold

The exact numeric values are implementation-test parameters and are not production physics constants.

## Stability projection

Implement a coarse child-readable stability result such as:

- WEAK
- MEDIUM
- STABLE

or an equivalent meter.

The stability projection is advisory only and must not be treated as an exact prediction of later collapse.

## Required ordering principle

For comparable construction conditions, the initial prototype tuning should preserve the intended broad relationship:

`STRAW < WOOD < STONE`

This does not require physically realistic engineering calculations.

## Explicit exclusions

DDS-04D does not implement:

- Wolf force source
- dynamic collapse
- final balancing
- realistic structural statics
- material art / final textures

## Completion evidence

The same placeholder construction can be assigned different material profiles and produce inspectably different material/stability state without altering the construction topology.

## Gate

A separate **DDS-04D Completion / Material-State Gate** is required before DDS-04E begins.

---

# DDS-04E – Wolf Force, Failure & Dynamic Collapse Foundation

Status: **PLANNED / NOT AUTHORIZED / NOT IMPLEMENTED**

Dependency:

- DDS-04D Completion / Material-State Gate = PASS

## Objective

Prove that a directed Wolf-Test force can cause state-dependent connection failure and dynamic structural response.

## Planned Wolf force input

Prototype input may include:

- source position
- direction
- strength
- distance
- affected construction region

The force source is technical data only.

No Wolf model or Wolf animation is required.

## Planned structural response

The prototype may evaluate:

- connection load / threshold comparison
- connection failure
- detachment
- tipping
- falling
- displacement
- secondary movement caused by detached pieces
- simple propagation through connected structure

## Controlled variation rule

Different results must primarily come from meaningful state differences:

- Wolf position
- force direction
- force strength
- distance
- material
- construction geometry
- connection layout

Pure random destruction unrelated to state is not permitted as the core behavior.

Limited controlled randomness remains optional and is not required for this initial implementation series.

## Minimum comparison evidence

The prototype must be able to demonstrate at least:

- changed material → materially changed response, and/or
- changed construction arrangement → materially changed response, and/or
- changed Wolf force position/direction → materially changed response.

The result must not be a single fixed collapse animation.

## Explicit exclusions

DDS-04E does not implement:

- final Wolf character
- final Wolf animation
- character AI
- cinematic destruction
- production-grade physics tuning
- realistic engineering simulation

## Gate

A separate **DDS-04E Completion / Dynamic Response Gate** is required before DDS-04F begins.

---

# DDS-04F – Child-Readable Construction UI & Responsive Prototype

Status: **PLANNED / NOT AUTHORIZED / NOT IMPLEMENTED**

Dependency:

- DDS-04E Completion / Dynamic Response Gate = PASS

## Objective

Expose the already-proven Construction and Wolf-Test capabilities through the simplest child-readable prototype interaction.

## Planned prototype UI areas

The prototype may contain:

- construction scene
- material selector
- build-piece toolbar
- rotate action
- place action
- undo action
- stability feedback
- Wolf-Test action
- visible valid / invalid snap feedback

## Interaction principle

The intended primary flow remains:

`Bauteil wählen → Vorschau → Einrasten → Drehen → Platzieren → Wolf-Test → Beobachten → Verbessern`

## Responsive requirement

The UI must be evaluated separately for:

- iPhone
- iPad

The same underlying construction capability must remain usable on both.

DDS-04F does not freeze production UI geometry or final visual styling.

## Mockup relationship

The existing Construction Prototype mockup is interaction/concept guidance only.

It is not pixel-authoritative and does not require exact visual reproduction.

## Explicit exclusions

DDS-04F does not implement:

- unrelated menus
- progression
- score systems
- level campaign
- monetization
- multiplayer
- final save-game flow
- final production art

## Gate

A separate **DDS-04F Completion / Responsive Device Gate** is required before DDS-04G begins.

---

# DDS-04G – Integrated Construction Prototype Completion / Regression / Freeze Gate

Status: **PLANNED / NOT AUTHORIZED / NOT IMPLEMENTED**

Dependencies:

- DDS-04B PASS
- DDS-04C PASS
- DDS-04D PASS
- DDS-04E PASS
- DDS-04F PASS

## Objective

Verify the complete minimum DDS-04 prototype as one coherent flow without expanding the feature set.

## Required integrated proof

Using only permitted prototype assets:

1. start from an empty construction state
2. select a FLOOR placeholder
3. place it
4. snap a WALL
5. add another WALL or CORNER
6. place a ROOF
7. assign / change STRAW, WOOD or STONE
8. observe coarse stability feedback
9. trigger a directed Wolf-Test
10. observe state-dependent failure / survival
11. reset
12. change material, construction arrangement or Wolf force input
13. repeat and obtain a meaningfully different valid response

## Regression requirements

Verify:

- no duplicate occupied snap usage
- no invalid hidden connection
- construction state survives visual placeholder replacement
- rendering does not become structural authority
- material assignment does not rewrite topology
- Wolf force source does not require a Wolf visual asset
- detached connections are reflected in authoritative construction state
- reset returns to a clean state
- iPhone interaction remains usable
- iPad interaction remains usable
- DDS-03A files / character authorities remain untouched

## Freeze boundary

A PASS may freeze only the **DDS-04 Construction & Wolf Physics Prototype foundation**.

It does not freeze:

- final character assets
- final Wolf assets
- final game camera
- final production UI
- production physics values
- full building library
- optional stairs / raised platforms
- progression / campaign systems
- production game architecture

## Gate result classes

DDS-04G may end only as:

- PASS / FROZEN PROTOTYPE FOUNDATION
- PASS WITH LIMITATIONS / NOT FROZEN UNTIL EXPLICIT DECISION
- BLOCKED
- FAIL

---

# Ordered DDS-04 Execution Chain

The required implementation order is:

`DDS-04B Construction State & Module Foundation`

→ `DDS-04B Completion / State Integrity Gate`

→ `DDS-04C Snap & Placement Foundation`

→ `DDS-04C Completion / Snap Determinism Gate`

→ `DDS-04D Material & Stability Foundation`

→ `DDS-04D Completion / Material-State Gate`

→ `DDS-04E Wolf Force, Failure & Dynamic Collapse Foundation`

→ `DDS-04E Completion / Dynamic Response Gate`

→ `DDS-04F Child-Readable Construction UI & Responsive Prototype`

→ `DDS-04F Completion / Responsive Device Gate`

→ `DDS-04G Integrated Completion / Regression / Freeze Gate`

No later implementation block may begin before its stated predecessor gate passes unless a separate reconciliation explicitly changes the plan.

## Branch / Implementation Rule

This plan does not create or authorize an implementation branch.

Branch naming and the exact first implementation commit belong to the separate authorization step after this plan passes its own documentation/scope verification gate.

## DDS-03A Resume Rule

If the missing DDS-03A reusable-character asset becomes available while DDS-04 is in progress:

- DDS-03A may resume independently from its recorded state.
- DDS-04 does not need to stop merely because DDS-03A resumes.
- neither workstream may absorb the other's evidence.
- any later convergence requires an explicit reconciliation step.

## Plan Completion Condition

This Implementation Plan Definition is complete when:

- the ordered implementation blocks are explicit,
- each block has a narrow objective,
- dependencies are explicit,
- completion gates are explicit,
- the minimal integrated proof is explicit,
- DDS-03A remains protected,
- no engine or physics-engine choice is made,
- no code or runtime implementation is created in this step.

## Next Admissible Step

After this document is committed, the next admissible step is exclusively:

**DDS-04 – Implementation Plan Documentation Verification / Scope Gate**

That gate must verify this plan against:

- DDS-04A Scope / Architecture Reconciliation,
- DDS-04A PASS Re-Run,
- DDS Construction Prototype concept,
- repository diff.

Only after that gate returns PASS may the first implementation block, DDS-04B, be separately authorized.
