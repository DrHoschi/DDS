import test from "node:test";
import assert from "node:assert/strict";

import { ConstructionState } from "../../src/dds-04b/construction-state.mjs";
import { SnapPlacementFoundation } from "../../src/dds-04c/snap-placement.mjs";

function createFoundation() {
  const constructionState = new ConstructionState();

  for (const [id, category] of [
    ["def:floor", "FLOOR"],
    ["def:wall", "WALL"],
    ["def:corner", "CORNER"],
    ["def:roof", "ROOF"],
  ]) {
    constructionState.registerModuleDefinition({ id, category });
  }

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
        id: "wall-north",
        connectionClass: "FLOOR_WALL",
        compatibleClasses: ["WALL_BOTTOM"],
        position: { x: 0, y: 0, z: 1 },
        rotationY: 0,
      },
      {
        id: "wall-east",
        connectionClass: "FLOOR_WALL",
        compatibleClasses: ["WALL_BOTTOM"],
        position: { x: 1, y: 0, z: 0 },
        rotationY: 90,
      },
      {
        id: "reserved-test",
        connectionClass: "FLOOR_WALL",
        compatibleClasses: ["WALL_BOTTOM"],
        position: { x: -1, y: 0, z: 0 },
        rotationY: 270,
      },
    ],
  });

  placement.registerSnapProfile({
    definitionId: "def:wall",
    allowedRotations: [0, 90],
    snapPoints: [
      {
        id: "bottom",
        connectionClass: "WALL_BOTTOM",
        compatibleClasses: ["FLOOR_WALL"],
        position: { x: 0, y: -1, z: 0 },
        rotationY: 180,
      },
      {
        id: "side",
        connectionClass: "WALL_SIDE",
        compatibleClasses: ["CORNER_SIDE"],
        position: { x: 1, y: 0, z: 0 },
        rotationY: 90,
      },
      {
        id: "top",
        connectionClass: "WALL_TOP",
        compatibleClasses: ["ROOF_BOTTOM"],
        position: { x: 0, y: 1, z: 0 },
        rotationY: 0,
      },
    ],
  });

  placement.registerSnapProfile({
    definitionId: "def:corner",
    allowedRotations: [0],
    snapPoints: [
      {
        id: "side",
        connectionClass: "CORNER_SIDE",
        compatibleClasses: ["WALL_SIDE"],
        position: { x: -1, y: 0, z: 0 },
        rotationY: 270,
      },
    ],
  });

  placement.registerSnapProfile({
    definitionId: "def:roof",
    allowedRotations: [0],
    snapPoints: [
      {
        id: "bottom",
        connectionClass: "ROOF_BOTTOM",
        compatibleClasses: ["WALL_TOP"],
        position: { x: 0, y: -0.5, z: 0 },
        rotationY: 180,
      },
    ],
  });

  return { constructionState, placement };
}

function previewWall(placement, overrides = {}) {
  return placement.previewPlacement({
    instanceId: "wall:001",
    definitionId: "def:wall",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "wall-north",
    rotation: 0,
    ...overrides,
  });
}

test("snap profiles expose stable explicit identities and data-driven compatibility", () => {
  const { placement } = createFoundation();
  const snapshot = placement.snapshot();

  assert.equal(
    placement.snapIdentity("floor:001", "wall-north"),
    "floor:001::wall-north",
  );
  assert.equal(snapshot.snapProfiles.length, 4);

  const wall = snapshot.snapProfiles.find(
    (profile) => profile.definitionId === "def:wall",
  );
  assert.deepEqual(wall.allowedRotations, [0, 90]);
  assert.equal(wall.snapPoints[0].connectionClass, "WALL_BOTTOM");
  assert.deepEqual(wall.snapPoints[0].compatibleClasses, ["FLOOR_WALL"]);
});

test("ghost preview does not mutate authoritative construction state", () => {
  const { constructionState, placement } = createFoundation();

  const before = constructionState.snapshot();
  const preview = previewWall(placement);
  const after = constructionState.snapshot();

  assert.equal(preview.valid, true);
  assert.deepEqual(after, before);
  assert.equal(after.instances.length, 1);
  assert.equal(after.connections.length, 0);
  assert.equal(placement.snapshot().historyDepth, 0);
});

