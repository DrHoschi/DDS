import test from "node:test";
import assert from "node:assert/strict";

import {
  ConstructionPrototypeController,
  MATERIAL_LABELS,
  PIECE_LABELS,
} from "../../src/dds-04f/construction-ui-controller.mjs";

test("prototype starts from authoritative starter floor with valid wall preview", () => {
  const controller = new ConstructionPrototypeController();
  const state = controller.snapshot();

  assert.equal(state.construction.instances.length, 1);
  assert.equal(state.construction.instances[0].id, "floor:starter");
  assert.equal(state.construction.instances[0].category, "FLOOR");
  assert.equal(state.construction.instances[0].materialRef, "STRAW");
  assert.equal(state.construction.connections.length, 0);

  assert.equal(state.ui.selectedPiece, "WALL");
  assert.equal(state.placement.ghostPreview.valid, true);
  assert.equal(state.placement.historyDepth, 0);
  assert.equal(state.stability.advisory, true);
});

test("piece selection and rotation do not mutate committed construction", () => {
  const controller = new ConstructionPrototypeController();
  const before = controller.snapshot().construction;

  controller.selectPiece("CORNER");
  controller.rotate();
  const after = controller.snapshot();

  assert.deepEqual(after.construction, before);
  assert.equal(after.ui.selectedPiece, "CORNER");
  assert.equal(after.ui.rotation, 90);
  assert.equal(after.placement.ghostPreview.valid, true);
});

test("valid UI placement commits through DDS-04C and assigns selected material", () => {
  const controller = new ConstructionPrototypeController();

  controller.selectMaterial("WOOD");
  const before = controller.snapshot();
  assert.equal(before.construction.instances[0].materialRef, "WOOD");

  controller.selectPiece("WALL");
  const placed = controller.place();

  assert.equal(placed.construction.instances.length, 2);
  assert.equal(placed.construction.connections.length, 1);
  assert.equal(placed.placement.historyDepth, 1);
  assert.match(placed.ui.status, /platziert/);

  const wall = placed.construction.instances.find(
    (instance) => instance.category === "WALL",
  );

  assert.ok(wall);
  assert.equal(wall.materialRef, "WOOD");
  assert.equal(wall.placementState, "PLACED");
  assert.equal(
    placed.construction.connections[0].state,
    "CONNECTED",
  );
});

test("invalid UI placement cannot create an authoritative module", () => {
  const controller = new ConstructionPrototypeController();

  controller.selectPiece("ROOF");
  const preview = controller.snapshot();

  assert.equal(preview.placement.ghostPreview.valid, false);

  const after = controller.place();

  assert.equal(after.construction.instances.length, 1);
  assert.equal(after.construction.connections.length, 0);
  assert.equal(after.placement.historyDepth, 0);
});

test("undo delegates to placement authority and removes latest committed placement", () => {
  const controller = new ConstructionPrototypeController();

  controller.place();
  const placed = controller.snapshot();
  assert.equal(placed.construction.instances.length, 2);
  assert.equal(placed.placement.historyDepth, 1);

  const undone = controller.undo();

  assert.equal(undone.construction.instances.length, 1);
  assert.equal(undone.construction.connections.length, 0);
  assert.equal(undone.placement.historyDepth, 0);
});

test("material changes alter selected module only and preserve topology", () => {
  const controller = new ConstructionPrototypeController();

  controller.place();
  const placed = controller.snapshot();
  const wall = placed.construction.instances.find(
    (instance) => instance.category === "WALL",
  );
  const topologyBefore = placed.construction.connections;

  controller.selectInstance(wall.id);
  const changed = controller.selectMaterial("STONE");

  assert.equal(
    changed.construction.instances.find(
      (instance) => instance.id === wall.id,
    ).materialRef,
    "STONE",
  );
  assert.deepEqual(changed.construction.connections, topologyBefore);
  assert.equal(changed.stability.advisory, true);
});

test("Wolf-Test projects authoritative DDS-04E detach and displacement", () => {
  const controller = new ConstructionPrototypeController();

  controller.selectPiece("WALL");
  controller.place();

  const before = controller.snapshot();
  const wallBefore = before.construction.instances.find(
    (instance) => instance.category === "WALL",
  );

  const after = controller.wolfTest();
  const wallAfter = after.construction.instances.find(
    (instance) => instance.id === wallBefore.id,
  );

  assert.ok(after.lastWolfResult);
  assert.match(after.ui.status, /Wolf-Test/);
  assert.equal(after.lastWolfResult.failedConnectionIds.length, 1);
  assert.equal(after.construction.connections.length, 0);
  assert.equal(wallAfter.placementState, "DETACHED");
  assert.ok(
    wallAfter.transform.position.y < wallBefore.transform.position.y,
  );
  assert.equal(after.placement.occupancy.length, 0);
});

