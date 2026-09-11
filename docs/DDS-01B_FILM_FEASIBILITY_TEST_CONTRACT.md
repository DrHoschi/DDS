# DDS-01B – Film Feasibility Test Contract

Status: **DEFINED / DOCUMENTED / NOT EXECUTED**

Baseline: frozen DDS-00 commit `3a32d75baa2c07e76e4c9910ebb81cd09ab021c2`

Dependency: `DDS-01A – Shared Asset Baseline Contract`

## Purpose

DDS-01B defines the exact acceptance criteria for the first film-side feasibility test using the shared DDS-01 baseline character. It does not execute the test and does not create film output.

## Authoritative Test Character

The only test character is:

- Character ID: `DDS-CHR-001`
- Character: PIG-01 / Schweinchen 1
- Identity authority: `assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

All identity-preservation rules from DDS-01A remain binding.

## Film-Side Question

The test must answer one narrow question:

> Can the frozen DDS-CHR-001 identity be used in a practical character/motion workflow to create short moving film shots while remaining recognizably the same character across outputs?

The test is not intended to prove that a full film can already be produced.

## Candidate Tooling

A later execution may use Higgsfield / Motion Studio or another explicitly selected character-motion workflow. Tool selection is implementation detail and may not change the acceptance criteria below.

DDS-01B does not authorize any tool execution.

## Required Test Evidence

A successful later DDS film feasibility execution must provide evidence for all of the following groups.

### 1. Identity Preservation

The moving result must remain clearly identifiable as DDS-CHR-001 rather than a generic or redesigned pig.

Required preservation includes at minimum:

- overall body proportions and silhouette,
- head / snout / ear relationship,
- pink skin and brown hoof treatment,
- straw hat,
- white shirt,
- blue short overalls,
- established visual age and personality impression,
- no unexplained identity drift between generated shots.

### 2. Motion Viability

The workflow must demonstrate at least one short controlled movement sequence in which:

- the character visibly changes pose over time,
- limb movement is coherent enough for intended children’s-film use,
- clothing and body parts remain structurally plausible,
- the character does not collapse into severe deformation or frame-to-frame redesign.

The contract does not prescribe a final animation style or exact motion preset.

### 3. Multi-Shot Consistency

The workflow must demonstrate that the same character can survive more than one output state.

The evidence must include at least two distinct shot states, for example:

- neutral / standing,
- walking or turning,
- simple acting gesture,
- changed camera framing or viewpoint.

The purpose is to test consistency across outputs, not to create an edited scene.

### 4. Camera / Framing Tolerance

The character must remain usable under at least a modest change in framing or viewpoint without losing identity.

This is not a full turnaround test. The requirement is only to show that the character is not locked to one single reference-sheet pose or camera presentation.

### 5. Expression / Acting Tolerance

The workflow must demonstrate at least one non-neutral expression or acting state without materially changing the character’s face design.

Expression variation is allowed; identity redesign is not.

### 6. Production Repeatability

A single lucky output is not sufficient.

The test must record whether the workflow can reproduce acceptable identity-preserving output through a repeatable sequence of inputs, references, settings, or steps.

If acceptable output depends on uncontrolled trial-and-error with frequent identity loss, that must be recorded as a feasibility limitation.

### 7. Practical Effort

The later test must record the practical effort required, including at minimum:

- number of attempts needed for acceptable output,
- manual correction or re-generation burden,
- whether references/settings can be reused,
- whether the process appears scalable from one test character to six DDS characters.

No exact numeric threshold is fixed in DDS-01B. The evidence must be sufficient for later comparison with the game path.

## Allowed Test Scope

The later DDS film feasibility execution may produce only small test artifacts needed to evaluate the criteria above, such as:

- short motion clips,
- still frames extracted from test clips,
- prompt / settings records,
- reference-input records,
- concise observation notes.

These outputs are feasibility evidence, not approved production assets.

## Explicitly Out of Scope

DDS-01B does not authorize or define:

- full scene production,
- storyboarding of the complete tale,
- final voices or dialogue,
- music,
- editing a finished film,
- production-quality environment creation,
- final camera language,
- final rendering style,
- 3D character modeling,
- game implementation,
- gameplay,
- expansion to the other five characters.

## Failure / Limitation Conditions

The film path must be marked as limited or failed for the tested workflow if one or more of the following remain materially unresolved:

- identity cannot be preserved across motion,
- clothing / body design drifts strongly between outputs,
- motion creates severe recurring deformation,
- multiple shot states cannot reproduce the same character,
- acceptable results depend on effectively redesigning DDS-CHR-001,
- the workflow is so inconsistent or correction-heavy that scaling to six characters is not practically credible.

A limitation is a valid result. The frozen reference must not be altered merely to turn a failing test into a pass.

## Result Classification

The later film feasibility execution must end in exactly one of these statuses:

- `FILM-FEASIBILITY: PASS`
- `FILM-FEASIBILITY: PASS WITH LIMITATIONS`
- `FILM-FEASIBILITY: FAIL`
- `FILM-FEASIBILITY: INCONCLUSIVE`

The status must be supported by saved test evidence and observations.

## Completion Condition for DDS-01B

DDS-01B itself is complete when this contract is documented and no film test has been executed in the same step.

## Next Boundary

After DDS-01B completion, the next admissible step is **DDS-01C – Game Feasibility Test Contract**.

No Higgsfield / Motion Studio execution, film generation, 3D modeling, rigging, or game implementation is authorized by DDS-01B itself.
