import { MATERIAL_PROFILES } from "../dds-04d/material-stability.mjs";

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

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function assertFiniteNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }

  return value;
}

function assertNonNegativeNumber(value, label) {
  const normalized = assertFiniteNumber(value, label);
  if (normalized < 0) {
    throw new RangeError(`${label} must be >= 0`);
  }
  return normalized;
}

function assertPositiveNumber(value, label) {
  const normalized = assertFiniteNumber(value, label);
  if (normalized <= 0) {
    throw new RangeError(`${label} must be > 0`);
  }
  return normalized;
}

function vector3(value, label) {
  assertObject(value, label);
  return {
    x: assertFiniteNumber(value.x, `${label}.x`),
    y: assertFiniteNumber(value.y, `${label}.y`),
    z: assertFiniteNumber(value.z, `${label}.z`),
  };
}

function magnitude(vector) {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function normalize(vector, label) {
  const length = magnitude(vector);
  if (length === 0) {
    throw new RangeError(`${label} must not be the zero vector`);
  }

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function cloneTransform(transform) {
  return {
    position: { ...transform.position },
    rotation: { ...transform.rotation },
    scale: { ...transform.scale },
  };
}

function profileFor(instance) {
  if (instance.materialRef === null) {
    throw new Error(
      `Module instance has no material assignment: ${instance.id}`,
    );
  }

  const profile = MATERIAL_PROFILES[instance.materialRef];
  if (!profile) {
    throw new Error(
      `Unknown DDS-04D material id on module ${instance.id}: ${instance.materialRef}`,
    );
  }

  return profile;
}

function instanceMap(construction) {
  return new Map(
    construction.instances.map((instance) => [instance.id, instance]),
  );
}

function buildAdjacency(construction, excludedConnectionIds) {
  const adjacency = new Map(
    construction.instances.map((instance) => [instance.id, new Set()]),
  );

  for (const connection of construction.connections) {
    if (
      excludedConnectionIds.has(connection.id) ||
      connection.state !== "CONNECTED"
    ) {
      continue;
    }

    const [moduleAId, moduleBId] = connection.moduleRefs;
    adjacency.get(moduleAId)?.add(moduleBId);
    adjacency.get(moduleBId)?.add(moduleAId);
  }

  return adjacency;
}

function connectedComponent(adjacency, startId) {
  const visited = new Set();
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) {
      continue;
    }

    visited.add(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return visited;
}

function materialResistance(profile) {
  return (
    profile.connectionResistance +
    profile.forceResistance +
    profile.detachBreakThreshold
  ) / 3;
}

/**
 * DDS-04E deterministic Wolf force / connection failure / simple collapse
 * foundation.
 *
 * No renderer, Wolf visual, animation system or production physics engine is
 * required. ConstructionState remains authoritative for structural mutations.
 */
export class WolfDynamicResponseFoundation {
  #constructionState;

  constructor({ constructionState }) {
    if (
      !constructionState ||
      typeof constructionState.snapshot !== "function" ||
      typeof constructionState.removeConnectionReference !== "function" ||
      typeof constructionState.setPlacementState !== "function" ||
      typeof constructionState.setTransform !== "function"
    ) {
      throw new TypeError(
        "constructionState must provide the DDS-04B authoritative mutation API",
      );
    }

    this.#constructionState = constructionState;
  }

  normalizeForceInput({
    source,
    direction,
    strength,
    maxDistance,
  }) {
    const normalizedSource = vector3(source, "source");
    const normalizedDirection = normalize(
      vector3(direction, "direction"),
      "direction",
    );
    const normalizedStrength = assertNonNegativeNumber(
      strength,
      "strength",
    );
    const normalizedMaxDistance = assertPositiveNumber(
      maxDistance,
      "maxDistance",
    );

    return deepFreeze({
      source: normalizedSource,
      direction: normalizedDirection,
      strength: normalizedStrength,
      maxDistance: normalizedMaxDistance,
      affectedRegion: {
        type: "SPHERE",
        radius: normalizedMaxDistance,
      },
    });
  }

  evaluate(forceInput) {
    const force = this.normalizeForceInput(forceInput);
    const construction = this.#constructionState.snapshot();
    const instances = instanceMap(construction);

    const evaluations = construction.connections.map((connection) =>
      this.#evaluateConnection(connection, force, instances),
    );

    return deepFreeze({
      force,
      evaluations,
      failedConnectionIds: evaluations
        .filter((evaluation) => evaluation.outcome === "FAIL")
        .map((evaluation) => evaluation.connectionId),
    });
  }

  apply(forceInput) {
    const force = this.normalizeForceInput(forceInput);
    const construction = this.#constructionState.snapshot();
    const instances = instanceMap(construction);

    // Evaluate and validate the complete current state before any mutation.
    const evaluations = construction.connections.map((connection) =>
      this.#evaluateConnection(connection, force, instances),
    );
    const failedEvaluations = evaluations.filter(
      (evaluation) => evaluation.outcome === "FAIL",
    );
    const failedConnectionIds = new Set(
      failedEvaluations.map((evaluation) => evaluation.connectionId),
    );

    const detachedModuleIds = this.#detachedModulesAfterFailures(
      construction,
      failedEvaluations,
      failedConnectionIds,
      instances,
    );

    const responses = [...detachedModuleIds]
      .sort()
      .map((moduleId) => {
        const instance = instances.get(moduleId);
        const profile = profileFor(instance);
        return this.#dynamicResponse(instance, profile, force);
      });

    for (const connectionId of failedConnectionIds) {
      this.#constructionState.removeConnectionReference(connectionId);
    }

    for (const response of responses) {
      this.#constructionState.setPlacementState(
        response.instanceId,
        "DETACHED",
      );
      this.#constructionState.setTransform(
        response.instanceId,
        response.afterTransform,
      );
    }

    return deepFreeze({
      force,
      evaluations,
      failedConnectionIds: [...failedConnectionIds],
      detachedModuleIds: responses.map((response) => response.instanceId),
      responses,
      stateChanged:
        failedConnectionIds.size > 0 || responses.length > 0,
    });
  }

  #evaluateConnection(connection, force, instances) {
    const [moduleAId, moduleBId] = connection.moduleRefs;
    const moduleA = instances.get(moduleAId);
    const moduleB = instances.get(moduleBId);

    if (!moduleA || !moduleB) {
      throw new Error(
        `Connection references unknown module: ${connection.id}`,
      );
    }

    const profileA = profileFor(moduleA);
    const profileB = profileFor(moduleB);
    const point = midpoint(
      moduleA.transform.position,
      moduleB.transform.position,
    );
    const fromSource = subtract(point, force.source);
    const distance = magnitude(fromSource);

    let falloff = 0;
    let directionInfluence = 0;

    if (distance <= force.maxDistance) {
      falloff = Math.max(0, 1 - distance / force.maxDistance);

      if (distance === 0) {
        directionInfluence = 1;
      } else {
        directionInfluence = Math.max(
          0,
          dot(force.direction, normalize(fromSource, "force target vector")),
        );
      }
    }

    const load = round(
      force.strength * falloff * directionInfluence,
    );
    const threshold = round(
      (materialResistance(profileA) +
        materialResistance(profileB)) /
        2,
    );

    let outcome = "SURVIVE";
    let reason = "BELOW_THRESHOLD";

    if (connection.state !== "CONNECTED") {
      reason = "CONNECTION_NOT_ACTIVE";
    } else if (distance > force.maxDistance) {
      reason = "OUT_OF_RANGE";
    } else if (directionInfluence === 0) {
      reason = "OUTSIDE_FORCE_DIRECTION";
    } else if (load > threshold) {
      outcome = "FAIL";
      reason = "LOAD_EXCEEDS_THRESHOLD";
    }

    return {
      connectionId: connection.id,
      moduleRefs: [...connection.moduleRefs],
      connectionState: connection.state,
      samplePoint: {
        x: round(point.x),
        y: round(point.y),
        z: round(point.z),
      },
      distance: round(distance),
      falloff: round(falloff),
      directionInfluence: round(directionInfluence),
      load,
      threshold,
      materials: [
        {
          instanceId: moduleA.id,
          materialId: profileA.id,
          resistance: round(materialResistance(profileA)),
        },
        {
          instanceId: moduleB.id,
          materialId: profileB.id,
          resistance: round(materialResistance(profileB)),
        },
      ],
      outcome,
      reason,
    };
  }

  #detachedModulesAfterFailures(
    construction,
    failedEvaluations,
    failedConnectionIds,
    instances,
  ) {
    if (failedEvaluations.length === 0) {
      return new Set();
    }

    const adjacency = buildAdjacency(
      construction,
      failedConnectionIds,
    );
    const detached = new Set();
    const checkedSeeds = new Set();

    for (const failure of failedEvaluations) {
      for (const moduleId of failure.moduleRefs) {
        if (checkedSeeds.has(moduleId)) {
          continue;
        }

        const component = connectedComponent(adjacency, moduleId);
        for (const memberId of component) {
          checkedSeeds.add(memberId);
        }

        const anchored = [...component].some(
          (memberId) => instances.get(memberId)?.category === "FLOOR",
        );

        if (!anchored) {
          for (const memberId of component) {
            detached.add(memberId);
          }
        }
      }
    }

    return detached;
  }

  #dynamicResponse(instance, profile, force) {
    const beforeTransform = cloneTransform(instance.transform);
    const movement = Math.min(
      2,
      (force.strength / (profile.mass + 2)) * 0.2,
    );
    const drop =
      0.5 +
      Math.min(
        1.5,
        (force.strength / (profile.mass + 4)) * 0.15,
      );

    const afterTransform = {
      position: {
        x: round(
          beforeTransform.position.x +
            force.direction.x * movement,
        ),
        y: round(
          beforeTransform.position.y +
            force.direction.y * movement -
            drop,
        ),
        z: round(
          beforeTransform.position.z +
            force.direction.z * movement,
        ),
      },
      rotation: {
        x: round(
          beforeTransform.rotation.x +
            force.direction.z * movement * 15,
        ),
        y: beforeTransform.rotation.y,
        z: round(
          beforeTransform.rotation.z -
            force.direction.x * movement * 15,
        ),
      },
      scale: { ...beforeTransform.scale },
    };

    return {
      instanceId: instance.id,
      materialId: profile.id,
      response: "DETACHED_DISPLACEMENT",
      beforeTransform,
      afterTransform,
    };
  }
}
