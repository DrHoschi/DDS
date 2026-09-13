# DDS-05A – Modular Grid Cache-Buster Correction Authorization

Status: AUTHORIZED / NARROW CACHE-CORRECTION SCOPE / NOT IMPLEMENTED

## 1. Purpose

This authorization exists only to ensure that the already implemented DDS-05A Modular Grid Authority Compatibility controller change is actually reloaded by browsers/devices instead of being hidden by a stale module cache.

No construction capability, snap contract, atlas data, sprite calibration, grid presentation or gameplay behavior is authorized to change here.

## 2. Verified cache chain

Current active entry chain:

- `index.html` loads `src/dds-04f/browser-app.mjs?build=DDS-05A-TB3`
- `src/dds-04f/browser-app.mjs` imports `./construction-ui-controller.mjs` without a query/cache-buster
- the controller file changed during the Modular Grid Authority Compatibility implementation

Therefore the controller can remain cached independently even when its repository content changed.

## 3. Authorized files

Only the following files may be modified by the correction:

1. `src/dds-04f/browser-app.mjs`
2. `index.html` only if required to keep the active build identity/cache chain internally consistent

No other file is authorized.

## 4. Authorized change

The correction may only:

- add/update a cache-busting build query on the active `construction-ui-controller.mjs` import,
- advance the active build identifier from the current TB3 identity to one new, internally consistent correction/test-build identity,
- update the corresponding `EXPECTED_BUILD_ID`, `data-build-id`, visible test-build label and active entry-module query only where necessary for that same identity.

All touched active cache-sensitive references must use the same new build identity.

## 5. Explicit exclusions

This correction must not:

- change any FLOOR snap point,
- change grid authority behavior,
- change DDS-04C snap/occupancy semantics,
- change any tests except where an existing cache-busting test strictly requires the new identity in a later separately authorized step,
- change atlas JSON or PNG,
- change atlas-loader behavior,
- change sprite-presentation behavior,
- implement the visible 9×9 grid,
- implement sprite/grid calibration,
- add Y/height/stacking rules,
- introduce DDS-05B+ capability.

## 6. Completion boundary

This authorization permits only the cache-buster correction described above.

It does not declare that correction implemented, device-verified, PASS, frozen, or integrated.

After the correction is implemented, the new build must be loaded on the target device before the Modular Grid Authority Compatibility Completion / Regression Gate is evaluated.
