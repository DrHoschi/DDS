import test from "node:test";
import assert from "node:assert/strict";

import {
  ConstructionState,
  MODULE_CATEGORIES,
  UNSPECIFIED_STATE,
} from "../../src/dds-04b/construction-state.mjs";

test("DDS-04B exposes only the planned baseline module categories", () => {
  assert.deepEqual(MODULE_CATEGORIES, [
    "FLOOR",
    "WALL",
    "CORNER",
    "DOOR_OPENING",
    "ROOF",
    "BEAM",
  ]);
});

test("construction state keeps explicit stable definition and instance identities", () => {
  const state = new ConstructionState();

  state.registerModuleDefinition({
    id: "module:def:floor.basic",
    category: "FLOOR",
  });
  state.registerModuleDefinition({
    id: "module:def:wall.basic",
    category: "WALL",
  });

  state.addModuleInstance({
    id: "module:instance:floor-001",
    definitionId: "module:def:floor.basic",
    transform: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
    placementState: "DECLARED",
  });

  state.addModuleInstance({
    id: "module:instance:wall-001",
    definitionId: "module:def:wall.basic",
    transform: {
      position: { x: 1, y: 0, z: 0 },
      rotation: { x: 0, y: 90, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  });

  const snapshot = state.snapshot();

  assert.equal(snapshot.definitions.length, 2);
  assert.equal(snapshot.instances.length, 2);
  assert.equal(snapshot.instances[0].id, "module:instance:floor-001");
  assert.equal(snapshot.instances[0].category, "FLOOR");
  assert.equal(snapshot.instances[0].placementState, "DECLARED");
  assert.equal(snapshot.instances[1].id, "module:instance:wall-001");
  assert.equal(snapshot.instances[1].category, "WALL");
  assert.equal(snapshot.instances[1].transform.rotation.y, 90);
});

test("material and connection fields remain explicit data without DDS-04C/D/E behavior", () => {
  const state = new ConstructionState();

  state.registerModuleDefinition({
    id: "module:def:floor.basic",
    category: "FLOOR",
  });
  state.registerModuleDefinition({
    id: "module:def:wall.basic",
    category: "WALL",
  });

  state.addModuleInstance({
    id: "module:instance:floor-001",
    definitionId: "module:def:floor.basic",
  });
  state.addModuleInstance({
    id: "module:instance:wall-001",
    definitionId: "module:def:wall.basic",
  });

  state.setMaterialReference("module:instance:floor-001", "material:straw");

  state.addConnectionReference({
    id: "connection:001",
    moduleAId: "module:instance:floor-001",
    moduleBId: "module:instance:wall-001",
  });

  const snapshot = state.snapshot();
  const floor = snapshot.instances.find(
    (instance) => instance.id === "module:instance:floor-001",
  );
  const wall = snapshot.instances.find(
    (instance) => instance.id === "module:instance:wall-001",
  );

  assert.equal(floor.materialRef, "material:straw");
  assert.deepEqual(floor.connectionRefs, ["connection:001"]);
  assert.deepEqual(wall.connectionRefs, ["connection:001"]);

  assert.deepEqual(snapshot.connections, [
    {
      id: "connection:001",
      moduleRefs: [
        "module:instance:floor-001",
        "module:instance:wall-001",
      ],
      state: UNSPECIFIED_STATE,
    },
  ]);
});

test("reset clears current construction instances and connections but preserves definitions", () => {
  const state = new ConstructionState();

  state.registerModuleDefinition({
    id: "module:def:floor.basic",
    category: "FLOOR",
  });
  state.registerModuleDefinition({
    id: "module:def:wall.basic",
    category: "WALL",
  });

  state.addModuleInstance({
    id: "module:instance:floor-001",
    definitionId: "module:def:floor.basic",
  });
  state.addModuleInstance({
    id: "module:instance:wall-001",
    definitionId: "module:def:wall.basic",
  });
  state.addConnectionReference({
    id: "connection:001",
    moduleAId: "module:instance:floor-001",
    moduleBId: "module:instance:wall-001",
    state: "DECLARED",
  });

  const resetSnapshot = state.resetConstruction();

  assert.equal(resetSnapshot.definitions.length, 2);
  assert.deepEqual(resetSnapshot.instances, []);
  assert.deepEqual(resetSnapshot.connections, []);
});

test("snapshots are detached and frozen so rendering cannot become state authority", () => {
  const state = new ConstructionState();

  state.registerModuleDefinition({
    id: "module:def:roof.basic",
    category: "ROOF",
  });

  state.addModuleInstance({
    id: "module:instance:roof-001",
    definitionId: "module:def:roof.basic",
  });

  const snapshot = state.snapshot();

  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.instances), true);
  assert.equal(Object.isFrozen(snapshot.instances[0]), true);
  assert.equal(Object.isFrozen(snapshot.instances[0].transform), true);

  assert.throws(() => {
    snapshot.instances.push({ id: "render-owned-instance" });
  }, TypeError);

  assert.equal(state.snapshot().instances.length, 1);
});

test("integrity guards reject duplicate ids, unknown definitions, and invalid categories", () => {
  const state = new ConstructionState();

  state.registerModuleDefinition({
    id: "module:def:beam.basic",
    category: "BEAM",
  });

  assert.throws(
    () =>
      state.registerModuleDefinition({
        id: "module:def:beam.basic",
        category: "BEAM",
      }),
    /Duplicate module definition id/,
  );

  assert.throws(
    () =>
      state.registerModuleDefinition({
        id: "module:def:unsupported",
        category: "STAIR",
      }),
    /Unsupported module category/,
  );

  assert.throws(
    () =>
      state.addModuleInstance({
        id: "module:instance:unknown-001",
        definitionId: "module:def:missing",
      }),
    /Unknown module definition id/,
  );

  state.addModuleInstance({
    id: "module:instance:beam-001",
    definitionId: "module:def:beam.basic",
  });

  assert.throws(
    () =>
      state.addModuleInstance({
        id: "module:instance:beam-001",
        definitionId: "module:def:beam.basic",
      }),
    /Duplicate module instance id/,
  );
});

test("transform and state mutation remain generic data operations only", () => {
  const state = new ConstructionState();

  state.registerModuleDefinition({
    id: "module:def:corner.basic",
    category: "CORNER",
  });

  state.addModuleInstance({
    id: "module:instance:corner-001",
    definitionId: "module:def:corner.basic",
  });

  state.setTransform("module:instance:corner-001", {
    position: { x: 2, y: 3, z: 4 },
    rotation: { x: 0, y: 45, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  });
  state.setPlacementState("module:instance:corner-001", "STORED");

  const snapshot = state.snapshot();
  assert.deepEqual(snapshot.instances[0].transform.position, {
    x: 2,
    y: 3,
    z: 4,
  });
  assert.equal(snapshot.instances[0].transform.rotation.y, 45);
  assert.equal(snapshot.instances[0].placementState, "STORED");
});
