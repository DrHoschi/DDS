import {
  ConstructionPrototypeController,
  MATERIAL_LABELS,
  PIECE_LABELS,
} from "./construction-ui-controller.mjs";
import { loadConstructionAtlas } from "../dds-05a/atlas-loader.mjs?build=DDS-05A-TB1";
import {
  projectWorldPoint,
  renderDepth,
  spriteDescriptor,
} from "../dds-05a/sprite-presentation.mjs?build=DDS-05A-TB1";

const EXPECTED_BUILD_ID = "DDS-05A-TB1";
const activeBuildId = new URL(import.meta.url).searchParams.get("build");
const buildIdValid = activeBuildId === EXPECTED_BUILD_ID;

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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scenePoint(position) {
  const point = projectWorldPoint(position);
  return {
    x: clamp(point.x, 6, 94),
    y: clamp(point.y, 10, 92),
  };
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

function makeSnapTarget(candidate, selection) {
  const element = document.createElement("button");
  const point = scenePoint(candidate.transform.position);
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
  element.style.left = `${point.x}%`;
  element.style.top = `${point.y}%`;
  element.style.zIndex = String(
    renderDepth(candidate.transform, `snap:${candidate.key}`) + 30,
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

  sprite.style.width = `${frame.w}px`;
  sprite.style.height = `${frame.h}px`;
  sprite.style.marginLeft = `${-descriptor.anchorX * frame.w}px`;
  sprite.style.marginTop = `${-descriptor.anchorY * frame.h}px`;
  sprite.style.backgroundImage = `url("${descriptor.imageUrl}")`;
  sprite.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
  sprite.style.backgroundSize =
    `${descriptor.imageWidth}px ${descriptor.imageHeight}px`;
  sprite.style.transformOrigin =
    `${descriptor.anchorX * 100}% ${descriptor.anchorY * 100}%`;
  sprite.style.setProperty("--sprite-scale", String(descriptor.scale));
}

function makeFallbackShape(category, yaw) {
  const shape = document.createElement("span");
  shape.className = "scene-module__shape";
  shape.textContent = categoryGlyph(category);
  shape.style.setProperty("--module-yaw", `${yaw ?? 0}deg`);
  return shape;
}

function makeModule(instance, { ghost = false, valid = true } = {}) {
  const element = document.createElement(ghost ? "div" : "button");
  const point = scenePoint(instance.transform.position);
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

  element.style.left = `${point.x}%`;
  element.style.top = `${point.y}%`;
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

  const ground = document.createElement("div");
  ground.className = "scene-ground";
  ground.setAttribute("aria-hidden", "true");
  scene.append(ground);

  const instances = [...state.construction.instances].sort(
    (a, b) =>
      renderDepth(a.transform, a.id) - renderDepth(b.transform, b.id),
  );

  for (const instance of instances) {
    const element = makeModule(instance);

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
    scene.append(makeSnapTarget(candidate, selection));
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
    : "TESTBUILD ungültig: DDS-05A Build-ID fehlt oder stimmt nicht.";
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

render();

if (!buildIdValid) {
  atlasState.error = new Error(
    `Invalid DDS-05A test build id: ${activeBuildId ?? "missing"}`,
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
