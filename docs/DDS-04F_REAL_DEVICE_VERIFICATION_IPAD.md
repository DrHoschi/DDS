# DDS-04F – Real Device Verification – iPad Evidence

Status: **PARTIAL PASS / CORE BUILD + WOLF FLOW VERIFIED / REMAINING INTERACTIONS OPEN / DDS-04G NOT AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Related gate:

- `docs/DDS-04F_COMPLETION_RESPONSIVE_DEVICE_GATE.md`
- current gate status remains BLOCKED until required real-device evidence is complete

## Evidence Source

Three user-provided screenshots from a real iPad running Safari / GitHub Pages were reviewed.

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

## 7. Remaining iPad Evidence

The following required real-device interactions are **not yet directly evidenced by the supplied screenshots**:

1. rotate action actually changing a Ghost / placement
2. material reassignment to WOOD or STONE on an existing module
3. undo actually removing the latest placement
4. reset actually returning to the starter state
5. full repeat loop after reset
6. explicit confirmation that there is no problematic vertical double-scroll during the complete interaction flow

These remain open only because the screenshots do not prove the action was executed.

## 8. iPad Verification Result

Current iPad result:

- responsive layout: PASS
- initial Ghost / valid-snap feedback: PASS
- repeated placement: PASS
- large construction remains operational: PASS
- Wolf-Test execution / dynamic-response projection: PASS
- primary control reachability: PASS
- rotate execution: OPEN
- material reassignment execution: OPEN
- undo execution: OPEN
- reset / repeat execution: OPEN
- explicit double-scroll confirmation: OPEN

Therefore:

**iPad Real Device Gate = PARTIAL PASS / CORE FLOW VERIFIED / COMPLETION EVIDENCE STILL OPEN**

## 9. iPhone Status

No iPhone real-device evidence is included in this evidence set.

**iPhone Real Device Gate = OPEN / NOT YET VERIFIED**

## Next Admissible Step

The current admissible work remains exclusively:

**DDS-04F – Real Device Verification – iPhone + iPad**

For iPad, only the still-open interactions need to be verified.

No new DDS-04F capability is authorized.

No DDS-04G work is authorized.
