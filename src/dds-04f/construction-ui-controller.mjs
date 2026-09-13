import { ConstructionState, MODULE_CATEGORIES } from "../dds-04b/construction-state.mjs";
import { SnapPlacementFoundation } from "../dds-04c/snap-placement.mjs";
import { MaterialStabilityFoundation, MATERIAL_IDS } from "../dds-04d/material-stability.mjs";
import { WolfDynamicResponseFoundation } from "../dds-04e/wolf-dynamic-response.mjs";

export const PIECE_LABELS = Object.freeze({
  FLOOR: "Boden",
  WALL: "Wand",
  CORNER: "Ecke",
  DOOR_OPENING: "Tür",
  ROOF: "Dach",
  BEAM: "Balken",
});

export const MATERIAL_LABELS = Object.freeze({
  STRAW: "Stroh",
  WOOD: "Holz",
  STONE: "Stein",
});

const DEFINITION_IDS = Object.freeze(
  Object.fromEntries(
    MODULE_CATEGORIES.map((category) => [
      category,
      `dds04f:${category.toLowerCase()}`,
    ]),
  ),
);

const ROTATIONS = Object.freeze([0, 90, 180, 270]);

function targetChoiceKey(request) {
  return JSON.stringify([
    request.sourceSnapId,
    request.targetInstanceId,
    request.targetSnapId,
  ]);
}

function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, clone(child)]),
    );
  }

  return value;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return value;
}

function definitionId(category) {
  return DEFINITION_IDS[category];
}

