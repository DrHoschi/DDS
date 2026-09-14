# DDS-05B – FLOOR Top-Surface Geometry Measurement Definition

Status: DEFINED — NO IMPLEMENTATION AUTHORIZED

## Purpose

Define a deterministic measurement method for comparing the visible top surface of a FLOOR sprite against one authoritative 1×1 construction-grid cell. This step decides whether the remaining mismatch is caused primarily by uniform scale, sprite registration/anchor, sprite crop/transparent padding, sprite-perspective geometry, or a combination.

This document does not authorize code, atlas, PNG, CSS, projection, grid, snap, controller, WALL, or any other runtime change.

## Frozen comparison authority

The grid/world side remains authoritative and unchanged:

- logical footprint: exactly one 1×1 cell;
- cell world pitch: 2 units;
- existing world→screen projection remains authoritative;
- existing snap/world positions remain authoritative;
- visible grid is presentation evidence only and must use the same projection.

The sprite is evaluated against that authority; the grid is not resized to match the sprite.

## Reference geometry

For one chosen visible grid cell define four projected screen-space vertices in clockwise order:

- `G_top`
- `G_right`
- `G_bottom`
- `G_left`

Define grid center:

`G_center = (G_top + G_right + G_bottom + G_left) / 4`

Define the two independent grid edge vectors:

- `G_axis_A = G_right - G_top`
- `G_axis_B = G_left - G_top`

Equivalent opposite edges should be parallel within normal pixel/raster tolerance.

## FLOOR top-surface geometry

Only the upper usable/building surface of the FLOOR element is measured. Do not use:

- visible board thickness below the top plane;
- drop shadow;
- antialiased halo;
- transparent frame padding;
- decorative protrusions that are not part of the logical top-plane boundary.

Identify the four top-plane corner points in the same clockwise semantic order:

- `S_top`
- `S_right`
- `S_bottom`
- `S_left`

Define sprite top-surface center:

`S_center = (S_top + S_right + S_bottom + S_left) / 4`

Define sprite top-surface edge vectors:

- `S_axis_A = S_right - S_top`
- `S_axis_B = S_left - S_top`

## Measurements

For each axis compare:

1. length ratio
   - `rA = |S_axis_A| / |G_axis_A|`
   - `rB = |S_axis_B| / |G_axis_B|`

2. direction/angle difference
   - angle between `S_axis_A` and `G_axis_A`
   - angle between `S_axis_B` and `G_axis_B`

3. center offset
   - `D_center = S_center - G_center`

4. corner residuals after center alignment
   - translate the sprite top surface by `-D_center` without scaling or rotation;
   - measure each aligned sprite corner against its corresponding grid corner.

## Diagnostic classification

### A. Uniform-scale mismatch

Classify primarily as SCALE when:

- `rA` and `rB` are materially different from 1 but approximately equal to each other;
- sprite and grid axis angles match;
- after center alignment the four corners show a radially consistent under- or oversize pattern.

Then one uniform scale correction may be sufficient.

### B. Registration / anchor mismatch

Classify primarily as REGISTRATION/ANCHOR when:

- `rA ≈ 1` and `rB ≈ 1`;
- axis angles match;
- corner shape is otherwise congruent;
- `D_center` is materially non-zero.

Then scale should not be changed merely to compensate for position.

### C. Perspective / aspect mismatch

Classify primarily as SPRITE GEOMETRY / PERSPECTIVE when:

- `rA` and `rB` differ materially from one another, or
- one/both sprite edge angles do not match the grid axes, or
- no single uniform scale and translation can align all four top-plane corners.

Then further scale-only iteration must stop. A corrected FLOOR render/asset or a separately authorized presentation transform would be required.

### D. Crop / transparent-padding issue

Transparent padding is classified separately from top-surface geometry. Padding is relevant only when the logical registration point is derived from the frame rectangle in a way that displaces the top surface.

A tighter crop does not correct perspective or top-surface proportions by itself.

### E. Combination

If both center displacement and shape/axis mismatch are present, classify as COMBINATION and separate the corrections. Do not compensate for registration error by changing scale.

## Anchor evaluation

Current manifest anchor values are not treated as correct merely because they already exist. For measurement, derive the visible top-surface center independently from the pixels first.

The anchor is then evaluated by comparing the sprite's runtime registration point against the desired registration point implied by `G_center` and `S_center`.

This prevents frame bounds, transparent padding, board thickness, or shadow from biasing the geometry diagnosis.

## Measurement evidence requirements

A valid measurement record should contain at least:

- exact build identity;
- exact FLOOR frame/direction being inspected;
- device/screenshot dimensions if using device evidence;
- `G_top/right/bottom/left` coordinates;
- `S_top/right/bottom/left` coordinates;
- `G_center` and `S_center`;
- `rA`, `rB`;
- both axis-angle differences;
- `D_center`;
- resulting classification: SCALE, REGISTRATION/ANCHOR, SPRITE GEOMETRY/PERSPECTIVE, CROP/PADDING, or COMBINATION.

## First measurement direction

Use one authoritative runtime FLOOR direction first, preferably the clearly visible foreground FLOOR orientation in TESTBUILD 1.2. Do not average multiple directions before the first diagnosis.

If the first direction proves geometrically compatible, repeat the same measurement for the other authoritative runtime directions `floor_s`, `floor_e`, `floor_n`, `floor_w` before declaring the FLOOR family calibrated.

## Decision gate

After measurement:

- only if geometry is congruent may another scale and/or registration calibration be defined;
- if geometry is not congruent, no further blind scale increment is permitted;
- any asset redraw, non-uniform transform, crop, or anchor change requires a separate reconciliation/definition/authorization chain.

## Explicit exclusions

No implementation.
No atlas metadata change.
No PNG edit.
No CSS change.
No projection change.
No grid/snap/controller change.
No WALL work.
