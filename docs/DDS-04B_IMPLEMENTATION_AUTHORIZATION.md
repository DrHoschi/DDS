# DDS-04B – Construction State & Module Foundation – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED**

Authority chain:

- DDS-04A Scope / Architecture Reconciliation: PASS
- DDS-04A Documentation Verification / Scope Gate Re-Run: PASS / 0 BLOCKER
- DDS-04 Implementation Plan: DEFINED / DOCUMENTED
- DDS-04 Implementation Plan Documentation Verification / Scope Gate: PASS / 0 BLOCKER

## Authorized Block

This document authorizes implementation of exactly:

**DDS-04B – Construction State & Module Foundation**

No later DDS-04 block is authorized by this document.

## Authorized Objective

Implement the smallest model-independent authoritative construction state capable of representing a house assembled from neutral placeholder modules.

The implementation must remain independent from final character assets, final building art and rendering authority.

## Authorized Scope

DDS-04B may implement only the state/foundation concepts already verified in the DDS-04 Implementation Plan:

- module definition identity
- module instance identity
- module category
- transform / placement state
- assigned material reference
- explicit connection references
- connection state
- construction collection / current build state
- reset to empty construction state

Neutral technical placeholder geometry may be used only where needed to inspect or verify state.

## State-vs-Behavior Boundary

DDS-04B may define and persist fields that later blocks will use, including:

- material reference
- connection references
- connection state

However, DDS-04B must not implement the later behavior associated with those fields.

Specifically:

- Snap compatibility / occupancy / placement behavior belongs to DDS-04C.
- Material resistance / stability behavior belongs to DDS-04D.
- Wolf force / failure / collapse behavior belongs to DDS-04E.

## Required Architectural Constraints

DDS-04B implementation must preserve:

1. construction state independent from rendering,
2. stable explicit module identities,
3. explicit inspectable connection references,
4. replaceable placeholder visuals,
5. no character asset dependency,
6. no hidden per-house authority in rendered geometry,
7. no DDS-03A evidence or character-feasibility logic,
8. no final production asset authority.

## Explicitly Not Authorized

DDS-04B does not authorize:

- snap compatibility logic
- snap-point occupancy behavior
- ghost placement
- rotation interaction
- placement UI
- undo UI behavior
- material strength calculations
- stability projection
- Wolf force
- connection failure rules
- dynamic collapse
- physics-engine selection
- game-engine selection
- final UI
- responsive UI implementation
- final building art
- final textures
- final pig or Wolf assets
- character integration
- character movement
- character animation
- DDS-04C
- DDS-04D
- DDS-04E
- DDS-04F
- DDS-04G

## Completion Evidence Required

DDS-04B may only be considered implementation-complete when the implementation can demonstrate:

1. multiple placeholder module instances can exist in one construction state,
2. every module instance has a stable explicit identity,
3. module category and transform / placement state can be inspected,
4. material-reference and connection-reference fields can exist without later behavior being implemented,
5. construction state can be reset cleanly to empty,
6. rendering / placeholder geometry is not the authority for the state,
7. no later DDS-04 capability has been pulled forward.

## Required Completion Gate

After implementation, the next required gate is:

**DDS-04B – Completion / State Integrity Gate**

That gate must verify the implementation against this authorization and the verified DDS-04 Implementation Plan.

DDS-04C remains unauthorized until that gate returns PASS and a separate DDS-04C authorization is explicitly issued.

## Branch Boundary

This authorization does not itself create an implementation branch or write implementation code.

A separate implementation action may create/use a DDS-04B branch and implement only the authorized DDS-04B scope.

## Gate Result

**DDS-04B IMPLEMENTATION = AUTHORIZED**

**DDS-04B IMPLEMENTATION STATUS = NOT YET STARTED**

**DDS-04C AND LATER = NOT AUTHORIZED**
