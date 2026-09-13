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

  return `${family}_${YAW_TO_DIRECTION[normalizeYaw(yaw)]}`;
}

export function projectWorldPoint(
  position,
  {
    originX = 50,
    originY = 70,
    groundScale = 8,
    verticalScale = 12,
  } = {},
) {
  const x = Number(position?.x ?? 0);
  const y = Number(position?.y ?? 0);
  const z = Number(position?.z ?? 0);

  return {
    x: originX + (x - z) * groundScale,
    y: originY + (x + z) * (groundScale / 2) - y * verticalScale,
  };
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
    point: projectWorldPoint(instance.transform?.position),
    depth: renderDepth(instance.transform, instance.id ?? key),
  });
}
