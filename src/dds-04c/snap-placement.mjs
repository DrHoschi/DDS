function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function assertFiniteNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
  return value;
}

function normalizeAngle(value) {
  const normalized = ((value % 360) + 360) % 360;
  return Object.is(normalized, -0) ? 0 : normalized;
}

function cloneVector3(value = { x: 0, y: 0, z: 0 }, label = "position") {
  assertObject(value, label);
  return {
    x: assertFiniteNumber(value.x, `${label}.x`),
    y: assertFiniteNumber(value.y, `${label}.y`),
    z: assertFiniteNumber(value.z, `${label}.z`),
  };
}

function rotateY(vector, degrees) {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: vector.x * cos - vector.z * sin,
    y: vector.y,
    z: vector.x * sin + vector.z * cos,
  };
}

function addVector(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function subtractVector(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function multiplyVector(a, b) {
  return { x: a.x * b.x, y: a.y * b.y, z: a.z * b.z };
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

function cloneData(value) {
  if (Array.isArray(value)) {
    return value.map(cloneData);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, cloneData(child)]),
    );
  }

  return value;
}

function cloneCandidate(candidate) {
  if (!candidate) return null;
  return cloneData(candidate);
}

function cloneProfile(profile) {
  return {
    definitionId: profile.definitionId,
    allowedRotations: [...profile.allowedRotations],
    snapPoints: profile.snapPoints.map((snapPoint) => ({
      id: snapPoint.id,
      connectionClass: snapPoint.connectionClass,
      compatibleClasses: [...snapPoint.compatibleClasses],
      position: { ...snapPoint.position },
      rotationY: snapPoint.rotationY,
    })),
  };
}

function normalizedStringArray(values, label) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError(`${label} must be a non-empty array`);
  }

  const result = values.map((value, index) =>
    assertString(value, `${label}[${index}]`),
  );

  if (new Set(result).size !== result.length) {
    throw new Error(`${label} must not contain duplicates`);
  }

  return result;
}

function normalizeAllowedRotations(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError("allowedRotations must be a non-empty array");
  }

  const normalized = values.map((value, index) =>
    normalizeAngle(assertFiniteNumber(value, `allowedRotations[${index}]`)),
  );

  if (new Set(normalized).size !== normalized.length) {
    throw new Error("allowedRotations must not contain equivalent rotations");
  }

  return normalized;
}

function normalizeSnapPoint(snapPoint, index) {
  assertObject(snapPoint, `snapPoints[${index}]`);

  return {
    id: assertString(snapPoint.id, `snapPoints[${index}].id`),
    connectionClass: assertString(
      snapPoint.connectionClass,
      `snapPoints[${index}].connectionClass`,
    ),
    compatibleClasses: normalizedStringArray(
      snapPoint.compatibleClasses,
      `snapPoints[${index}].compatibleClasses`,
    ),
    position: cloneVector3(
      snapPoint.position ?? { x: 0, y: 0, z: 0 },
      `snapPoints[${index}].position`,
    ),
    rotationY: normalizeAngle(
      assertFiniteNumber(
        snapPoint.rotationY ?? 0,
        `snapPoints[${index}].rotationY`,
      ),
    ),
  };
}

function findById(items, id) {
  return items.find((item) => item.id === id) ?? null;
}

/**
 * DDS-04C engine-independent Snap & Placement foundation.
 *
 * ConstructionState remains authoritative for committed module instances and
 * connections. This class owns only snap-specific data, occupancy, ghost
 * preview state and LIFO placement history needed for deterministic undo.
 */
export class SnapPlacementFoundation {
  #constructionState;
  #profiles = new Map();
  #ghostPreview = null;
  #history = [];

  constructor({ constructionState }) {
    if (
      !constructionState ||
      typeof constructionState.snapshot !== "function" ||
      typeof constructionState.addModuleInstance !== "function" ||
      typeof constructionState.addConnectionReference !== "function" ||
      typeof constructionState.removeConnectionReference !== "function" ||
      typeof constructionState.removeModuleInstance !== "function"
    ) {
      throw new TypeError(
        "constructionState must provide the DDS-04B authoritative state API",
      );
    }

    this.#constructionState = constructionState;
  }

