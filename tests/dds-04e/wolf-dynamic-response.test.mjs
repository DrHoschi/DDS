import test from "node:test";
import assert from "node:assert/strict";

import { ConstructionState } from "../../src/dds-04b/construction-state.mjs";
import { SnapPlacementFoundation } from "../../src/dds-04c/snap-placement.mjs";
import { MaterialStabilityFoundation } from "../../src/dds-04d/material-stability.mjs";
import { WolfDynamicResponseFoundation } from "../../src/dds-04e/wolf-dynamic-response.mjs";

function createSingleWall(materialId = "STRAW") {
  const constructionState = new ConstructionState();

  constructionState.registerModuleDefinition({
    id: "def:floor",
    category: "FLOOR",
  });
  constructionState.registerModuleDefinition({
    id: "def:wall",
    category: "WALL",
  });

  constructionState.addModuleInstance({
    id: "floor:001",
    definitionId: "def:floor",
    placementState: "PLACED",
  });

  const placement = new SnapPlacementFoundation({ constructionState });

  placement.registerSnapProfile({
    definitionId: "def:floor",
    allowedRotations: [0],
    snapPoints: [
      {
        id: "wall",
        connectionClass: "FLOOR_WALL",
        compatibleClasses: ["WALL_BOTTOM"],
        position: { x: 0, y: 0, z: 0 },
        rotationY: 0,
      },
    ],
  });

  placement.registerSnapProfile({
    definitionId: "def:wall",
    allowedRotations: [0],
    snapPoints: [
      {
        id: "bottom",
        connectionClass: "WALL_BOTTOM",
        compatibleClasses: ["FLOOR_WALL"],
        position: { x: 0, y: 0, z: 0 },
        rotationY: 180,
      },
    ],
  });

  placement.previewPlacement({
    instanceId: "wall:001",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "wall",
    rotation: 0,
  });
  placement.placePreview();

  const materials = new MaterialStabilityFoundation({
    constructionState,
  });

  materials.assignMaterial("floor:001", materialId);
  materials.assignMaterial("wall:001", materialId);

  const response = new WolfDynamicResponseFoundation({
    constructionState,
  });

  return {
    constructionState,
    placement,
    materials,
    response,
  };
}

function wolfForce(overrides = {}) {
  return {
    source: { x: -1, y: 0, z: 0 },
    direction: { x: 1, y: 0, z: 0 },
    strength: 3,
    maxDistance: 10,
    ...overrides,
  };
}

test("Wolf force input is normalized and inspectable", () => {
  const { response } = createSingleWall();

  const force = response.normalizeForceInput(
    wolfForce({
      direction: { x: 10, y: 0, z: 0 },
      strength: 4,
      maxDistance: 12,
    }),
  );

  assert.deepEqual(force.source, { x: -1, y: 0, z: 0 });
  assert.deepEqual(force.direction, { x: 1, y: 0, z: 0 });
  assert.equal(force.strength, 4);
  assert.equal(force.maxDistance, 12);
  assert.deepEqual(force.affectedRegion, {
    type: "SPHERE",
    radius: 12,
  });
  assert.equal(Object.isFrozen(force), true);
});

test("zero direction and invalid distance are rejected", () => {
  const { response } = createSingleWall();

  assert.throws(
    () =>
      response.normalizeForceInput(
        wolfForce({ direction: { x: 0, y: 0, z: 0 } }),
      ),
    /must not be the zero vector/,
  );

  assert.throws(
    () => response.normalizeForceInput(wolfForce({ maxDistance: 0 })),
    /maxDistance must be > 0/,
  );
});

test("weak force leaves connection intact without state mutation", () => {
  const { constructionState, response } = createSingleWall("WOOD");

  const before = constructionState.snapshot();

  const result = response.apply(
    wolfForce({
      strength: 2,
    }),
  );

  assert.equal(result.evaluations.length, 1);
  assert.equal(result.evaluations[0].outcome, "SURVIVE");
  assert.equal(result.failedConnectionIds.length, 0);
  assert.equal(result.detachedModuleIds.length, 0);
  assert.equal(result.stateChanged, false);
  assert.deepEqual(constructionState.snapshot(), before);
});

