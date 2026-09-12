import test from "node:test";
import assert from "node:assert/strict";

import { ConstructionState } from "../../src/dds-04b/construction-state.mjs";
import { SnapPlacementFoundation } from "../../src/dds-04c/snap-placement.mjs";
import {
  MATERIAL_IDS,
  MATERIAL_PROFILES,
  MaterialStabilityFoundation,
} from "../../src/dds-04d/material-stability.mjs";

function createConnectedConstruction() {
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

  return { constructionState, placement, materials };
}

function assignAll(materials, materialId) {
  materials.assignMaterial("floor:001", materialId);
  materials.assignMaterial("wall:001", materialId);
}

test("DDS-04D exposes exactly STRAW WOOD STONE with inspectable prototype properties", () => {
  assert.deepEqual(MATERIAL_IDS, ["STRAW", "WOOD", "STONE"]);

  for (const materialId of MATERIAL_IDS) {
    const profile = MATERIAL_PROFILES[materialId];

    assert.equal(profile.id, materialId);
    assert.equal(typeof profile.mass, "number");
    assert.equal(typeof profile.connectionResistance, "number");
    assert.equal(typeof profile.forceResistance, "number");
    assert.equal(typeof profile.detachBreakThreshold, "number");

    assert.ok(profile.mass > 0);
    assert.ok(profile.connectionResistance > 0);
    assert.ok(profile.forceResistance > 0);
    assert.ok(profile.detachBreakThreshold > 0);
  }

  assert.ok(
    MATERIAL_PROFILES.STRAW.connectionResistance <
      MATERIAL_PROFILES.WOOD.connectionResistance,
  );
  assert.ok(
    MATERIAL_PROFILES.WOOD.connectionResistance <
      MATERIAL_PROFILES.STONE.connectionResistance,
  );
  assert.ok(
    MATERIAL_PROFILES.STRAW.forceResistance <
      MATERIAL_PROFILES.WOOD.forceResistance,
  );
  assert.ok(
    MATERIAL_PROFILES.WOOD.forceResistance <
      MATERIAL_PROFILES.STONE.forceResistance,
  );
  assert.ok(
    MATERIAL_PROFILES.STRAW.detachBreakThreshold <
      MATERIAL_PROFILES.WOOD.detachBreakThreshold,
  );
  assert.ok(
    MATERIAL_PROFILES.WOOD.detachBreakThreshold <
      MATERIAL_PROFILES.STONE.detachBreakThreshold,
  );
});

test("material profiles returned to callers are frozen detached data", () => {
  const { materials } = createConnectedConstruction();

  const profile = materials.getMaterialProfile("WOOD");
  assert.equal(Object.isFrozen(profile), true);

  assert.throws(() => {
    profile.mass = 999;
  }, TypeError);

  assert.equal(materials.getMaterialProfile("WOOD").mass, 2);

  const list = materials.listMaterialProfiles();
  assert.equal(Object.isFrozen(list), true);
  assert.deepEqual(
    list.map((entry) => entry.id),
    ["STRAW", "WOOD", "STONE"],
  );
});

test("material assignment is authoritative and preserves construction topology", () => {
  const { constructionState, placement, materials } =
    createConnectedConstruction();

  const before = constructionState.snapshot();
  const beforeOccupancy = placement.snapshot().occupancy;

  materials.assignMaterial("floor:001", "WOOD");
  materials.assignMaterial("wall:001", "WOOD");

  const after = constructionState.snapshot();
  const afterOccupancy = placement.snapshot().occupancy;

  assert.deepEqual(
    after.instances.map((instance) => instance.id),
    before.instances.map((instance) => instance.id),
  );
  assert.deepEqual(
    after.instances.map((instance) => instance.transform),
    before.instances.map((instance) => instance.transform),
  );
  assert.deepEqual(after.connections, before.connections);
  assert.deepEqual(afterOccupancy, beforeOccupancy);

  assert.deepEqual(
    after.instances.map((instance) => instance.materialRef),
    ["WOOD", "WOOD"],
  );
});

test("unknown material assignment is rejected without state mutation", () => {
  const { constructionState, materials } = createConnectedConstruction();

  const before = constructionState.snapshot();

  assert.throws(
    () => materials.assignMaterial("floor:001", "STEEL"),
    /Unknown DDS-04D material id/,
  );

  assert.deepEqual(constructionState.snapshot(), before);
});