function snapProfile(category) {
  const profiles = {
    FLOOR: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        {
          id: "floor-east",
          connectionClass: "FLOOR_EDGE",
          compatibleClasses: ["FLOOR_EDGE"],
          position: { x: 2, y: 0, z: 0 },
          rotationY: 0,
        },
        {
          id: "floor-north",
          connectionClass: "FLOOR_EDGE",
          compatibleClasses: ["FLOOR_EDGE"],
          position: { x: 0, y: 0, z: 2 },
          rotationY: 90,
        },
        {
          id: "floor-west",
          connectionClass: "FLOOR_EDGE",
          compatibleClasses: ["FLOOR_EDGE"],
          position: { x: -2, y: 0, z: 0 },
          rotationY: 180,
        },
        {
          id: "floor-south",
          connectionClass: "FLOOR_EDGE",
          compatibleClasses: ["FLOOR_EDGE"],
          position: { x: 0, y: 0, z: -2 },
          rotationY: 270,
        },
        {
          id: "wall-north",
          connectionClass: "FLOOR_WALL",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 0, y: 0, z: 1.3 },
          rotationY: 0,
        },
        {
          id: "wall-east",
          connectionClass: "FLOOR_WALL",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.3, y: 0, z: 0 },
          rotationY: 90,
        },
        {
          id: "wall-south",
          connectionClass: "FLOOR_WALL",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 0, y: 0, z: -1.3 },
          rotationY: 180,
        },
        {
          id: "wall-west",
          connectionClass: "FLOOR_WALL",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: -1.3, y: 0, z: 0 },
          rotationY: 270,
        },
        {
          id: "corner-east",
          connectionClass: "FLOOR_CORNER",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.3, y: 0, z: 1.3 },
          rotationY: 45,
        },
        {
          id: "corner-south",
          connectionClass: "FLOOR_CORNER",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.3, y: 0, z: -1.3 },
          rotationY: 135,
        },
        {
          id: "corner-west",
          connectionClass: "FLOOR_CORNER",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: -1.3, y: 0, z: -1.3 },
          rotationY: 225,
        },
        {
          id: "corner-north",
          connectionClass: "FLOOR_CORNER",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: -1.3, y: 0, z: 1.3 },
          rotationY: 315,
        },
        {
          id: "beam-center",
          connectionClass: "FLOOR_BEAM",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 0.8, y: 0, z: 0 },
          rotationY: 0,
        },
      ],
    },
    WALL: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        {
          id: "base",
          connectionClass: "MODULE_BASE",
          compatibleClasses: [
            "FLOOR_WALL",
            "FLOOR_CORNER",
            "FLOOR_BEAM",
            "MODULE_SIDE",
          ],
          position: { x: 0, y: 0, z: 0 },
          rotationY: 180,
        },
        {
          id: "side",
          connectionClass: "MODULE_SIDE",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.4, y: 0, z: 0 },
          rotationY: 90,
        },
        {
          id: "top",
          connectionClass: "WALL_TOP",
          compatibleClasses: ["ROOF_BASE", "MODULE_BASE"],
          position: { x: 0, y: 1.6, z: 0 },
          rotationY: 0,
        },
      ],
    },
    CORNER: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        {
          id: "base",
          connectionClass: "MODULE_BASE",
          compatibleClasses: [
            "FLOOR_WALL",
            "FLOOR_CORNER",
            "FLOOR_BEAM",
            "MODULE_SIDE",
          ],
          position: { x: 0, y: 0, z: 0 },
          rotationY: 180,
        },
        {
          id: "side",
          connectionClass: "MODULE_SIDE",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.2, y: 0, z: 1.2 },
          rotationY: 90,
        },
        {
          id: "top",
          connectionClass: "WALL_TOP",
          compatibleClasses: ["ROOF_BASE", "MODULE_BASE"],
          position: { x: 0, y: 1.6, z: 0 },
          rotationY: 0,
        },
      ],
    },
    DOOR_OPENING: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        {
          id: "base",
          connectionClass: "MODULE_BASE",
          compatibleClasses: ["FLOOR_WALL", "MODULE_SIDE"],
          position: { x: 0, y: 0, z: 0 },
          rotationY: 180,
        },
        {
          id: "side",
          connectionClass: "MODULE_SIDE",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.4, y: 0, z: 0 },
          rotationY: 90,
        },
        {
          id: "top",
          connectionClass: "WALL_TOP",
          compatibleClasses: ["ROOF_BASE", "MODULE_BASE"],
          position: { x: 0, y: 1.6, z: 0 },
          rotationY: 0,
        },
      ],
    },
    ROOF: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        {
          id: "base",
          connectionClass: "ROOF_BASE",
          compatibleClasses: ["WALL_TOP", "BEAM_TOP"],
          position: { x: 0, y: 0, z: 0 },
          rotationY: 180,
        },
      ],
    },
    BEAM: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        {
          id: "base",
          connectionClass: "MODULE_BASE",
          compatibleClasses: [
            "FLOOR_BEAM",
            "FLOOR_WALL",
            "MODULE_SIDE",
            "WALL_TOP",
          ],
          position: { x: 0, y: 0, z: 0 },
          rotationY: 180,
        },
        {
          id: "side",
          connectionClass: "MODULE_SIDE",
          compatibleClasses: ["MODULE_BASE"],
          position: { x: 1.2, y: 0, z: 0 },
          rotationY: 90,
        },
        {
          id: "top",
          connectionClass: "BEAM_TOP",
          compatibleClasses: ["ROOF_BASE"],
          position: { x: 0, y: 1.8, z: 0 },
          rotationY: 0,
        },
      ],
    },
  };

  return profiles[category];
}

function messageForInvalid(reason) {
  const labels = {
    TARGET_SNAP_OCCUPIED: "Dieser Platz ist schon belegt.",
    INCOMPATIBLE_CONNECTION_CLASS: "Dieses Teil passt hier nicht.",
    ROTATION_NOT_ALLOWED: "So lässt sich das Teil nicht drehen.",
    TARGET_INSTANCE_MISSING: "Kein passendes Bauteil gefunden.",
    TARGET_PROFILE_MISSING: "Hier kann nichts einrasten.",
    TARGET_SNAP_MISSING: "Der Einrastpunkt fehlt.",
    SOURCE_PROFILE_MISSING: "Für dieses Teil fehlen Einrastpunkte.",
    SOURCE_SNAP_MISSING: "Für dieses Teil fehlt der Anschluss.",
  };

  return labels[reason] ?? "Noch kein gültiger Einrastpunkt.";
}

