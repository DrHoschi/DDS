import {
  ConstructionPrototypeController,
  MATERIAL_LABELS,
  PIECE_LABELS,
} from "./construction-ui-controller.mjs?build=DDS-05B-TB1.1";
import { loadConstructionAtlas } from "../dds-05a/atlas-loader.mjs?build=DDS-05B-TB1.1";
import {
  createSceneProjection,
  projectWorldPoint,
  renderDepth,
  snapWorldPosition,
  spriteDescriptor,
} from "../dds-05a/sprite-presentation.mjs?build=DDS-05B-TB1.1";

const EXPECTED_BUILD_ID = "DDS-05B-TB1.1";
const activeBuildId = new URL(import.meta.url).searchParams.get("build");
const buildIdValid = activeBuildId === EXPECTED_BUILD_ID;

const GRID_SIZE = 9;
const GRID_CELL_WORLD_SIZE = 2;
const GRID_HALF_EXTENT = Math.floor(GRID_SIZE / 2);
const GRID_ORIGIN_INDEX = GRID_HALF_EXTENT;
const SVG_NS = "http://www.w3.org/2000/svg";

const controller = new ConstructionPrototypeController();

const scene = document.querySelector("[data-scene]");
const statusText = document.querySelector("[data-status]");
const stabilityText = document.querySelector("[data-stability]");
const stabilityMeter = document.querySelector("[data-stability-meter]");
const snapState = document.querySelector("[data-snap-state]");
const moduleCount = document.querySelector("[data-module-count]");
const placeButton = document.querySelector("[data-action='place']");
const undoButton = document.querySelector("[data-action='undo']");

const atlasState = {
  package: null,
  error: null,
};

const atlasManifestUrl = new URL(
  "../../assets/construction/dds-05a/candidate/construction-atlas.json",
  import.meta.url,
);

if (activeBuildId) {
  atlasManifestUrl.searchParams.set("build", activeBuildId);
}

function currentSceneProjection() {
  const bounds = scene.getBoundingClientRect();
  return createSceneProjection({
    width: bounds.width,
    height: bounds.height,
  });
}

function scenePoint(position, projection) {
  return projectWorldPoint(position, projection);
}

function categoryGlyph(category) {
  return category === "FLOOR"
    ? "▱"
    : category === "ROOF"
      ? "⌃"
      : category === "CORNER"
        ? "⌞"
        : category === "DOOR_OPENING"
          ? "▯"
          : category === "BEAM"
            ? "━"
            : "▮";
}

function gridCellKey(x, z) {
  return `${x}:${z}`;
}

function nearestGridCoordinate(value) {
  return Math.round(Number(value) / GRID_CELL_WORLD_SIZE) * GRID_CELL_WORLD_SIZE;
}

function gridCellFromWorldPosition(position) {
  const x = nearestGridCoordinate(position?.x ?? 0);
  const z = nearestGridCoordinate(position?.z ?? 0);
  const limit = GRID_HALF_EXTENT * GRID_CELL_WORLD_SIZE;

  if (Math.abs(x) > limit || Math.abs(z) > limit) {
    return null;
  }

  return { x, z, key: gridCellKey(x, z) };
}

function occupiedFloorCells(state) {
  return new Set(
    state.construction.instances
      .filter((instance) => instance.category === "FLOOR")
      .map((instance) => gridCellFromWorldPosition(instance.transform.position))
      .filter(Boolean)
      .map((cell) => cell.key),
  );
}

function floorTargetCells(state) {
  const valid = new Set();
  let selected = null;

  if (state.ui.selectedPiece !== "FLOOR") {
    return { valid, selected };
  }

  const selection = state.ui.targetSelection;
  for (const candidate of selection.candidates) {
    const resolved = resolveTargetSnap(state, candidate);
    const cell = resolved
      ? gridCellFromWorldPosition(resolved.worldPosition)
      : null;

    if (!cell) {
      continue;
    }

    valid.add(cell.key);
    if (candidate.key === selection.selectedTargetKey) {
      selected = cell.key;
    }
  }

  return { valid, selected };
}

