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

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }

  return value.trim();
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function cloneProfile(profile) {
  return {
    id: profile.id,
    mass: profile.mass,
    connectionResistance: profile.connectionResistance,
    forceResistance: profile.forceResistance,
    detachBreakThreshold: profile.detachBreakThreshold,
  };
}

export const MATERIAL_IDS = Object.freeze(["STRAW", "WOOD", "STONE"]);

export const MATERIAL_PROFILES = deepFreeze({
  STRAW: {
    id: "STRAW",
    mass: 1,
    connectionResistance: 2,
    forceResistance: 2,
    detachBreakThreshold: 2,
  },
  WOOD: {
    id: "WOOD",
    mass: 2,
    connectionResistance: 5,
    forceResistance: 5,
    detachBreakThreshold: 5,
  },
  STONE: {
    id: "STONE",
    mass: 4,
    connectionResistance: 8,
    forceResistance: 9,
    detachBreakThreshold: 9,
  },
});

export const STABILITY_LEVELS = Object.freeze([
  "WEAK",
  "MEDIUM",
  "STABLE",
]);

/**
 * DDS-04D data-driven material and advisory stability foundation.
 *
 * This layer does not apply force, fail connections, detach modules or
 * perform collapse. ConstructionState remains authoritative for committed
 * module state and topology.
 */
export class MaterialStabilityFoundation {
  #constructionState;

  constructor({ constructionState }) {
    if (
      !constructionState ||
      typeof constructionState.snapshot !== "function" ||
      typeof constructionState.setMaterialReference !== "function"
    ) {
      throw new TypeError(
        "constructionState must provide the DDS-04B material-reference API",
      );
    }

    this.#constructionState = constructionState;
  }

  listMaterialProfiles() {
    return deepFreeze(
      MATERIAL_IDS.map((materialId) =>
        cloneProfile(MATERIAL_PROFILES[materialId]),
      ),
    );
  }

  getMaterialProfile(materialId) {
    const normalizedId = this.#requireMaterialId(materialId);
    return deepFreeze(cloneProfile(MATERIAL_PROFILES[normalizedId]));
  }

  assignMaterial(instanceId, materialId) {
    const normalizedInstanceId = assertNonEmptyString(
      instanceId,
      "instanceId",
    );
    const normalizedMaterialId = this.#requireMaterialId(materialId);

    return this.#constructionState.setMaterialReference(
      normalizedInstanceId,
      normalizedMaterialId,
    );
  }

  projectStability() {
    const construction = this.#constructionState.snapshot();

    if (construction.instances.length === 0) {
      throw new Error(
        "Cannot project stability for an empty construction",
      );
    }

    const materialStates = construction.instances.map((instance) => {
      if (instance.materialRef === null) {
        throw new Error(
          `Module instance has no material assignment: ${instance.id}`,
        );
      }

      const materialId = this.#requireMaterialId(instance.materialRef);
      const profile = MATERIAL_PROFILES[materialId];

      return {
        instanceId: instance.id,
        materialId,
        mass: profile.mass,
        connectionResistance: profile.connectionResistance,
        forceResistance: profile.forceResistance,
        detachBreakThreshold: profile.detachBreakThreshold,
      };
    });

    const totals = materialStates.reduce(
      (accumulator, material) => ({
        mass: accumulator.mass + material.mass,
        connectionResistance:
          accumulator.connectionResistance +
          material.connectionResistance,
        forceResistance:
          accumulator.forceResistance + material.forceResistance,
        detachBreakThreshold:
          accumulator.detachBreakThreshold +
          material.detachBreakThreshold,
      }),
      {
        mass: 0,
        connectionResistance: 0,
        forceResistance: 0,
        detachBreakThreshold: 0,
      },
    );

    const moduleCount = materialStates.length;
    const expectedTreeConnections = Math.max(0, moduleCount - 1);
    const connectionCoverage =
      expectedTreeConnections === 0
        ? 1
        : Math.min(
            construction.connections.length / expectedTreeConnections,
            1,
          );

    const averageConnectionResistance =
      totals.connectionResistance / moduleCount;
    const averageForceResistance =
      totals.forceResistance / moduleCount;
    const averageDetachBreakThreshold =
      totals.detachBreakThreshold / moduleCount;

    const baseResistance =
      (averageConnectionResistance +
        averageForceResistance +
        averageDetachBreakThreshold) /
      3;

    // Coarse gameplay projection only: topology can reduce confidence in the
    // material baseline, but it never executes structural failure.
    const topologyMultiplier = 0.75 + 0.25 * connectionCoverage;
    const score = round(baseResistance * topologyMultiplier);

    let level = "STABLE";
    if (score < 4) {
      level = "WEAK";
    } else if (score < 7) {
      level = "MEDIUM";
    }

    return deepFreeze({
      advisory: true,
      level,
      score,
      topology: {
        moduleCount,
        connectionCount: construction.connections.length,
        connectionCoverage: round(connectionCoverage),
      },
      materialSummary: {
        totalMass: round(totals.mass),
        averageMass: round(totals.mass / moduleCount),
        averageConnectionResistance: round(
          averageConnectionResistance,
        ),
        averageForceResistance: round(averageForceResistance),
        averageDetachBreakThreshold: round(
          averageDetachBreakThreshold,
        ),
      },
      modules: materialStates.map((material) => ({ ...material })),
    });
  }

  #requireMaterialId(materialId) {
    const normalizedId = assertNonEmptyString(
      materialId,
      "materialId",
    );

    if (!MATERIAL_IDS.includes(normalizedId)) {
      throw new Error(`Unknown DDS-04D material id: ${normalizedId}`);
    }

    return normalizedId;
  }
}
