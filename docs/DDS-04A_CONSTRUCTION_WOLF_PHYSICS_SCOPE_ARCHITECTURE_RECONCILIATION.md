# DDS-04A – Construction & Wolf Physics Prototype Scope / Architecture Reconciliation

Status: **DEFINED / DOCUMENTED / NO IMPLEMENTATION AUTHORIZED**

## Authority / Protected Baselines

DDS-04A is defined against the current DDS repository state and must preserve the following boundaries:

- DDS-00 repository and character foundation remains authoritative and unchanged.
- The six approved V1 character references remain protected identity assets.
- DDS-03A remains the authoritative game-side reusable-character feasibility package.
- DDS-03A is currently not completed and must not be bypassed, reinterpreted, or silently absorbed into DDS-04.
- `docs/DDS-GAME-CONSTRUCTION-PROTOTYPE-CONCEPT.md` remains the gameplay concept source for the Construction Prototype idea.

DDS-04A does not modify the Film ↔ Game decision.

## Purpose

DDS-04A defines the model-independent scope for a future Construction & Wolf Physics Prototype.

The intent is to allow technical and interaction work to continue while DDS-03A is blocked by the missing reusable character model, without creating architectural debt or pretending that character feasibility has already been proven.

DDS-04A is a reconciliation and architecture-boundary step only.

No implementation is authorized by this document.

## Core Separation Rule

The following two workstreams are separate and must remain independently verifiable:

### DDS-03A – Character Feasibility

Concerned with:

- reusable DDS-CHR-001 representation,
- identity preservation,
- view control,
- pose / minimal motion,
- save / reopen / reuse,
- game-scale readability.

### DDS-04 – Construction & Wolf Physics Prototype

Concerned with:

- modular construction pieces,
- snap relationships,
- placement rules,
- simple material properties,
- connection graph,
- simplified structural response,
- directed Wolf-Test force,
- dynamic piece separation / collapse,
- child-readable construction interaction.

DDS-04 must not require a finished pig model to prove these capabilities.

## Model-Independent Test Authority

Future DDS-04 implementation steps may use neutral technical placeholders only, such as:

- cubes,
- simple boxes,
- primitive wall panels,
- primitive floor panels,
- primitive roof wedges,
- neutral markers for snap points,
- a neutral force-source marker in place of the Wolf.

These placeholders must not be treated as final game assets.

## Permitted Prototype Questions

DDS-04 may later test the following independently of DDS-03A.

### 1. Construction Module Contract

Define a minimal set of module categories:

- FLOOR
- WALL
- CORNER
- DOOR / OPENING
- ROOF
- BEAM

Optional later prototype categories may include:

- STAIR
- RAISED_PLATFORM
- additional roof variants.

No production building library is authorized.

### 2. Snap Contract

Define:

- snap-point identity,
- compatible connection classes,
- permitted orientation,
- placement transform,
- occupied / free state,
- valid / invalid connection feedback,
- deterministic attachment relationship.

The prototype must not depend on hidden per-asset manual positioning rules.

### 3. Placement Interaction Contract

A future UI prototype may test the interaction sequence:

`select piece → show ghost preview → approach valid snap → snap preview → rotate → place → undo`

The interaction must remain child-readable.

No final UI is frozen in DDS-04A.

### 4. Construction State / Connection Graph

A constructed house may later be represented as:

- module instances,
- transforms,
- material assignment,
- explicit connections between module instances,
- connection state.

The construction state must be separable from rendering.

### 5. Material Property Prototype

The prototype may define simplified material profiles for:

- STRAW
- WOOD
- STONE

Candidate properties may include:

- mass,
- connection resistance,
- force resistance,
- break / detach threshold.

Exact values are not frozen in DDS-04A.

The system is intentionally a gameplay abstraction and not a real structural-engineering model.

### 6. Simplified Structural Response

A later prototype may test:

- connection failure,
- detachment,
- tipping,
- falling,
- secondary movement caused by detached pieces,
- simple force propagation through connected parts.

The purpose is believable gameplay response, not engineering-grade statics.

### 7. Wolf-Test Force Contract

The Wolf-Test may later be represented technically as a directed force source with parameters such as:

- source position,
- direction,
- strength,
- distance,
- affected construction region.

A real Wolf character model or Wolf animation is not required for this test.

### 8. Controlled Variation