test("reset clears build state and placement history but restores starter floor", () => {
  const controller = new ConstructionPrototypeController();

  controller.place();
  controller.selectPiece("CORNER");
  controller.place();

  const reset = controller.reset();

  assert.equal(reset.construction.instances.length, 1);
  assert.equal(reset.construction.instances[0].id, "floor:starter");
  assert.equal(reset.construction.connections.length, 0);
  assert.equal(reset.placement.historyDepth, 0);
  assert.equal(reset.ui.selectedPiece, "WALL");
  assert.equal(reset.ui.selectedMaterial, "STRAW");
});

test("all authorized module and material labels remain exposed without extra categories", () => {
  assert.deepEqual(Object.keys(PIECE_LABELS).sort(), [
    "BEAM",
    "CORNER",
    "DOOR_OPENING",
    "FLOOR",
    "ROOF",
    "WALL",
  ]);
  assert.deepEqual(Object.keys(MATERIAL_LABELS).sort(), [
    "STONE",
    "STRAW",
    "WOOD",
  ]);
});


test("automatic recommendation exposes multiple valid snap targets", () => {
  const controller = new ConstructionPrototypeController();
  const state = controller.snapshot();
  const selection = state.ui.targetSelection;

  assert.ok(selection.candidates.length >= 2);
  assert.equal(selection.locked, false);
  assert.equal(
    selection.recommendedTargetKey,
    selection.candidates[0].key,
  );
  assert.equal(
    state.placement.ghostPreview.request.targetInstanceId,
    selection.candidates[0].request.targetInstanceId,
  );
  assert.equal(
    state.placement.ghostPreview.request.targetSnapId,
    selection.candidates[0].request.targetSnapId,
  );
});

test("manual snap target selection moves Ghost to exact DDS-04C candidate", () => {
  const controller = new ConstructionPrototypeController();
  const initial = controller.snapshot();
  const target = initial.ui.targetSelection.candidates[1];

  const selected = controller.selectSnapTarget(target.key);

  assert.equal(selected.ui.targetSelection.locked, true);
  assert.equal(
    selected.ui.targetSelection.selectedTargetKey,
    target.key,
  );
  assert.equal(
    selected.placement.ghostPreview.request.sourceSnapId,
    target.request.sourceSnapId,
  );
  assert.equal(
    selected.placement.ghostPreview.request.targetInstanceId,
    target.request.targetInstanceId,
  );
  assert.equal(
    selected.placement.ghostPreview.request.targetSnapId,
    target.request.targetSnapId,
  );
  assert.deepEqual(
    selected.placement.ghostPreview.transform,
    target.transform,
  );
});

test("rotation keeps manually selected snap target locked", () => {
  const controller = new ConstructionPrototypeController();
  const target = controller.snapshot().ui.targetSelection.candidates[1];

  controller.selectSnapTarget(target.key);
  const rotated = controller.rotate();

  assert.equal(rotated.ui.targetSelection.locked, true);
  assert.equal(
    rotated.ui.targetSelection.selectedTargetKey,
    target.key,
  );
  assert.equal(
    rotated.placement.ghostPreview.request.targetInstanceId,
    target.request.targetInstanceId,
  );
  assert.equal(
    rotated.placement.ghostPreview.request.targetSnapId,
    target.request.targetSnapId,
  );
  assert.equal(rotated.placement.ghostPreview.request.rotation, 90);
});

test("Place commits the manually selected target and then regenerates suggestions", () => {
  const controller = new ConstructionPrototypeController();
  const target = controller.snapshot().ui.targetSelection.candidates[1];

  const selected = controller.selectSnapTarget(target.key);
  const expectedTransform = selected.placement.ghostPreview.transform;
  const placed = controller.place();

  const wall = placed.construction.instances.find(
    (instance) => instance.category === "WALL",
  );

  assert.deepEqual(wall.transform, expectedTransform);
  assert.equal(placed.ui.targetSelection.locked, false);
  assert.equal(placed.ui.targetSelection.selectedTargetKey, null);
  assert.ok(placed.ui.targetSelection.candidates.length > 0);
});

test("undo clears stale manual target lock and regenerates candidates", () => {
  const controller = new ConstructionPrototypeController();
  const target = controller.snapshot().ui.targetSelection.candidates[1];

  controller.selectSnapTarget(target.key);
  controller.place();

  const nextTarget =
    controller.snapshot().ui.targetSelection.candidates.at(-1);
  controller.selectSnapTarget(nextTarget.key);

  const undone = controller.undo();

  assert.equal(undone.ui.targetSelection.locked, false);
  assert.equal(undone.ui.targetSelection.selectedTargetKey, null);
  assert.ok(undone.ui.targetSelection.candidates.length >= 2);
});

test("Wolf-Test clears stale target lock and regenerates against current topology", () => {
  const controller = new ConstructionPrototypeController();
  controller.place();

  const before = controller.snapshot();
  const target = before.ui.targetSelection.candidates.at(-1);
  controller.selectSnapTarget(target.key);

  const after = controller.wolfTest();

  assert.equal(after.ui.targetSelection.locked, false);
  assert.equal(after.ui.targetSelection.selectedTargetKey, null);
  assert.ok(Array.isArray(after.ui.targetSelection.candidates));
});
