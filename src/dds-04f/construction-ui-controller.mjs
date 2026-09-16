import { ConstructionState, MODULE_CATEGORIES } from "../dds-04b/construction-state.mjs";
import { SnapPlacementFoundation } from "../dds-04c/snap-placement.mjs";
import { MaterialStabilityFoundation, MATERIAL_IDS } from "../dds-04d/material-stability.mjs";
import { WolfDynamicResponseFoundation } from "../dds-04e/wolf-dynamic-response.mjs";

export const PIECE_LABELS = Object.freeze({ FLOOR: "Boden", WALL: "Wand", CORNER: "Ecke", DOOR_OPENING: "Tür", ROOF: "Dach", BEAM: "Balken" });
export const MATERIAL_LABELS = Object.freeze({ STRAW: "Stroh", WOOD: "Holz", STONE: "Stein" });
const DEFINITION_IDS = Object.freeze(Object.fromEntries(MODULE_CATEGORIES.map((category) => [category, `dds04f:${category.toLowerCase()}`])));
const ROTATIONS = Object.freeze([0, 90, 180, 270]);

function targetChoiceKey(request) { return JSON.stringify([request.sourceSnapId, request.targetInstanceId, request.targetSnapId]); }
function clone(value) { if (Array.isArray(value)) return value.map(clone); if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clone(child)])); return value; }
function deepFreeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.freeze(value); for (const child of Object.values(value)) deepFreeze(child); return value; }
function definitionId(category) { return DEFINITION_IDS[category]; }