test("strong force fails straw connection and commits authoritative detachment", () => {
  const { constructionState, placement, response } =
    createSingleWall("STRAW");

  const beforeWall = constructionState
    .snapshot()
    .instances.find((instance) => instance.id === "wall:001");

  assert.equal(placement.snapshot().occupancy.length, 2);

  const result = response.apply(
    wolfForce({
      strength: 5,
    }),
  );

  assert.equal(result.evaluations[0].outcome, "FAIL");
  assert.equal(
    result.evaluations[0].reason,
    "LOAD_EXCEEDS_THRESHOLD",
  );
  assert.equal(result.failedConnectionIds.length, 1);
  assert.deepEqual(result.detachedModuleIds, ["wall:001"]);

  const after = constructionState.snapshot();
  assert.equal(after.connections.length, 0);

  const wall = after.instances.find(
    (instance) => instance.id === "wall:001",
  );

  assert.equal(wall.placementState, "DETACHED");
  assert.equal(wall.materialRef, "STRAW");
  assert.ok(wall.transform.position.x > beforeWall.transform.position.x);
  assert.ok(wall.transform.position.y < beforeWall.transform.position.y);
  assert.equal(placement.snapshot().occupancy.length, 0);
});

test("same force and topology produce different material outcomes", () => {
  const straw = createSingleWall("STRAW");
  const stone = createSingleWall("STONE");

  const force = wolfForce({
    strength: 6,
  });

  const strawResult = straw.response.apply(force);
  const stoneResult = stone.response.apply(force);

  assert.equal(strawResult.evaluations[0].outcome, "FAIL");
  assert.equal(stoneResult.evaluations[0].outcome, "SURVIVE");

  assert.ok(
    strawResult.evaluations[0].threshold <
      stoneResult.evaluations[0].threshold,
  );
});

test("out-of-range and opposite-direction force leave connection intact", () => {
  const outOfRange = createSingleWall("STRAW");
  const opposite = createSingleWall("STRAW");

  const rangeResult = outOfRange.response.apply(
    wolfForce({
      source: { x: -10, y: 0, z: 0 },
      maxDistance: 2,
      strength: 100,
    }),
  );

  assert.equal(rangeResult.evaluations[0].outcome, "SURVIVE");
  assert.equal(rangeResult.evaluations[0].reason, "OUT_OF_RANGE");

  const directionResult = opposite.response.apply(
    wolfForce({
      direction: { x: -1, y: 0, z: 0 },
      strength: 100,
    }),
  );

  assert.equal(directionResult.evaluations[0].outcome, "SURVIVE");
  assert.equal(
    directionResult.evaluations[0].reason,
    "OUTSIDE_FORCE_DIRECTION",
  );
});

test("evaluate is deterministic and read-only", () => {
  const { constructionState, response } = createSingleWall("WOOD");

  const before = constructionState.snapshot();
  const first = response.evaluate(wolfForce({ strength: 7 }));
  const second = response.evaluate(wolfForce({ strength: 7 }));

  assert.deepEqual(second, first);
  assert.deepEqual(constructionState.snapshot(), before);
});

test("identical cloned state and force produce identical applied response", () => {
  const first = createSingleWall("STRAW");
  const second = createSingleWall("STRAW");
  const force = wolfForce({ strength: 5 });

  const resultA = first.response.apply(force);
  const resultB = second.response.apply(force);

  assert.deepEqual(resultB, resultA);
  assert.deepEqual(
    second.constructionState.snapshot(),
    first.constructionState.snapshot(),
  );
});

test("missing material fails before authoritative mutation", () => {
  const fixture = createSingleWall("WOOD");
  fixture.constructionState.setMaterialReference("wall:001", null);

  const before = fixture.constructionState.snapshot();

  assert.throws(
    () => fixture.response.apply(wolfForce({ strength: 100 })),
    /has no material assignment: wall:001/,
  );

  assert.deepEqual(fixture.constructionState.snapshot(), before);
});

