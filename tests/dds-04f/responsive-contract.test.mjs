import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(
  new URL("../../index.html", import.meta.url),
  "utf8",
);
const css = await readFile(
  new URL("../../src/dds-04f/prototype.css", import.meta.url),
  "utf8",
);

test("prototype exposes all authorized child-readable control groups", () => {
  for (const token of [
    'data-piece="FLOOR"',
    'data-piece="WALL"',
    'data-piece="CORNER"',
    'data-piece="DOOR_OPENING"',
    'data-piece="ROOF"',
    'data-piece="BEAM"',
    'data-material="STRAW"',
    'data-material="WOOD"',
    'data-material="STONE"',
    'data-action="rotate"',
    'data-action="place"',
    'data-action="undo"',
    'data-action="reset"',
    'data-action="wolf"',
    "data-stability",
    "data-snap-state",
    "data-scene",
  ]) {
    assert.ok(html.includes(token), `missing prototype control: ${token}`);
  }
});

test("viewport configuration supports safe-area-aware touch layout", () => {
  assert.match(
    html,
    /width=device-width, initial-scale=1, viewport-fit=cover/,
  );
  assert.match(css, /env\(safe-area-inset-top\)/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test("responsive CSS contains distinct iPhone and iPad layout contracts", () => {
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(min-width: 720px\)/);

  assert.match(
    css,
    /grid-template-areas:\s*"header"\s*"scene"\s*"materials"\s*"pieces"\s*"actions"/,
  );

  assert.match(
    css,
    /"header header header"\s*"materials scene actions"\s*"pieces pieces pieces"/,
  );
});

test("prototype styling does not require hover for core controls", () => {
  assert.doesNotMatch(css, /:hover/);
});