  registerSnapProfile({
    definitionId,
    allowedRotations = [0],
    snapPoints,
  }) {
    const normalizedDefinitionId = assertString(
      definitionId,
      "definitionId",
    );

    const construction = this.#constructionState.snapshot();
    if (!findById(construction.definitions, normalizedDefinitionId)) {
      throw new Error(
        `Cannot register snap profile for unknown definition: ${normalizedDefinitionId}`,
      );
    }

    if (this.#profiles.has(normalizedDefinitionId)) {
      throw new Error(
        `Duplicate snap profile for definition: ${normalizedDefinitionId}`,
      );
    }

    if (!Array.isArray(snapPoints) || snapPoints.length === 0) {
      throw new TypeError("snapPoints must be a non-empty array");
    }

    const normalizedSnapPoints = snapPoints.map(normalizeSnapPoint);
    const snapPointIds = normalizedSnapPoints.map((snapPoint) => snapPoint.id);

    if (new Set(snapPointIds).size !== snapPointIds.length) {
      throw new Error("snapPoints must have unique ids within a profile");
    }

    const profile = {
      definitionId: normalizedDefinitionId,
      allowedRotations: normalizeAllowedRotations(allowedRotations),
      snapPoints: normalizedSnapPoints,
    };

    this.#profiles.set(normalizedDefinitionId, profile);
    return deepFreeze(cloneProfile(profile));
  }

  snapIdentity(instanceId, snapPointId) {
    const normalizedInstanceId = assertString(instanceId, "instanceId");
    const normalizedSnapPointId = assertString(snapPointId, "snapPointId");
    const encode = (value) => `${value.length}:${value}`;

    return `snap:v2:${encode(normalizedInstanceId)}${encode(
      normalizedSnapPointId,
    )}`;
  }

  previewPlacement({
    instanceId,
    definitionId,
    sourceSnapId,
    targetInstanceId,
    targetSnapId,
    rotation = 0,
  }) {
    const request = {
      instanceId: assertString(instanceId, "instanceId"),
      definitionId: assertString(definitionId, "definitionId"),
      sourceSnapId: assertString(sourceSnapId, "sourceSnapId"),
      targetInstanceId: assertString(targetInstanceId, "targetInstanceId"),
      targetSnapId: assertString(targetSnapId, "targetSnapId"),
      rotation: normalizeAngle(assertFiniteNumber(rotation, "rotation")),
    };

    const candidate = this.#evaluateCandidate(request);
    this.#ghostPreview = candidate;
    return deepFreeze(cloneCandidate(candidate));
  }

  clearPreview() {
    this.#ghostPreview = null;
    return null;
  }

  placePreview() {
    if (!this.#ghostPreview) {
      throw new Error("No ghost preview is active");
    }

    const candidate = this.#evaluateCandidate(this.#ghostPreview.request);
    if (!candidate.valid) {
      this.#ghostPreview = candidate;
      throw new Error(
        `Cannot place invalid snap candidate: ${candidate.reason}`,
      );
    }

    const targetSnapIdentity = candidate.targetSnapIdentity;
    const sourceSnapIdentity = candidate.sourceSnapIdentity;
    const connectionId = this.#connectionIdentity(
      sourceSnapIdentity,
      targetSnapIdentity,
    );

