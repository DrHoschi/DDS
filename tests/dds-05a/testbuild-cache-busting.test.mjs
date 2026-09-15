import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { resolveAtlasImageUrl } from "../../src/dds-05a/atlas-loader.mjs";

const BUILD_ID = "DDS-05B-TB1.6";
const BUILD_LABEL = "DDS-05B · TESTBUILD 1.6";

const html = await readFile(
  new URL("../../index.html", import.meta.url),
  "utf8",
);
const app = await readFile(
  new URL("../../src/dds-04f/browser-app.mjs", import.meta.url),
  "utf8",
);
const css = await readFile(
  new URL("../../src/dds-04f/prototype.css", import.meta.url),
  "utf8",
);

test("visible TESTBUILD 1.6 identity and canonical build id are exposed", () => {
  assert.match(html, new RegExp(BUILD_LABEL.replace("·", "\\·")));
  assert.match(html, /data-build-id="DDS-05B-TB1\.6"/);
  assert.match(html, /<title>DDS-05B · TESTBUILD 1\.6/);
});

test("HTML cache-busts CSS and browser entry with the same build id", () => {
  assert.match(
    html,
    /prototype\.css\?build=DDS-05B-TB1\.6/,
  );
  assert.match(
    html,
    /browser-app\.mjs\?build=DDS-05B-TB1\.6/,
  );
});

test("browser runtime derives build id from import.meta.url", () => {
  assert.match(app, /new URL\(import\.meta\.url\)\.searchParams\.get\("build"\)/);
  assert.match(app, /EXPECTED_BUILD_ID = "DDS-05B-TB1\.6"/);
  assert.match(app, /atlasManifestUrl\.searchParams\.set\("build", activeBuildId\)/);
});

test("active module imports use DDS-05B TESTBUILD 1.6 cache id", () => {
  assert.match(
    app,
    /construction-ui-controller\.mjs\?build=DDS-05B-TB1\.6/,
  );
  assert.match(
    app,
    /atlas-loader\.mjs\?build=DDS-05B-TB1\.6/,
  );
  assert.match(
    app,
    /sprite-presentation\.mjs\?build=DDS-05B-TB1\.6/,
  );
});

test("active runtime/testbuild identity files contain no stale TESTBUILD 1.4 identity", () => {
  assert.doesNotMatch(html, /DDS-05B-TB1\.4|TESTBUILD 1\.4/);
  assert.doesNotMatch(app, /DDS-05B-TB1\.4/);
  assert.doesNotMatch(html, /DDS-05A-TB3\.1|DDS-05A · TESTBUILD 3\.1/);
  assert.doesNotMatch(app, /DDS-05A-TB3\.1/);
});

test("FLOOR sprite geometry correction remains presentation-only and scoped to FLOOR", () => {
  assert.match(
    css,
    /\.scene-module--floor\.has-sprite \.scene-module__sprite\s*\{[^}]*scaleY\(0\.79\)/s,
  );
  assert.match(
    css,
    /\.scene-module__sprite\s*\{[^}]*transform:\s*scale\(var\(--sprite-scale, 1\)\);/s,
  );
  assert.doesNotMatch(css, /\.scene-module--wall\.has-sprite[^}]*scaleY/);
});

test("atlas image receives the exact manifest build id", () => {
  const imageUrl = resolveAtlasImageUrl(
    "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.json?build=DDS-05B-TB1.6",
    "construction-atlas.png",
  );

  assert.equal(
    imageUrl,
    "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.png?build=DDS-05B-TB1.6",
  );
});

test("missing build id does not invent one for atlas image", () => {
  const imageUrl = resolveAtlasImageUrl(
    "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.json",
    "construction-atlas.png",
  );

  assert.equal(
    imageUrl,
    "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.png",
  );
});

test("responsive iPhone and iPad contracts remain present", () => {
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(min-width: 720px\)/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test("browser uses shared pixel projection and actual target snap world point", () => {
  assert.match(app, /createSceneProjection/);
  assert.match(app, /getBoundingClientRect\(\)/);
  assert.match(app, /snapWorldPosition/);
  assert.match(app, /candidate\.targetInstanceId/);
  assert.match(app, /candidate\.targetSnapId/);
  assert.match(app, /style\.left = `\$\{point\.x\}px`/);
  assert.match(app, /style\.top = `\$\{point\.y\}px`/);
  assert.doesNotMatch(app, /candidate\.transform\.position\)/);
});
