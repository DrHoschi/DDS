# DDS-05A – Construction Sprite Projection / Anchor Alignment – Implementation Authorization

Status: **AUTHORIZED / NOT IMPLEMENTED / TESTBUILD 3 NOT DEPLOYED**

Branch:

- `feature/dds-05a-sprite-construction-presentation`

Implementation-scope authority:

- `docs/DDS-05A_CONSTRUCTION_SPRITE_PROJECTION_ANCHOR_ALIGNMENT_IMPLEMENTATION_SCOPE.md`

Implementation-scope commit:

- `2dd185e15d3a5edece425c496b528a994b16e406`

Input reconciliation:

- `docs/DDS-05A_CONSTRUCTION_SPRITE_PROJECTION_ANCHOR_ALIGNMENT_RECONCILIATION.md`
- commit `1ea2d2c49360237a65b1ed014c3fd3fa570ac9d3`

Current real-device baseline:

- `DDS-05A · TESTBUILD 2`
- `DDS-05A-TB2`
- real iPad evidence exists
- visual alignment = NOT PASS

Frozen authority:

- DDS-04 Construction & Wolf Physics Prototype Foundation remains frozen

## 1. Authorization Decision

The DDS-05A Construction Sprite Projection / Anchor Alignment implementation is authorized strictly within the reconciled five-file scope and exact formulas defined by the implementation-scope document.

This authorization does not itself implement any code.

No construction authority, atlas asset, crop, anchor, yaw mapping or layout capability is expanded by this step.

## 2. Authorized TESTBUILD Identity

Because TESTBUILD 2 already has real-device evidence, the corrected runtime must identify as:

**DDS-05A · TESTBUILD 3**

Canonical technical build ID:

`DDS-05A-TB3`

The later implementation must update all active test-build/cache references consistently from TB2 to TB3.

## 3. Authorized Existing Runtime Files

Implementation may modify only:

1. `src/dds-05a/sprite-presentation.mjs`
2. `src/dds-04f/browser-app.mjs`
3. `index.html`

No other runtime file is authorized.

## 4. Authorized Existing Test Files

Implementation may modify only:

4. `tests/dds-05a/sprite-presentation.test.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No additional test file is required or authorized by this block.

## 5. Authorized Pixel Projection

The later implementation must use the exact responsive scene metric:

`S = clamp(min(width / 16, height / 12), 24, 44)`

with:

`originX = width * 0.50`

`originY = height * 0.70`

`H = S`

and exact projection:

`screenX = originX + (x - z) * S`

`screenY = originY + (x + z) * (S / 2) - y * H`

Therefore:

- world +X → `(+S, +S/2)`
- world +Z → `(-S, +S/2)`
- world +Y → `(0, -S)`

The projection is presentation-only.

## 6. Scene Metric Authorization

`browser-app.mjs` may read the actual construction-scene dimensions using the rendered scene bounds.

The same scene projection must be reused within one render pass for:

- committed modules
- Ghost
- snap target markers

No independent percentage projection may remain active for these DDS-05A world positions.

## 7. Point-Clamping Rule

Per-point clamping is explicitly not authorized.

The implementation must not individually force modules, Ghosts or snap markers back inside screen percentages.

Relative geometry must remain mathematically intact.

Normal visual clipping remains the responsibility of the existing scene container.

## 8. ResizeObserver Authorization

A narrow presentation-only `ResizeObserver` on the construction scene is authorized.

Its only allowed responsibility is:

- detect scene size change
- trigger presentation re-render

It must not:

- modify controller state
- modify construction state
- select a target
- commit placement
- change material
- change Wolf state

## 9. Committed Module Authorization

Committed module screen positions must be derived only from:

- authoritative instance transform
- current shared scene projection

The implementation may set:

- pixel `left`
- pixel `top`

It may not alter the authoritative transform.

## 10. Ghost Authorization

Ghost screen position must remain based on:

`state.placement.ghostPreview.transform.position`

The Ghost must use the same shared pixel projection as committed modules.

No Ghost-specific offset is authorized.

## 11. Target Snap World Helper Authorization

`src/dds-05a/sprite-presentation.mjs` may add a pure presentation helper equivalent to:

`snapWorldPosition(instanceTransform, snapPoint)`

It may perform only:

1. local snap scaling
2. Y-axis rotation
3. translation by instance world position

using the exact formula established in the scope reconciliation.

The helper must not mutate either input.

## 12. Target Snap Marker Authorization

`browser-app.mjs` may resolve the visual target snap point from existing frozen snapshot data:

- `candidate.targetInstanceId`
- `candidate.targetSnapId`
- target instance transform
- target instance definition ID
- corresponding snap profile
- corresponding target snap local position

The resulting target snap world point may then be projected with the shared scene projection.

The candidate key/request must remain unchanged.

## 13. Target Snap Marker Semantic Correction

After implementation, green/recommended/selected target markers must represent:

**the actual target snap world point on the existing construction**

They must no longer be positioned using:

`candidate.transform.position`

when that value represents the incoming module origin.

This is a presentation correction only.

## 14. Snap Resolution Failure Rule

If presentation cannot resolve a candidate's target instance/profile/snap point:

- do not invent a coordinate
- do not fall back to incoming module origin
- omit the unresolved marker
- diagnostic logging is allowed
- leave authoritative candidate/controller state unchanged

## 15. Visual Pivot Authorization

The first corrected implementation must continue using the existing candidate atlas anchor values without modification.

For every sprite frame:

`pivotX = frame.w * anchorX`

`pivotY = frame.h * anchorY`

That pivot must land on the projected authoritative module origin.

No per-category or per-instance corrective pixel offset is authorized.

## 16. Sprite Scaling Rule

Existing sprite `scale` may continue to apply around the visual pivot.

Scaling must not move the pivot away from the projected authoritative module origin.

No scale values are authorized to change.

## 17. spriteDescriptor Authorization

`spriteDescriptor()` may be refactored only as necessary to remove hidden/default percentage screen-position ownership.

It may continue to own:

- sprite frame key
- frame rectangle
- anchor metadata
- scale
- image URL
- image dimensions
- presentation depth

Preferred result:

- screen projection is centralized outside `spriteDescriptor()`
- descriptor no longer calculates its own screen point from a default projection

No sprite-category or yaw behavior change is authorized.

## 18. Depth Protection

`renderDepth()` behavior must remain unchanged in this block.

No depth model redesign is authorized.

## 19. Yaw / Direction Protection

The existing mapping remains fixed for TESTBUILD 3:

- 0° → `s`
- 90° → `e`
- 180° → `n`
- 270° → `w`

No direction-map correction is authorized.

## 20. Atlas Protection

Implementation must not modify:

- `assets/construction/dds-05a/candidate/construction-atlas.json`
- `assets/construction/dds-05a/candidate/construction-atlas.png`

Therefore no changes are allowed to:

- crops
- anchors
- scales
- image content
- extra asset entries

TESTBUILD 3 may request the same files with the new TB3 cache query only.

## 21. Cache / Identification Authorization

### index.html

May change only as needed to:

- visible label → `DDS-05A · TESTBUILD 3`
- page title/description → TESTBUILD 3
- `data-build-id` → `DDS-05A-TB3`
- CSS cache query → TB3
- browser-app cache query → TB3

### browser-app.mjs

May change:

- expected build ID → `DDS-05A-TB3`
- DDS-05A module import queries → TB3
- atlas request uses active TB3

No cache architecture change is authorized.

## 22. Required Verification Tests

The implementation must prove at minimum:

1. 800×600 scene → `S=44`, origin `(400,420)`
2. +X vector → `(+44,+22)`
3. +Z vector → `(-44,+22)`
4. +Y vector → `(0,-44)`
5. 360×360 scene → `S=24`, origin `(180,252)`
6. yaw 0 snap-world transformation correct
7. yaw 90 snap-world transformation correct
8. scale-before-rotation transformation correct
9. projection helper does not mutate input
10. snap-world helper does not mutate input
11. candidate key/request remains unchanged
12. visible build = TESTBUILD 3
13. all active cache references = `DDS-05A-TB3`
14. no active runtime/testbuild TB2 identity remains
15. protected DDS-04 files unchanged

## 23. Explicitly Protected Files

Implementation must not modify:

- `src/dds-04b/construction-state.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-04d/material-stability.mjs`
- `src/dds-04e/wolf-dynamic-response.mjs`
- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04f/prototype.css`
- `src/dds-05a/atlas-loader.mjs`
- candidate atlas JSON
- candidate atlas PNG

## 24. Explicit Exclusions

This authorization does not permit:

- atlas JSON edits
- PNG edits
- crop edits
- anchor edits
- scale edits
- yaw mapping edits
- CSS layout redesign
- DDS-04C changes
- controller changes
- new snap semantics
- new module categories
- gameplay changes
- Completion / Freeze decision
- device-gate approval in the same implementation step

## 25. Authorization Result

**DDS-05A – CONSTRUCTION SPRITE PROJECTION / ANCHOR ALIGNMENT IMPLEMENTATION = AUTHORIZED**

Authorized target:

- unified responsive pixel projection
- actual target-snap marker projection
- existing pivot semantics preserved
- TESTBUILD 3 identity/cache progression

Exact authorized diff boundary:

1. `src/dds-05a/sprite-presentation.mjs`
2. `src/dds-04f/browser-app.mjs`
3. `index.html`
4. `tests/dds-05a/sprite-presentation.test.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

Current status after this document:

**AUTHORIZED / NOT IMPLEMENTED / TESTBUILD 3 NOT DEPLOYED**

## 26. Next Admissible Step

The next admissible step is exclusively:

**DDS-05A – Construction Sprite Projection / Anchor Alignment – Implementation**

That step may modify only the five authorized files and must implement only the exact projection, snap-overlay, pivot-preservation and TESTBUILD-3 contracts defined above.

No additional visual correction and no device-gate decision may occur in the same step.
