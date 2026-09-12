export const MODULE_CATEGORIES = Object.freeze([
  "FLOOR",
  "WALL",
  "CORNER",
  "DOOR_OPENING",
  "ROOF",
  "BEAM",
]);

export const UNSPECIFIED_STATE = "UNSPECIFIED";

const IDENTITY_TRANSFORM = Object.freeze({
  position: Object.freeze({ x: 0, y: 0, z: 0 }),
  rotation: Object.freeze({ x: 0, y: 0, z: 0 }),
  scale: Object.freeze({ x: 1, y: 1, z: 1 }),
});

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }

  return value.trim();
}

function assertOptionalReference(value, label) {
  if (value === null || value === undefined) {
    return null;
  }

  return assertNonEmptyString(value, label);
}

function assertFiniteNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }

  return value;
}

function cloneVector3(value, fallback, label) {
  if (value === undefined) {
    return { ...fallback };
  }

  assertPlainObject(value, label);

  return {
    x: assertFiniteNumber(value.x, `${label}.x`),
    y: assertFiniteNumber(value.y, `${label}.y`),
    z: assertFiniteNumber(value.z, `${label}.z`),
  };
}

function cloneTransform(transform = IDENTITY_TRANSFORM) {
  assertPlainObject(transform, "transform");

  return {
    position: cloneVector3(
      transform.position,
      IDENTITY_TRANSFORM.position,
      "transform.position",
    ),
    rotation: cloneVector3(
      transform.rotation,
      IDENTITY_TRANSFORM.rotation,
      "transform.rotation",
    ),
    scale: cloneVector3(
      transform.scale,
      IDENTITY_TRANSFORM.scale,
      "transform.scale",
    ),
  };
}

