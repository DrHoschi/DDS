# DDS-04D – Material & Stability Foundation – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED**

Authority chain:

- DDS-04A Scope / Architecture Reconciliation: PASS
- DDS-04A Documentation Verification / Scope Gate Re-Run: PASS / 0 BLOCKER
- DDS-04 Implementation Plan: DEFINED / DOCUMENTED
- DDS-04 Implementation Plan Documentation Verification / Scope Gate: PASS / 0 BLOCKER
- DDS-04B Completion / State Integrity Gate – Re-Run: PASS / 0 BLOCKER
- DDS-04C Completion / Snap Determinism Gate – Re-Run 3: PASS / 0 BLOCKER

## Authorized Block

This document authorizes implementation of exactly:

**DDS-04D – Material & Stability Foundation**

No later DDS-04 block is authorized by this document.

## Authorized Objective

Add data-driven prototype material behavior and a coarse structural-stability projection on top of the completed DDS-04B / DDS-04C construction foundation.

DDS-04D must not apply Wolf force, trigger structural failure or perform dynamic collapse.

## Authorized Material Baseline

DDS-04D may define exactly these initial prototype material profiles:

- STRAW
- WOOD
- STONE

Material behavior must be data-driven and independent from rendered material art or textures.

## Authorized Prototype Material Properties

DDS-04D may define and use prototype-level parameters for:

- mass
- connection resistance
- force resistance
- detach / break threshold

These values are gameplay/test parameters only.

They are not:

- production balancing constants,
- engineering material constants,
- physically validated structural values.

## Required Material Assignment Boundary

Material assignment must use the existing authoritative construction state material-reference boundary.

DDS-04D may:

- assign a material profile to an existing module instance,
- change an assigned material profile,
- inspect the current material assignment,
- derive material/stability state from current construction plus material assignments.

Material assignment must not alter:

- module identity,
- module transform,
- snap identity,
- snap occupancy,
- connection topology,
- connection identity.

Changing STRAW → WOOD → STONE on the same construction must therefore preserve the same construction topology unless a later separately authorized block explicitly changes it.

## Authorized Stability Projection

DDS-04D may implement a coarse, child-readable stability projection.

Permitted result classes include:

- WEAK
- MEDIUM
- STABLE

or an equivalent small ordered meter if the implementation keeps the same meaning.

The projection must be:

- deterministic for the same authoritative construction/material state,
- inspectable,
- derived from explicit prototype material / construction state,
- advisory only.

The stability result must not claim to predict exact later collapse behavior.

## Required Ordering Principle

For comparable construction conditions and otherwise equivalent state, the initial prototype tuning must preserve the broad intended material relationship:

`STRAW < WOOD < STONE`

This ordering may be demonstrated through material parameters and/or coarse stability output.

It does not require realistic structural engineering.

## Required Architecture Constraints

DDS-04D implementation must preserve:

1. DDS-04B as authoritative Construction State.
2. DDS-04C snap / placement identities and topology.
3. material definitions as explicit data rather than rendering-owned behavior.
4. material assignment as a reference/state concern, not a topology mutation.
5. stability projection as a derived/advisory value.
6. deterministic output for identical authoritative input.
7. no hidden per-building manual stability overrides.
8. no dependence on final pig, Wolf or building assets.

## Explicitly Not Authorized

DDS-04D does not authorize:

- Wolf force source
- Wolf position / direction / strength / distance evaluation
- force application to the structure
- connection-load evaluation caused by Wolf force
- connection failure
- detachment
- break execution
- tipping
- falling
- displacement
- propagation / secondary movement
- dynamic collapse
- random destruction
- final balancing
- engineering-grade statics
- production physics constants
- physics-engine selection
- game-engine selection
- final material art
- final textures
- final responsive UI
- pig or Wolf character integration
- DDS-04E
- DDS-04F
- DDS-04G

The presence of prototype fields such as `force resistance` or `detach / break threshold` does not authorize applying a force or executing a failure in DDS-04D.

Those values remain passive material-profile data until DDS-04E is separately authorized.

## Minimum Completion Evidence Required

DDS-04D may only be considered implementation-complete when the same neutral placeholder construction can demonstrate all of the following:

1. STRAW profile exists and is inspectable.
2. WOOD profile exists and is inspectable.
3. STONE profile exists and is inspectable.
4. material assignment is stored through the authoritative module material-reference boundary.
5. changing a module material does not change construction topology.
6. material parameters differ inspectably between STRAW, WOOD and STONE.
7. the broad comparable-condition ordering `STRAW < WOOD < STONE` is preserved.
8. a deterministic coarse stability result can be derived.
9. repeated identical authoritative input produces identical stability output.
10. changing material on an otherwise unchanged construction can produce an inspectably different material/stability state.
11. no Wolf-force, failure or collapse behavior is executed.
12. no DDS-04E-or-later capability has been pulled forward.

## Required Regression Protection

DDS-04D completion verification must confirm that material/stability work does not regress DDS-04B / DDS-04C guarantees, including:

- stable module identity
- explicit connection identity
- snap occupancy
- deterministic snap / placement behavior
- Ghost non-authority
- connection topology preservation
- Undo integrity

## Required Completion Gate

After implementation, the next required gate is:

**DDS-04D – Completion / Material-State Gate**

That gate must verify:

- authorization fidelity
- material-profile integrity
- authoritative material assignment
- topology preservation
- STRAW < WOOD < STONE ordering
- deterministic stability projection
- advisory-only stability boundary
- DDS-04B preservation
- DDS-04C preservation
- absence of DDS-04E+ behavior

DDS-04E remains unauthorized until that gate returns PASS and a separate DDS-04E authorization is explicitly issued.

## Branch Boundary

This authorization does not itself create an implementation branch and does not write implementation code.

A separate DDS-04D implementation action may create or use a dedicated DDS-04D branch based on the completed DDS-04C state and may implement only the authorized DDS-04D scope.

## Authorization Result

**DDS-04D IMPLEMENTATION = AUTHORIZED**

**DDS-04D IMPLEMENTATION STATUS = NOT YET STARTED**

**DDS-04E AND LATER = NOT AUTHORIZED**
