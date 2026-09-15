import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolveAtlasImageUrl } from "../../src/dds-05a/atlas-loader.mjs";

const BUILD_ID = "DDS-FLOOR-CAL-TB1.8";
const BUILD_LABEL = "FLOOR Fine Calibration · TESTBUILD 1.8 CALIBRATION";
const html = await readFile(new URL("../../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../../src/dds-04f/browser-app.mjs", import.meta.url), "utf8");
const css = await readFile(new URL("../../src/dds-04f/prototype.css", import.meta.url), "utf8");

test("visible calibration TESTBUILD 1.8 identity and canonical build id are exposed", () => {
  assert.match(html, new RegExp(BUILD_LABEL.replace("·", "\\·")));
  assert.match(html, /data-build-id="DDS-FLOOR-CAL-TB1\.8"/);
  assert.match(html, /<title>FLOOR Fine Calibration · TESTBUILD 1\.8 CALIBRATION/);
});

test("HTML cache-busts CSS and browser entry with the calibration build id", () => {
  assert.match(html, /prototype\.css\?build=DDS-FLOOR-CAL-TB1\.8/);
  assert.match(html, /browser-app\.mjs\?build=DDS-FLOOR-CAL-TB1\.8/);
});

test("browser runtime derives and propagates the calibration build id", () => {
  assert.match(app, /new URL\(import\.meta\.url\)\.searchParams\.get\("build"\)/);
  assert.match(app, /EXPECTED_BUILD_ID="DDS-FLOOR-CAL-TB1\.8"/);
  assert.match(app, /atlasManifestUrl\.searchParams\.set\("build",activeBuildId\)/);
  assert.match(app, /construction-ui-controller\.mjs\?build=DDS-FLOOR-CAL-TB1\.8/);
  assert.match(app, /atlas-loader\.mjs\?build=DDS-FLOOR-CAL-TB1\.8/);
  assert.match(app, /sprite-presentation\.mjs\?build=DDS-FLOOR-CAL-TB1\.8/);
});

test("clean reference view is render-only and exposes a grid-center marker", () => {
  assert.match(app, /data\.calibration="grid-center"/);
  assert.match(app, /makeCalibrationCross\(ghost\.transform\.position,projection\)/);
  assert.match(app, /state\.ui\.selectedPiece!=="FLOOR"/);
  assert.doesNotMatch(app, /anchorX\s*=|anchorY\s*=|GRID_CELL_WORLD_SIZE\s*=\s*(?!2\b)\d/);
});

test("FLOOR sprite geometry correction remains presentation-only and scoped to FLOOR", () => {
  assert.match(css, /\.scene-module--floor\.has-sprite \.scene-module__sprite\s*\{[^}]*scaleY\(0\.79\)/s);
  assert.match(css, /\.scene-module__sprite\s*\{[^}]*transform:\s*scale\(var\(--sprite-scale, 1\)\);/s);
  assert.doesNotMatch(css, /\.scene-module--wall\.has-sprite[^}]*scaleY/);
});

test("atlas image receives the exact calibration build id", () => {
  const imageUrl = resolveAtlasImageUrl("https://example.test/assets/construction/dds-05a/candidate/construction-atlas.json?build=DDS-FLOOR-CAL-TB1.8", "construction-atlas.png");
  assert.equal(imageUrl, "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.png?build=DDS-FLOOR-CAL-TB1.8");
});

test("responsive iPhone and iPad contracts remain present", () => {
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(min-width: 720px\)/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test("browser still uses shared projection and target snap world point", () => {
  assert.match(app, /createSceneProjection/);
  assert.match(app, /getBoundingClientRect\(\)/);
  assert.match(app, /snapWorldPosition/);
  assert.match(app, /targetInstanceId/);
  assert.match(app, /targetSnapId/);
});