function cloneStringArray(values, label) {
  if (values === undefined) {
    return [];
  }

  if (!Array.isArray(values)) {
    throw new TypeError(`${label} must be an array`);
  }

  const normalized = values.map((value, index) =>
    assertNonEmptyString(value, `${label}[${index}]`),
  );

  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${label} must not contain duplicate references`);
  }

  return normalized;
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

function cloneDefinition(definition) {
  return {
    id: definition.id,
    category: definition.category,
  };
}

function cloneInstance(instance) {
  return {
    id: instance.id,
    definitionId: instance.definitionId,
    category: instance.category,
    transform: cloneTransform(instance.transform),
    placementState: instance.placementState,
    materialRef: instance.materialRef,
    connectionRefs: [...instance.connectionRefs],
  };
}

function cloneConnection(connection) {
  return {
    id: connection.id,
    moduleRefs: [...connection.moduleRefs],
    state: connection.state,
  };
}

/**
 * DDS-04B authoritative, engine-independent construction state.
 *
 * This layer intentionally contains no snap compatibility, material physics,
 * Wolf force, collapse, rendering or character logic. Later DDS-04 blocks may
 * consume these fields, but DDS-04B only owns explicit state and integrity.
 */
export class ConstructionState {
  #definitions = new Map();
  #instances = new Map();
  #connections = new Map();

  registerModuleDefinition({ id, category }) {
    const normalizedId = assertNonEmptyString(id, "definition.id");
    const normalizedCategory = assertNonEmptyString(
      category,
      "definition.category",
    );

    if (!MODULE_CATEGORIES.includes(normalizedCategory)) {
      throw new Error(
        `Unsupported module category: ${normalizedCategory}`,
      );
    }

    if (this.#definitions.has(normalizedId)) {
      throw new Error(`Duplicate module definition id: ${normalizedId}`);
    }

    const definition = {
      id: normalizedId,
      category: normalizedCategory,
    };

    this.#definitions.set(normalizedId, definition);
    return deepFreeze(cloneDefinition(definition));
  }

  addModuleInstance({
    id,
    definitionId,
    transform = IDENTITY_TRANSFORM,
    placementState = UNSPECIFIED_STATE,
    materialRef = null,
    connectionRefs = [],
  }) {
    const normalizedId = assertNonEmptyString(id, "instance.id");
    const normalizedDefinitionId = assertNonEmptyString(
      definitionId,
      "instance.definitionId",
    );

    if (this.#instances.has(normalizedId)) {
      throw new Error(`Duplicate module instance id: ${normalizedId}`);
    }

    const definition = this.#definitions.get(normalizedDefinitionId);
    if (!definition) {
      throw new Error(
        `Unknown module definition id: ${normalizedDefinitionId}`,
      );
    }

    const normalizedPlacementState = assertNonEmptyString(
      placementState,
      "instance.placementState",
    );
    const normalizedMaterialRef = assertOptionalReference(
      materialRef,
      "instance.materialRef",
    );
    const normalizedConnectionRefs = cloneStringArray(
      connectionRefs,
      "instance.connectionRefs",
    );

    for (const connectionId of normalizedConnectionRefs) {
      if (!this.#connections.has(connectionId)) {
        throw new Error(
          `Unknown connection reference on module instance: ${connectionId}`,
        );
      }
    }

    const instance = {
      id: normalizedId,
      definitionId: normalizedDefinitionId,
      category: definition.category,
      transform: cloneTransform(transform),
      placementState: normalizedPlacementState,
      materialRef: normalizedMaterialRef,
      connectionRefs: normalizedConnectionRefs,
    };

    this.#instances.set(normalizedId, instance);
    return deepFreeze(cloneInstance(instance));
  }

  setMaterialReference(instanceId, materialRef) {
    const instance = this.#requireInstance(instanceId);
    instance.materialRef = assertOptionalReference(
      materialRef,
      "instance.materialRef",
    );

    return deepFreeze(cloneInstance(instance));
  }

  setPlacementState(instanceId, placementState) {
    const instance = this.#requireInstance(instanceId);
    instance.placementState = assertNonEmptyString(
      placementState,
      "instance.placementState",
    );

    return deepFreeze(cloneInstance(instance));
  }

  setTransform(instanceId, transform) {
    const instance = this.#requireInstance(instanceId);
    instance.transform = cloneTransform(transform);

    return deepFreeze(cloneInstance(instance));
  }

  addConnectionReference({
    id,
    moduleAId,
    moduleBId,
    state = UNSPECIFIED_STATE,
  }) {
    const normalizedId = assertNonEmptyString(id, "connection.id");

    if (this.#connections.has(normalizedId)) {
      throw new Error(`Duplicate connection id: ${normalizedId}`);
    }

    const moduleA = this.#requireInstance(moduleAId);
    const moduleB = this.#requireInstance(moduleBId);
    const normalizedState = assertNonEmptyString(state, "connection.state");

    const connection = {
      id: normalizedId,
      moduleRefs: [moduleA.id, moduleB.id],
      state: normalizedState,
    };

    this.#connections.set(normalizedId, connection);
    moduleA.connectionRefs.push(normalizedId);

    if (moduleB.id !== moduleA.id) {
      moduleB.connectionRefs.push(normalizedId);
    }

    return deepFreeze(cloneConnection(connection));
  }

  setConnectionState(connectionId, state) {
    const normalizedId = assertNonEmptyString(connectionId, "connection.id");
    const connection = this.#connections.get(normalizedId);

    if (!connection) {
      throw new Error(`Unknown connection id: ${normalizedId}`);
    }

    connection.state = assertNonEmptyString(state, "connection.state");
    return deepFreeze(cloneConnection(connection));
  }

  resetConstruction() {
    this.#instances.clear();
    this.#connections.clear();
    return this.snapshot();
  }

  snapshot() {
    const snapshot = {
      definitions: Array.from(this.#definitions.values(), cloneDefinition),
      instances: Array.from(this.#instances.values(), cloneInstance),
      connections: Array.from(this.#connections.values(), cloneConnection),
    };

    return deepFreeze(snapshot);
  }

  #requireInstance(instanceId) {
    const normalizedId = assertNonEmptyString(instanceId, "instance.id");
    const instance = this.#instances.get(normalizedId);

    if (!instance) {
      throw new Error(`Unknown module instance id: ${normalizedId}`);
    }

    return instance;
  }
}
