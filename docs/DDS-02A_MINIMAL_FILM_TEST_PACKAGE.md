# DDS-02A – Minimal Film Test Package

Status: **DEFINED / DOCUMENTED / NOT YET EXECUTED**

Authority chain:
- DDS-00 – Repository & Character Foundation: FROZEN
- DDS-01A – Shared Asset Baseline Contract
- DDS-01B – Film Feasibility Test Contract
- DDS-01C – Game Feasibility Test Contract
- DDS-01D – Comparison & Decision Gate Contract

Test character:
- `DDS-CHR-001` / PIG-01 / Schweinchen 1
- authoritative reference: `assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

Initial execution tool: **Higgsfield**

Higgsfield is the first test tool only. It is not part of DDS character identity, repository architecture, or a permanent production decision.

## Purpose

DDS-02A defines the smallest controlled film-side execution package capable of producing useful evidence against DDS-01B without prematurely building a film-production pipeline.

Only three evidence cases are permitted.

## Test 01 – IDENTITY / STILL

### Objective

Determine whether the film-side tool can derive a new controlled image state from the authoritative V1 reference while keeping the character recognizably DDS-CHR-001.

### Required evidence

The resulting image must allow direct inspection of at least:

- head and snout identity,
- ears,
- body proportions,
- straw hat,
- white shirt,
- blue short overalls,
- established palette,
- hands / hooves,
- overall silhouette and age impression.

### Test constraint

The state should remain visually simple. No second character, complex action, elaborate environment, dramatic camera effect, or identity redesign may be introduced.

### Gate

If the still already loses the DDS-01A identity materially, that failure must be recorded before proceeding as though the film route were successful.

## Test 02 – MOTION

### Objective

Determine whether the same character can perform a simple clearly readable full-body movement while preserving identity and anatomy through time.

### Minimal motion

Preferred initial action: **a few ordinary steps forward**.

An equivalent simple full-body movement is permissible only if the selected tool cannot express this action directly and the substitution is documented.

### Required observation points

Inspect during the motion:

- face / snout stability,
- hat stability,
- shirt and overall continuity,
- body proportions,
- arm and leg integrity,
- hands / hooves,
- foot contact / walking plausibility,
- unwanted morphing,
- disappearing or duplicated body/clothing elements,
- character identity from beginning to end.

### Gate

A good first or final frame does not compensate for severe identity or anatomy failure during the movement.

## Test 03 – CONTINUITY

### Objective

Determine whether DDS-CHR-001 can be produced again in a separate short state or shot and still read as the same character rather than only remaining stable inside one generated clip.

### Required condition

The continuity evidence must be a separately produced state/shot using the same authoritative identity source and controlled film-test approach.

It must introduce enough change to test continuity, such as a different simple pose, expression, framing, or uncomplicated shot state, without adding unrelated production complexity.

### Required comparison

Compare Test 03 against both:

- the frozen V1 reference,
- the accepted output/evidence from Test 01 and Test 02.

Observe especially face, snout, proportions, hat, clothing, palette and overall silhouette.

## Explicit Exclusions

DDS-02A does not test or authorize:

- speech,
- lip-sync,
- dialogue,
- voice generation,
- a second character,
- crowd scenes,
- complex environments,
- camera choreography,
- cinematic scene construction,
- story or screenplay,
- a finished film,
- production asset mass generation,
- 3D modeling,
- game implementation.

These variables are excluded so that failures can be attributed primarily to character identity, motion and continuity rather than unrelated production complexity.

## Evidence Recording

Each of the three tests must be recorded separately with:

- test ID,
- tool / mode used,
- authoritative input reference,
- concise generation or motion instruction,
- produced output,
- number of meaningful attempts if retries were required,
- observed identity deviations,
- observed technical / motion defects,
- result classification.

Permitted per-test classifications:

- `PASS`
- `PASS WITH LIMITATIONS`
- `FAIL`
- `INCONCLUSIVE`

Failed attempts must not be silently discarded when repeated retries are required to obtain one acceptable result. Retry effort is part of the feasibility evidence.

## Execution Order

Execution is sequential:

`TEST-01 IDENTITY/STILL` → `TEST-02 MOTION` → `TEST-03 CONTINUITY`

Do not expand the package during execution merely because an early result looks promising.

If an early result exposes a fundamental blocker, record it before deciding whether the remaining evidence cases still provide useful diagnostic information.

## DDS-00 Protection

The frozen V1 reference remains unchanged throughout DDS-02A.

No generated result may overwrite:

`assets/characters/pig-01/reference/DDS-CHR-001_REFERENCE_V1.png`

Generated feasibility outputs are derivatives/evidence only and do not become new identity authority automatically.

## DDS-02A Completion Gate

DDS-02A may be marked execution-complete only when all performed evidence and retries are preserved sufficiently to evaluate DDS-01B honestly.

Completion of DDS-02A does not itself select FILM.

The film-side feasibility result must subsequently be evaluated against DDS-01B and later compared with game-side evidence under DDS-01D.

## Immediate Next Boundary

After this document is committed, the next admissible action is **DDS-02A / TEST-01 – IDENTITY / STILL execution with DDS-CHR-001**.

Do not start MOTION or CONTINUITY in the same execution step before TEST-01 evidence has been reviewed.
