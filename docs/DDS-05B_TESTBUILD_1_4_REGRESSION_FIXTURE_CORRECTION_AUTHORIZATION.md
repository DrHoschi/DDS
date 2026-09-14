# DDS-05B – TESTBUILD 1.4 Regression Fixture Correction Authorization

Status: AUTHORIZED — NOT IMPLEMENTED

## Authorized baseline

- TESTBUILD 1.4 implementation head: `8dd8e386d068c52f8993f19235b127ade99826af`
- Regression Failure Reconciliation: `68d053e95fdf9d1b0f66c2192ebcf2f54816dbfd`
- Failing regression: `tests/dds-05a/atlas-loader.test.mjs`
- Failure reason: stale expectation `floor_s.frame.x === 17` although TESTBUILD 1.4 intentionally changed the authorized `floor_s` crop origin to `x = 20`.

## Exact authorized correction

Exactly one existing file may be changed:

`tests/dds-05a/atlas-loader.test.mjs`

Exactly one expectation may change:

- from: `assert.equal(loaded.manifest.frames.floor_s.frame.x, 17);`
- to: `assert.equal(loaded.manifest.frames.floor_s.frame.x, 20);`

No other assertion, test name, fixture, helper, source file, runtime file, atlas value, build identity or workflow may be changed in this correction.

## Explicitly excluded

- no `construction-atlas.json` change;
- no PNG change;
- no `index.html` change;
- no `browser-app.mjs` change;
- no CSS change;
- no `sprite-presentation.test.mjs` change;
- no cache-busting test change;
- no workflow change;
- no grid/snap/projection/controller change;
- no TESTBUILD identity increment;
- no device testing in the same step.

## Required follow-up

After the one-line fixture correction is implemented, the full existing regression command must be re-run against the resulting exact head:

`node --test tests/dds-04f/*.test.mjs tests/dds-05a/*.test.mjs tests/dds-05b/*.test.mjs`

The iPhone two-FLOOR device test remains blocked until this regression re-verification is PASS.