test("identical authoritative input produces identical deterministic placement output", () => {
  const { placement } = createFoundation();

  const first = previewWall(placement);
  placement.clearPreview();
  const second = previewWall(placement);

  assert.deepEqual(second, first);
  assert.deepEqual(first.transform, {
    position: { x: 0, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  });
});

test("valid placement creates authoritative module connection and snap occupancy", () => {
  const { constructionState, placement } = createFoundation();

  const preview = previewWall(placement);
  assert.equal(preview.valid, true);

  const committed = placement.placePreview();
  const construction = constructionState.snapshot();
  const snapState = placement.snapshot();

  assert.equal(construction.instances.length, 2);
  assert.equal(construction.connections.length, 1);

  const wall = construction.instances.find(
    (instance) => instance.id === "wall:001",
  );
  assert.deepEqual(wall.transform, preview.transform);
  assert.deepEqual(wall.connectionRefs, [committed.connectionId]);

  assert.deepEqual(construction.connections[0].moduleRefs, [
    "floor:001",
    "wall:001",
  ]);

  assert.deepEqual(
    snapState.occupancy.map((entry) => entry.snapId).sort(),
    ["floor:001::wall-north", "wall:001::bottom"].sort(),
  );
  assert.equal(snapState.ghostPreview, null);
  assert.equal(snapState.historyDepth, 1);
});

test("occupied target snaps reject a second placement without state mutation", () => {
  const { constructionState, placement } = createFoundation();

  previewWall(placement);
  placement.placePreview();

  const before = constructionState.snapshot();
  const candidate = previewWall(placement, {
    instanceId: "wall:002",
  });

  assert.equal(candidate.valid, false);
  assert.equal(candidate.reason, "TARGET_SNAP_OCCUPIED");
  assert.deepEqual(constructionState.snapshot(), before);
});

test("incompatible connection classes and disallowed rotations are rejected", () => {
  const { constructionState, placement } = createFoundation();

  const incompatible = placement.previewPlacement({
    instanceId: "roof:bad",
    definitionId: "def:roof",
    sourceSnapId: "bottom",
    targetInstanceId: "floor:001",
    targetSnapId: "reserved-test",
    rotation: 0,
  });

  assert.equal(incompatible.valid, false);
  assert.equal(incompatible.reason, "INCOMPATIBLE_CONNECTION_CLASS");

  const badRotation = previewWall(placement, {
    instanceId: "wall:rotation-bad",
    targetSnapId: "wall-east",
    rotation: 45,
  });

  assert.equal(badRotation.valid, false);
  assert.equal(badRotation.reason, "ROTATION_NOT_ALLOWED");

  assert.equal(constructionState.snapshot().instances.length, 1);
  assert.equal(constructionState.snapshot().connections.length, 0);
});

test("permitted prototype rotation changes placement deterministically", () => {
  const { placement } = createFoundation();

  const candidate = previewWall(placement, {
    instanceId: "wall:rotated",
    targetSnapId: "wall-east",
    rotation: 90,
  });

  assert.equal(candidate.valid, true);
  assert.equal(candidate.transform.rotation.y, 180);

  placement.clearPreview();

  const repeated = previewWall(placement, {
    instanceId: "wall:rotated",
    targetSnapId: "wall-east",
    rotation: 90,
  });

  assert.deepEqual(repeated, candidate);
});

test("minimal FLOOR to WALL to CORNER to ROOF chain commits through explicit connections", () => {
  const { constructionState, placement } = createFoundation();

  previewWall(placement);
  placement.placePreview();

  const corner = placement.previewPlacement({
    instanceId: "corner:001",
    definitionId: "def:corner",
    sourceSnapId: "side",
    targetInstanceId: "wall:001",
    targetSnapId: "side",
    rotation: 0,
  });
  assert.equal(corner.valid, true);
  placement.placePreview();

  const roof = placement.previewPlacement({
    instanceId: "roof:001",
    definitionId: "def:roof",
    sourceSnapId: "bottom",
    targetInstanceId: "wall:001",
    targetSnapId: "top",
    rotation: 0,
  });
  assert.equal(roof.valid, true);
  placement.placePreview();

  const construction = constructionState.snapshot();
  assert.deepEqual(
    construction.instances.map((instance) => instance.id),
    ["floor:001", "wall:001", "corner:001", "roof:001"],
  );
  assert.equal(construction.connections.length, 3);
  assert.equal(placement.snapshot().historyDepth, 3);
});

test("undo removes only the latest placement and restores preceding valid state", () => {
  const { constructionState, placement } = createFoundation();

  previewWall(placement);
  placement.placePreview();

  placement.previewPlacement({
    instanceId: "roof:001",
    definitionId: "def:roof",
    sourceSnapId: "bottom",
    targetInstanceId: "wall:001",
    targetSnapId: "top",
    rotation: 0,
  });
  const roofPlacement = placement.placePreview();

  const beforeUndo = constructionState.snapshot();
  assert.equal(beforeUndo.instances.length, 3);
  assert.equal(beforeUndo.connections.length, 2);

  const undone = placement.undoLastPlacement();
  assert.equal(undone.instanceId, "roof:001");
  assert.equal(undone.connectionId, roofPlacement.connectionId);

  const afterUndo = constructionState.snapshot();
  assert.deepEqual(
    afterUndo.instances.map((instance) => instance.id),
    ["floor:001", "wall:001"],
  );
  assert.equal(afterUndo.connections.length, 1);
  assert.equal(placement.snapshot().historyDepth, 1);

  const roofAgain = placement.previewPlacement({
    instanceId: "roof:001",
    definitionId: "def:roof",
    sourceSnapId: "bottom",
    targetInstanceId: "wall:001",
    targetSnapId: "top",
    rotation: 0,
  });
  assert.equal(roofAgain.valid, true);
});

test("undo refuses to corrupt state when the latest module has unexpected extra connections", () => {
  const { constructionState, placement } = createFoundation();

  previewWall(placement);
  placement.placePreview();

  placement.previewPlacement({
    instanceId: "corner:001",
    definitionId: "def:corner",
    sourceSnapId: "side",
    targetInstanceId: "wall:001",
    targetSnapId: "side",
    rotation: 0,
  });
  placement.placePreview();

  assert.throws(
    () => placement.undoLastPlacement(),
    /unexpected connection state/,
  );

  const construction = constructionState.snapshot();
  assert.equal(construction.instances.length, 3);
  assert.equal(construction.connections.length, 2);
});
