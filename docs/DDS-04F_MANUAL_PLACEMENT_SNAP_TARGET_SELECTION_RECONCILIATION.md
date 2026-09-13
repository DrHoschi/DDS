# DDS-04F – Manual Placement / Snap Target Selection Reconciliation

Status: **DEFINED / NARROW CORRECTION SCOPE FIXED / NOT IMPLEMENTED / DDS-04G NOT AUTHORIZED**

Verified branch:

- `feature/dds-04f-child-readable-responsive-prototype`

Current relevant authorities:

- DDS-04B – authoritative Construction State
- DDS-04C – authoritative Snap / Placement / Occupancy / Undo
- DDS-04D – Material / Stability
- DDS-04E – Wolf Force / Failure / Detachment
- DDS-04F – child-readable interaction / projection layer

## 1. Problem Statement

Current DDS-04F behavior automatically scans candidate snap combinations and stops at the first valid DDS-04C candidate.

This is useful as an automatic suggestion, but it prevents the player from choosing another valid place when several valid construction targets exist.

Observed real-device consequence on iPad:

- building itself works,
- rotation works,
- placement works,
- undo works,
- materials work,
- Wolf-Test works,
- but the player cannot intentionally continue construction at another valid place because DDS-04F chooses the target automatically.

For a construction game prototype this is a blocking interaction limitation.

## 2. Required User Experience

The corrected DDS-04F interaction shall be:

`Bauteil wählen → sinnvoller gültiger Snap wird automatisch vorgeschlagen → alle anderen gültigen Snap-Ziele sind sichtbar → gewünschtes Ziel antippen → Ghost bleibt auf diesem Ziel → drehen → platzieren`

The automatic suggestion remains.

Manual target choice supplements it; it does not replace deterministic snapping.

## 3. Authority Reconciliation

**DDS-04C DOES NOT NEED TO BE REDEFINED.**

DDS-04C already accepts an explicit placement request containing:

- incoming instance id
- definition id
- source snap id
- target instance id
- target snap id
- rotation

and authoritatively returns:

- valid / invalid
- reason
- source snap identity
- target snap identity
- authoritative placement transform

Therefore DDS-04F may enumerate possible target requests and ask DDS-04C to validate each one.

DDS-04F must never calculate a committed transform itself.

DDS-04F must never mark a candidate valid without DDS-04C validation.

## 4. Automatic Suggestion Contract

When a build piece is selected and no manual target is locked:

1. DDS-04F enumerates candidate source/target snap combinations in deterministic order.
2. Every candidate is evaluated through DDS-04C `previewPlacement(...)`.
3. Valid candidates are collected.
4. The first valid candidate remains the automatic recommended target.
5. The Ghost Preview is restored to that recommended candidate after enumeration.
6. The recommended target is visually distinguished from other valid targets.

This preserves the current convenient “jump to a sensible place” behavior.

## 5. Visible Valid Snap Targets

All currently valid target choices for the selected piece and current rotation must be visible in the construction scene.

Each selectable target marker must correspond to an actual DDS-04C-valid candidate.

Minimum marker behavior:

- visible on touch device without hover
- sufficiently large touch target
- visually distinguishable from placed modules
- recommended target visibly highlighted
- manually selected target visibly highlighted more strongly
- no marker may imply validity unless DDS-04C returned `valid: true`

For the prototype, markers may be simple dots / rings / plus symbols.

No production artwork is required.

## 6. Manual Target Selection Contract

Tapping a valid target marker stores only DDS-04F presentation selection:

- `sourceSnapId`
- `targetInstanceId`
- `targetSnapId`

This selection is not authoritative construction state.

Immediately after the tap:

1. DDS-04F calls DDS-04C `previewPlacement(...)` for exactly that selected request.
2. DDS-04C remains the authority for validity and transform.
3. The Ghost Preview moves to the transform returned by DDS-04C.
4. The selected target becomes locked as the current target.
5. Place acts only on that currently selected DDS-04C Ghost Preview.

## 7. Ghost Target Lock

Once the user manually chooses a target, DDS-04F must not silently jump to another valid target merely because:

- the user rotates,
- the UI re-renders,
- Stability changes,
- material selection changes,
- another presentation state changes.

The selected target remains the intended target until one of these explicit events occurs:

- user taps another valid target
- user selects another build-piece category
- placement is committed
- reset occurs
- authoritative state makes the target impossible and the user explicitly chooses another target

## 8. Rotation on a Locked Target

Rotation must operate against the currently locked target.

Flow:

1. target remains fixed
2. rotation changes
3. DDS-04F re-submits the same source / target snap request with the new rotation to DDS-04C
4. DDS-04C determines validity and transform

If the new rotation remains valid:

- Ghost stays on the same target
- Ghost orientation changes
- Place remains enabled

If the new rotation becomes invalid:

- Ghost / target remains visibly selected
- invalid feedback is shown
- Place is disabled
- DDS-04F must not automatically jump to another target

Further rotation may make the same target valid again.

## 9. Occupied / Invalid Target Handling

DDS-04C remains authoritative for occupancy and compatibility.

### Other invalid / occupied candidates

Candidates that DDS-04C rejects must:

- never be shown as green / valid selectable targets
- never enable Place
- never be committed

They may either:

- remain hidden to reduce clutter, or
- be shown as muted / unavailable markers if needed for clarity

For this narrow correction, hiding non-selected invalid candidates is sufficient.

### Currently selected target becomes invalid

If the manually selected target becomes invalid because authoritative state changed:

- keep the target selection visible
- show invalid state / reason
- disable Place
- do not silently select another target

