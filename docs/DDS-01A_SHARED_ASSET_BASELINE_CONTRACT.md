# DDS-01A – Shared Asset Baseline Contract

Status: **DEFINED / DOCUMENTED / NOT IMPLEMENTED**

Baseline: frozen DDS-00 commit `3a32d75baa2c07e76e4c9910ebb81cd09ab021c2`

## Purpose

DDS-01A defines the single shared test baseline that later film and game feasibility work must use. It does not perform any film test, game test, 3D modeling, rigging, animation, rendering, or gameplay implementation.

## Authoritative Test Character

The only character allowed for the first Film ↔ Game feasibility comparison is:

- Character ID: `DDS-CHR-001`
- Character: PIG-01 / Schweinchen 1
- Authoritative identity reference: `assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

No other DDS character is in scope for DDS-01A.

## Identity Authority

The frozen V1 reference sheet is the identity authority. Any later film-side or game-side derivative used in feasibility testing must remain recognizably the same character and must preserve the defining identity package rather than merely generate a generic pig character.

The following identity groups are binding:

- species and overall stylized childlike pig design,
- body proportions and general silhouette,
- head shape, ears, snout and facial proportions,
- pink skin tone and brown hoof treatment,
- straw hat with its established band treatment,
- white shirt,
- blue short overalls,
- established overall color relationship,
- friendly / clever / dependable visual character impression,
- tail form and other persistent body identifiers.

## Allowed Test Variation

A later feasibility derivative may vary only where production necessarily requires it, for example:

- pose,
- facial expression,
- limb articulation,
- camera angle,
- lighting,
- scene placement,
- animation frame state,
- technical topology or rig structure that is not visible as an identity change.

Such variation must not replace or redesign the character identity.

## Prohibited Baseline Drift

The following are not acceptable as successful derivatives of the shared baseline:

- different clothing concept,
- removal or redesign of core identity clothing without explicit test justification,
- materially different body proportions,
- materially different head or snout design,
- different species or age impression,
- major palette drift,
- generic substitute pig that only resembles the reference loosely,
- redesign performed only to make one production path easier.

If a production path cannot preserve the shared identity without redesign, that is a feasibility finding and must be recorded as such. The reference must not be changed to hide the limitation.

## Shared-Comparison Rule

Film and game feasibility must be compared against the same frozen identity source. Neither path may use a separately redesigned master character as its baseline.

This prevents a false comparison in which the film path and game path are effectively testing different characters.

## Output of DDS-01A

DDS-01A produces only this contract.

It does not produce:

- Higgsfield or Motion Studio output,
- video,
- animation,
- image generation,
- 3D mesh,
- rig,
- sprite,
- game code,
- gameplay prototype,
- production decision.

## Completion Condition

DDS-01A is complete when this contract is documented against the frozen DDS-00 baseline and no implementation work has been introduced in the same step.

## Next Boundary

After DDS-01A completion, the next admissible step is a separately defined **DDS-01B – Film Feasibility Test Contract**.

No film test may be executed until DDS-01B is explicitly defined. No game feasibility test may begin in DDS-01A or DDS-01B.
