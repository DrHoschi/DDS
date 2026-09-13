# DDS-04F – Real Device Verification – iPhone Evidence

Status: **PASS / REAL iPHONE RESPONSIVE + CORE TOUCH FLOW VERIFIED / DDS-04G NOT YET AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Related authority:

- `docs/DDS-04F_IMPLEMENTATION_AUTHORIZATION.md`
- `docs/DDS-04F_COMPLETION_RESPONSIVE_DEVICE_GATE.md`

## Evidence Source

Three user-provided screenshots from a real iPhone running the live GitHub Pages DDS-04F prototype were reviewed.

The screenshots were supplied after the manual snap-target correction and therefore reflect the current DDS-04F interaction model.

The device-specific rendering is the narrow iPhone responsive layout.

All construction interaction logic is shared with the iPad/desktop DDS-04F controller; there is no separate iPhone gameplay/authority implementation.

## 1. iPhone Responsive Layout

**PASS**

The screenshots show the intended stacked narrow-screen layout:

- title / status
- construction scene
- material panel
- build-piece panel
- actions panel

Observed:

- no horizontal layout break
- no clipped left/right panel content
- controls remain within the viewport width
- material controls remain readable
- all six build-piece selectors remain readable
- action controls remain touch-sized
- scene remains large enough to understand placement state

The mobile layout therefore behaves as a dedicated iPhone arrangement rather than a squeezed iPad three-column layout.

## 2. Initial Construction / Snap Feedback

**PASS**

The first screenshot shows:

- construction count = 1
- WALL selected
- visible Ghost / candidate region
- recommended target marker
- additional valid target marker(s)
- `Wand kann hier einrasten ✓`
- `Einrasten möglich ✓`
- Place reachable
- Rotate reachable
- Material selector reachable
- Wolf-Test reachable in the stacked action section

This confirms that the current manual-target-capable construction UI remains readable on the real iPhone.

## 3. Manual Target / Touch Placement Evidence

**PASS**

The second screenshot shows:

- construction count increased to 2
- status `Bauplatz gewählt ✓`
- a manually selected target marker is visibly distinguished
- another valid target remains available
- committed construction remains visible
- FLOOR selection is reachable and selected

The state progression from the first to second screenshot provides real-device evidence that touch selection / placement interaction works in the iPhone layout.

## 4. Repeated Construction Evidence

**PASS**

The third screenshot shows:

- construction count = 5
- status `Dach platziert ✓`
- ROOF selected
- several placed modules visible
- recommended target feedback still active
- Material / Stability remain visible
- Undo remains enabled/reachable
- Rotate / Place remain reachable
- Reset / Neu remains reachable
- Wolf-Test remains reachable

This verifies that the narrow-screen layout remains usable after repeated building actions rather than only in the initial state.

## 5. Core Control Reachability

**PASS**

Visible and reachable on the real iPhone:

- FLOOR
- WALL
- CORNER
- DOOR_OPENING
- ROOF
- BEAM
- STRAW
- WOOD
- STONE
- rotate
- place
- undo
- reset
- Wolf-Test
- Stability feedback

No primary DDS-04F action is hidden behind a desktop-only interaction.

## 6. Scroll / Overflow Assessment

**PASS FOR DDS-04F RESPONSIVE REQUIREMENT**

The iPhone intentionally uses a vertically stacked page.

Vertical page scrolling is allowed and expected.

The screenshots show:

- no horizontal overflow
- no side-to-side clipping
- no nested construction-scene scroll
- no evidence of a blocking double-scroll condition
- primary controls remain reachable through normal page scrolling

The bottom Safari browser chrome does not constitute application layout clipping.

## 7. Functional Evidence Composition

The iPhone screenshots directly verify:

- responsive layout
- touch target visibility
- Ghost / snap feedback readability
- manual target-selection presentation
- touch placement
- repeated build growth
- piece selection
- action reachability

The shared DDS-04F runtime was separately re-verified on the same branch with:

- 14 direct functional checks
- 14 PASS
- 0 FAIL

Those checks include:

- rotation
- valid placement
- invalid placement rejection
- undo
- material reassignment
- Stability
- Wolf-Test authoritative failure/detachment
- reset
- automatic recommendation
- manual target selection
- target lock across rotation
- exact target commit
- stale target cleanup after Wolf-Test

The complete real-device interaction path has additionally been exercised on iPad, which uses the same DDS-04F interaction/controller code and different responsive layout.

Therefore the remaining iPhone-specific completion question is responsive/touch usability, and the supplied real-device evidence is sufficient for that requirement.

## 8. iPhone Verification Result

- dedicated iPhone layout: PASS
- scene readability: PASS
- snap feedback readability: PASS
- touch target usability: PASS
- manual target selection presentation: PASS
- placement on device: PASS
- repeated build state: PASS
- material controls reachable: PASS
- rotate reachable: PASS
- undo reachable: PASS
- reset reachable: PASS
- Wolf-Test reachable: PASS
- no blocking horizontal overflow: PASS
- no observed blocking double-scroll: PASS
- shared complete DDS-04F runtime: 14/14 PASS

Therefore:

**iPhone Real Device Gate = PASS**

## Scope Note

This PASS validates the current functional DDS-04F prototype and responsive shell.

It does not approve final construction artwork, sprite-atlas integration, final camera presentation or production UI styling.

Those remain post-foundation presentation work.

## Result

**DDS-04F iPHONE REAL-DEVICE EVIDENCE = PASS**