function snapProfile(category) {
  const profiles = {
    FLOOR: {
      allowedRotations: ROTATIONS,
      snapPoints: [
        { id: "floor-east", connectionClass: "FLOOR_EDGE", compatibleClasses: ["FLOOR_EDGE"], position: { x: 1, y: 0, z: 0 }, rotationY: 0 },
        { id: "floor-north", connectionClass: "FLOOR_EDGE", compatibleClasses: ["FLOOR_EDGE"], position: { x: 0, y: 0, z: 1 }, rotationY: 90 },
        { id: "floor-west", connectionClass: "FLOOR_EDGE", compatibleClasses: ["FLOOR_EDGE"], position: { x: -1, y: 0, z: 0 }, rotationY: 180 },
        { id: "floor-south", connectionClass: "FLOOR_EDGE", compatibleClasses: ["FLOOR_EDGE"], position: { x: 0, y: 0, z: -1 }, rotationY: 270 },
        // EDGE contract: WALL / DOOR_OPENING / BEAM all start on a real grid corner.
        { id: "wall-north", connectionClass: "FLOOR_WALL", compatibleClasses: ["MODULE_BASE"], position: { x: -1, y: 0, z: 1 }, rotationY: 0 },
        { id: "wall-east", connectionClass: "FLOOR_WALL", compatibleClasses: ["MODULE_BASE"], position: { x: 1, y: 0, z: 1 }, rotationY: 90 },
        { id: "wall-south", connectionClass: "FLOOR_WALL", compatibleClasses: ["MODULE_BASE"], position: { x: 1, y: 0, z: -1 }, rotationY: 180 },
        { id: "wall-west", connectionClass: "FLOOR_WALL", compatibleClasses: ["MODULE_BASE"], position: { x: -1, y: 0, z: -1 }, rotationY: 270 },
        // CORNER contract: the common corner anchor is the grid intersection itself.
        { id: "corner-east", connectionClass: "FLOOR_CORNER", compatibleClasses: ["MODULE_BASE"], position: { x: 1, y: 0, z: 1 }, rotationY: 45 },
        { id: "corner-south", connectionClass: "FLOOR_CORNER", compatibleClasses: ["MODULE_BASE"], position: { x: 1, y: 0, z: -1 }, rotationY: 135 },
        { id: "corner-west", connectionClass: "FLOOR_CORNER", compatibleClasses: ["MODULE_BASE"], position: { x: -1, y: 0, z: -1 }, rotationY: 225 },
        { id: "corner-north", connectionClass: "FLOOR_CORNER", compatibleClasses: ["MODULE_BASE"], position: { x: -1, y: 0, z: 1 }, rotationY: 315 },
      ],
    },
    WALL: { allowedRotations: ROTATIONS, snapPoints: [
      { id: "base", connectionClass: "MODULE_BASE", compatibleClasses: ["FLOOR_WALL", "FLOOR_CORNER", "MODULE_SIDE"], position: { x: 0, y: 0, z: 0 }, rotationY: 180 },
      { id: "side", connectionClass: "MODULE_SIDE", compatibleClasses: ["MODULE_BASE"], position: { x: 1.4, y: 0, z: 0 }, rotationY: 90 },
      { id: "top", connectionClass: "WALL_TOP", compatibleClasses: ["ROOF_BASE", "MODULE_BASE"], position: { x: 0, y: 1.6, z: 0 }, rotationY: 0 },
    ]},
    CORNER: { allowedRotations: ROTATIONS, snapPoints: [
      { id: "base", connectionClass: "MODULE_BASE", compatibleClasses: ["FLOOR_CORNER", "MODULE_SIDE"], position: { x: 0, y: 0, z: 0 }, rotationY: 180 },
      { id: "side", connectionClass: "MODULE_SIDE", compatibleClasses: ["MODULE_BASE"], position: { x: 1.2, y: 0, z: 1.2 }, rotationY: 90 },
      { id: "top", connectionClass: "WALL_TOP", compatibleClasses: ["ROOF_BASE", "MODULE_BASE"], position: { x: 0, y: 1.6, z: 0 }, rotationY: 0 },
    ]},
    DOOR_OPENING: { allowedRotations: ROTATIONS, snapPoints: [
      { id: "base", connectionClass: "MODULE_BASE", compatibleClasses: ["FLOOR_WALL", "MODULE_SIDE"], position: { x: 0, y: 0, z: 0 }, rotationY: 180 },
      { id: "side", connectionClass: "MODULE_SIDE", compatibleClasses: ["MODULE_BASE"], position: { x: 1.4, y: 0, z: 0 }, rotationY: 90 },
      { id: "top", connectionClass: "WALL_TOP", compatibleClasses: ["ROOF_BASE", "MODULE_BASE"], position: { x: 0, y: 1.6, z: 0 }, rotationY: 0 },
    ]},
    ROOF: { allowedRotations: ROTATIONS, snapPoints: [{ id: "base", connectionClass: "ROOF_BASE", compatibleClasses: ["WALL_TOP", "BEAM_TOP"], position: { x: 0, y: 0, z: 0 }, rotationY: 180 }] },
    BEAM: { allowedRotations: ROTATIONS, snapPoints: [
      { id: "base", connectionClass: "MODULE_BASE", compatibleClasses: ["FLOOR_WALL", "MODULE_SIDE", "WALL_TOP"], position: { x: 0, y: 0, z: 0 }, rotationY: 180 },
      { id: "side", connectionClass: "MODULE_SIDE", compatibleClasses: ["MODULE_BASE"], position: { x: 1.2, y: 0, z: 0 }, rotationY: 90 },
      { id: "top", connectionClass: "BEAM_TOP", compatibleClasses: ["ROOF_BASE"], position: { x: 0, y: 1.8, z: 0 }, rotationY: 0 },
    ]},
  };
  return profiles[category];
}

function messageForInvalid(reason) { const labels = { TARGET_SNAP_OCCUPIED: "Dieser Platz ist schon belegt.", INCOMPATIBLE_CONNECTION_CLASS: "Dieses Teil passt hier nicht.", ROTATION_NOT_ALLOWED: "So lässt sich das Teil nicht drehen.", TARGET_INSTANCE_MISSING: "Kein passendes Bauteil gefunden.", TARGET_PROFILE_MISSING: "Hier kann nichts einrasten.", TARGET_SNAP_MISSING: "Der Einrastpunkt fehlt.", SOURCE_PROFILE_MISSING: "Für dieses Teil fehlen Einrastpunkte.", SOURCE_SNAP_MISSING: "Für dieses Teil fehlt der Anschluss." }; return labels[reason] ?? "Noch kein gültiger Einrastpunkt."; }

