# DDS-04C – Snap & Placement Foundation – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED**

Authority chain:

- DDS-04A Scope / Architecture Reconciliation: PASS
- DDS-04A Documentation Verification / Scope Gate Re-Run: PASS / 0 BLOCKER
- DDS-04 Implementation Plan: DEFINED / DOCUMENTED
- DDS-04 Implementation Plan Documentation Verification / Scope Gate: PASS / 0 BLOCKER
- DDS-04B Completion / State Integrity Gate – Re-Run: PASS / 0 BLOCKER

## Authorized Block

This document authorizes implementation of exactly:

**DDS-04C – Snap & Placement Foundation**

No later DDS-04 block is authorized by this document.

## Authorized Objective

Implement deterministic placement and connection behavior on top of the completed DDS-04B authoritative construction state.

The implementation must use DDS-04B state as the authority and must not move structural authority into rendering, placeholder geometry, UI state or hidden per-house offsets.

## Authorized Scope

DDS-04C may implement only the following already verified capabilities:

- snap-point identity
- compatible connection classes
- snap occupancy state
- valid / invalid candidate detection
- deterministic placement transform
- permitted prototype rotation
- ghost-preview state
- place operation
- undo of the last placement operation
- explicit connection creation after a valid placement

The intended minimum interaction sequence is:

`select placeholder → ghost preview → approach snap → valid snap feedback → rotate if permitted → place → undo`

## Required Behavioral Constraints

DDS-04C implementation must ensure:

1. snap points have explicit stable identities,
2. compatibility is data-driven,
3. occupied snap points cannot accept a second incompatible connection,
4. invalid candidates cannot create structural connections,
5. valid placement produces a deterministic transform,
6. the same authoritative input state produces the same placement result,
7. placement does not depend on hidden per-house manual offsets,
8. valid placement creates connection state through the DDS-04B authoritative connection boundary,
9. undo removes only the latest authorized placement effect and returns the construction state to the immediately preceding valid state,
10. rendering / ghost preview remains a projection of state and not structural authority.

## DDS-04B Dependency Rule

DDS-04C must build on the completed DDS-04B state foundation.

DDS-04C must not:

- weaken DDS-04B identity guarantees,
- allow direct caller seeding of contradictory connection references,
- duplicate a second structural store,
- bypass the DDS-04B authoritative state with rendering-owned placement state.

Where DDS-04C needs additional snap-specific state, that state must remain explicit and inspectable and must reconcile into the DDS-04B authoritative construction state when a placement becomes committed.

## Placeholder Boundary

DDS-04C may use neutral technical placeholder geometry only.

Permitted placeholder use includes:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM

No final building art, production textures or character assets are required or authorized.

## Explicitly Not Authorized

DDS-04C does not authorize:

- material strength behavior
- material resistance calculations
- stability projection
- Wolf force
- connection failure thresholds
- dynamic collapse
- physics-engine selection
- game-engine selection
- final responsive UI styling
- final production UI
- free-form CAD placement
- production building tools
- final building art
- final textures
- pig or Wolf character integration
- character movement
- character animation
- DDS-04D
- DDS-04E
- DDS-04F
- DDS-04G

## Minimum Completion Evidence Required

DDS-04C may only be considered implementation-complete when, using neutral placeholders:

1. one FLOOR can exist as the initial placed module,
2. one WALL can snap to a valid FLOOR snap point,
3. one additional WALL or CORNER can connect through a valid compatible snap,
4. one ROOF can connect to a valid support snap,
5. invalid or incompatible placement candidates are rejected,
6. occupied snap state is respected,
7. deterministic rotation / placement transform is observable,
8. valid placement creates explicit authoritative connection state,
9. ghost-preview state does not mutate authoritative construction state before placement,
10. undo cleanly removes the latest placement effect and restores the immediately preceding valid construction state,
11. repeated identical input produces identical placement output,
12. no DDS-04D-or-later capability has been pulled forward.

## Required Completion Gate

After implementation, the next required gate is:

**DDS-04C – Completion / Snap Determinism Gate**

That gate must verify:

- authorization fidelity
- deterministic placement
- compatibility enforcement
- occupancy enforcement
- explicit connection creation
- ghost-preview non-authority
- undo integrity
- DDS-04B state preservation
- absence of DDS-04D+ capability

DDS-04D remains unauthorized until that gate returns PASS and a separate DDS-04D authorization is explicitly issued.

## Branch Boundary

This authorization does not itself create an implementation branch and does not write implementation code.

A separate DDS-04C implementation action may create or use a dedicated DDS-04C branch based on the completed DDS-04B state and may implement only the authorized DDS-04C scope.

## Gate Result

**DDS-04C IMPLEMENTATION = AUTHORIZED**

**DDS-04C IMPLEMENTATION STATUS = NOT YET STARTED**

**DDS-04D AND LATER = NOT AUTHORIZED**
