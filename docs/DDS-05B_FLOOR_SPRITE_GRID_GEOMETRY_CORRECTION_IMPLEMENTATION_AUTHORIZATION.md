# DDS-05B – FLOOR Sprite/Grid Geometry Correction Implementation Authorization

Status: AUTHORIZED — NOT IMPLEMENTED

## Authorized basis

This authorization is limited to the previously reconciled DDS-05B FLOOR sprite/grid geometry correction scope.

The intended correction remains presentation-only. World/grid/snap authority is unchanged.

## Authorized implementation scope — exactly six existing files

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
2. `src/dds-04f/prototype.css`
3. `index.html`
4. `src/dds-04f/browser-app.mjs`
5. `tests/dds-05a/sprite-presentation.test.mjs`
6. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No seventh file is authorized.

## Authorized FLOOR correction

For the four authoritative runtime FLOOR frames only:

- `floor_s`
- `floor_e`
- `floor_n`
- `floor_w`

The implementation may:

- remove the temporary uniform TESTBUILD 1.2 footprint enlargement by returning `scale` from `1.30` to `1.00`;
- change FLOOR registration from the current measured `anchorY = 0.85` toward the defined first geometry-correction candidate `anchorY ≈ 0.425` while retaining `anchorX = 0.50`;
- apply a FLOOR-only presentation Y compression of approximately `0.79` while leaving X geometry at `1.00`;
- expose this correction only through the existing runtime presentation path;
- update the associated regression assertions accordingly;
- advance visible/technical build identity and cache busting together for the resulting test build.

The numeric values above are first device-calibration candidates from the geometry definition. They are not frozen final gameplay values and remain subject to later device evidence.

## Explicit implementation choice

The authorized method is a runtime presentation correction using the existing atlas metadata plus the existing sprite rendering/CSS path.

The implementation MUST NOT create a new generic `scaleX` / `scaleY` atlas contract or change `src/dds-05a/sprite-presentation.mjs` in this block.

## Explicitly not authorized

- no change to `construction-atlas.png`;
- no crop/frame rectangle changes;
- no new/re-rendered FLOOR asset;
- no changes to grid pitch or visible grid geometry;
- no changes to snap positions or snap authority;
- no changes to construction controller/domain authority;
- no changes to scene projection;
- no WALL, CORNER, DOOR, ROOF, BEAM, FOUNDATION or other family calibration;
- no generalized sprite-transform architecture;
- no freeze/completion claim in the implementation step.

## Gate after implementation

After implementation, the resulting head must first be checked against this six-file authorization, then receive regression re-verification, and only then may a real-device FLOOR/grid geometry test be used to judge the correction.

This authorization does not itself implement any change.
