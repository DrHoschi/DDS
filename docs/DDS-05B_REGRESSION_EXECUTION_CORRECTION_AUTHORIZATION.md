# DDS-05B – Regression Execution Correction Authorization

Status: AUTHORIZED / ONE-FILE CORRECTION ONLY / NOT YET IMPLEMENTED

## Basis

Authorization applies against reconciliation commit:

`0cb591dc8d2ca5e054979acfd3112b3c30b5b77d`

Branch at authorization start:

`feature/dds-05a-sprite-construction-presentation`

## Authorized file scope

Exactly one existing file may be changed:

`.github/workflows/dds-05a-regression.yml`

No other file is authorized by this correction step.

## Authorized correction

The existing regression command may be extended from:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs`

to:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

The human-readable step name may also be adjusted only as necessary to state that DDS-05B regression tests are included.

## Explicitly unchanged

The following remain unchanged:

- workflow name unless technically required by the one-line correction (not currently required)
- push branch trigger
- `workflow_dispatch`
- permissions
- runner image
- Node.js version
- checkout action
- setup-node action
- job topology
- runtime files
- DDS-04F tests
- DDS-05A tests
- DDS-05B test contents
- GitHub Pages configuration
- deployment workflow
- DDS-05A frozen behavior
- DDS-05B runtime implementation

## Prohibited scope expansion

This authorization does not permit:

- creation of a new workflow
- creation of a second regression job
- CI refactoring or renaming beyond the optional step label
- runtime or presentation changes
- test logic changes
- TESTBUILD 4 work
- Y-stacking
- DDS-05C+

## Required result

After the separate correction implementation:

1. the existing single regression job must execute DDS-04F, DDS-05A and DDS-05B tests together;
2. no unrelated workflow behavior may change;
3. the resulting workflow run must be checked against its exact head SHA before DDS-05B regression can be marked PASS.

## Authorization decision

**DDS-05B REGRESSION EXECUTION CORRECTION = AUTHORIZED**

**SCOPE = EXACTLY ONE WORKFLOW FILE**

**IMPLEMENTATION = NOT YET PERFORMED IN THIS STEP**
