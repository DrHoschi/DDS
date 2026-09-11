# DDS-01D – Comparison & Decision Gate Contract

Status: **DEFINED / DOCUMENTED / NOT EXECUTED**

Authority chain:
- DDS-00 Foundation: FROZEN
- DDS-01A – Shared Asset Baseline Contract
- DDS-01B – Film Feasibility Test Contract
- DDS-01C – Game Feasibility Test Contract
- Shared test character: `DDS-CHR-001` / PIG-01 / Schweinchen 1

## Purpose

DDS-01D defines the decision rules that must be applied after the film-side and game-side feasibility tests have produced evidence.

The purpose is to prevent the final direction from being chosen by a single attractive result, tool preference, sunk effort, or an unfair comparison using different character identities.

DDS-01D executes no film test, game test, generation, modeling, rigging, animation, gameplay, or production work.

## Decision Inputs

A final DDS-01 decision is admissible only when both sides have been evaluated under their respective contracts and against the shared DDS-01A identity baseline.

The comparison must consider at minimum:

1. identity fidelity,
2. consistency / repeatability,
3. controllability,
4. motion / animation viability,
5. technical stability and reuse,
6. production effort,
7. correction / iteration effort,
8. scalability from DDS-CHR-001 to all six frozen characters,
9. dependency on uncontrolled generation or manual repair,
10. resulting creative flexibility.

## Hard Gates

### Identity Gate

A production direction cannot receive a positive selection if it only works by materially redesigning DDS-CHR-001 away from the frozen shared baseline.

### Evidence Gate

A successful still image, isolated render, or one lucky generation is not sufficient evidence for either production direction.

### Repeatability Gate

The selected direction must demonstrate a credible way to reproduce, reopen, modify, or continue working with the character rather than starting from an uncontrolled new generation for each production state.

### Scalability Gate

The comparison must explicitly consider whether the tested method can reasonably extend to DDS-CHR-002 through DDS-CHR-006.

A method may still be selected with limitations, but those limitations must be documented rather than ignored.

### Fair Comparison Gate

Film and game evidence must use the same identity authority from DDS-01A. Neither side may obtain an advantage by substituting a redesigned master character.

## Comparative Rating

For every common criterion, each side must receive one of:

- `STRONG`
- `ACCEPTABLE`
- `LIMITED`
- `FAILED`
- `NOT PROVEN`

The rating must be supported by observed evidence from the feasibility execution.

No numerical weighting is frozen by DDS-01D. Identity preservation and production controllability are hard requirements and therefore cannot be compensated merely by a high score elsewhere.

## Allowed Final Decisions

DDS-01 may end only in one of the following four project decisions.

### FILM

`FILM` is admissible when:

- the film path has demonstrated a credible production-feasible route,
- the game path is materially weaker, failed, or unsuitable for the intended character production,
- the choice does not require changing the frozen identity baseline,
- known film limitations are documented.

`FILM` selects film as the primary next production direction. It does not permanently prohibit later game work.

### GAME

`GAME` is admissible when:

- the game path has demonstrated a credible production-feasible route,
- the film path is materially weaker, failed, or unsuitable for reliable character production,
- the choice does not require changing the frozen identity baseline,
- known game limitations are documented.

`GAME` selects game as the primary next production direction. It does not permanently prohibit later film work.

### SHARED

`SHARED` is admissible only when the evidence shows that a common or intentionally linked asset foundation can credibly support both directions without forcing one side to accept unacceptable identity loss or production instability.

A `SHARED` result must identify what is genuinely shared and what remains medium-specific.

Two independently successful but unrelated pipelines do not automatically constitute a shared pipeline.

### NEITHER/REWORK

`NEITHER/REWORK` is required when:

- neither direction has produced sufficient production-feasible evidence,
- both require unacceptable identity redesign,
- evidence remains materially inconclusive after the contracted tests,
- or the tested foundation reveals a shared blocker that must be solved before selecting a medium.

This result is not permission to silently modify the frozen V1 reference. Any required rework must be opened as a separate controlled decision/block.

## Treatment of PASS WITH LIMITATIONS

A `PASS WITH LIMITATIONS` result from DDS-01B or DDS-01C remains eligible for selection, but every material limitation must be carried into the comparison.

A direction with limitations must not be represented as equivalent to an unrestricted PASS.

## Inconclusive Evidence Rule

If either side is `INCONCLUSIVE` and the missing evidence could materially change the final selection, no FILM, GAME or SHARED decision may be frozen.

The missing evidence must first be resolved through a separately scoped continuation of the relevant feasibility test.

## Production-Effort Rule

Production effort is a decision factor, not merely a note.

The comparison must distinguish between:

- initial setup effort,
- recurring per-character effort,
- recurring per-shot / per-animation effort,
- correction effort caused by instability,
- tool-specific manual intervention.

A technically possible method may therefore still be judged materially weaker if its recurring effort makes six-character production unrealistic.

## Decision Record Requirement

Before DDS-01 can be frozen, the final comparison record must contain:

- film result classification,
- game result classification,
- common-criterion comparison,
- observed limitations,
- scalability assessment,
- selected decision: `FILM`, `GAME`, `SHARED`, or `NEITHER/REWORK`,
- concise evidence-based rationale,
- explicit statement that DDS-00 V1 character references remain unchanged unless a later separately authorized block decides otherwise.

## Scope Exclusions

DDS-01D does not:

- execute either feasibility test,
- select a tool,
- create production assets,
- create story or screenplay material,
- create gameplay,
- authorize mass production of all six characters,
- preselect FILM, GAME or SHARED.

The project decision remains **OPEN** until evidence is produced and evaluated through this gate.

## Completion Condition

DDS-01D is complete when this comparison and decision contract is documented without executing either feasibility path in the same step.

## Next Boundary

After DDS-01D completion, DDS-01A through DDS-01D together define the complete pre-test feasibility framework.

The next admissible work must therefore be a separately scoped feasibility **execution** step against these contracts. Execution must not begin implicitly inside DDS-01D.