test("same construction preserves STRAW < WOOD < STONE stability ordering", () => {
  const { materials } = createConnectedConstruction();

  assignAll(materials, "STRAW");
  const straw = materials.projectStability();

  assignAll(materials, "WOOD");
  const wood = materials.projectStability();

  assignAll(materials, "STONE");
  const stone = materials.projectStability();

  assert.equal(straw.level, "WEAK");
  assert.equal(wood.level, "MEDIUM");
  assert.equal(stone.level, "STABLE");

  assert.ok(straw.score < wood.score);
  assert.ok(wood.score < stone.score);

  assert.equal(straw.advisory, true);
  assert.equal(wood.advisory, true);
  assert.equal(stone.advisory, true);
});

test("stability projection is deterministic for identical authoritative state", () => {
  const { materials } = createConnectedConstruction();

  assignAll(materials, "WOOD");

  const first = materials.projectStability();
  const second = materials.projectStability();

  assert.deepEqual(second, first);
});

test("changing only material changes material and stability state without topology change", () => {
  const { constructionState, materials } = createConnectedConstruction();

  assignAll(materials, "STRAW");
  const topologyBefore = constructionState.snapshot().connections;
  const straw = materials.projectStability();

  assignAll(materials, "STONE");
  const topologyAfter = constructionState.snapshot().connections;
  const stone = materials.projectStability();

  assert.deepEqual(topologyAfter, topologyBefore);
  assert.notEqual(stone.score, straw.score);
  assert.notEqual(stone.level, straw.level);
  assert.ok(
    stone.materialSummary.averageConnectionResistance >
      straw.materialSummary.averageConnectionResistance,
  );
});

test("stability projection uses coarse connection coverage without changing topology", () => {
  const constructionState = new ConstructionState();

  constructionState.registerModuleDefinition({
    id: "def:floor",
    category: "FLOOR",
  });

  constructionState.addModuleInstance({
    id: "floor:a",
    definitionId: "def:floor",
    placementState: "PLACED",
  });
  constructionState.addModuleInstance({
    id: "floor:b",
    definitionId: "def:floor",
    placementState: "PLACED",
  });

  const materials = new MaterialStabilityFoundation({
    constructionState,
  });

  materials.assignMaterial("floor:a", "WOOD");
  materials.assignMaterial("floor:b", "WOOD");

  const before = constructionState.snapshot();
  const projection = materials.projectStability();
  const after = constructionState.snapshot();

  assert.equal(projection.topology.moduleCount, 2);
  assert.equal(projection.topology.connectionCount, 0);
  assert.equal(projection.topology.connectionCoverage, 0);
  assert.equal(projection.level, "WEAK");
  assert.deepEqual(after, before);
});

test("projection rejects incomplete material assignment instead of inventing hidden defaults", () => {
  const { constructionState, materials } = createConnectedConstruction();

  materials.assignMaterial("floor:001", "WOOD");

  const before = constructionState.snapshot();

  assert.throws(
    () => materials.projectStability(),
    /has no material assignment: wall:001/,
  );

  assert.deepEqual(constructionState.snapshot(), before);
});

test("projection rejects unknown authoritative material references", () => {
  const { constructionState, materials } = createConnectedConstruction();

  constructionState.setMaterialReference("floor:001", "WOOD");
  constructionState.setMaterialReference("wall:001", "UNKNOWN");

  const before = constructionState.snapshot();

  assert.throws(
    () => materials.projectStability(),
    /Unknown DDS-04D material id: UNKNOWN/,
  );

  assert.deepEqual(constructionState.snapshot(), before);
});

test("DDS-04C occupied snap remains occupied after repeated material changes", () => {
  const { constructionState, placement, materials } =
    createConnectedConstruction();

  const occupancyBefore = placement.snapshot().occupancy;
  const connectionsBefore = constructionState.snapshot().connections;

  assignAll(materials, "STRAW");
  assignAll(materials, "WOOD");
  assignAll(materials, "STONE");

  const candidate = placement.previewPlacement({
    instanceId: "wall:002",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "wall",
    rotation: 0,
  });

  assert.equal(candidate.valid, false);
  assert.equal(candidate.reason, "TARGET_SNAP_OCCUPIED");
  assert.deepEqual(placement.snapshot().occupancy, occupancyBefore);
  assert.deepEqual(
    constructionState.snapshot().connections,
    connectionsBefore,
  );
});