The user can then tap another valid marker.

## 10. Candidate Enumeration Boundary

DDS-04F may use the existing public DDS-04C data:

- Construction State snapshot
- DDS-04C `snapProfiles`
- DDS-04C `previewPlacement(...)`

DDS-04F may maintain a temporary list of validated target candidates for rendering.

That list is presentation state only.

Each candidate must carry enough information to re-submit the exact DDS-04C request.

The list must be regenerated whenever relevant authoritative/input state changes, including:

- selected build piece
- rotation
- committed placement
- undo
- reset
- Wolf-Test structural change

## 11. Candidate Identity

DDS-04F target-selection identity must be deterministic and presentation-only.

A target choice can be identified by the tuple:

`sourceSnapId + targetInstanceId + targetSnapId`

DDS-04F must not invent a second structural connection ID.

DDS-04C continues to own:

- snap identity
- occupancy identity
- connection identity
- committed transform

## 12. Placement Commit Contract

Pressing Place may only call DDS-04C `placePreview()` against the currently active Ghost Preview.

Before commit, DDS-04C revalidates the request as it already does today.

Therefore a stale or newly occupied target remains fail-safe.

DDS-04F must not bypass that final revalidation.

## 13. Post-Placement Behavior

After a successful placement:

1. manual target lock is cleared
2. candidate targets are regenerated from the new authoritative state
3. DDS-04F may automatically recommend the next deterministic valid target
4. player remains free to tap another valid target before placing the next module

This directly implements the desired behavior:

> automatic sensible suggestion is fine, but the player can continue building somewhere else.

## 14. Undo / Reset / Wolf-Test Interaction

### Undo

After DDS-04C undo:

- clear any stale target lock
- regenerate valid target candidates
- restore an automatic recommendation if available

### Reset

After reset:

- clear target lock
- regenerate from starter construction
- restore normal automatic recommendation

### Wolf-Test

After DDS-04E structural mutation:

- clear target lock if its target is no longer valid
- regenerate candidates from current authoritative Construction State / DDS-04C occupancy
- no target marker may survive from stale pre-Wolf topology

## 15. Rendering Boundary

DDS-04F may render target markers and Ghost Preview positions.

Rendering must remain a projection.

The browser scene must not:

- move committed modules by pointer coordinates
- write transforms directly
- create connections directly
- determine occupancy
- determine compatibility

A tap chooses a DDS-04C request; DDS-04C supplies the Ghost transform.

## 16. Touch Interaction Boundary

For the current iPad-first correction:

- valid target markers must be directly tappable
- no drag gesture is required
- no precision pointer movement is required
- no hover is required
- tapping a marker must not also select the underlying placed module accidentally

This correction does **not** implement free-form dragging.

## 17. Explicitly Not Part of This Correction

This reconciliation does not authorize:

- free drag anywhere in the scene
- arbitrary world-coordinate placement
- free-floating placement without a snap
- moving already committed modules
- editing committed transforms
- multi-connection placement in one action
- automatic best-structure optimization
- pathfinding
- final camera controls
- production 3D manipulation gizmos
- DDS-04C authority redesign
- DDS-04G

## 18. Required Narrow Implementation Changes

The correction may touch only DDS-04F implementation / tests unless a separate blocker proves otherwise.

Expected affected files:

- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`
- `tests/dds-04f/construction-ui-controller.test.mjs`
- `tests/dds-04f/responsive-contract.test.mjs` if marker/touch contracts need coverage

DDS-04B/C/D/E source must remain unchanged.

## 19. Required Regression Evidence

The narrow correction must prove at minimum:

1. automatic recommended valid target still exists
2. two or more valid targets can be exposed simultaneously
3. tapping another valid target moves Ghost to that exact DDS-04C candidate
4. selected target remains locked across re-render
5. rotate revalidates the same locked target
6. invalid rotation does not auto-jump to another target
7. invalid/occupied target cannot be placed
8. Place commits the manually selected target
9. post-placement candidates regenerate
10. Undo regenerates candidates
11. Wolf-Test structural change invalidates stale candidates
12. no DDS-04B/C/D/E source change
13. no DDS-04G behavior

## 20. Real-Device Gate Consequence

The previous iPad evidence remains valuable for:

- responsive layout
- touch controls
- existing build flow
- materials
- undo
- reset
- Wolf-Test

However, the earlier classification of automatic-only target placement as a non-blocking limitation is superseded by this reconciliation.

For the intended construction interaction:

**DDS-04F iPad Completion Status = BLOCKED pending manual valid-target selection correction and iPad re-test.**

The iPhone test remains deferred until the shared placement interaction is corrected and passes on iPad.

This avoids repeating the same known interaction defect on iPhone.

## 21. Reconciliation Result

**DDS-04F MANUAL PLACEMENT / SNAP TARGET SELECTION = RECONCILED**

Fixed design:

- automatic first valid suggestion remains
- all current valid target choices become visible
- player may tap any valid target
- selected target locks
- Ghost is always generated by DDS-04C
- rotation stays on the selected target and is revalidated there
- invalid/occupied targets cannot commit
- no DDS-04C authority is duplicated or changed
- no free-form drag is introduced

## Next Admissible Step

The next admissible step is exclusively:

**DDS-04F – Manual Placement / Snap Target Selection – Narrow Implementation**

Implementation must remain within this reconciled scope.

After implementation:

**DDS-04F – Manual Placement / Snap Target Selection – iPad Real-Device Re-Test**

Only after the corrected interaction passes on iPad should iPhone responsive verification resume.

DDS-04G remains unauthorized.
