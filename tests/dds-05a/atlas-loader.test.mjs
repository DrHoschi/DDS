import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  loadConstructionAtlas,
  REQUIRED_CATEGORY_FAMILIES,
  REQUIRED_DIRECTIONS,
  resolveAtlasImageUrl,
  validateAtlasManifest,
} from "../../src/dds-05a/atlas-loader.mjs";

const manifestUrl = new URL(
  "../../assets/construction/dds-05a/candidate/construction-atlas.json",
  import.meta.url,
);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

test("candidate manifest keeps all six frozen categories across eight directions", () => {
  assert.equal(validateAtlasManifest(manifest), true);
  assert.equal(Object.keys(manifest.frames).length, 78);

  for (const family of Object.values(REQUIRED_CATEGORY_FAMILIES)) {
    for (const direction of REQUIRED_DIRECTIONS) {
      assert.ok(manifest.frames[`${family}_${direction}`]);
    }
  }
});

test("candidate package points to exact colocated atlas image", () => {
  assert.equal(manifest.meta.image, "construction-atlas.png");
  assert.match(
    resolveAtlasImageUrl(manifestUrl, manifest.meta.image),
    /assets\/construction\/dds-05a\/candidate\/construction-atlas\.png$/,
  );
});

test("atlas loader validates actual image dimensions without structural authority", async () => {
  const fakeFetch = async () => ({
    ok: true,
    json: async () => manifest,
  });

  const fakeImage = {
    naturalWidth: 1536,
    naturalHeight: 1024,
    set src(value) {
      this._src = value;
      queueMicrotask(() => this.onload());
    },
  };

  const loaded = await loadConstructionAtlas(manifestUrl, {
    fetchImpl: fakeFetch,
    imageFactory: () => fakeImage,
  });

  assert.equal(loaded.imageWidth, 1536);
  assert.equal(loaded.imageHeight, 1024);
  assert.equal(loaded.manifest.frames.floor_s.frame.x, 17);
});

test("out-of-bounds frame is rejected", () => {
  const broken = structuredClone(manifest);
  broken.frames.floor_s.frame.x = 1530;
  broken.frames.floor_s.frame.w = 100;

  assert.throws(
    () =>
      validateAtlasManifest(broken, {
        imageWidth: 1536,
        imageHeight: 1024,
      }),
    /outside image bounds/,
  );
});
