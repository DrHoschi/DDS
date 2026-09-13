# DDS-04F – Child-Readable Construction UI & Responsive Prototype – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED**

Authority chain:

- DDS-04A Scope / Architecture Reconciliation: PASS
- DDS-04A Documentation Verification / Scope Gate Re-Run: PASS / 0 BLOCKER
- DDS-04 Implementation Plan: DEFINED / DOCUMENTED
- DDS-04 Implementation Plan Documentation Verification / Scope Gate: PASS / 0 BLOCKER
- DDS-04B Completion / State Integrity Gate – Re-Run: PASS / 0 BLOCKER
- DDS-04C Completion / Snap Determinism Gate – Re-Run 3: PASS / 0 BLOCKER
- DDS-04D Completion / Material-State Gate: PASS / 0 BLOCKER
- DDS-04E Completion / Dynamic Response Gate – Re-Run 3: PASS / 0 BLOCKER

## Authorized Block

This document authorizes implementation of exactly:

**DDS-04F – Child-Readable Construction UI & Responsive Prototype**

No later DDS-04 block is authorized by this document.

## Authorized Objective

Expose the already-proven DDS-04B/C/D/E construction capabilities through a minimal, child-readable prototype UI that remains directly usable on both iPhone and iPad.

DDS-04F is an interaction/projection layer only.

It must not become a new authority for:

- construction state
- snap compatibility
- snap occupancy
- material behavior
- stability calculation
- Wolf-force calculation
- failure / detachment
- collapse state

Those authorities remain in DDS-04B through DDS-04E.

## Authorized Primary Flow

The prototype interaction may expose exactly this intended core loop:

`Bauteil wählen → Vorschau → Einrasten → Drehen → Platzieren → Material wählen → Stabilität sehen → Wolf-Test → Reaktion beobachten → verbessern / rückgängig / neu testen`

The UI may simplify or reorder presentation details where needed for device usability, but it must not change the underlying construction semantics.

## Authorized Prototype UI Areas

DDS-04F may implement a minimal UI containing:

- construction scene / viewport
- build-piece selector / toolbar
- material selector
- rotate action
- place action
- undo action
- reset action if required for the prototype loop
- stability feedback
- Wolf-Test action
- visible valid / invalid snap feedback
- minimal state/result feedback required to understand the prototype

The initial selectable module baseline remains:

- FLOOR
- WALL
- CORNER
- DOOR / OPENING
- ROOF
- BEAM

The material baseline remains:

- STRAW
- WOOD
- STONE

No additional building-system capability is authorized by the UI layer.

## Child-Readable Interaction Requirements

Controls must be understandable without requiring dense technical knowledge.

Prototype interaction should favor:

- large tap targets
- visually distinct primary actions
- short labels
- clear selection state
- clear valid / invalid feedback
- immediate visible response after placement or Wolf-Test
- limited simultaneous controls
- no dependency on hover
- no desktop-only interaction requirement
- no hidden gesture required for core completion

The child-readable requirement is functional/usability-oriented.

It does not authorize final art direction or production UX polish.

## Construction Scene Requirements

The scene may render neutral placeholder modules or existing prototype visuals sufficient to expose DDS-04 behavior.

The scene must project authoritative state from DDS-04B/C/D/E.

It must not maintain a second independent construction authority.

Required relationship:

- module position / state → projected from Construction State
- current Ghost Preview → projected from DDS-04C candidate state
- snap valid / invalid state → projected from DDS-04C
- material assignment → projected from DDS-04B/D
- Stability feedback → projected from DDS-04D
- Wolf-Test result → projected from DDS-04E
- detached / displaced modules → projected from DDS-04E-authoritative result state

Rendering remains replaceable.

## Build-Piece Selection Boundary

DDS-04F may provide UI selection for the already-authorized module categories.

Selecting a module type may prepare a DDS-04C placement request / ghost preview.

The UI must not:

- invent hidden snap points
- create hidden connection classes
- place modules directly by mutating rendered coordinates
- bypass DDS-04C candidate validation
- bypass occupancy rules

A visually placed module must correspond to an authoritative committed placement.

## Ghost / Snap Feedback Boundary

DDS-04F may show:

- Ghost Preview
- valid snap highlight
- invalid snap feedback
- occupied-snap feedback
- permitted rotation state

The displayed result must come from or remain consistent with DDS-04C deterministic placement evaluation.

The UI must not override an invalid candidate and force placement.

## Material Selection Boundary

Material controls may assign or change:

- STRAW
- WOOD
- STONE

Material assignment must continue through the existing authoritative material-reference boundary.

Changing material from the UI must not rewrite:

- module identity
- transform
- connection topology
- snap occupancy

## Stability Feedback Boundary

DDS-04F may display the existing coarse advisory Stability result:

- WEAK
- MEDIUM
- STABLE

or an equivalent child-readable visual meter.

The UI must preserve its advisory nature.

It must not present the Stability result as:

- exact structural engineering output
- guaranteed Wolf-Test outcome
- production physics prediction

## Wolf-Test UI Boundary

DDS-04F may expose a child-readable Wolf-Test action.

The UI may provide the minimum technical controls or fixed prototype defaults needed to trigger DDS-04E, such as:

- fixed or selected Wolf source position
- force direction
- strength
- distance / affected region

The exact child-facing presentation may be simplified.

However:

- the UI must call DDS-04E behavior
- it must not simulate destruction locally
- it must not use a canned visual collapse as structural authority
- result visuals must reflect authoritative DDS-04E state

No final Wolf character, animation or AI is required.

## Undo / Reset Boundary

DDS-04F may expose:

- DDS-04C undo for the latest placement where valid
- a prototype reset path needed to repeat the minimum loop

Reset behavior must reconcile to the existing authoritative Construction State semantics.

DDS-04F must not introduce an independent visual-only reset that leaves authoritative state behind.

## Responsive Requirement

DDS-04F must treat iPhone and iPad as separate layout targets.

A single scaled desktop/tablet layout is not sufficient evidence.

Implementation may use shared responsive structure, but usability must be verified separately for:

### iPhone

The prototype must remain usable in the smaller viewport with:

- no required horizontal page scrolling
- no clipped primary controls
- no inaccessible Wolf-Test action
- no inaccessible material or build-piece selection
- no control overlap that prevents core interaction
- tap targets suitable for touch
- construction scene still large enough to understand placement state

### iPad

The prototype may use the additional screen area to expose more simultaneous controls, while preserving:

- clear construction scene
- clear build-piece selection
- clear material selection
- direct placement actions
- visible Stability feedback
- visible Wolf-Test action

iPad must not merely be treated as an oversized iPhone if a materially better responsive arrangement is required.

## Orientation / Geometry Boundary

DDS-04F may choose prototype responsive breakpoints and layout arrangements required for usable iPhone / iPad testing.

These are prototype implementation details only.

DDS-04F does not freeze:

- final production breakpoints
- final device geometry
- final safe-area policy
- final orientation support
- final panel dimensions
- final toolbar dimensions

If one orientation is used for the prototype, that remains a prototype constraint rather than a final product decision unless separately authorized.

## Mockup Relationship

The existing polished Construction Prototype mockup is authorized as:

- interaction guidance
- hierarchy guidance
- control-placement inspiration
- child-readability guidance

It is not:

- pixel-authoritative
- final brand authority
- final visual-style authority
- final responsive geometry authority

The implementation should preserve the useful interaction intent without requiring exact visual reproduction.

## UI State / Authority Rule

DDS-04F may own temporary presentation state such as:

- currently selected toolbar item
- open / closed prototype panel state
- currently displayed transient feedback
- device-layout mode
- local focus / selection presentation

DDS-04F must not become the authority for:

- committed module instances
- committed transforms
- committed connections
- snap occupancy
- material assignment
- Stability calculation
- failure state
- detached state

Any UI cache or projection must be recoverable from authoritative DDS-04B/C/D/E state where applicable.

## Required Failure-Safe Interaction

The UI must visibly remain coherent when an action is rejected.

Examples:

- occupied snap
- incompatible snap
- invalid rotation
- missing valid target
- unavailable placement

Rejected actions must not create visual structures that do not exist authoritatively.

## Authorized Placeholder / Styling Boundary

DDS-04F may use prototype styling sufficient to prove:

