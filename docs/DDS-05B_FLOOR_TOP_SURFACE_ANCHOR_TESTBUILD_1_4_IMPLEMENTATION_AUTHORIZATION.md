# DDS-05B – FLOOR Top-Surface Anchor TESTBUILD 1.4 Implementation Authorization

Status: AUTHORIZED — NOT IMPLEMENTED

## Authorized baseline

Implementation is authorized only against the reconciled TESTBUILD 1.4 scope documented at commit:

`295bc75bc8fa3091c30583e70cc3e24780843fd1`

The existing runtime baseline remains DDS-05B · TESTBUILD 1.3 until the separate implementation step is executed.

## Exact authorized file scope

Only the following five existing files may be changed in the implementation step:

1. `assets/construction/dds-05a/candidate/construction-atlas.json`
2. `index.html`
3. `src/dds-04f/browser-app.mjs`
4. `tests/dds-05a/sprite-presentation.test.mjs`
5. `tests/dds-05a/testbuild-cache-busting.test.mjs`

No sixth file is authorized.

## Authorized FLOOR candidate values

Only the four authoritative cardinal FLOOR runtime frames may receive the reconciled crop/anchor candidate values:

- `floor_s`: `x=20, y=31, w=95, h=74`, `anchorX=0.5`, `anchorY=0.84`, `scale=1`
- `floor_e`: `x=253, y=31, w=95, h=74`, `anchorX=0.5`, `anchorY=0.84`, `scale=1`
- `floor_n`: `x=481, y=31, w=95, h=74`, `anchorX=0.5`, `anchorY=0.84`, `scale=1`
- `floor_w`: `x=719, y=31, w=95, h=74`, `anchorX=0.5`, `anchorY=0.84`, `scale=1`

The relative correction is the reconciled cardinal-frame crop of +3 px X, +3 px Y, -5 px width and -6 px height from the current 100×80 runtime frames.

## Authorized runtime presentation behavior

The existing FLOOR-only CSS geometry correction `scaleY(0.79)` remains unchanged and is not part of this implementation scope.

No CSS modification is authorized.

The implementation may update only the cache/build identity references in `browser-app.mjs` required to expose the new test build. No renderer, projection, placement, snap, grid or controller behavior may be changed.

## Authorized build identity

The implementation may advance the visible and technical test-build identity from TESTBUILD 1.3 to:

- visible: `DDS-05B · TESTBUILD 1.4`
- technical/cache id: `DDS-05B-TB1.4`

All active cache-busted imports and runtime build checks within the authorized files must use the same technical identity.

## Authorized test updates

The two authorized test files may be changed only to verify:

- the four cardinal FLOOR frames use the exact reconciled 95×74 crop and `0.5 / 0.84` anchor;
- their atlas scale remains `1`;
- diagonal FLOOR frames remain outside this calibration;
- non-FLOOR sprite families remain unchanged;
- TESTBUILD 1.4 visible/technical identities are consistent;
- no stale TESTBUILD 1.3 identity remains in the active runtime identity paths;
- the existing FLOOR-only presentation correction remains scoped to FLOOR without introducing new authority.

## Explicitly not authorized

This authorization does not permit:

- `prototype.css` changes;
- changing/removing `scaleY(0.79)`;
- atlas PNG modification;
- changes to diagonal FLOOR frames (`floor_se`, `floor_ne`, `floor_nw`, `floor_sw`);
- WALL/CORNER/DOOR/ROOF/BEAM changes;
- `src/dds-05a/sprite-presentation.mjs` changes;
- grid geometry changes;
- snap offsets or snap authority changes;
- world positions or occupancy changes;
- projection changes;
- construction-controller changes;
- depth-ordering redesign;
- any additional capability or cleanup outside the five-file scope.

## Post-implementation gate

After implementation, the implementation commit must be compared against this authorization baseline to prove that exactly the five authorized files changed and no scope expansion occurred.

Regression verification is a separate subsequent step.

Real iPhone validation is also separate and must include the defined two-FLOOR acceptance case: one calibrated FLOOR plus a second orthogonally adjacent/front FLOOR, checking grid-tip registration and natural presentation-only overhang coverage.

No implementation is performed in this authorization step.
