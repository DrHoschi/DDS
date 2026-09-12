import {
  ConstructionPrototypeController,
  MATERIAL_LABELS,
  PIECE_LABELS,
} from "./construction-ui-controller.mjs";

const controller = new ConstructionPrototypeController();

const scene = document.querySelector("[data-scene]");
const statusText = document.querySelector("[data-status]");
const stabilityText = document.querySelector("[data-stability]");
const stabilityMeter = document.querySelector("[data-stability-meter]");
const snapState = document.querySelector("[data-snap-state]");
const moduleCount = document.querySelector("[data-module-count]");
const placeButton = document.querySelector("[data-action='place']");
const undoButton = document.querySelector("[data-action='undo']");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scenePoint(position) {
  return {
    x: clamp(50 + position.x * 9 - position.z * 5, 8, 92),
    y: clamp(68 - position.y * 13 + position.z * 4, 12, 88),
  };
}

function makeModule(instance, { ghost = false, valid = true } = {}) {
  const element = document.createElement(ghost ? "div" : "button");
  const point = scenePoint(instance.transform.position);
  const category = instance.category ?? "GHOST";

  element.className = [
    "scene-module",
    `scene-module--${category.toLowerCase()}`,
    ghost ? "is-ghost" : "",
    ghost && valid ? "is-valid" : "",
    ghost && !valid ? "is-invalid" : "",
    instance.placementState === "DETACHED" ? "is-detached" : "",
  ]
    .filter(Boolean)
    .join(" ");

  element.style.left = `${point.x}%`;
  element.style.top = `${point.y}%`;
  element.style.setProperty(
    "--module-yaw",
    `${instance.transform.rotation.y ?? 0}deg`,
  );

  if (!ghost) {
    element.type = "button";
    element.dataset.instance = instance.id;
    element.dataset.material = instance.materialRef ?? "NONE";
    element.setAttribute(
      "aria-label",
      `${PIECE_LABELS[category] ?? category}, ${MATERIAL_LABELS[instance.materialRef] ?? "ohne Material"}`,
    );
    element.title = `${PIECE_LABELS[category] ?? category} · ${MATERIAL_LABELS[instance.materialRef] ?? "ohne Material"}`;
  } else {
    element.setAttribute("aria-hidden", "true");
  }

  const shape = document.createElement("span");
  shape.className = "scene-module__shape";
  shape.textContent =
    category === "FLOOR"
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

  element.append(shape);
  return element;
}

function renderScene(state) {
  scene.replaceChildren();

  const ground = document.createElement("div");
  ground.className = "scene-ground";
  ground.setAttribute("aria-hidden", "true");
  scene.append(ground);

  for (const instance of state.construction.instances) {
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

  const ghost = state.placement.ghostPreview;
  if (ghost?.transform) {
    scene.append(
      makeModule(
        {
          category: state.ui.selectedPiece,
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
  snap.className = `snap-marker ${ghost?.valid ? "is-valid" : "is-invalid"}`;
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

  statusText.textContent = state.ui.status;
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
    stabilityMeter.setAttribute("aria-label", "Noch keine Stabilitätsanzeige");
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