DDS-04 may allow the same construction to react differently when relevant input conditions differ.

Variation must primarily come from actual state differences, such as:

- Wolf position,
- force direction,
- force strength,
- distance,
- material choice,
- construction geometry,
- connection layout.

Pure random destruction with no relationship to the construction state is not the target behavior.

Limited controlled randomness may be considered later, but is not required or frozen in DDS-04A.

### 9. Stability Feedback

A simple child-readable stability indicator may be tested.

It may expose coarse states such as:

- weak,
- medium,
- stable,

or an equivalent meter.

It must not be treated as an exact prediction of the collapse result.

### 10. Responsive Prototype UI

Future Construction Prototype UI work may be evaluated separately for:

- iPhone,
- iPad.

The prototype should preserve the previously defined interaction concept:

- material selection,
- construction scene,
- build-piece toolbar,
- placement actions,
- stability feedback,
- Wolf-Test action.

DDS-04A does not freeze final responsive geometry.

## Explicitly NOT Authorized Before DDS-03A Resumes / Completes

DDS-04 must not use the current DDS-03A blocker as justification to advance unrelated character-production work.

The following remain outside DDS-04:

- final pig character model integration,
- pig rigging,
- pig animation pipeline,
- identity validation of DDS-CHR-001,
- character gameplay movement,
- character locomotion,
- final Wolf character model,
- final Wolf animation,
- voice / lip sync,
- character AI,
- final cinematic presentation,
- mass production of character assets.

Those topics remain governed by DDS-03A or by a later explicitly authorized block.

## Also Outside DDS-04A

DDS-04A does not authorize:

- game code,
- engine selection,
- physics-engine selection,
- production architecture,
- final UI implementation,
- final building art,
- production textures,
- sound,
- level design,
- progression,
- scoring,
- multiplayer,
- monetization,
- final save-game architecture,
- release packaging.

## Architecture Guardrails

Any later DDS-04 implementation should preserve these principles:

1. **Construction state is independent of character assets.**
2. **Snap logic is data-driven, not hard-coded per house.**
3. **Material behavior is data-driven.**
4. **Connections are explicit and inspectable.**
5. **Wolf force input is separate from the Wolf visual asset.**
6. **Physics / collapse result is derived from construction state and force input.**
7. **Rendering is not the authority for structural state.**
8. **Placeholder geometry must be replaceable without rewriting the construction rules.**
9. **DDS-03A can later supply final reusable character assets without DDS-04 redesign.**
10. **No DDS-04 result may silently redefine frozen DDS character identity.**

## Minimal Future Proof of Concept Boundary

The smallest later implementation that DDS-04A considers meaningful is:

1. place one FLOOR placeholder,
2. snap one WALL to it,
3. add one additional WALL or CORNER,
4. place one ROOF placeholder,
5. assign one material profile,
6. apply one directed Wolf-Test force,
7. evaluate connection thresholds,
8. detach / move failed pieces,
9. display the resulting state,
10. reset and repeat with a changed material or construction arrangement.

This is sufficient to test the core architectural idea.

A pig model is not required for this proof.

## Dependency Rule

DDS-04 may proceed through model-independent prototype work while DDS-03A is blocked.

However:

- DDS-04 must not mark DDS-03A complete.
- DDS-04 must not provide evidence for DDS-03A identity / reusable-character tests.
- DDS-04 must not integrate final pig gameplay before the reusable-character route is resolved.
- When the DDS-03A blocker is removed, DDS-03A resumes from its own recorded state.

The two tracks may later converge only through an explicit reconciliation step.

## DDS-04A Completion Gate

DDS-04A is complete when:

- model-independent scope is explicit,
- DDS-03A protected scope is explicit,
- permitted placeholder usage is explicit,
- Construction / Snap / Material / Stability / Wolf-Test boundaries are explicit,
- implementation remains unauthorized,
- no existing frozen character baseline is modified.

## Next Admissible Step

After DDS-04A is documented and verified, the next admissible step is:

**DDS-04A Documentation Verification / Scope Gate**

That gate must verify the new contract against:

- DDS-00 protected character foundation,
- DDS-03A explicit exclusions and current blocker,
- DDS Construction Prototype concept note,
- repository diff scope.

Only after that gate passes may a separate DDS-04 implementation-planning step be authorized.

No code or prototype implementation belongs in DDS-04A.