function makeGridCellPolygon(x, z, projection, stateName) {
  const half = GRID_CELL_WORLD_SIZE / 2;
  const corners = [
    { x: x - half, y: 0, z: z - half },
    { x: x + half, y: 0, z: z - half },
    { x: x + half, y: 0, z: z + half },
    { x: x - half, y: 0, z: z + half },
  ].map((corner) => scenePoint(corner, projection));

  const polygon = document.createElementNS(SVG_NS, "polygon");
  polygon.classList.add("scene-grid__cell", `is-${stateName}`);
  polygon.setAttribute(
    "points",
    corners.map((point) => `${point.x},${point.y}`).join(" "),
  );
  polygon.dataset.gridCell = gridCellKey(x, z);
  polygon.dataset.gridState = stateName;
  polygon.setAttribute("vector-effect", "non-scaling-stroke");
  return polygon;
}

function makeConstructionGrid(state, projection) {
  const grid = document.createElementNS(SVG_NS, "svg");
  grid.classList.add("scene-grid");
  grid.dataset.gridSize = String(GRID_SIZE);
  grid.dataset.cellWorldSize = String(GRID_CELL_WORLD_SIZE);
  grid.setAttribute("viewBox", `0 0 ${projection.width} ${projection.height}`);
  grid.setAttribute("preserveAspectRatio", "none");
  grid.setAttribute("aria-hidden", "true");

  const occupied = occupiedFloorCells(state);
  const targets = floorTargetCells(state);

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const x = (column - GRID_ORIGIN_INDEX) * GRID_CELL_WORLD_SIZE;
      const z = (row - GRID_ORIGIN_INDEX) * GRID_CELL_WORLD_SIZE;
      const key = gridCellKey(x, z);
      const stateName = targets.selected === key
        ? "selected-target"
        : targets.valid.has(key)
          ? "valid-target"
          : occupied.has(key)
            ? "occupied"
            : "free";

      grid.append(makeGridCellPolygon(x, z, projection, stateName));
    }
  }

  return grid;
}

function resolveTargetSnap(state, candidate) {
  const targetInstance = state.construction.instances.find(
    (instance) => instance.id === candidate.targetInstanceId,
  );

  if (!targetInstance) {
    console.warn(
      "DDS-05A snap marker target instance missing:",
      candidate.targetInstanceId,
    );
    return null;
  }

  const targetProfile = state.placement.snapProfiles.find(
    (profile) => profile.definitionId === targetInstance.definitionId,
  );

  if (!targetProfile) {
    console.warn(
      "DDS-05A snap marker profile missing:",
      targetInstance.definitionId,
    );
    return null;
  }

  const targetSnap = targetProfile.snapPoints.find(
    (snapPoint) => snapPoint.id === candidate.targetSnapId,
  );

  if (!targetSnap) {
    console.warn(
      "DDS-05A snap marker point missing:",
      candidate.targetSnapId,
    );
    return null;
  }

  return {
    targetInstance,
    targetSnap,
    worldPosition: snapWorldPosition(
      targetInstance.transform,
      targetSnap,
    ),
  };
}

