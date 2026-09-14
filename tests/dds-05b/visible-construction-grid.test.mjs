import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const browserApp = await readFile(
  new URL("../../src/dds-04f/browser-app.mjs", import.meta.url),
  "utf8",
);
const css = await readFile(
  new URL("../../src/dds-04f/prototype.css", import.meta.url),
  "utf8",
);

test("DDS-05B keeps a fixed 9x9 presentation grid with two world units per cell", () => {
  assert.match(browserApp, /const GRID_SIZE = 9;/);
  assert.match(browserApp, /const GRID_CELL_WORLD_SIZE = 2;/);
  assert.match(browserApp, /for \(let row = 0; row < GRID_SIZE; row \+= 1\)/);
  assert.match(browserApp, /for \(let column = 0; column < GRID_SIZE; column \+= 1\)/);
  assert.match(browserApp, /dataset\.gridSize = String\(GRID_SIZE\)/);
  assert.match(browserApp, /dataset\.cellWorldSize = String\(GRID_CELL_WORLD_SIZE\)/);
});

test("grid geometry uses the shared DDS-05A world-to-screen projection", () => {
  assert.match(browserApp, /function scenePoint\(position, projection\)/);
  assert.match(browserApp, /return projectWorldPoint\(position, projection\)/);
  assert.match(browserApp, /makeGridCellPolygon\(x, z, projection, stateName\)/);
  assert.match(browserApp, /\.map\(\(corner\) => scenePoint\(corner, projection\)\)/);
  assert.match(browserApp, /scene\.append\(makeConstructionGrid\(state, projection\)\)/);
});

test("occupied and floor target states are derived from existing frozen state", () => {
  assert.match(
    browserApp,
    /state\.construction\.instances[\s\S]*\.filter\(\(instance\) => instance\.category === "FLOOR"\)/,
  );
  assert.match(browserApp, /state\.ui\.targetSelection/);
  assert.match(browserApp, /state\.ui\.selectedPiece !== "FLOOR"/);
  assert.match(browserApp, /targets\.selected === key/);
  assert.match(browserApp, /targets\.valid\.has\(key\)/);
  assert.match(browserApp, /occupied\.has\(key\)/);
});

test("grid exposes only the four authorized presentation states", () => {
  assert.match(browserApp, /: "free";/);
  assert.match(css, /\.scene-grid__cell\s*\{/);
  for (const state of ["occupied", "valid-target", "selected-target"]) {
    assert.match(css, new RegExp(`\\.scene-grid__cell\\.is-${state}`));
  }
});

test("grid is presentation-only and smartphone viewport clips rather than changing authority", () => {
  assert.match(css, /\.scene-grid\s*\{[\s\S]*pointer-events:\s*none/);
  assert.match(css, /\.scene-grid__cell\s*\{[\s\S]*pointer-events:\s*none/);
  assert.match(css, /\.construction-scene\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /@media \(max-width: 430px\)[\s\S]*\.scene-grid__cell/);
  assert.match(browserApp, /const GRID_SIZE = 9;/);
});
