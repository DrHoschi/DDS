# DDS – Planned Asset / Spatial / Rig Pipeline Notes

**Status: PLANNED / IDEA RECORDED / NOT AUTHORIZED FOR IMPLEMENTATION**

This document records future ideas relevant to Die Drei Schweinchen. It does not change existing DDS freeze boundaries and does not authorize a film/game, 2D/3D, rigging or implementation decision.

## Sprite Placement / Construction Calibration

For future game/construction work, evaluate a richer sprite spatial contract instead of relying only on a single anchor:

- four-point ground footprint marking the actual floor/contact area, not roof/visual overhang
- stable origin/world anchor
- front/orientation marker
- optional height reference
- optional occupancy/interaction area distinct from the physical footprint
- scale/perspective calibration against the game-world construction grid

The goal is to make sprites from slightly different source perspectives/sizes easier to normalize consistently. Perspective warp, if ever supported, should be explicit and bounded rather than silently deforming an asset.

## Extensible Spatial Metadata

Future atlas metadata may include reusable POINT / LINE / CIRCLE / POLYGON elements with IDs/types. This can support entries, effects, construction snap edges, work areas, sockets and other game-specific points without requiring every marker name to be hard-coded into the editor.

## Modular Character / Rig Candidate

For future character work, evaluate modular sprite parts with:
- joints/pivots
- bones/segments
- body-part layer bindings
- sockets/attachments
- pose/frame definitions
- animation clips and optional per-frame corrections

Layer/Z-order must be explicit and may vary by viewing direction so arms, legs, torso, equipment and other parts are drawn in the correct front/back order.

This is only a future candidate and does not replace the authoritative DDS character references or decide the production pipeline.

## Schweinchen GLB as Future Test Asset

A Meshy-exported Schweinchen GLB is available from the project workflow and can later serve as a practical test candidate for 3D inspection/optimization once the relevant tool capability is separately authorized. Candidate checks include polygon/triangle count, silhouette quality, materials/textures, hierarchy, dimensions, pivot/origin and suitability for LOD/decimation.

DevForge is the candidate tool for inspection/game-asset optimization; CyberMotion is the candidate tool for deliberate 3D geometry/material/texture editing. Concrete handoff formats and workflows remain undecided.

## Guardrails

- PLANNED only.
- No current DDS block is expanded by this note.
- Film ↔ Game and concrete 2D/3D production decisions remain governed by their existing DDS decision/freeze boundaries.
- Do not block current construction/sprite work waiting for these future capabilities.
- Any implementation requires a separate DDS scope reconciliation/authorization.