test("localized failure removes only affected connection and preserves unrelated occupancy", () => {
  const constructionState = new ConstructionState();

  constructionState.registerModuleDefinition({
    id: "def:floor",
    category: "FLOOR",
  });
  constructionState.registerModuleDefinition({
    id: "def:wall",
    category: "WALL",
  });

  constructionState.addModuleInstance({
    id: "floor:001",
    definitionId: "def:floor",
    placementState: "PLACED",
  });

  const placement = new SnapPlacementFoundation({ constructionState });

  placement.registerSnapProfile({
    definitionId: "def:floor",
    allowedRotations: [0],
    snapPoints: [
      {
        id: "near",
        connectionClass: "FLOOR_WALL",
        compatibleClasses: ["WALL_BOTTOM"],
        position: { x: 0, y: 0, z: 0 },
        rotationY: 0,
      },
      {
        id: "far",
        connectionClass: "FLOOR_WALL",
        compatibleClasses: ["WALL_BOTTOM"],
        position: { x: 8, y: 0, z: 0 },
        rotationY: 0,
      },
    ],
  });

  placement.registerSnapProfile({
    definitionId: "def:wall",
    allowedRotations: [0],
    snapPoints: [
      {
        id: "bottom",
        connectionClass: "WALL_BOTTOM",
        compatibleClasses: ["FLOOR_WALL"],
        position: { x: 0, y: 0, z: 0 },
        rotationY: 180,
      },
    ],
  });

  placement.previewPlacement({
    instanceId: "wall:near",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "near",
    rotation: 0,
  });
  placement.placePreview();

  placement.previewPlacement({
    instanceId: "wall:far",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "far",
    rotation: 0,
  });
  placement.placePreview();

  const materials = new MaterialStabilityFoundation({
    constructionState,
  });

  for (const instanceId of ["floor:001", "wall:near", "wall:far"]) {
    materials.assignMaterial(instanceId, "STRAW");
  }

  const response = new WolfDynamicResponseFoundation({
    constructionState,
  });

  const result = response.apply({
    source: { x: -1, y: 0, z: 0 },
    direction: { x: 1, y: 0, z: 0 },
    strength: 5,
    maxDistance: 3,
  });

  assert.equal(
    result.evaluations.filter(
      (evaluation) => evaluation.outcome === "FAIL",
    ).length,
    1,
  );

  const after = constructionState.snapshot();
  assert.equal(after.connections.length, 1);

  const near = after.instances.find(
    (instance) => instance.id === "wall:near",
  );
  const far = after.instances.find(
    (instance) => instance.id === "wall:far",
  );

  assert.equal(near.placementState, "DETACHED");
  assert.equal(far.placementState, "PLACED");

  assert.equal(placement.snapshot().occupancy.length, 2);

  const nearReplacement = placement.previewPlacement({
    instanceId: "wall:replacement",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "near",
    rotation: 0,
  });

  assert.equal(nearReplacement.valid, true);

  const farDuplicate = placement.previewPlacement({
    instanceId: "wall:duplicate",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "far",
    rotation: 0,
  });

  assert.equal(farDuplicate.valid, false);
  assert.equal(farDuplicate.reason, "TARGET_SNAP_OCCUPIED");
});

test("failure detaches unsupported connected component but preserves floor-anchored component", () => {
  const constructionState = new ConstructionState();

  constructionState.registerModuleDefinition({
    id: "def:floor",
    category: "FLOOR",
  });
  constructionState.registerModuleDefinition({
    id: "def:wall",
    category: "WALL",
  });

  constructionState.addModuleInstance({
    id: "floor:001",
    definitionId: "def:floor",
    placementState: "PLACED",
    materialRef: "STRAW",
  });
  constructionState.addModuleInstance({
    id: "wall:001",
    definitionId: "def:wall",
    placementState: "PLACED",
    materialRef: "STRAW",
  });
  constructionState.addModuleInstance({
    id: "wall:002",
    definitionId: "def:wall",
    placementState: "PLACED",
    materialRef: "STRAW",
  });

  constructionState.addConnectionReference({
    id: "connection:base",
    moduleAId: "floor:001",
    moduleBId: "wall:001",
    state: "CONNECTED",
  });
  constructionState.addConnectionReference({
    id: "connection:upper",
    moduleAId: "wall:001",
    moduleBId: "wall:002",
    state: "CONNECTED",
  });

  const response = new WolfDynamicResponseFoundation({
    constructionState,
  });

  const result = response.apply({
    source: { x: -1, y: 0, z: 0 },
    direction: { x: 1, y: 0, z: 0 },
    strength: 5,
    maxDistance: 10,
  });

  assert.equal(result.failedConnectionIds.length, 2);
  assert.deepEqual(
    [...result.detachedModuleIds].sort(),
    ["wall:001", "wall:002"],
  );

  const after = constructionState.snapshot();
  assert.equal(after.connections.length, 0);

  const floor = after.instances.find(
    (instance) => instance.id === "floor:001",
  );

  assert.equal(floor.placementState, "PLACED");
  assert.equal(
    after.instances.find((instance) => instance.id === "wall:001")
      .placementState,
    "DETACHED",
  );
  assert.equal(
    after.instances.find((instance) => instance.id === "wall:002")
      .placementState,
    "DETACHED",
  );
});


