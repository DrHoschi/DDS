const DEFAULT_REQUIRED_CATEGORIES = Object.freeze({
  FLOOR: "floor",
  WALL: "wall",
  CORNER: "corner",
  DOOR_OPENING: "door",
  ROOF: "roof",
  BEAM: "beam",
});

export const REQUIRED_CATEGORY_FAMILIES = DEFAULT_REQUIRED_CATEGORIES;

export const REQUIRED_DIRECTIONS = Object.freeze([
  "s",
  "se",
  "e",
  "ne",
  "n",
  "nw",
  "w",
  "sw",
]);

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateFrame(key, entry, imageWidth, imageHeight) {
  const frame = entry?.frame;

  if (
    !frame ||
    ![frame.x, frame.y, frame.w, frame.h].every(isFiniteNumber) ||
    frame.x < 0 ||
    frame.y < 0 ||
    frame.w <= 0 ||
    frame.h <= 0
  ) {
    throw new Error(`Invalid atlas frame: ${key}`);
  }

  if (
    imageWidth != null &&
    imageHeight != null &&
    (frame.x + frame.w > imageWidth || frame.y + frame.h > imageHeight)
  ) {
    throw new Error(`Atlas frame outside image bounds: ${key}`);
  }
}

export function validateAtlasManifest(
  manifest,
  { imageWidth = null, imageHeight = null } = {},
) {
  if (!manifest || manifest.meta?.format !== "asset-lab-atlas-v1") {
    throw new Error("Unsupported or missing atlas format");
  }

  if (!manifest.meta.image || typeof manifest.meta.image !== "string") {
    throw new Error("Atlas image reference is missing");
  }

  if (!manifest.frames || typeof manifest.frames !== "object") {
    throw new Error("Atlas frames are missing");
  }

  for (const [key, entry] of Object.entries(manifest.frames)) {
    validateFrame(key, entry, imageWidth, imageHeight);
  }

  for (const family of Object.values(REQUIRED_CATEGORY_FAMILIES)) {
    for (const direction of REQUIRED_DIRECTIONS) {
      const key = `${family}_${direction}`;
      if (!manifest.frames[key]) {
        throw new Error(`Required atlas frame missing: ${key}`);
      }
    }
  }

  return true;
}

export function resolveAtlasImageUrl(manifestUrl, imageName) {
  const manifest = new URL(manifestUrl);
  const image = new URL(imageName, manifest);

  const buildId = manifest.searchParams.get("build");
  if (buildId) {
    image.searchParams.set("build", buildId);
  }

  return image.href;
}

function loadImage(imageUrl, imageFactory) {
  return new Promise((resolve, reject) => {
    const image = imageFactory();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Construction atlas image failed to load: ${imageUrl}`));
    image.src = imageUrl;
  });
}

export async function loadConstructionAtlas(
  manifestUrl,
  {
    fetchImpl = globalThis.fetch,
    imageFactory = () => new Image(),
  } = {},
) {
  if (typeof fetchImpl !== "function") {
    throw new Error("No fetch implementation available for atlas loading");
  }

  const response = await fetchImpl(manifestUrl);

  if (!response?.ok) {
    throw new Error(
      `Construction atlas manifest failed to load: ${response?.status ?? "unknown"}`,
    );
  }

  const manifest = await response.json();
  validateAtlasManifest(manifest);

  const imageUrl = resolveAtlasImageUrl(manifestUrl, manifest.meta.image);
  const image = await loadImage(imageUrl, imageFactory);
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  if (!imageWidth || !imageHeight) {
    throw new Error("Construction atlas image has no usable dimensions");
  }

  validateAtlasManifest(manifest, { imageWidth, imageHeight });

  return Object.freeze({
    manifest,
    imageUrl,
    imageWidth,
    imageHeight,
  });
}
