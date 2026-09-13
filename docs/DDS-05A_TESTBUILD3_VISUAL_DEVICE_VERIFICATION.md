# DDS-05A – TESTBUILD 3 Visual / Device Verification

Status: **PARTIAL / IPHONE EVIDENCE REVIEWED / VISUAL ALIGNMENT NOT PASS / IPAD TB3 PENDING**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Implementation under verification:

- `6c32ca6875c109aaf5a884325138efa442d48e90`

Visible build identity in supplied evidence:

- `DDS-05A · TESTBUILD 3`

Technical build identity:

- `DDS-05A-TB3`

Evidence type:

- real iPhone Safari screen recording
- portrait layout
- TESTBUILD 3 visible in UI

## 1. Verification Scope

This verification evaluates only:

- TESTBUILD 3 identity
- real iPhone responsive presentation
- sprite projection result
- snap-marker visual result
- Ghost visual result
- visible module-to-module construction alignment

No runtime, atlas, crop, anchor, CSS or authority change is part of this verification.

## 2. Build Identity

Observed:

- `DDS-05A · TESTBUILD 3` is visibly present
- runtime responds normally
- sprite atlas rendering is active

Result:

**PASS**

## 3. iPhone Responsive Layout

Observed:

- header remains readable
- construction scene remains contained in the mobile layout
- material controls remain usable
- piece controls remain usable
- action controls remain usable when scrolled into view
- no horizontal page overflow is visible

Result:

**PASS**

## 4. Sprite Runtime

Observed:

- candidate construction sprites render
- floor sprites are visible
- wall Ghost is visible in the opening sequence
- sprite fallback glyphs are not the primary rendering mode

Result:

**PASS**

## 5. Pixel Projection Activation

Observed behavior is materially different from TESTBUILD 2:

- modules use the new compact phone-space projection
- world placement no longer exhibits the earlier broad percentage-based spread
- construction remains centered around the scene projection origin initially

Result:

**PASS – implementation is visibly active**

This does not imply final visual alignment PASS.

## 6. Snap Marker Projection

The recording shows recommended / valid / selected snap markers being drawn relative to construction-space positions rather than the old fixed lower-scene displacement.

This is a visible improvement over TESTBUILD 2.

However the markers do not yet consistently read as being exactly on the visible sprite connection edge.

The new marker calculation can therefore be considered active, but the complete **marker-to-art alignment** is not yet visually accepted.

Result:

- target-snap projection implementation active: **PASS**
- target-snap marker visually aligned to sprite artwork: **NOT PASS**

## 7. Floor-to-Floor Visual Alignment

The strongest blocker is visible after placing additional floor modules.

The UI reports successful placements and the module counter increases, but the floor sprites remain visibly separated instead of forming one contiguous floor surface.

This is visible in multiple moments of the recording after `Boden platziert ✓`.

Result:

**NOT PASS / BLOCKER**

The authoritative connection is functioning, but the sprite artwork footprint still does not visually match the authoritative world/snap geometry.

## 8. Ghost Alignment

The translucent floor Ghost is shown in a valid selected placement.

Its relationship to the projected target position is improved compared with the old percentage projection, but the artwork still does not read as a contiguous attached floor piece.

Result:

**NOT PASS**

This is consistent with the same visual-footprint mismatch seen after commit.

## 9. Wall / Floor Evidence

At the beginning of the recording, a wall Ghost is rendered near the starter floor.

The recording is sufficient to prove:

- wall sprite/ghost projection is active
- snap targets are available

It is not sufficient to declare final wall-to-floor art alignment PASS.

Result:

**NOT YET PASS**

## 10. Door / Wall Evidence

No sufficiently clear TESTBUILD 3 door-to-wall placement sequence is visible in the supplied recording.

Result:

**PENDING / NOT EVIDENCED**

## 11. Wall / Corner Evidence

A corner control is selected later in the recording, but the evidence does not clearly show a completed wall/corner visual connection suitable for gate approval.

Result:

**PENDING / NOT EVIDENCED**

## 12. Framing Observation

As construction extends, some valid projected construction positions approach or move beyond the visible scene edge.

This is consistent with the authorized removal of per-point clamping.

This is recorded as an observation only.

No framing correction is authorized by this verification step.

## 13. Root Finding From TESTBUILD 3

TESTBUILD 3 narrows the remaining defect.

The new common pixel projection and actual target-snap projection are visibly active, but connected artwork still does not form a contiguous structure.

The remaining primary candidate is now:

**sprite visual footprint / world-unit scale mismatch**

In other words:

- authoritative module/snap positions use world units
- projection converts those world units consistently into pixels
- sprite frames still render at their fixed atlas pixel footprint
- there is not yet an explicit contract tying visible sprite footprint dimensions to authoritative module/snap dimensions

This finding is stronger than a generic "anchor problem".

Anchor/crop may still need later verification, but they should not be changed before the sprite-world-footprint relationship is reconciled.

## 14. What Is Not Reopened

This evidence does not justify reopening:

- DDS-04B state
- DDS-04C snap authority
- DDS-04D material/stability
- DDS-04E Wolf response
- construction UI controller semantics

The runtime continues to report valid placement and increasing committed module count.

The defect remains presentation-side.

## 15. Current Verification Matrix

- TESTBUILD 3 identity: **PASS**
- iPhone responsive layout: **PASS**
- sprite runtime active: **PASS**
- new pixel projection active: **PASS**
- target-snap projection active: **PASS**
- target-snap marker ↔ visible sprite edge: **NOT PASS**
- floor ↔ floor visual continuity: **NOT PASS / BLOCKER**
- Ghost visual continuity: **NOT PASS**
- wall ↔ floor: **NOT YET PASS**
- door ↔ wall: **PENDING**
- wall ↔ corner: **PENDING**
- iPad TESTBUILD 3 evidence: **PENDING**

## 16. Verification Result

**DDS-05A – TESTBUILD 3 Visual / Device Verification = NOT PASS / PARTIAL**

Blocking visual result:

**authoritatively connected modules still do not visually form one contiguous construction**

The TESTBUILD 3 projection correction improved the coordinate system and marker behavior, but it did not finish construction-art alignment.

## 17. No Changes Performed

This verification performed no:

- runtime edits
- CSS edits
- atlas JSON edits
- PNG edits
- crop edits
- anchor edits
- scale edits
- yaw changes
- DDS-04 changes

## 18. Next Step Boundary

Before implementing any new correction, the next development step should be a separate reconciliation focused on:

**DDS-05A – Sprite World Footprint / Snap-Visual Scale Reconciliation**

That reconciliation should determine how the visible sprite footprint is mapped to authoritative world dimensions and snap spacing.

It must distinguish:

- world-unit projection scale
- visible sprite footprint scale
- pivot
- snap location within the artwork

No implementation is authorized by this verification document.

Additional TESTBUILD 3 iPad evidence may still be collected to compare device behavior, but the current iPhone evidence is already sufficient to prevent a visual PASS for TESTBUILD 3.
