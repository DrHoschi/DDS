# DDS-04F – Real Device Verification – iPad Evidence

Status: **PASS / REAL iPAD FLOW VERIFIED / PROTOTYPE PLACEMENT LIMITATION NOTED / DDS-04G NOT AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Related gate:

- `docs/DDS-04F_COMPLETION_RESPONSIVE_DEVICE_GATE.md`
- current gate status remains BLOCKED until required real-device evidence is complete

## Evidence Source

Four user-provided screenshots from a real iPad running Safari / GitHub Pages were reviewed, together with direct user confirmation of the tested interactions.

The screenshots show the live DDS-04F browser prototype rather than a static mockup.

## 1. iPad Responsive Layout

**PASS**

Visible layout matches the intended iPad contract:

- Material panel on the left
- Construction scene in the center
- Actions panel on the right
- Build-piece tray across the bottom
- Status / title bar across the top

The central scene remains visually dominant.

No primary control is visibly clipped.

No horizontal overflow is visible in the screenshots.

## 2. Initial Build State / Ghost Feedback

**PASS**

Initial screenshot shows:

- starter construction count = 1
- WALL selected
- visible Ghost Preview
- status message: wall can snap
- scene HUD: `Einrasten möglich ✓`
- Place action enabled
- Undo action initially disabled
- Stability visible
- Wolf-Test visible and reachable

This verifies the initial iPad construction flow is readable and usable.

## 3. Repeated Placement / Build Growth

**PASS**

Later screenshot shows:

- construction count = 41
- multiple placed module categories visible
- selected BEAM
- status: `Balken platziert ✓`
- Undo enabled
- Place remains reachable
- material panel remains reachable
- Wolf-Test remains reachable
- build-piece tray remains fully visible

This provides direct evidence that repeated touch placement works on the real iPad and that the layout remains operational with a substantially larger construction.

## 4. Wolf-Test Interaction

**PASS**

The third screenshot shows a completed Wolf-Test:

- status: `Wolf-Test: 16 Verbindung(en) gelöst.`
- construction remains visible
- multiple modules show displaced / detached visual state
- controls remain visible after the test
- Wolf-Test button remains reachable
- build-piece tray remains visible

This provides real-device evidence that the iPad UI can invoke the DDS-04E path and visibly project a non-trivial dynamic response.

## 5. Scene Readability Under Load

**PASS WITH PROTOTYPE LIMITATION**

At 41 modules the scene becomes visually crowded, but:

- the scene remains readable enough to distinguish module groups
- selected module highlighting remains visible
- Ghost Preview remains visible
- build and Wolf-Test controls remain unobstructed

This is acceptable for the current prototype gate and does not by itself constitute a blocking responsive defect.

Final production scene management / camera behavior remains outside DDS-04F.

## 6. Visible Touch / Reachability Evidence

**PASS FOR OBSERVED ACTIONS**

The state progression between screenshots proves successful interaction with:

- build-piece selection
- repeated placement
- Wolf-Test

The screenshots also visibly confirm reachability of:

- material controls
- rotate
- place
- undo
- reset
- Wolf-Test
- all six build-piece buttons

## 7. Additional Real-Device Interaction Confirmation

**PASS**

The user directly confirmed on the real iPad that the following interactions work:

- rotate
- undo
- place
- reset / Neu
- Wolf-Test
- visible falling / displacement response
- trying multiple module categories
- trying multiple materials

The additional screenshot also visibly shows:

- FLOOR selected
- STONE selected
- mixed-material construction state
- multiple rotated module orientations
- Ghost Preview still visible
- valid snap feedback still visible
- primary controls remain reachable

This closes the previously open rotate / material / undo / reset evidence items.

## 8. Prototype Placement Limitation

**NOT A DDS-04F COMPLETION BLOCKER UNDER THE CURRENT AUTHORIZED SCOPE**

The user also confirmed an important usability limitation:

- a new module cannot currently be freely dragged or manually positioned to a chosen target location,
- the prototype automatically chooses a valid snap candidate.

This behavior follows the current DDS-04F controller design, which asks DDS-04C for a valid candidate and uses the first deterministic valid snap found.

The current DDS-04F authorization requires:

- build-piece selection,
- Ghost Preview,
- deterministic valid / invalid snap feedback,
- rotation,
- placement,
- undo,
- material selection,
- Wolf-Test,

but it does not authorize a free-drag / manual target-selection interaction system.

Therefore this is recorded as a **prototype usability limitation**, not as a defect against the currently authorized DDS-04F completion contract.

Any future capability such as:

- drag-to-position,
- tap-to-select a specific snap target,
- cycle-through-valid-snaps,
- manual target selection,

requires separate reconciliation / authorization and must not be silently added inside this gate.

## 9. iPad Verification Result

Current iPad result:

- responsive layout: PASS
- initial Ghost / valid-snap feedback: PASS
- repeated placement: PASS
- large construction remains operational: PASS
- rotate execution: PASS
- multiple module categories: PASS
- multiple materials: PASS
- undo execution: PASS
- reset / repeat interaction: PASS
- Wolf-Test execution / dynamic-response projection: PASS
- primary control reachability: PASS
- no visible horizontal overflow: PASS
- no reported blocking double-scroll issue during the tested flow: PASS
- free manual target positioning: NOT IN CURRENT AUTHORIZED SCOPE

Therefore:

**iPad Real Device Gate = PASS**

## 10. iPhone Status

No iPhone real-device evidence is available because the user currently has only the iPad available for this test.

**iPhone Real Device Gate = OPEN / DEFERRED**

The existing DDS-04F authorization originally requires separate iPhone and iPad verification. Therefore the overall DDS-04F Completion / Responsive Device Gate cannot yet be converted to PASS without either:

1. later iPhone real-device evidence, or
2. an explicit separate reconciliation that changes the device-completion requirement.

The iPad PASS does not silently waive the iPhone requirement.

## Next Admissible Step

The current admissible work remains:

**DDS-04F – Real Device Verification – iPhone when available**

No new DDS-04F capability is authorized.

No DDS-04G work is authorized.
