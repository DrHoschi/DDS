export const CATEGORY_TO_SPRITE_FAMILY = Object.freeze({
  FLOOR: "floor",
  WALL: "wall",
  CORNER: "corner",
  DOOR_OPENING: "door",
  ROOF: "roof",
  BEAM: "beam",
});

export const YAW_TO_DIRECTION = Object.freeze({
  0: "s",
  90: "e",
  180: "n",
  270: "w",
});

function finiteNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new TypeError(`${label} must be a finite number`);
  }
  return number;
}

function positiveNumber(value, label) {
  const number = finiteNumber(value, label);
  if (number <= 0) {
    throw new RangeError(`${label} must be greater than zero`);
  }
  return number;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizeYaw(yaw = 0) {
  const normalized = ((Number(yaw) % 360) + 360) % 360;

  if (!Object.hasOwn(YAW_TO_DIRECTION, normalized)) {
    throw new Error(`Unsupported construction yaw: ${yaw}`);
  }

  return normalized;
}

export function spriteFrameKey(category, yaw = 0) {
  const family = CATEGORY_TO_SPRITE_FAMILY[category];

  if (!family) {
    throw new Error(`Unsupported DDS-05A sprite category: ${category}`);
  }

  // FLOOR is a world-aligned square footprint. TESTBUILD 1.8.9 calibrated
  // floor_s against exactly one projected grid diamond. Reuse that verified
  // render frame for every FLOOR instance; only the instance world position
  // determines which grid cell it occupies. Other categories retain yaw frames.
  if (category === "FLOOR") {
    return "floor_s";
  }

  return `${family}_${YAW_TO_DIRECTION[normalizeYaw(yaw)]}`;
}

export function createSceneProjection({ width, height }) {
  const sceneWidth = positiveNumber(width, "scene width");
  const sceneHeight = positiveNumber(height, "scene height");
  const scale = clamp(
    Math.min(sceneWidth / 16, sceneHeight / 12),
    24,
    44,
  );

  return Object.freeze({
    width: sceneWidth,
    height: sceneHeight,
    originX: sceneWidth * 0.5,
    originY: sceneHeight * 0.7,
    groundScale: scale,
    verticalScale: scale,
  });
}

export function projectWorldPoint(position, projection) {
  if (!projection) {
    throw new TypeError("scene projection is required");
  }

  const x = finiteNumber(position?.x ?? 0, "position.x");
  const y = finiteNumber(position?.y ?? 0, "position.y");
  const z = finiteNumber(position?.z ?? 0, "position.z");
  const originX = finiteNumber(projection.originX, "projection.originX");
  const originY = finiteNumber(projection.originY, "projection.originY");
  const groundScale = positiveNumber(
    projection.groundScale,
    "projection.groundScale",
  );
  const verticalScale = positiveNumber(
    projection.verticalScale,
    "projection.verticalScale",
  );

  return Object.freeze({
    x: originX + (x - z) * groundScale,
    y:
      originY +
      (x + z) * (groundScale / 2) -
      y * verticalScale,
  });
}

export function snapWorldPosition(instanceTransform, snapPoint) {
  const position = instanceTransform?.position ?? {};
  const scale = instanceTransform?.scale ?? {};
  const rotation = instanceTransform?.rotation ?? {};
  const local = snapPoint?.position ?? {};

  const tx = finiteNumber(position.x ?? 0, "transform.position.x");
  const ty = finiteNumber(position.y ?? 0, "transform.position.y");
  const tz = finiteNumber(position.z ?? 0, "transform.position.z");

  const kx = finiteNumber(scale.x ?? 1, "transform.scale.x");
  const ky = finiteNumber(scale.y ?? 1, "transform.scale.y");
  const kz = finiteNumber(scale.z ?? 1, "transform.scale.z");

  const lx = finiteNumber(local.x ?? 0, "snapPoint.position.x");
  const ly = finiteNumber(local.y ?? 0, "snapPoint.position.y");
  const lz = finiteNumber(local.z ?? 0, "snapPoint.position.z");

  const yaw = finiteNumber(rotation.y ?? 0, "transform.rotation.y");
  const radians = (yaw * Math.PI) / 180;

  const sx = lx * kx;
  const sy = ly * ky;
  const sz = lz * kz;

  const rx = sx * Math.cos(radians) - sz * Math.sin(radians);
  const rz = sx * Math.sin(radians) + sz * Math.cos(radians);

  return Object.freeze({
    x: tx + rx,
    y: ty + sy,
    z: tz + rz,
  });
}

export function renderDepth(transform, stableId = "") {
  const position = transform?.position ?? {};
  const x = Number(position.x ?? 0);
  const y = Number(position.y ?? 0);
  const z = Number(position.z ?? 0);
  const spatial = Math.round((x + z) * 100 - y * 10);
  let tie = 0;

  for (const char of String(stableId)) {
    tie = (tie * 31 + char.charCodeAt(0)) % 97;
  }

  return 1000 + spatial * 100 + tie;
}

export function spriteDescriptor(instance, atlasPackage) {
  if (!atlasPackage?.manifest?.frames) {
    return null;
  }

  const yaw = instance?.transform?.rotation?.y ?? 0;
  const key = spriteFrameKey(instance.category, yaw);
  const entry = atlasPackage.manifest.frames[key];

  if (!entry) {
    return null;
  }

  const defaults = atlasPackage.manifest.meta?.defaults ?? {};
  const anchorX = entry.anchorX ?? defaults.anchorX ?? 0.5;
  const anchorY = entry.anchorY ?? defaults.anchorY ?? 1;
  const scale = entry.scale ?? defaults.scale ?? 1;

  return Object.freeze({
    key,
    frame: Object.freeze({ ...entry.frame }),
    anchorX,
    anchorY,
    scale,
    imageUrl: atlasPackage.imageUrl,
    imageWidth: atlasPackage.imageWidth,
    imageHeight: atlasPackage.imageHeight,
    depth: renderDepth(instance.transform, instance.id ?? key),
  });
}
