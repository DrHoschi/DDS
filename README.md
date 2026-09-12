# DDS – Die Drei Schweinchen

## Project Foundation

DDS is the repository for the project **Die Drei Schweinchen**.

DDS-00 establishes only the repository and character-reference foundation. It does not decide or implement a film pipeline, game pipeline, animation pipeline, 3D workflow, or production format.

## Foundation Status

- DDS-00A – Repository Inventory: PASS
- DDS-00B – Character Asset Identification & Naming Contract: PASS
- DDS-00C – Repository Structure & Controlled Rename: PASS
- DDS-00D – Foundation Documentation & Freeze Gate: PASS
- Technical blockers: 0

## Character References

The six approved V1 character reference images are authoritative foundation assets. They are stored under `assets/characters/<character>/reference/` and must not be silently replaced, modified, or reinterpreted.

The authoritative mapping is documented in `docs/CHARACTER_ASSET_MANIFEST.md`.

## Film / Game Decision

**FILM ↔ GAME: OPEN**

No decision has yet been made whether the character assets and later production pipeline will primarily target film, game, or a controlled shared workflow. DDS-00 intentionally leaves this question open.

No later work may treat either FILM or GAME as already selected without a separate explicit project decision.

## DDS-00 Freeze Boundary

DDS-00 freezes:

- repository foundation,
- six character identities,
- six V1 reference assets,
- controlled character paths and names,
- the Film ↔ Game decision as OPEN.

DDS-00 does **not** freeze future animation, rigging, modeling, scene, story, gameplay, rendering, or production decisions.

Any work above this foundation must begin as a separate explicitly scoped DDS block.


## Future Game Concept Notes

The following gameplay concept is recorded for future work only and does not alter the current Film ↔ Game decision or authorize implementation:

- [DDS – Construction Prototype Game Concept](docs/DDS-GAME-CONSTRUCTION-PROTOTYPE-CONCEPT.md) — child-friendly modular house building, snap placement, Stroh/Holz/Stein material behavior, simplified stability, and a dynamic Wolf-Test.