    let instanceAdded = false;
    try {
      this.#constructionState.addModuleInstance({
        id: candidate.request.instanceId,
        definitionId: candidate.request.definitionId,
        transform: candidate.transform,
        placementState: "PLACED",
      });
      instanceAdded = true;

      this.#constructionState.addConnectionReference({
        id: connectionId,
        moduleAId: candidate.request.targetInstanceId,
        moduleBId: candidate.request.instanceId,
        state: "CONNECTED",
      });
    } catch (error) {
      if (instanceAdded) {
        this.#constructionState.removeModuleInstance(
          candidate.request.instanceId,
        );
      }
      throw error;
    }

    const historyEntry = {
      instanceId: candidate.request.instanceId,
      connectionId,
      occupiedSnapIds: [targetSnapIdentity, sourceSnapIdentity],
    };
    this.#history.push(historyEntry);
    this.#ghostPreview = null;

    return deepFreeze({
      instanceId: historyEntry.instanceId,
      connectionId,
      transform: cloneData(candidate.transform),
      occupiedSnapIds: [...historyEntry.occupiedSnapIds],
    });
  }

  undoLastPlacement() {
    const historyEntry = this.#history.at(-1);
    if (!historyEntry) {
      throw new Error("No committed placement is available to undo");
    }

    const construction = this.#constructionState.snapshot();
    const instance = findById(construction.instances, historyEntry.instanceId);
    if (!instance) {
      throw new Error(
        `Undo target module instance is missing: ${historyEntry.instanceId}`,
      );
    }

    if (
      instance.connectionRefs.length !== 1 ||
      instance.connectionRefs[0] !== historyEntry.connectionId
    ) {
      throw new Error(
        `Undo target has unexpected connection state: ${historyEntry.instanceId}`,
      );
    }

    this.#constructionState.removeConnectionReference(
      historyEntry.connectionId,
    );
    this.#constructionState.removeModuleInstance(historyEntry.instanceId);

    this.#history.pop();
    this.#ghostPreview = null;

    return deepFreeze({
      instanceId: historyEntry.instanceId,
      connectionId: historyEntry.connectionId,
    });
  }

  snapshot() {
    const construction = this.#constructionState.snapshot();
    const occupancy = this.#deriveCommittedOccupancy(construction);

    const result = {
      snapProfiles: Array.from(this.#profiles.values(), cloneProfile),
      occupancy: Array.from(occupancy.entries()).map(
        ([snapId, connectionId]) => ({ snapId, connectionId }),
      ),
      ghostPreview: cloneCandidate(this.#ghostPreview),
      historyDepth: this.#history.length,
    };

    return deepFreeze(result);
  }

  #evaluateCandidate(request) {
    const construction = this.#constructionState.snapshot();
    const occupancy = this.#deriveCommittedOccupancy(construction);

    if (findById(construction.instances, request.instanceId)) {
      return this.#invalidCandidate(request, "INSTANCE_ID_IN_USE");
    }

    const sourceProfile = this.#profiles.get(request.definitionId);
    if (!sourceProfile) {
      return this.#invalidCandidate(request, "SOURCE_PROFILE_MISSING");
    }

    const sourceSnap = findById(sourceProfile.snapPoints, request.sourceSnapId);
    if (!sourceSnap) {
      return this.#invalidCandidate(request, "SOURCE_SNAP_MISSING");
    }

    if (!sourceProfile.allowedRotations.includes(request.rotation)) {
      return this.#invalidCandidate(request, "ROTATION_NOT_ALLOWED");
    }

    const targetInstance = findById(
      construction.instances,
      request.targetInstanceId,
    );
    if (!targetInstance) {
      return this.#invalidCandidate(request, "TARGET_INSTANCE_MISSING");
    }

    const targetProfile = this.#profiles.get(targetInstance.definitionId);
    if (!targetProfile) {
      return this.#invalidCandidate(request, "TARGET_PROFILE_MISSING");
    }

    const targetSnap = findById(
      targetProfile.snapPoints,
      request.targetSnapId,
    );
    if (!targetSnap) {
      return this.#invalidCandidate(request, "TARGET_SNAP_MISSING");
    }

    const targetSnapIdentity = this.snapIdentity(
      targetInstance.id,
      targetSnap.id,
    );
    const targetLegacySnapIdentity = this.#legacySnapIdentity(
      targetInstance.id,
      targetSnap.id,
    );
    const sourceSnapIdentity = this.snapIdentity(
      request.instanceId,
      sourceSnap.id,
    );

    if (
      occupancy.has(targetSnapIdentity) ||
      occupancy.has(targetLegacySnapIdentity)
    ) {
      return this.#invalidCandidate(
        request,
        "TARGET_SNAP_OCCUPIED",
        sourceSnapIdentity,
        targetSnapIdentity,
      );
    }

    const sourceAcceptsTarget = sourceSnap.compatibleClasses.includes(
      targetSnap.connectionClass,
    );
    const targetAcceptsSource = targetSnap.compatibleClasses.includes(
      sourceSnap.connectionClass,
    );

    if (!sourceAcceptsTarget || !targetAcceptsSource) {
      return this.#invalidCandidate(
        request,
        "INCOMPATIBLE_CONNECTION_CLASS",
        sourceSnapIdentity,
        targetSnapIdentity,
      );
    }

    const targetScale = targetInstance.transform.scale;
    const scaledTargetLocal = multiplyVector(
      targetSnap.position,
      targetScale,
    );
    const targetWorldOffset = rotateY(
      scaledTargetLocal,
      targetInstance.transform.rotation.y,
    );
    const targetWorldPosition = addVector(
      targetInstance.transform.position,
      targetWorldOffset,
    );

    const targetWorldYaw = normalizeAngle(
      targetInstance.transform.rotation.y + targetSnap.rotationY,
    );
    const incomingYaw = normalizeAngle(
      targetWorldYaw + 180 + request.rotation - sourceSnap.rotationY,
    );
    const sourceWorldOffset = rotateY(sourceSnap.position, incomingYaw);
    const floorEdgeToFloorEdge =
      sourceSnap.connectionClass === "FLOOR_EDGE" &&
      targetSnap.connectionClass === "FLOOR_EDGE";
    const incomingPosition = floorEdgeToFloorEdge
      ? addVector(targetWorldPosition, targetWorldOffset)
      : subtractVector(targetWorldPosition, sourceWorldOffset);

    const transform = {
      position: incomingPosition,
      rotation: { x: 0, y: incomingYaw, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };

    return {
      valid: true,
      reason: "VALID",
      request: { ...request },
      sourceSnapIdentity,
      targetSnapIdentity,
      transform,
    };
  }

  #deriveCommittedOccupancy(construction) {
    const occupancy = new Map();

    for (const connection of construction.connections) {
      if (connection.state !== "CONNECTED") {
        continue;
      }

      const snapIdentities = this.#decodeConnectionSnapIdentities(
        connection.id,
      );

      if (!snapIdentities) {
        continue;
      }

      for (const snapIdentity of snapIdentities) {
        occupancy.set(snapIdentity, connection.id);
      }
    }

    return occupancy;
  }

  #decodeConnectionSnapIdentities(connectionId) {
    const versionedPrefix = "connection:v2:";

    if (connectionId.startsWith(versionedPrefix)) {
      let cursor = versionedPrefix.length;
      const snapIdentities = [];

      for (let index = 0; index < 2; index += 1) {
        const separatorIndex = connectionId.indexOf(":", cursor);
        if (separatorIndex === -1) {
          return null;
        }

        const lengthText = connectionId.slice(cursor, separatorIndex);
        if (!/^(0|[1-9]\d*)$/.test(lengthText)) {
          return null;
        }

        const length = Number(lengthText);
        cursor = separatorIndex + 1;

        const snapIdentity = connectionId.slice(cursor, cursor + length);
        if (snapIdentity.length !== length || snapIdentity.length === 0) {
          return null;
        }

        snapIdentities.push(snapIdentity);
        cursor += length;
      }

      if (cursor !== connectionId.length) {
        return null;
      }

      return snapIdentities;
    }

    const legacyPrefix = "connection:";
    if (!connectionId.startsWith(legacyPrefix)) {
      return null;
    }

    const legacyPayload = connectionId.slice(legacyPrefix.length);
    const legacySnapIdentities = legacyPayload.split("<->");

    if (
      legacySnapIdentities.length !== 2 ||
      legacySnapIdentities.some(
        (snapIdentity) => snapIdentity.length === 0,
      )
    ) {
      return null;
    }

    return legacySnapIdentities;
  }

  #legacySnapIdentity(instanceId, snapPointId) {
    return `${instanceId}::${snapPointId}`;
  }

  #invalidCandidate(
    request,
    reason,
    sourceSnapIdentity = null,
    targetSnapIdentity = null,
  ) {
    return {
      valid: false,
      reason,
      request: { ...request },
      sourceSnapIdentity,
      targetSnapIdentity,
      transform: null,
    };
  }

  #connectionIdentity(sourceSnapIdentity, targetSnapIdentity) {
    const pair = [sourceSnapIdentity, targetSnapIdentity].sort();
    const encode = (snapIdentity) =>
      `${snapIdentity.length}:${snapIdentity}`;

    return `connection:v2:${encode(pair[0])}${encode(pair[1])}`;
  }
}
