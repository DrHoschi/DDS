# DDS – Planned Asset Pipeline Ideas

**Datum:** 2026-09-15  
**Status:** PLANNED / IDEA BACKLOG / NOT AUTHORIZED FOR IMPLEMENTATION

## Zweck

Diese Notiz hält Ideen fest, die aus den aktuellen Sprite-/Positionierungsproblemen und dem neuen Meshy-Schweinchen-GLB entstanden sind. Sie erweitert keinen laufenden DDS-Block und darf aktuelle Arbeit nicht blockieren.

## 1. Sprite Spatial Metadata / Footprint

Künftiger Kandidat für DDS-Assets und Atlas-Metadaten:

- Ground Footprint als editierbares 4-Punkt-Polygon für die reale Boden-/Aufstandsfläche, unabhängig von Dach- oder Bildüberständen;
- Origin / World Anchor;
- Front-/Orientierungsmarker;
- optional Height und separate Occupancy-/Interaction-Fläche;
- daraus ableitbare konsistente Positionierung, Skalierung/assetPPU und begrenzte Perspektivkalibrierung;
- generische Spatial-Primitives `POINT`, `LINE`, `CIRCLE`, `POLYGON`.

## 2. Frei definierbare Marker / Sockets

Atlas-/Asset-Metadaten sollen später frei benannte IDs tragen können, damit DDS sie nur noch über generische Engine-Funktionen verknüpfen muss. Beispiele:

- `ENTRY_MAIN`, `ENTRY_WORKER`;
- `SMOKE_01`;
- `RESOURCE_IN`, `RESOURCE_OUT`;
- Straßen-/Bauteil-/Modulanschlüsse;
- Effekt- und Custom-Marker.

Prinzip: Asset/Atlas beschreibt Position und Typ; DDS interpretiert nur die Marker, die es fachlich benötigt.

## 3. Modularer Charakter / Rig als spätere Option

Für zusammengesetzte 2D-/2,5D-Charaktere kann ein späterer Asset Contract enthalten:

- getrennte Sprite-Layer/Körperteile;
- Joints/Pivots als Punkte und Bones/Achsen als Linien;
- Parent-Child-Bindings;
- Attachments/Sockets;
- Posen, Frames und Animation Clips;
- richtungs- bzw. poseabhängige Layer-/Z-Order, damit Vorder-/Hinterarme, Beine und Ausrüstung korrekt vor bzw. hinter dem Körper gerendert werden.

Diese Idee ist kein aktueller DDS-Implementierungsauftrag; die allgemeine Editor-/Contract-Funktion gehört primär nach DevForge.

## 4. Meshy Pig GLB / 3D Game Asset Pipeline

Das bereits heruntergeladene Schweinchen-GLB von Meshy soll als reales zukünftiges Testasset vorgemerkt werden. Interessante spätere Prüfungen:

- Mesh-/Triangle-/Vertex-Aufwand;
- Untergruppen/Nodes;
- Materialien, Texturen und UVs;
- Maße, Bounds und Pivot/Origin;
- Rig/Animationen, falls vorhanden;
- Eignung als Game Asset und als Quelle für konsistente 2,5D-Sprites;
- mögliche LOD-/Decimation-Varianten mit möglichst erhaltener Silhouette.

Werkzeugabgrenzung: DevForge kann Inspection/Game-Asset-Optimierung und Sprite-/Atlas-Aufbereitung übernehmen; CyberMotion kann später Geometrie, Materialien/Texturen und Modellkorrekturen bearbeiten. DDS konsumiert die daraus erzeugten game-ready Assets.

## Guardrail

Keine Änderung an laufenden DDS-04/05-Scopes oder bestehenden Atlas-/Sprite-Verträgen allein aufgrund dieser Notiz. Vor jeder Umsetzung ist ein eigener Reconciliation-/Authorization-Schritt gegen den dann aktuellen DDS-Stand erforderlich.
