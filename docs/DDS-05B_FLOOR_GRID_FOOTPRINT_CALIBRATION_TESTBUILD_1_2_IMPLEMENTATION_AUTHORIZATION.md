# DDS-05B – FLOOR/Grid Footprint Calibration TESTBUILD 1.2 Implementation Authorization

Status: AUTHORIZED — NOT IMPLEMENTED

## Basis

- Definition commit: `0d194102fe1a6f70e6424333926f092ef5be4376`
- Implementation Scope Reconciliation commit: `a3c3ba8c18a592c727e7ec933ec17568765255d4`
- Current device build: `DDS-05B · TESTBUILD 1.1`
- Current technical build id: `DDS-05B-TB1.1`
- Current authoritative runtime FLOOR scale: `1.15`

## Exact authorized file scope

Only these five existing files may be changed:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
2. `tests/dds-05a/sprite-presentation.test.mjs`
3. `index.html`
4. `src/dds-04f/browser-app.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No other repository file is authorized for modification in this implementation step.

## Authorized functional change

In `construction-atlas.json`, and only for the four authoritative runtime FLOOR frames:

- `floor_s`
- `floor_e`
- `floor_n`
- `floor_w`

change presentation `scale` from `1.15` to `1.30`.

The following properties are explicitly not authorized to change:

- frame `x/y/w/h`
- `anchorX`
- `anchorY`
- any diagonal FLOOR frame scale
- any non-FLOOR frame or metadata
- atlas image file

## Authorized test change

In `tests/dds-05a/sprite-presentation.test.mjs`, update only the existing FLOOR footprint calibration assertion so the four authoritative runtime FLOOR frames are expected to use `scale: 1.30` for TESTBUILD 1.2 while existing unchanged-category safeguards remain intact.

No unrelated sprite-presentation test logic may be added, removed, or weakened.

## Authorized build identity / cache-buster change

Advance the device-visible calibration build from 1.1 to 1.2:

- visible label: `DDS-05B · TESTBUILD 1.2`
- technical/cache id: `DDS-05B-TB1.2`

This may be applied only through the existing build identity/cache-buster locations in:

- `index.html`
- `src/dds-04f/browser-app.mjs`
- `tests/dds-05a/testbuild-cache-busting.test.mjs`

The existing build-id derivation and cache propagation behavior must remain unchanged.

## Explicitly not authorized

- no CSS changes
- no construction controller changes
- no grid geometry changes
- no snap coordinate or placement-authority changes
- no projection changes
- no atlas-loader changes
- no frame crop changes
- no anchor/pivot changes
- no PNG/image changes
- no WALL calibration
- no CORNER/DOOR/ROOF/BEAM calibration
- no diagonal FLOOR calibration
- no workflow/CI changes
- no new capability or DDS-05C+ work

## Required implementation result

After a separate implementation step:

- exactly the five authorized files are changed;
- `floor_s/e/n/w` use `scale: 1.30` and all explicitly excluded frame properties remain unchanged;
- visible build identity is `DDS-05B · TESTBUILD 1.2`;
- active technical/cache identity is `DDS-05B-TB1.2` throughout the existing load chain;
- regression is re-run against the exact final implementation head before any iPhone device result is judged.

`1.30` remains a calibration probe, not a frozen final FLOOR scale. Device evidence decides whether it is accepted, refined, or whether scale iteration must stop for separate crop/anchor reconciliation.
