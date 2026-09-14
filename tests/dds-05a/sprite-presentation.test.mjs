import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  CATEGORY_TO_SPRITE_FAMILY,
  createSceneProjection,
  normalizeYaw,
  projectWorldPoint,
  renderDepth,
  snapWorldPosition,
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

function closeTo(actual, expected, epsilon = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} ≈ ${expected}`,
  );
}

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
  assert.equal(Object.hasOwn(descriptor, "point"), false);
  assert.deepEqual(instance, before);
});

test("FLOOR runtime directions use TESTBUILD 1.1 footprint scale without changing other sprite families", () => {
  for (const key of ["floor_s", "floor_e", "floor_n", "floor_w"]) {
    assert.equal(manifest.frames[key].scale, 1.15, `${key} scale`);
    assert.equal(manifest.frames[key].anchorX, 0.5, `${key} anchorX`);
    assert.equal(manifest.frames[key].anchorY, 0.85, `${key} anchorY`);
  }

  for (const key of ["floor_se", "floor_ne", "floor_nw", "floor_sw"]) {
    assert.equal(manifest.frames[key].scale, 1, `${key} remains uncalibrated`);
  }

  assert.equal(manifest.frames.wall_s.scale, 1);
  assert.equal(manifest.frames.corner_s.scale, 1);
  assert.equal(manifest.frames.door_s.scale, 1);
  assert.equal(manifest.frames.roof_s.scale, 1);
  assert.equal(manifest.frames.beam_s.scale, 1);
});

test("800x600 projection uses fixed dimetric pixel vectors", () => {
  const projection = createSceneProjection({ width: 800, height: 600 });

  assert.deepEqual(projection, {
    width: 800,
    height: 600,
    originX: 400,
    originY: 420,
    groundScale: 44,
    verticalScale: 44,
  });

  const origin = projectWorldPoint({ x: 0, y: 0, z: 0 }, projection);
  const x = projectWorldPoint({ x: 1, y: 0, z: 0 }, projection);
  const z = projectWorldPoint({ x: 0, y: 0, z: 1 }, projection);
  const y = projectWorldPoint({ x: 0, y: 1, z: 0 }, projection);

  assert.deepEqual(origin, { x: 400, y: 420 });
  assert.deepEqual(x, { x: 444, y: 442 });
  assert.deepEqual(z, { x: 356, y: 442 });
  assert.deepEqual(y, { x: 400, y: 376 });
});

test("360x360 projection keeps fixed ratio at phone lower bound", () => {
  const projection = createSceneProjection({ width: 360, height: 360 });

  assert.deepEqual(projection, {
    width: 360,
    height: 360,
    originX: 180,
    originY: 251.99999999999997,
    groundScale: 24,
    verticalScale: 24,
  });

  const origin = projectWorldPoint({ x: 0, y: 0, z: 0 }, projection);
  const x = projectWorldPoint({ x: 1, y: 0, z: 0 }, projection);

  closeTo(origin.x, 180);
  closeTo(origin.y, 252);
  closeTo(x.x - origin.x, 24);
  closeTo(x.y - origin.y, 12);
});

test("projection helper does not mutate source position", () => {
  const position = { x: 2, y: 1, z: -3 };
  const before = structuredClone(position);
  const projection = createSceneProjection({ width: 800, height: 600 });

  projectWorldPoint(position, projection);

  assert.deepEqual(position, before);
});

test("snap world point at yaw 0 preserves local z direction", () => {
  const result = snapWorldPosition(
    {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
    { position: { x: 0, y: 0, z: 1.3 } },
  );

  closeTo(result.x, 0);
  closeTo(result.y, 0);
  closeTo(result.z, 1.3);
});

test("snap world point at yaw 90 rotates local z to negative x", () => {
  const result = snapWorldPosition(
    {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 90, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
    { position: { x: 0, y: 0, z: 1.3 } },
  );

  closeTo(result.x, -1.3);
  closeTo(result.y, 0);
  closeTo(result.z, 0);
});

test("snap world point applies scale before rotation and does not mutate inputs", () => {
  const transform = {
    position: { x: 4, y: 5, z: 6 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 2, y: 3, z: 4 },
  };
  const snap = { position: { x: 1, y: 2, z: 3 } };
  const beforeTransform = structuredClone(transform);
  const beforeSnap = structuredClone(snap);

  const result = snapWorldPosition(transform, snap);

  closeTo(result.x, -8);
  closeTo(result.y, 11);
  closeTo(result.z, 8);
  assert.deepEqual(transform, beforeTransform);
  assert.deepEqual(snap, beforeSnap);
});

test("depth ordering behavior remains deterministic", () => {
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
