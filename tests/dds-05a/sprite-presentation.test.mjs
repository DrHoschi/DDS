import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  CATEGORY_TO_SPRITE_FAMILY,
  normalizeYaw,
  projectWorldPoint,
  renderDepth,
  spriteDescriptor,
  spriteFrameKey,
  YAW_TO_DIRECTION,
} from "../../src/dds-05a/sprite-presentation.mjs";

const manifest = JSON.parse(
  await readFile(
    new URL(
      "../../assets/construction/dds-05a/candidate/construction-atlas.json",
      import.meta.url,
    ),
    "utf8",
  ),
);

const atlasPackage = Object.freeze({
  manifest,
  imageUrl: "https://example.invalid/construction-atlas.png",
  imageWidth: 1536,
  imageHeight: 1024,
});

test("four authoritative yaw values map deterministically to presentation directions", () => {
  assert.deepEqual(YAW_TO_DIRECTION, {
    0: "s",
    90: "e",
    180: "n",
    270: "w",
  });

  assert.equal(normalizeYaw(360), 0);
  assert.equal(normalizeYaw(-90), 270);
  assert.throws(() => normalizeYaw(45), /Unsupported construction yaw/);
});

test("all six frozen categories resolve candidate sprite frames", () => {
  for (const category of Object.keys(CATEGORY_TO_SPRITE_FAMILY)) {
    for (const yaw of [0, 90, 180, 270]) {
      const key = spriteFrameKey(category, yaw);
      assert.ok(manifest.frames[key], `missing ${category} ${yaw}: ${key}`);
    }
  }
});

test("sprite descriptor is presentation-only and leaves source instance unchanged", () => {
  const instance = {
    id: "module:test",
    category: "WALL",
    materialRef: "WOOD",
    placementState: "PLACED",
    transform: {
      position: { x: 1, y: 0, z: 2 },
      rotation: { x: 0, y: 90, z: 0 },
    },
  };
  const before = structuredClone(instance);

  const descriptor = spriteDescriptor(instance, atlasPackage);

  assert.equal(descriptor.key, "wall_e");
  assert.deepEqual(descriptor.frame, manifest.frames.wall_e.frame);
  assert.deepEqual(instance, before);
});

test("world projection and depth ordering are deterministic", () => {
  assert.deepEqual(projectWorldPoint({ x: 0, y: 0, z: 0 }), {
    x: 50,
    y: 70,
  });

  assert.deepEqual(projectWorldPoint({ x: 1, y: 0, z: 1 }), {
    x: 50,
    y: 78,
  });

  const rear = renderDepth(
    { position: { x: 0, y: 0, z: 0 } },
    "module:a",
  );
  const front = renderDepth(
    { position: { x: 1, y: 0, z: 1 } },
    "module:b",
  );

  assert.ok(front > rear);
});
