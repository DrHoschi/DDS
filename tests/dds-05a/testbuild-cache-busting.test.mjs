import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { resolveAtlasImageUrl } from "../../src/dds-05a/atlas-loader.mjs";

const BUILD_ID = "DDS-05A-TB2";
const BUILD_LABEL = "DDS-05A · TESTBUILD 2";

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

test("visible TESTBUILD 2 identity and canonical build id are exposed", () => {
  assert.match(html, new RegExp(BUILD_LABEL.replace("·", "\\·")));
  assert.match(html, /data-build-id="DDS-05A-TB2"/);
  assert.match(html, /<title>DDS-05A · TESTBUILD 2/);
});

test("HTML cache-busts CSS and browser entry with the same build id", () => {
  assert.match(
    html,
    /prototype\.css\?build=DDS-05A-TB2/,
  );
  assert.match(
    html,
    /browser-app\.mjs\?build=DDS-05A-TB2/,
  );
});

test("browser runtime derives build id from import.meta.url", () => {
  assert.match(app, /new URL\(import\.meta\.url\)\.searchParams\.get\("build"\)/);
  assert.match(app, /EXPECTED_BUILD_ID = "DDS-05A-TB2"/);
  assert.match(app, /atlasManifestUrl\.searchParams\.set\("build", activeBuildId\)/);
});

test("DDS-05A module imports use TESTBUILD 2 cache id", () => {
  assert.match(
    app,
    /atlas-loader\.mjs\?build=DDS-05A-TB2/,
  );
  assert.match(
    app,
    /sprite-presentation\.mjs\?build=DDS-05A-TB2/,
  );
});

test("atlas image receives the exact manifest build id", () => {
  const imageUrl = resolveAtlasImageUrl(
    "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.json?build=DDS-05A-TB2",
    "construction-atlas.png",
  );

  assert.equal(
    imageUrl,
    "https://example.test/assets/construction/dds-05a/candidate/construction-atlas.png?build=DDS-05A-TB2",
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
