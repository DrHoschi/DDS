# DDS – Construction Prototype Game Concept

Status: **CONCEPT / FUTURE GAMEPLAY PROTOTYPE / NOT YET AUTHORIZED FOR IMPLEMENTATION**

## Zweck

Diese Notiz hält ausschließlich die für **Die Drei Schweinchen** relevanten Spielideen zum modularen Bauen und zum Wolf-Test fest.

Sie erweitert keinen bereits laufenden DDS-Feasibility-Block und autorisiert noch keine Implementierung.

## Grundidee

Das Schweinchen-Spiel soll einen einfachen, kindgerechten **Construction Prototype** erhalten.

Der Spieler soll kleine Häuser aus wenigen klar verständlichen Bauteilen zusammensetzen können. Das System dient im Spiel selbst als spielerische Bau- und Experimentiermechanik.

Das Bauen soll bewusst einfach bleiben:

`Bauteil wählen → Vorschau sehen → an gültigem Punkt einrasten → drehen → platzieren`

Keine komplexe CAD-, Architektur- oder freie Modellierlogik.

## Darstellungs- und Bedienprinzip

- 2.5D / feste oder stark begrenzte Spielkamera
- klare, große Bedienelemente für Kinder
- sichtbare Snap-Punkte / Einrast-Hinweise
- transparente Ghost-Vorschau des aktuell gewählten Bauteils
- einfache Rotation
- Platzieren
- Rückgängig
- eigener gut sichtbarer **Wolf-Test**

Die Bedienung soll auf iPhone und iPad verständlich und direkt bleiben.

## Erste Bauteile

Der erste Prototyp soll nur wenige Bauteilklassen benötigen:

- Boden
- Wand
- Ecke
- Tür / Türöffnung
- Dach
- Balken

Optionale spätere Erweiterungen innerhalb des Schweinchen-Spiels:

- Treppe
- erhöhte Bodenplattform
- zusätzliche Dachvarianten
- einfache dekorative Elemente

## Materialien

Mindestens drei Materialien sind vorgesehen:

- Stroh
- Holz
- Stein

Die Materialien sollen sich nicht nur optisch unterscheiden, sondern unterschiedliche vereinfachte Stabilitäts- bzw. Widerstandseigenschaften besitzen.

Grundtendenz:

- Stroh: sehr leicht und labil
- Holz: stabiler, aber weiterhin deutlich zerstörbar
- Stein: deutlich massiver und widerstandsfähiger

Die exakten Zahlenwerte sind noch nicht festgelegt.

## Snap- und Verbindungslogik

Bauteile werden über definierte Anschluss- bzw. Snap-Punkte verbunden.

Für den Prototyp genügt eine kleine, verständliche Menge gültiger Verbindungen.

Beispiele:

- Boden ↔ Wand
- Wand ↔ Ecke
- Wand ↔ Türsegment
- Wand / Balken ↔ Dach
- Boden ↔ weitere Bodenplatte

Ungültige Verbindungen sollen visuell klar erkennbar sein.

## Vereinfachte Stabilitätssimulation

Das Haus soll nicht nur aus einer festen Animation bestehen.

Die Konstruktion erhält eine vereinfachte Simulation auf Basis von Eigenschaften wie:

- Material
- Masse
- Verbindungskraft / Verbindungsstabilität
- Belastung
- Position / Ausrichtung des Bauteils

Das Ziel ist keine vollständige Baustatik, sondern eine glaubhafte, spielerische Reaktion.

## Wolf-Test

Der Wolf-Test ist eine zentrale Spielmechanik.

Ablauf:

`Bauen → Wolf-Test starten → Wolf pustet → Konstruktion reagiert → Kind kann verbessern und erneut testen`

Der Wolf erzeugt eine gerichtete Kraft bzw. einen Pust-Impuls.

Das Ergebnis soll von der konkreten Spielsituation abhängen, insbesondere von:

- Position des Wolfs
- Richtung des Pustens
- Entfernung
- verwendeten Materialien
- Aufbau des Hauses
- Anzahl und Qualität der Verbindungen

## Dynamisches Zerfallen

Das Gebäude soll nicht bei jeder Sitzung exakt gleich zusammenbrechen.

Wenn einzelne Verbindungen versagen, können Bauteile:

- sich lösen,
- kippen,
- herunterfallen,
- weggeschoben oder weggeblasen werden,
- weitere Bauteile mitreißen.

Damit können auch identische Grundhäuser unterschiedlich reagieren, wenn Position, Richtung oder Konstruktion variieren.

Gewünschter Charakter:

- Strohhaus zerfällt früh und leicht.
- Holzhaus hält länger und kann in größeren Teilen versagen.
- Steinhaus widersteht deutlich stärker.

## Spielschleife

Die einfache Kernschleife lautet:

`Planen → Bauen → Testen → Zerfallen beobachten → Verbessern → Wiederbauen → erneut testen`

Der Bauvorgang selbst soll Spaß machen und ohne lange Erklärung verständlich sein.

## Stabilitätsanzeige

Eine einfache, kindgerechte Stabilitätsanzeige kann während des Bauens Feedback geben.

Sie darf jedoch nicht jede spätere Reaktion exakt vorhersagen. Der Wolf-Test soll weiterhin spannend bleiben.

Beispiel:

- schwach
- mittel
- stabil

oder eine einfache Balkenanzeige.

## Prototype-UI-Konzept

Für den Construction Prototype wurde bereits ein Mockup-Konzept festgelegt mit:

- Materialauswahl links
- Construction-Szene in der Mitte
- Bauteilleiste unten
- Aktionen rechts
- Stabilitätsanzeige
- sichtbaren Snap-Punkten
- großem Wolf-Test-Button

Die Grundidee wurde als für Kinder unmittelbar verständlich bewertet.

## Bewusste Grenzen dieses Konzepts

Diese Notiz definiert noch nicht:

- endgültige Physikparameter
- endgültige Engine
- Produktionsarchitektur
- vollständiges Leveldesign
- finales UI
- vollständige Gebäudebibliothek
- Multiplayer
- komplexe freie Gebäudekonstruktion
- eine realistische Baustatik

## Minimaler erster Proof of Concept

Der kleinste sinnvolle spätere Test wäre:

1. Boden platzieren
2. Wand an Boden snappen
3. weitere Wand / Ecke ergänzen
4. Dach aufsetzen
5. Materialeigenschaft anwenden
6. Wolf an definierter Position pusten lassen
7. Verbindungen prüfen
8. Bauteile dynamisch reagieren / zerfallen lassen
9. Ergebnis beobachten und neu bauen

Erst wenn dieser kleine Ablauf verständlich und technisch stabil funktioniert, sollte der Construction Prototype erweitert werden.
