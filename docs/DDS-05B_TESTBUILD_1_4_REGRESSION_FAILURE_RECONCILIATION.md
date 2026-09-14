# DDS-05B – TESTBUILD 1.4 Regression Failure Reconciliation

Status: RECONCILED — NOT CORRECTED

## Baseline

- TESTBUILD 1.4 implementation head: `8dd8e386d068c52f8993f19235b127ade99826af`
- Regression workflow: DDS-05A Regression
- Run ID: `34873998181`
- Result: 55 PASS / 1 FAIL

## Single failing assertion

The only failing test is:

`tests/dds-05a/atlas-loader.test.mjs`

Subtest:

`atlas loader validates actual image dimensions without structural authority`

The stale assertion is:

`assert.equal(loaded.manifest.frames.floor_s.frame.x, 17);`

TESTBUILD 1.4 intentionally changed the authorized `floor_s` crop from x=17 to x=20 as part of the approved top-surface-anchor crop package. Therefore the runtime manifest value `20` is expected and the assertion value `17` is obsolete.

The same test continues to verify the atlas dimensions (1536×1024) and the unchanged `beam_s` frame. Those assertions remain valid and must stay unchanged.

## Reconciliation decision

This is a regression-fixture expectation mismatch, not evidence of a runtime, atlas-loader, world/grid, snap or projection defect.

The minimal permissible correction is exactly one existing test file:

`tests/dds-05a/atlas-loader.test.mjs`

Within that file, only the TESTBUILD-1.4-dependent FLOOR expectation may be corrected:

- `floor_s.frame.x`: expected `17` → `20`

No production/runtime file is required for this correction.

## Explicitly not authorized by this reconciliation

- no `construction-atlas.json` change;
- no atlas PNG change;
- no `browser-app.mjs` change;
- no `prototype.css` change;
- no `sprite-presentation.mjs` change;
- no build/cache identity change;
- no grid, snap, projection or controller change;
- no changes to other atlas-loader assertions unless a later independent failure proves they are stale;
- no iPhone device gate before regression returns PASS.

## Required next sequence

1. Explicit correction authorization for the single-file scope above.
2. Correct only `tests/dds-05a/atlas-loader.test.mjs`.
3. Re-run the full DDS-04F + DDS-05A + DDS-05B regression suite against the resulting exact SHA.
4. Only after full PASS may the TESTBUILD 1.4 iPhone two-FLOOR device test proceed.