export class ConstructionPrototypeController {
  #constructionState;
  #placement;
  #materials;
  #wolf;
  #selectedPiece = "WALL";
  #selectedMaterial = "STRAW";
  #selectedInstanceId = null;
  #rotation = 0;
  #nextInstanceNumber = 1;
  #status = "Bauteil wählen und losbauen.";
  #lastWolfResult = null;
  #targetCandidates = [];
  #recommendedTargetKey = null;
  #selectedTargetKey = null;
  #selectedTargetRequest = null;

  constructor() {
    this.#constructionState = new ConstructionState();
    this.#registerDefinitions();
    this.#rebuildDerivedAuthorities();
    this.#addStarterFloor();
    this.#refreshPreview();
  }

  selectPiece(category) {
    if (!MODULE_CATEGORIES.includes(category)) {
      throw new Error(`Unsupported DDS-04F piece category: ${category}`);
    }

    this.#selectedPiece = category;
    this.#rotation = 0;
    this.#clearTargetSelection();
    this.#status = `${PIECE_LABELS[category]} gewählt.`;
    this.#refreshPreview();
    return this.snapshot();
  }

  rotate() {
    const currentIndex = ROTATIONS.indexOf(this.#rotation);
    this.#rotation = ROTATIONS[(currentIndex + 1) % ROTATIONS.length];
    this.#status = `Gedreht: ${this.#rotation}°`;
    this.#refreshPreview();
    return this.snapshot();
  }

  selectSnapTarget(targetKey) {
    const target = this.#targetCandidates.find(
      (candidate) => candidate.key === targetKey,
    );

    if (!target) {
      throw new Error(`Unknown or unavailable DDS-04F snap target: ${targetKey}`);
    }

    this.#selectedTargetKey = target.key;
    this.#selectedTargetRequest = { ...target.request };

    const selected = this.#placement.previewPlacement({
      ...target.request,
      rotation: this.#rotation,
    });

    this.#status = selected.valid
      ? "Bauplatz gewählt ✓"
      : messageForInvalid(selected.reason);

    return this.snapshot();
  }

  place() {
    const ghost = this.#placement.snapshot().ghostPreview;
    if (!ghost?.valid) {
      this.#status = messageForInvalid(ghost?.reason);
      return this.snapshot();
    }

    const committed = this.#placement.placePreview();
    this.#materials.assignMaterial(
      committed.instanceId,
      this.#selectedMaterial,
    );
    this.#selectedInstanceId = committed.instanceId;
    this.#nextInstanceNumber += 1;
    this.#clearTargetSelection();
    const placedStatus =
      `${PIECE_LABELS[this.#selectedPiece]} platziert ✓`;
    this.#lastWolfResult = null;
    this.#refreshPreview();
    this.#status = placedStatus;

    return this.snapshot();
  }

  undo() {
    try {
      const undone = this.#placement.undoLastPlacement();
      if (this.#selectedInstanceId === undone.instanceId) {
        this.#selectedInstanceId = null;
      }
      this.#lastWolfResult = null;
      this.#clearTargetSelection();
      this.#refreshPreview();
      this.#status = "Letzte Platzierung rückgängig ✓";
      return this.snapshot();
    } catch (error) {
      this.#refreshPreview();
      this.#status = "Gerade gibt es nichts Sicheres zum Rückgängig-machen.";
      return this.snapshot();
    }
  }

  reset() {
    this.#constructionState.resetConstruction();
    this.#rebuildDerivedAuthorities();
    this.#selectedPiece = "WALL";
    this.#selectedMaterial = "STRAW";
    this.#selectedInstanceId = null;
    this.#rotation = 0;
    this.#nextInstanceNumber = 1;
    this.#lastWolfResult = null;
    this.#clearTargetSelection();
    this.#addStarterFloor();
    this.#refreshPreview();
    this.#status = "Neu gestartet. Der Startboden ist bereit.";
    return this.snapshot();
  }

  selectInstance(instanceId) {
    const instance = this.#constructionState
      .snapshot()
      .instances.find((candidate) => candidate.id === instanceId);

    if (!instance) {
      throw new Error(`Unknown DDS-04F module instance: ${instanceId}`);
    }

    this.#selectedInstanceId = instance.id;
    this.#status = `${PIECE_LABELS[instance.category]} ausgewählt.`;
    return this.snapshot();
  }

  selectMaterial(materialId) {
    if (!MATERIAL_IDS.includes(materialId)) {
      throw new Error(`Unsupported DDS-04F material: ${materialId}`);
    }

    this.#selectedMaterial = materialId;

    if (this.#selectedInstanceId) {
      this.#materials.assignMaterial(
        this.#selectedInstanceId,
        materialId,
      );
      this.#status = `${MATERIAL_LABELS[materialId]} zugewiesen ✓`;
    } else {
      this.#status = `${MATERIAL_LABELS[materialId]} für das nächste Teil gewählt.`;
    }

    this.#lastWolfResult = null;
    return this.snapshot();
  }

  wolfTest({
    source = { x: -4, y: 0, z: 0 },
    direction = { x: 1, y: 0, z: 0 },
    strength = 8,
    maxDistance = 12,
  } = {}) {
    this.#placement.clearPreview();

    this.#lastWolfResult = this.#wolf.apply({
      source,
      direction,
      strength,
      maxDistance,
    });

    const wolfStatus =
      this.#lastWolfResult.failedConnectionIds.length > 0
        ? `Wolf-Test: ${this.#lastWolfResult.failedConnectionIds.length} Verbindung(en) gelöst.`
        : "Wolf-Test: Das Haus hält!";

    this.#selectedInstanceId = null;
    this.#clearTargetSelection();
    this.#refreshPreview();
    this.#status = wolfStatus;
    return this.snapshot();
  }

  snapshot() {
    const construction = this.#constructionState.snapshot();
    const placement = this.#placement.snapshot();

    let stability = null;
    if (
      construction.instances.length > 0 &&
      construction.instances.every((instance) => instance.materialRef)
    ) {
      stability = this.#materials.projectStability();
    }

    return deepFreeze({
      ui: {
        selectedPiece: this.#selectedPiece,
        selectedMaterial: this.#selectedMaterial,
        selectedInstanceId: this.#selectedInstanceId,
        rotation: this.#rotation,
        status: this.#status,
        targetSelection: {
          recommendedTargetKey: this.#recommendedTargetKey,
          selectedTargetKey: this.#selectedTargetKey,
          locked: this.#selectedTargetKey !== null,
          candidates: clone(this.#targetCandidates),
        },
      },
      construction: clone(construction),
      placement: clone(placement),
      stability: stability ? clone(stability) : null,
      lastWolfResult: this.#lastWolfResult
        ? clone(this.#lastWolfResult)
        : null,
    });
  }

  #registerDefinitions() {
    for (const category of MODULE_CATEGORIES) {
      this.#constructionState.registerModuleDefinition({
        id: definitionId(category),
        category,
      });
    }
  }

  #rebuildDerivedAuthorities() {
    this.#placement = new SnapPlacementFoundation({
      constructionState: this.#constructionState,
    });

    for (const category of MODULE_CATEGORIES) {
      const profile = snapProfile(category);
      this.#placement.registerSnapProfile({
        definitionId: definitionId(category),
        allowedRotations: profile.allowedRotations,
        snapPoints: profile.snapPoints,
      });
    }

    this.#materials = new MaterialStabilityFoundation({
      constructionState: this.#constructionState,
    });
    this.#wolf = new WolfDynamicResponseFoundation({
      constructionState: this.#constructionState,
    });
  }

  #addStarterFloor() {
    const starterId = "floor:starter";

    this.#constructionState.addModuleInstance({
      id: starterId,
      definitionId: definitionId("FLOOR"),
      placementState: "PLACED",
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    });
    this.#materials.assignMaterial(starterId, this.#selectedMaterial);
    this.#selectedInstanceId = starterId;
  }

  #clearTargetSelection() {
    this.#targetCandidates = [];
    this.#recommendedTargetKey = null;
    this.#selectedTargetKey = null;
    this.#selectedTargetRequest = null;
  }

  #refreshPreview() {
    const construction = this.#constructionState.snapshot();
    const placementState = this.#placement.snapshot();
    const sourceProfile = placementState.snapProfiles.find(
      (profile) =>
        profile.definitionId === definitionId(this.#selectedPiece),
    );

    this.#targetCandidates = [];
    this.#recommendedTargetKey = null;

    if (!sourceProfile) {
      this.#placement.clearPreview();
      this.#status = "Für dieses Teil fehlt ein Snap-Profil.";
      return;
    }

    const incomingInstanceId =
      `ui:${this.#selectedPiece.toLowerCase()}:${this.#nextInstanceNumber}`;
    let lastInvalid = null;

    for (const targetInstance of construction.instances) {
      if (targetInstance.placementState === "DETACHED") {
        continue;
      }

      const targetProfile = placementState.snapProfiles.find(
        (profile) =>
          profile.definitionId === targetInstance.definitionId,
      );

      if (!targetProfile) {
        continue;
      }

      for (const sourceSnap of sourceProfile.snapPoints) {
        for (const targetSnap of targetProfile.snapPoints) {
          const request = {
            instanceId: incomingInstanceId,
            definitionId: definitionId(this.#selectedPiece),
            sourceSnapId: sourceSnap.id,
            targetInstanceId: targetInstance.id,
            targetSnapId: targetSnap.id,
            rotation: this.#rotation,
          };

          const candidate = this.#placement.previewPlacement(request);

          if (candidate.valid) {
            const key = targetChoiceKey(request);
            this.#targetCandidates.push({
              key,
              request: { ...request },
              transform: clone(candidate.transform),
              targetInstanceId: targetInstance.id,
              targetSnapId: targetSnap.id,
              sourceSnapId: sourceSnap.id,
            });
          } else {
            lastInvalid = candidate;
          }
        }
      }
    }

    this.#recommendedTargetKey =
      this.#targetCandidates[0]?.key ?? null;

    if (this.#selectedTargetRequest) {
      const lockedRequest = {
        ...this.#selectedTargetRequest,
        instanceId: incomingInstanceId,
        definitionId: definitionId(this.#selectedPiece),
        rotation: this.#rotation,
      };
      const lockedCandidate =
        this.#placement.previewPlacement(lockedRequest);

      this.#selectedTargetRequest = {
        ...lockedRequest,
      };
      this.#selectedTargetKey = targetChoiceKey(lockedRequest);

      if (lockedCandidate.valid) {
        this.#status =
          `${PIECE_LABELS[this.#selectedPiece]} bleibt am gewählten Bauplatz ✓`;
      } else {
        this.#status = messageForInvalid(lockedCandidate.reason);
      }
      return;
    }

    const recommended = this.#targetCandidates[0];
    if (recommended) {
      this.#placement.previewPlacement(recommended.request);
      this.#status =
        `${PIECE_LABELS[this.#selectedPiece]} kann hier einrasten ✓`;
      return;
    }

    if (!lastInvalid) {
      this.#placement.clearPreview();
      this.#status = "Noch kein passender Einrastpunkt.";
      return;
    }

    this.#placement.previewPlacement(lastInvalid.request);
    this.#status = messageForInvalid(lastInvalid.reason);
  }
}