export class ConstructionPrototypeController {
  #constructionState; #placement; #materials; #wolf; #selectedPiece = "WALL"; #selectedMaterial = "STRAW"; #selectedInstanceId = null; #rotation = 0; #nextInstanceNumber = 1; #status = "Bauteil wählen und losbauen."; #lastWolfResult = null; #targetCandidates = []; #recommendedTargetKey = null; #selectedTargetKey = null; #selectedTargetRequest = null;
  constructor() { this.#constructionState = new ConstructionState(); this.#registerDefinitions(); this.#rebuildDerivedAuthorities(); this.#addStarterFloor(); this.#refreshPreview(); }
  selectPiece(category) { if (!MODULE_CATEGORIES.includes(category)) throw new Error(`Unsupported DDS-04F piece category: ${category}`); this.#selectedPiece = category; this.#rotation = 0; this.#clearTargetSelection(); this.#status = `${PIECE_LABELS[category]} gewählt.`; this.#refreshPreview(); return this.snapshot(); }
  rotate() { const currentIndex = ROTATIONS.indexOf(this.#rotation); this.#rotation = ROTATIONS[(currentIndex + 1) % ROTATIONS.length]; this.#status = `Gedreht: ${this.#rotation}°`; this.#refreshPreview(); return this.snapshot(); }
  selectSnapTarget(targetKey) { const target = this.#targetCandidates.find((candidate) => candidate.key === targetKey); if (!target) throw new Error(`Unknown or unavailable DDS-04F snap target: ${targetKey}`); const selectedTarget = this.#selectedPiece === "FLOOR" ? this.#targetCandidates.find((candidate) => candidate.targetInstanceId === target.targetInstanceId && candidate.targetSnapId === target.targetSnapId && candidate.transform.rotation.y === this.#rotation) ?? target : target; this.#selectedTargetKey = selectedTarget.key; this.#selectedTargetRequest = { ...selectedTarget.request }; const selected = this.#placement.previewPlacement({ ...selectedTarget.request, rotation: this.#rotation }); this.#status = selected.valid ? "Bauplatz gewählt ✓" : messageForInvalid(selected.reason); return this.snapshot(); }
  place() { const ghost = this.#placement.snapshot().ghostPreview; if (!ghost?.valid) { this.#status = messageForInvalid(ghost?.reason); return this.snapshot(); } const committed = this.#placement.placePreview(); this.#materials.assignMaterial(committed.instanceId, this.#selectedMaterial); this.#selectedInstanceId = committed.instanceId; this.#nextInstanceNumber += 1; this.#clearTargetSelection(); const placedStatus = `${PIECE_LABELS[this.#selectedPiece]} platziert ✓`; this.#lastWolfResult = null; this.#refreshPreview(); this.#status = placedStatus; return this.snapshot(); }
  undo() { const undone = this.#placement.undoLastPlacement(); if (!undone) { this.#status = "Nichts zum Rückgängig machen."; return this.snapshot(); } this.#materials.unregisterInstance(undone.instanceId); if (this.#selectedInstanceId === undone.instanceId) this.#selectedInstanceId = null; this.#clearTargetSelection(); this.#lastWolfResult = null; this.#refreshPreview(); this.#status = `${PIECE_LABELS[undone.category] ?? "Bauteil"} entfernt.`; return this.snapshot(); }
  reset() { this.#constructionState = new ConstructionState(); this.#registerDefinitions(); this.#rebuildDerivedAuthorities(); this.#selectedInstanceId = null; this.#rotation = 0; this.#nextInstanceNumber = 1; this.#lastWolfResult = null; this.#clearTargetSelection(); this.#addStarterFloor(); this.#refreshPreview(); this.#status = "Baufläche zurückgesetzt."; return this.snapshot(); }
  selectMaterial(materialId) { if (!MATERIAL_IDS.includes(materialId)) throw new Error(`Unsupported DDS-04F material: ${materialId}`); this.#selectedMaterial = materialId; if (this.#selectedInstanceId) this.#materials.assignMaterial(this.#selectedInstanceId, materialId); this.#lastWolfResult = null; this.#status = `${MATERIAL_LABELS[materialId]} gewählt.`; return this.snapshot(); }
  selectInstance(instanceId) { const instance = this.#constructionState.getInstance(instanceId); if (!instance) return this.snapshot(); this.#selectedInstanceId = instanceId; this.#selectedPiece = instance.category; const assignment = this.#materials.snapshot().assignments.find((entry) => entry.instanceId === instanceId); if (assignment) this.#selectedMaterial = assignment.materialId; this.#clearTargetSelection(); this.#status = `${PIECE_LABELS[instance.category]} ausgewählt.`; this.#refreshPreview(); return this.snapshot(); }
  runWolfTest() { const result = this.#wolf.simulate({ direction: { x: 1, y: 0, z: 0 }, strength: 1 }); this.#lastWolfResult = result; this.#status = result.summary === "STOOD" ? "Das Haus hält! 🐷✨" : result.summary === "PARTIAL" ? "Ein Teil gibt nach – aber nicht alles!" : "Der Wolf hat es geschafft! 🐺💨"; return this.snapshot(); }
  snapshot() { const construction = this.#constructionState.snapshot(); const placement = this.#placement.snapshot(); const materials = this.#materials.snapshot(); const stability = this.#materials.evaluateStability(); return deepFreeze({ ui: { selectedPiece: this.#selectedPiece, selectedMaterial: this.#selectedMaterial, selectedInstanceId: this.#selectedInstanceId, rotation: this.#rotation, status: this.#status, targetSelection: { candidates: clone(this.#targetCandidates), recommendedTargetKey: this.#recommendedTargetKey, selectedTargetKey: this.#selectedTargetKey } }, construction, placement, materials, stability, wolf: this.#lastWolfResult ? clone(this.#lastWolfResult) : null }); }
  #registerDefinitions() { for (const category of MODULE_CATEGORIES) this.#constructionState.registerDefinition({ id: definitionId(category), category, label: PIECE_LABELS[category], snapProfile: snapProfile(category) }); }
  #rebuildDerivedAuthorities() { this.#placement = new SnapPlacementFoundation({ constructionState: this.#constructionState }); for (const category of MODULE_CATEGORIES) this.#placement.registerSnapProfile({ definitionId: definitionId(category), ...snapProfile(category) }); this.#materials = new MaterialStabilityFoundation({ constructionState: this.#constructionState }); this.#wolf = new WolfDynamicResponseFoundation({ constructionState: this.#constructionState, materialFoundation: this.#materials }); for (const instance of this.#constructionState.snapshot().instances) this.#materials.registerInstance(instance.id); }
  #addStarterFloor() { const floorId = "dds04f:floor:starter"; this.#constructionState.addInstance({ id: floorId, definitionId: definitionId("FLOOR"), transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, materialRef: "STRAW", placementState: "PLACED" }); this.#materials.registerInstance(floorId); this.#materials.assignMaterial(floorId, "STRAW"); }
  #clearTargetSelection() { this.#targetCandidates = []; this.#recommendedTargetKey = null; this.#selectedTargetKey = null; this.#selectedTargetRequest = null; }
  #collectTargetCandidates() { const sourceProfile = snapProfile(this.#selectedPiece); if (!sourceProfile) return []; const candidates = []; const seen = new Set(); for (const sourceSnap of sourceProfile.snapPoints) { for (const targetInstance of this.#constructionState.snapshot().instances) { const targetProfile = snapProfile(targetInstance.category); if (!targetProfile) continue; for (const targetSnap of targetProfile.snapPoints) { if (!sourceSnap.compatibleClasses.includes(targetSnap.connectionClass) || !targetSnap.compatibleClasses.includes(sourceSnap.connectionClass)) continue; const request = { sourceDefinitionId: definitionId(this.#selectedPiece), sourceSnapId: sourceSnap.id, targetInstanceId: targetInstance.id, targetSnapId: targetSnap.id, instanceId: `dds04f:${this.#selectedPiece.toLowerCase()}:${this.#nextInstanceNumber}`, materialRef: this.#selectedMaterial }; const key = targetChoiceKey(request); if (seen.has(key)) continue; const preview = this.#placement.previewPlacement({ ...request, rotation: this.#rotation }); if (!preview.valid) continue; seen.add(key); candidates.push({ key, request, sourceSnapId: sourceSnap.id, targetInstanceId: targetInstance.id, targetSnapId: targetSnap.id, transform: clone(preview.transform) }); } } } return candidates; }
  #refreshPreview() { const candidates = this.#collectTargetCandidates(); this.#targetCandidates = candidates; const selectedStillAvailable = this.#selectedTargetRequest ? candidates.find((candidate) => candidate.key === targetChoiceKey(this.#selectedTargetRequest)) : null; const selected = selectedStillAvailable ?? candidates[0] ?? null; this.#recommendedTargetKey = candidates[0]?.key ?? null; this.#selectedTargetKey = selected?.key ?? null; this.#selectedTargetRequest = selected ? { ...selected.request } : null; if (!selected) { this.#placement.clearPreview(); return; } this.#placement.previewPlacement({ ...selected.request, rotation: this.#rotation }); }
}