- readability
- hierarchy
- touch usability
- responsive behavior
- valid / invalid distinction
- material distinction
- Stability distinction
- Wolf-Test visibility

Neutral placeholder art and simple icons are allowed.

No production art package is required.

## Explicitly Not Authorized

DDS-04F does not authorize:

- final pig character integration
- final Wolf character integration
- final character animation
- final Wolf blowing animation
- final cinematic destruction
- production art
- production shader / material art
- final camera system
- final level design
- progression
- score system
- campaign
- achievements
- monetization
- multiplayer
- account / backend systems
- final save-game flow
- full settings system
- unrelated menus
- production onboarding
- production accessibility certification
- production localization system
- additional module categories
- STAIR
- RAISED_PLATFORM
- decorative building library
- final physics tuning
- engine selection
- physics-engine selection
- DDS-04G implementation

## Minimum Completion Evidence Required

DDS-04F may only be considered implementation-complete when the prototype UI can demonstrate all of the following:

1. construction scene is visible and usable
2. user can select an authorized build piece
3. selected piece can produce a visible Ghost Preview
4. valid / invalid snap state is visibly distinguishable
5. permitted rotation can be triggered
6. valid placement can be committed
7. invalid placement cannot be committed through the UI
8. undo is accessible and works through the existing placement authority
9. STRAW / WOOD / STONE can be selected and assigned
10. coarse Stability feedback is visible and remains advisory
11. Wolf-Test is clearly accessible
12. Wolf-Test invokes DDS-04E rather than visual-only destruction
13. authoritative detach / displacement is reflected in the scene
14. core loop can be repeated after improvement / reset
15. iPhone core interaction is usable
16. iPad core interaction is usable
17. no authoritative B/C/D/E behavior is duplicated in UI state
18. no DDS-04G-or-later capability has been pulled forward

## Required iPhone Evidence

At minimum, real-device or equivalently representative iPhone testing must verify:

- build-piece selection reachable
- material selection reachable
- rotate / place / undo reachable
- Wolf-Test reachable
- construction scene not obscured beyond practical use
- valid / invalid feedback readable
- no blocking overflow / double-scroll issue
- touch interaction works for the complete prototype loop

## Required iPad Evidence

At minimum, real-device or equivalently representative iPad testing must verify:

- build-piece selection reachable
- material selection reachable
- rotate / place / undo reachable
- Wolf-Test reachable
- construction scene remains primary and readable
- Stability feedback visible
- no blocking overflow / double-scroll issue
- touch interaction works for the complete prototype loop

## Regression Protection

DDS-04F completion verification must confirm that UI work does not regress:

- DDS-04B stable module identity
- DDS-04B authoritative state
- DDS-04C snap identity
- DDS-04C occupancy
- DDS-04C deterministic placement
- DDS-04C undo semantics
- DDS-04D material assignment
- DDS-04D advisory Stability behavior
- DDS-04E force determinism
- DDS-04E authoritative failure / detachment
- DDS-04E occupancy reconciliation
- DDS-04E pre-existing failure reconciliation

## Required Completion Gate

After implementation, the next required gate is:

**DDS-04F – Completion / Responsive Device Gate**

That gate must verify:

- authorization fidelity
- child-readable interaction
- UI-to-authority boundaries
- build-piece selection
- Ghost Preview
- valid / invalid feedback
- rotation / place / undo
- material selection
- Stability feedback
- Wolf-Test integration
- authoritative dynamic-response projection
- repeatable core loop
- iPhone usability
- iPad usability
- responsive layout integrity
- DDS-04B/C/D/E preservation
- absence of DDS-04G+ behavior

DDS-04G remains unauthorized until this gate returns PASS and DDS-04G is separately authorized or otherwise entered through its defined final-gate process.

## Branch Boundary

This authorization does not itself create an implementation branch and does not write UI/runtime code.

A separate DDS-04F implementation action may create or use a dedicated DDS-04F branch based on the completed DDS-04E state and may implement only the authorized DDS-04F scope.

## Authorization Result

**DDS-04F IMPLEMENTATION = AUTHORIZED**

**DDS-04F IMPLEMENTATION STATUS = NOT YET STARTED**

**DDS-04G AND LATER = NOT AUTHORIZED**