function makeSnapTarget(candidate, selection, state, projection) {
  const resolved = resolveTargetSnap(state, candidate);
  if (!resolved) {
    return null;
  }

  const element = document.createElement("button");
  const point = scenePoint(resolved.worldPosition, projection);
  const recommended = candidate.key === selection.recommendedTargetKey;
  const selected = candidate.key === selection.selectedTargetKey;

  element.type = "button";
  element.className = [
    "snap-target",
    recommended ? "is-recommended" : "",
    selected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");
  element.style.left = `${point.x}px`;
  element.style.top = `${point.y}px`;
  element.style.zIndex = String(
    renderDepth(
      resolved.targetInstance.transform,
      `snap:${candidate.key}`,
    ) + 30,
  );
  element.dataset.snapTarget = candidate.key;
  element.setAttribute(
    "aria-label",
    selected
      ? "Gewählter Bauplatz"
      : recommended
        ? "Empfohlener Bauplatz"
        : "Gültiger Bauplatz",
  );
  element.textContent = selected ? "●" : recommended ? "★" : "+";

  element.addEventListener("click", (event) => {
    event.stopPropagation();
    controller.selectSnapTarget(candidate.key);
    render();
  });

  return element;
}

function applySpriteStyle(sprite, descriptor) {
  const { frame } = descriptor;
  const pivotX = descriptor.anchorX * frame.w;
  const pivotY = descriptor.anchorY * frame.h;

  sprite.style.width = `${frame.w}px`;
  sprite.style.height = `${frame.h}px`;
  sprite.style.marginLeft = `${-pivotX}px`;
  sprite.style.marginTop = `${-pivotY}px`;
  sprite.style.backgroundImage = `url("${descriptor.imageUrl}")`;
  sprite.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
  sprite.style.backgroundSize =
    `${descriptor.imageWidth}px ${descriptor.imageHeight}px`;
  sprite.style.transformOrigin = `${pivotX}px ${pivotY}px`;
  sprite.style.setProperty("--sprite-scale", String(descriptor.scale));
}

function makeFallbackShape(category, yaw) {
  const shape = document.createElement("span");
  shape.className = "scene-module__shape";
  shape.textContent = categoryGlyph(category);
  shape.style.setProperty("--module-yaw", `${yaw ?? 0}deg`);
  return shape;
}

function makeModule(
  instance,
  projection,
  { ghost = false, valid = true } = {},
) {
  const element = document.createElement(ghost ? "div" : "button");
  const point = scenePoint(instance.transform.position, projection);
  const category = instance.category ?? "GHOST";
  const descriptor = atlasState.package
    ? spriteDescriptor(instance, atlasState.package)
    : null;

  element.className = [
    "scene-module",
    `scene-module--${category.toLowerCase()}`,
    descriptor ? "has-sprite" : "is-fallback",
    ghost ? "is-ghost" : "",
    ghost && valid ? "is-valid" : "",
    ghost && !valid ? "is-invalid" : "",
    instance.placementState === "DETACHED" ? "is-detached" : "",
  ]
    .filter(Boolean)
    .join(" ");

  element.style.left = `${point.x}px`;
  element.style.top = `${point.y}px`;
  element.style.zIndex = String(
    descriptor?.depth ??
      renderDepth(instance.transform, instance.id ?? `ghost:${category}`),
  );

  element.dataset.material = instance.materialRef ?? "NONE";

  if (!ghost) {
    element.type = "button";
    element.dataset.instance = instance.id;
    element.setAttribute(
      "aria-label",
      `${PIECE_LABELS[category] ?? category}, ${MATERIAL_LABELS[instance.materialRef] ?? "ohne Material"}`,
    );
    element.title =
      `${PIECE_LABELS[category] ?? category} · ${MATERIAL_LABELS[instance.materialRef] ?? "ohne Material"}`;
  } else {
    element.setAttribute("aria-hidden", "true");
  }

  if (descriptor) {
    const sprite = document.createElement("span");
    sprite.className = "scene-module__sprite";
    sprite.dataset.spriteFrame = descriptor.key;
    applySpriteStyle(sprite, descriptor);
    element.append(sprite);
  } else {
    element.append(
      makeFallbackShape(category, instance.transform.rotation.y ?? 0),
    );
  }

  return element;
}

function renderScene(state) {
  scene.replaceChildren();
  scene.classList.toggle("has-atlas", Boolean(atlasState.package));
  scene.classList.toggle("has-atlas-error", Boolean(atlasState.error));

  const projection = currentSceneProjection();

  const ground = document.createElement("div");
  ground.className = "scene-ground";
  ground.setAttribute("aria-hidden", "true");
  scene.append(ground);
  scene.append(makeConstructionGrid(state, projection));

  const instances = [...state.construction.instances].sort(
    (a, b) =>
      renderDepth(a.transform, a.id) - renderDepth(b.transform, b.id),
  );

  for (const instance of instances) {
    const element = makeModule(instance, projection);

    if (instance.id === state.ui.selectedInstanceId) {
      element.classList.add("is-selected");
    }

    element.addEventListener("click", () => {
      controller.selectInstance(instance.id);
      render();
    });

    scene.append(element);
  }

  const selection = state.ui.targetSelection;
  for (const candidate of selection.candidates) {
    const target = makeSnapTarget(
      candidate,
      selection,
      state,
      projection,
    );
    if (target) {
      scene.append(target);
    }
  }

  const ghost = state.placement.ghostPreview;
  if (ghost?.transform) {
    scene.append(
      makeModule(
        {
          id: "ghost:preview",
          category: state.ui.selectedPiece,
          materialRef: state.ui.selectedMaterial,
          transform: ghost.transform,
          placementState: "GHOST",
        },
        projection,
        {
          ghost: true,
          valid: ghost.valid,
        },
      ),
    );
  }

  const snap = document.createElement("div");
  snap.className =
    `snap-marker ${ghost?.valid ? "is-valid" : "is-invalid"}`;
  snap.textContent = ghost?.valid ? "✓" : "×";
  snap.setAttribute("aria-hidden", "true");
  scene.append(snap);
}

function updateControls(state) {
  document.querySelectorAll("[data-piece]").forEach((button) => {
    const active = button.dataset.piece === state.ui.selectedPiece;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-material]").forEach((button) => {
    const active = button.dataset.material === state.ui.selectedMaterial;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const ghost = state.placement.ghostPreview;
  placeButton.disabled = !ghost?.valid;
  undoButton.disabled = state.placement.historyDepth === 0;

  snapState.textContent = ghost?.valid
    ? "Einrasten möglich ✓"
    : "Noch kein gültiger Platz";
  snapState.dataset.valid = String(Boolean(ghost?.valid));

  statusText.textContent = buildIdValid
    ? state.ui.status
    : "TESTBUILD ungültig: DDS-05B Build-ID fehlt oder stimmt nicht.";
  moduleCount.textContent = String(state.construction.instances.length);

  if (state.stability) {
    const levelLabel = {
      WEAK: "Schwach",
      MEDIUM: "Mittel",
      STABLE: "Stabil",
    }[state.stability.level];

    stabilityText.textContent = levelLabel;
    stabilityMeter.dataset.level = state.stability.level;
    stabilityMeter.setAttribute(
      "aria-label",
      `Stabilität: ${levelLabel}, nur Hinweis`,
    );
  } else {
    stabilityText.textContent = "—";
    stabilityMeter.dataset.level = "NONE";
    stabilityMeter.setAttribute(
      "aria-label",
      "Noch keine Stabilitätsanzeige",
    );
  }
}

function render() {
  const state = controller.snapshot();
  updateControls(state);
  renderScene(state);
}

document.querySelectorAll("[data-piece]").forEach((button) => {
  button.addEventListener("click", () => {
    controller.selectPiece(button.dataset.piece);
    render();
  });
});

document.querySelectorAll("[data-material]").forEach((button) => {
  button.addEventListener("click", () => {
    controller.selectMaterial(button.dataset.material);
    render();
  });
});

document
  .querySelector("[data-action='rotate']")
  .addEventListener("click", () => {
    controller.rotate();
    render();
  });

placeButton.addEventListener("click", () => {
  controller.place();
  render();
});

undoButton.addEventListener("click", () => {
  controller.undo();
  render();
});

document
  .querySelector("[data-action='reset']")
  .addEventListener("click", () => {
    controller.reset();
    render();
  });

document
  .querySelector("[data-action='wolf']")
  .addEventListener("click", () => {
    controller.wolfTest();
    render();
  });

if (typeof ResizeObserver === "function") {
  let lastWidth = null;
  let lastHeight = null;

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    const width = entry?.contentRect?.width;
    const height = entry?.contentRect?.height;

    if (
      Number.isFinite(width) &&
      Number.isFinite(height) &&
      width > 0 &&
      height > 0 &&
      (width !== lastWidth || height !== lastHeight)
    ) {
      lastWidth = width;
      lastHeight = height;
      render();
    }
  });

  resizeObserver.observe(scene);
}

render();

if (!buildIdValid) {
  atlasState.error = new Error(
    `Invalid DDS-05B test build id: ${activeBuildId ?? "missing"}`,
  );
  render();
} else {
  loadConstructionAtlas(atlasManifestUrl)
    .then((atlasPackage) => {
      atlasState.package = atlasPackage;
      atlasState.error = null;
      render();
    })
    .catch((error) => {
      atlasState.package = null;
      atlasState.error = error;
      console.warn("DDS-05A atlas fallback active:", error);
      render();
    });
}