test("pre-existing FAILED connection does not anchor detached support component", () => {
  const constructionState = new ConstructionState();

  constructionState.registerModuleDefinition({
    id: "def:floor",
    category: "FLOOR",
  });
  constructionState.registerModuleDefinition({
    id: "def:wall",
    category: "WALL",
  });

  constructionState.addModuleInstance({
    id: "floor:001",
    definitionId: "def:floor",
    placementState: "PLACED",
    materialRef: "STRAW",
    transform: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  });
  constructionState.addModuleInstance({
    id: "wall:001",
    definitionId: "def:wall",
    placementState: "PLACED",
    materialRef: "STRAW",
    transform: {
      position: { x: 1, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  });
  constructionState.addModuleInstance({
    id: "wall:002",
    definitionId: "def:wall",
    placementState: "PLACED",
    materialRef: "STRAW",
    transform: {
      position: { x: 2, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  });

  constructionState.addConnectionReference({
    id: "connection:base",
    moduleAId: "floor:001",
    moduleBId: "wall:001",
    state: "FAILED",
  });
  constructionState.addConnectionReference({
    id: "connection:upper",
    moduleAId: "wall:001",
    moduleBId: "wall:002",
    state: "CONNECTED",
  });

  const response = new WolfDynamicResponseFoundation({
    constructionState,
  });

  const result = response.apply({
    source: { x: 0, y: 0, z: 0 },
    direction: { x: 1, y: 0, z: 0 },
    strength: 5,
    maxDistance: 10,
  });

  const baseEvaluation = result.evaluations.find(
    (evaluation) => evaluation.connectionId === "connection:base",
  );
  const upperEvaluation = result.evaluations.find(
    (evaluation) => evaluation.connectionId === "connection:upper",
  );

  assert.equal(baseEvaluation.outcome, "SURVIVE");
  assert.equal(baseEvaluation.reason, "CONNECTION_NOT_ACTIVE");
  assert.equal(upperEvaluation.outcome, "FAIL");

  assert.deepEqual(
    [...result.detachedModuleIds].sort(),
    ["wall:001", "wall:002"],
  );

  const after = constructionState.snapshot();

  assert.deepEqual(
    after.connections.map((connection) => ({
      id: connection.id,
      state: connection.state,
    })),
    [{ id: "connection:base", state: "FAILED" }],
  );

  assert.equal(
    after.instances.find((instance) => instance.id === "floor:001")
      .placementState,
    "PLACED",
  );
  assert.equal(
    after.instances.find((instance) => instance.id === "wall:001")
      .placementState,
    "DETACHED",
  );
  assert.equal(
    after.instances.find((instance) => instance.id === "wall:002")
      .placementState,
    "DETACHED",
  );
});


test("FAILED DDS-04C connection releases snap occupancy for replacement placement", () => {
  const fixture = createSingleWall("STRAW");
  const connectionId =
    fixture.constructionState.snapshot().connections[0].id;

  fixture.constructionState.setConnectionState(
    connectionId,
    "FAILED",
  );

  const evaluation = fixture.response.evaluate(
    wolfForce({ strength: 100 }),
  );

  assert.equal(evaluation.evaluations[0].outcome, "SURVIVE");
  assert.equal(
    evaluation.evaluations[0].reason,
    "CONNECTION_NOT_ACTIVE",
  );

  assert.deepEqual(fixture.placement.snapshot().occupancy, []);

  const replacement = fixture.placement.previewPlacement({
    instanceId: "wall:replacement",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "wall",
    rotation: 0,
  });

  assert.equal(replacement.valid, true);
  assert.equal(replacement.reason, "VALID");
});
