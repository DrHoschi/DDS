# DDS-05B – Regression Test Failure Reconciliation

Status: RECONCILED / TEST-ONLY FAILURE SCOPE IDENTIFIED / NO CORRECTION AUTHORIZED

Baseline under reconciliation:
- Branch: `feature/dds-05a-sprite-construction-presentation`
- Regression execution correction head: `3b030f3e637389fd67fcee103f7bec90b57fb2e4`
- Full regression command: `node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`
- Result: 54 total / 52 pass / 2 fail

This reconciliation is restricted to the two failing assertions in `tests/dds-05b/visible-construction-grid.test.mjs`. No runtime, CSS, controller, snap, atlas, sprite, workflow, build identity, or device behavior change is authorized by this document.

## Failure 1 – presentation-state selector assumption

Failing test:
`grid exposes only the four authorized presentation states`

Current assertion loops over `free`, `occupied`, `valid-target`, and `selected-target` and requires a dedicated CSS selector `.scene-grid__cell.is-<state>` for every state.

Actual runtime contract:
- `browser-app.mjs` explicitly derives exactly four state names: `selected-target`, `valid-target`, `occupied`, and `free`.
- Every polygon receives the runtime class `is-${stateName}` and the corresponding `data-grid-state` value.
- The CSS base rule `.scene-grid__cell` is the visual FREE presentation.
- CSS overrides exist only for `is-occupied`, `is-valid-target`, and `is-selected-target` because those states differ from the base FREE presentation.

Reconciliation conclusion:
The failure is caused by an over-specific CSS-structure assertion. DDS-05B does expose all four authorized runtime states, while FREE intentionally inherits the base `.scene-grid__cell` presentation. A separate `.scene-grid__cell.is-free` CSS override is not required by the DDS-05B presentation contract.

Required later test correction:
- verify that the runtime state derivation explicitly includes exactly `free`, `occupied`, `valid-target`, and `selected-target`;
- verify the base `.scene-grid__cell` rule exists for FREE presentation;
- verify dedicated override selectors for `occupied`, `valid-target`, and `selected-target`;
- do not require a redundant `.is-free` CSS override.

## Failure 2 – malformed GRID_SIZE negative regex

Failing assertion:
`assert.doesNotMatch(browserApp, /GRID_SIZE\s*=\s*[^9]/);`

Actual runtime contract:
`browser-app.mjs` declares `const GRID_SIZE = 9;` and both row/column loops are bounded by `GRID_SIZE`.

The negative regex is not a valid proof that `GRID_SIZE` differs from 9. Because `\s*` may consume zero characters, `[^9]` may match whitespace between `=` and `9`, causing the correct declaration itself to satisfy the forbidden pattern.

Reconciliation conclusion:
The failure is a malformed test assertion. The existing positive assertion `assert.match(browserApp, /const GRID_SIZE = 9;/);` already verifies the fixed authority value. The later correction should remove the invalid negative regex or replace it with a structurally safe assertion that cannot match whitespace from the correct declaration.

## Scope conclusion

The two observed failures do not establish a DDS-05B runtime defect. They are both confined to test-contract assumptions in one existing test file.

If separately authorized, the exact correction scope is one file only:
- `tests/dds-05b/visible-construction-grid.test.mjs`

Explicitly out of scope:
- `src/dds-04f/browser-app.mjs`
- `src/dds-04f/prototype.css`
- controller / snap authority
- sprite presentation / atlas / loader
- `.github/workflows/dds-05a-regression.yml`
- build/cache-buster identity
- iPhone or iPad presentation changes
- TESTBUILD 4
- DDS-05C+

No test correction is implemented in this step.
