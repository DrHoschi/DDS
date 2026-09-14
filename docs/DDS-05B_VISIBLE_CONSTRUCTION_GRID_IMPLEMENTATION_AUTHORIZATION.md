# DDS-05B – Visible Construction Grid / Placement Presentation Implementation Authorization

Status: AUTHORIZED / THREE-FILE SCOPE / NOT IMPLEMENTED

## Basis

Diese Autorisierung gilt ausschließlich auf Basis der folgenden bereits abgeschlossenen Schritte:

- DDS-05A Completion Baseline: FROZEN
- DDS-05B Reconciliation: `41da6ee880aaba1d6a6dfe65d17f1207222f86a7`
- DDS-05B Definition / Scope Gate: `3607a904cc674f069280bb2f014148746b70885b`
- DDS-05B Implementation Scope Reconciliation: `9681366ecc190d314678d9958e3f5f47e9339170`

## Autorisierter Implementierungsumfang

Die spätere DDS-05B-Implementierung darf ausschließlich folgende drei Dateien betreffen:

1. `src/dds-04f/browser-app.mjs`
   - sichtbare 9×9-Grid-Presentation aus der bestehenden Welt-/Placement-Authority ableiten
   - bestehende `createSceneProjection` / `projectWorldPoint`-Projektion verwenden
   - Raster als zusätzliche Presentation-Layer in `renderScene(state)` integrieren
   - OCCUPIED ausschließlich aus bestehenden FLOOR-Instanzen ableiten
   - VALID TARGET / SELECTED TARGET ausschließlich aus bestehendem Placement-/Snap-State ableiten
   - keine neue Placement-, Snap- oder Occupancy-Authority erzeugen

2. `src/dds-04f/prototype.css`
   - Styling für sichtbare Grid-Zellen/-Linien
   - Zustände FREE, OCCUPIED, VALID TARGET, SELECTED TARGET darstellen
   - Raster unter Sprites/Ghost/Snap-Targets halten
   - Raster nicht interaktiv machen (`pointer-events: none` oder gleichwertig)
   - identische Grid-Geometrie für iPhone/iPad; Viewport-Clipping ist zulässig

3. `tests/dds-05b/visible-construction-grid.test.mjs`
   - 9×9 Presentation Contract prüfen
   - 1×1-Zelle = 2 Welt-Einheiten prüfen
   - gemeinsame Welt→Bildschirm-Projektion absichern
   - Presentation-only / keine zweite Authority absichern
   - nicht-interaktives Raster / Viewport-Clipping-Vertrag absichern

## Nicht autorisiert

Ausdrücklich nicht autorisiert sind Änderungen an:

- `src/dds-04f/construction-ui-controller.mjs`
- `src/dds-04c/snap-placement.mjs`
- `src/dds-05a/sprite-presentation.mjs`
- `src/dds-05a/atlas-loader.mjs`
- Atlas-JSON/-PNG-Dateien
- `index.html`
- bestehenden DDS-04F-/DDS-05A-Tests
- `.github/workflows/dds-05a-regression.yml`
- Y-Stacking / Höhenebenen / Storeys
- Pan/Zoom/Dragging
- anklickbare Grid-Zellen als neue Bau-Authority
- TESTBUILD 4 Sprite-Kalibrierung
- DDS-05C+

## Freeze-Schutz

DDS-05A bleibt unverändert FROZEN. DDS-05B darf keine eingefrorene DDS-05A-Authority semantisch verändern.

## Gate

Mit dieser Datei ist ausschließlich die spätere Implementierung des exakt oben beschriebenen Drei-Dateien-Scopes autorisiert. In diesem Autorisierungsschritt selbst wurde keine Runtime-, CSS- oder Testimplementierung vorgenommen.

Status: **AUTHORIZED / SCOPE-LOCKED / NOT IMPLEMENTED**
