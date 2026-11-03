# Schweiz klingt anders
### Eine interaktive Reise durch Dialekte und Klänge

Interdisziplinäres Schulprojekt **Bildnerisches Gestalten (BG) × Musik**.
Eine interaktive Schweizerkarte mit allen 26 Kantonen, auf der man Sprache **sehen**, **hören** und **erleben** kann.

> Leitfrage: **«Wie kann Sprache durch Musik und Gestaltung erlebbar gemacht werden?»**

---

## 1. Startanleitung

Voraussetzung: [Node.js](https://nodejs.org) ab Version 20.

```bash
npm install        # einmalig: Abhängigkeiten installieren
npm run dev        # Entwicklungsserver starten → http://localhost:5173
```

Weitere Befehle:

| Befehl | Zweck |
| --- | --- |
| `npm run build` | TypeScript prüfen und fertige Website nach `dist/` bauen |
| `npm run preview` | gebaute Website lokal ansehen (http://localhost:4173) |
| `npm run typecheck` | nur TypeScript prüfen |
| `npm run geo` | Kartengeometrie neu aus den BFS-Daten erzeugen |
| `npm run symbols` | Wappensymbole neu nach `public/assets/images/cantons/wappen/` kopieren |

Der Ordner `dist/` kann auf jeden statischen Webserver (Schulserver, GitHub Pages, Netlify …) kopiert werden. Dank Hash-Routing (`#/karte/be`) ist keine Serverkonfiguration nötig. Es werden **keine API-Schlüssel** und keine kostenpflichtigen Dienste benötigt; Schriften und Karte sind lokal eingebunden, die Seite funktioniert also auch offline.

---

## 2. Implementierte Funktionen

### Startseite
- Titel «SCHWEIZ KLINGT ANDERS», Untertitel, Einführungstext, Button **«Schweiz entdecken»**
- Ausschnitt der künstlerischen Karte mit pulsierenden «Klangpunkten» je Kanton
- Laufband mit Wörtern aus der Dialektbibliothek, Kacheln der sechs Beispielkantone mit Klangsignet

### Schweizerkarte (`#/karte`)
- **Echte Kantonsgrenzen** (BFS, generalisiert, Stand 1.1.2026 – inkl. Moutier im Kanton Jura), nur projiziert, nichts gezeichnet
- Alle 26 Kantone anklick- und per Tastatur (Tab, Enter) auswählbar; kleine Kantone (BS, ZG, AI, …) haben eine zusätzliche Klickfläche, dazu eine Kantonsliste
- Hover: Farbveränderung + Tooltip mit Name und Sprachen
- Auswahl: Kanton bleibt hervorgehoben, Rest tritt zurück, Kamera fliegt sanft zum Kanton
- Zoom (Mausrad, Pinch, +/−), Verschieben (Ziehen, Pfeiltasten), **Zurücksetzen**-Button
- **Drei Kartenstile:**
  1. *Künstlerisch* – Farbfamilien je Amtssprache, eigene Nuance je Kanton, grafische Strukturen (Linien, Punkte, Wellen, Raster, Ringe), Streifen bei mehrsprachigen Kantonen
  2. *Geografisch* – sachlich, deutliche Grenzen, Seen, Kantonskürzel
  3. *Wappen* – Wappensymbole auf der Karte, Wappen im Tooltip, eigene **Wappensammlung** (`#/wappen`)
- Musikereignisse lösen Wellenringe auf dem jeweiligen Kanton aus
- Wechselt man den Kanton, während ein Motiv läuft, wechselt die Klangwelt mit

### Detailansicht eines Kantons
Allgemeines (Name, Kürzel, Wappen, Hauptort, Amtssprachen, Lage) · Sprache & Dialekte (Varietäten, Sprachräume, Hinweis «Kantonsgrenze ≠ Dialektgrenze») · Wörter mit Übersetzung, Bedeutung, Verbreitung, Prüfstatus und Quelle · Sprachaufnahmen (mit Klangwelle, sobald vorhanden) · Klangmotiv mit Play-Button, zwei Visualisierungen und Gestaltungserklärung · Farb- und Klangsignet-Gestaltung · Quellen

### Musik & Visualisierung
- Eigenes **Motiv-System**: jedes Motiv wird als einfache Textnotation beschrieben und live mit der Web Audio API gespielt (9 Klangfarben, 5 Schlaginstrumente, Hall)
- Sechs **handgestaltete Demo-Motive** (BE, ZH, BS, GR, TI, GE), deren Idee jeweils an ein sprachliches Phänomen anknüpft; 20 automatisch erzeugte, klar markierte Platzhalter-Motive
- **Wellenform-Modus** (Zeitbereichsdaten des AnalyserNode + Lautstärkeverlauf) und **Rhythmus-Modus** (Formen je gespielter Note, Ringe je Schlag, Frequenzbänder) – beides aus echten Audiodaten bzw. echten Musikereignissen
- **Klangsignet**: grafische Partitur, direkt aus den Noten berechnet
- Eigene MP3/WAV/OGG-Dateien können jederzeit eingebunden werden

### Klanglabor (`#/klanglabor`)
Motiv aller Kantone untersuchen (Rhythmus, Welle, Partitur-Raster mit Laufpunkt) · **eigene Stimme aufnehmen oder Audiodatei laden** → Wellenform, Lautstärkeverlauf, Pausen (≥ 0,25 s), Tonhöhenschätzung, Zeitachse. Die Aufnahme bleibt im Browser.

### Dialektvergleich (`#/vergleich/be/zh`)
Zwei Kantone nebeneinander (Farben, Wörter, Aufnahmen, Motive), **«Nacheinander abspielen»**, Seiten tauschen, Gegenüberstellung von Lautstärkeverlauf (aus gerendertem Audio), Tonhöhe und Rhythmus.

### Dialektquiz (`#/quiz`)
Vier Antworten, Lösung + Erklärung + Quelle, Punktestand, Fortschrittsbalken, Lösungskarte. Aktuell als **Demoversion** mit ausdrücklich gekennzeichneten Testfragen; Hörfragen mit echten Aufnahmen erscheinen automatisch, sobald die Datei eingetragen ist.

### Über das Projekt (`#/projekt`)
Interdisziplinärer Ansatz (BG, Musik, Gemeinsames), gestalterische Entscheidungen, vollständige Quellen- und Lizenzliste, Liste der offenen Punkte.

### Barrierefreiheit & Technik
Tastaturbedienung (Karte, Kantone, Menü, Escape schliesst), Skip-Link, ARIA-Beschriftungen, `lang`-Attribute für fr/it/rm/gsw, **reduzierte Animationen** bei entsprechender Systemeinstellung, Bedienung komplett ohne Ton möglich (globaler Stumm-Schalter), Audio startet nur nach Klick, verständliche Fehlermeldungen bei fehlenden Dateien, responsives Layout mit Smartphone-Menü.

---

## 3. Projektstruktur

```text
public/
  assets/
    audio/
      dialects/          ← eigene Sprachaufnahmen
      music/             ← eigene Kompositionen
    images/
      cantons/wappen/    ← Wappensymbole (CC BY-SA 4.0)
      illustrations/     ← eigene Illustrationen
    maps/                ← Hinweise zur Kartengrundlage
scripts/
  build-geo.mjs          ← erzeugt die Kartengeometrie aus den BFS-Daten
  copy-symbols.mjs       ← kopiert die Wappensymbole
src/
  audio/                 ← Audio-Engine, Synthesizer, Motive, Analyse
  components/            ← Karte, Visualizer, Detailansicht, …
  data/
    cantons.ts           ← DIALEKTBIBLIOTHEK (alle 26 Kantone)
    sources.ts           ← Quellenliste
    quiz.ts              ← Quizfragen
    geo/                 ← generierte Kartengeometrie
  pages/                 ← Start, Karte, Klanglabor, Vergleich, Quiz, Projekt, Wappen
  styles/                ← Designsystem (global.css = Farben & Schriften)
```

---

## 4. Inhalte pflegen – Anleitungen

### 4.1 Einen neuen Dialektbegriff hinzufügen
In `src/data/cantons.ts` beim gewünschten Kanton im Feld `words` ein Objekt ergänzen:

```ts
{
  dialect: "Anke",
  lang: "de",                       // de | fr | it | rm
  standardGerman: "Butter",
  meaning: "Kurze Erklärung …",
  scope: "Wo ist das Wort verbreitet?",   // Kantonsgrenze ≠ Dialektgrenze!
  source: "idiotikon",              // id aus src/data/sources.ts
  verification: "literatur",        // amtlich | literatur | eigen | platzhalter
},
```
Platzhalter-Einträge (`verification: "platzhalter"`) danach löschen. Neue Quellen in `src/data/sources.ts` eintragen.

### 4.2 Eine eigene Sprachaufnahme einfügen
1. Datei (MP3/WAV/OGG/M4A) nach `public/assets/audio/dialects/` kopieren, z. B. `be-gruessech.mp3` (Kleinbuchstaben, keine Leerzeichen).
2. In `src/data/cantons.ts` bei `audioExamples` den Platzhalter ersetzen:
   ```ts
   {
     id: "be-gruessech",
     title: "Begrüssung auf Berndeutsch",
     lang: "de",
     transcript: "Grüessech mitenand",
     translation: "Guten Tag zusammen",
     audioUrl: "assets/audio/dialects/be-gruessech.mp3",
     speaker: "Vorname, Ort",          // nur mit Einverständnis!
     recordedAt: "2026-11",
     consent: true,
     verification: "eigen",
   },
   ```
3. Für ein einzelnes Wort: bei diesem Wort `audioUrl: "assets/audio/dialects/…"` ergänzen.

Die Website zeigt automatisch Play-Button, Klangwelle, Pausen und Laufpunkt an.

### 4.3 Ein Musikstück einem Kanton zuordnen (Demo-Audio ersetzen)
1. Datei nach `public/assets/audio/music/` kopieren, z. B. `zh-motiv.mp3` (10–30 s).
2. In `src/data/cantons.ts` beim Kanton:
   ```ts
   music: {
     title: "Gläserne Pulse",
     audioUrl: "assets/audio/music/zh-motiv.mp3",
     composer: "Musikgruppe 4b",
     description: "Wie der Klang gestaltet wurde …",
   },
   ```
   Sobald `audioUrl` gesetzt ist, wird statt des Demo-Motivs die eigene Datei gespielt – auf der Karte, im Klanglabor, im Vergleich und in den Visualisierungen (Rhythmus-Ereignisse werden dann aus Lautstärkesprüngen erkannt).

**Alternative:** Das Demo-Motiv selbst umkomponieren – in `src/audio/motifs.ts`. Notation pro Stimme, ein Zeichen pro Rasterschritt: Zahl = Tonleiterstufe, `-` = halten, `.` = Pause. Schlagzeug: `x` laut, `o` leise, `.` Pause. Neue Motive für weitere Kantone im Objekt `HANDMADE_MOTIFS` mit der Kantons-ID (z. B. `lu`) anlegen; dann ersetzt es automatisch das Platzhalter-Motiv.

### 4.4 Ein Kantonsbild / Wappen ersetzen
- Wappen: SVG/PNG nach `public/assets/images/cantons/` legen und in `cantons.ts` das Feld `coatOfArms` anpassen (z. B. `"assets/images/cantons/be-offiziell.svg"`). Quelle + Lizenz in `sources.ts` dokumentieren.
- Eigene Illustrationen: nach `public/assets/images/illustrations/` legen und z. B. in `src/components/CantonDetail.tsx` (Abschnitt «Visuelle Gestaltung») einbinden: `<img src={assetUrl("assets/images/illustrations/bern.png")} alt="…" />`.

### 4.5 Farben und Design anpassen
- **Grundfarben, Sprachfarben, Schriften, Rundungen:** `src/styles/global.css`, Abschnitt «Tokens» (`--paper`, `--ink`, `--signal`, `--lang-de`, `--lang-fr`, `--lang-it`, `--lang-rm` …).
- **Farbe eines Kantons:** `color` in `src/data/cantons.ts` (bitte innerhalb der Farbfamilie seiner Amtssprache bleiben).
- **Grafische Strukturen der Karte:** `PATTERN_OF` und die `<pattern>`-Definitionen in `src/components/SwissMap.tsx`.
- **Kartenstile:** `src/styles/components.css`, Abschnitt «Karte».

### 4.6 Eine neue Quizfrage hinzufügen
In `src/data/quiz.ts` ein Objekt ergänzen:
```ts
{
  id: "rec-zh-1",
  type: "recording",                       // recording | motif | text
  prompt: "Aus welchem Kanton stammt diese Aufnahme?",
  audioUrl: "assets/audio/dialects/zh-beispiel.mp3",
  options: ["Zürich", "Bern", "Luzern", "St. Gallen"],
  answer: 0,                               // Index der richtigen Antwort
  explanation: "Woran man es erkennt …",
  revealCanton: "zh",
  source: "eigen",
  verification: "eigen",
  demo: false,
},
```
Fragen vom Typ `recording` ohne `audioUrl` werden automatisch ausgeblendet.

---

## 5. Externe Quellen und Lizenzen

| Inhalt | Quelle | Lizenz |
| --- | --- | --- |
| Kantonsgrenzen, Seen, Landesgrenze | Bundesamt für Statistik (BFS), Generalisierte Gemeindegrenzen, Stand 1.1.2026, Basis swisstopo | OGD – freie Nutzung mit Quellenangabe |
| TopoJSON-Aufbereitung | [swiss-maps](https://github.com/interactivethings/swiss-maps) 4.7.0, Interactive Things | BSD-3-Clause |
| Wappensymbole | [ch-canton-symbols](https://github.com/nzzdev/ch-canton-symbols) 1.3.2, NZZ | CC BY-SA 4.0 (Lizenztext in `public/assets/images/cantons/wappen/`) |
| Schriften | Fraunces, Inter (via Fontsource) | SIL Open Font License 1.1 |
| Software | React, Vite, TypeScript, d3-geo, topojson-client | MIT / ISC / Apache-2.0 |
| Sprachliche Angaben | Schweizerisches Idiotikon; Kleiner Sprachatlas der deutschen Schweiz (Christen/Glaser/Friedli); Sprachatlas der deutschen Schweiz; Dictionnaire suisse romand (Thibault); VSI; OLSI; Lia Rumantscha / Pledari Grond; DRG | Zitate/Verweise – siehe `src/data/sources.ts` |
| Amtliche Angaben | Bundesverfassung Art. 4 & 70; Kantonsverfassungen BE (Art. 6) und GR (Art. 3); BFS Sprachenstatistik | amtlich |
| Demo-Klänge | eigene Programmierung (Web Audio API) | eigene Gestaltung – **künstlerische Interpretation, keine traditionelle Musik** |

Hinweis zu den Wappen: Kantonswappen sind in der Schweiz durch das Wappenschutzgesetz (WSchG) geschützt; die Verwendung in einem nicht-kommerziellen Schulprojekt zu Informationszwecken ist üblich, für eine öffentliche Veröffentlichung bitte mit der Lehrperson abklären.

---

## 6. Prüfstatus der Inhalte

Jede Angabe trägt einen sichtbaren Status:

- **Amtlich** – Verfassung, BFS, Kanton
- **Literatur – prüfen** – in der genannten Fachliteratur dokumentiert; vor der Präsentation am Original (Seite/Karte/Stichwort) nachschlagen und bestätigen
- **Eigene Gestaltung** – Komposition/Gestaltung der Projektgruppe
- **Platzhalter** – noch nicht recherchiert, muss ersetzt werden

Es wurden **keine Sprachaufnahmen erfunden**. Alle Aufnahme-Felder sind Platzhalter.

---

## 7. Was für die Schlusspräsentation noch fehlt

- [ ] Eigene **Sprachaufnahmen** für die sechs Beispielkantone (mit schriftlichem Einverständnis der Sprecher:innen; mehrsprachige Kantone: je Sprache eine Aufnahme)
- [ ] Eigene **Kompositionen/Aufnahmen** der Musikgruppe (mind. für die sechs Beispielkantone; ideal für alle 26)
- [ ] Alle Angaben mit Status «Literatur – prüfen» am Original überprüfen und Seiten-/Kartenangaben in `sources.ts` ergänzen
- [ ] Recherchierte Wörter und Beschreibungen für die **20 Platzhalter-Kantone**
- [ ] Mundartwort im *dialetto ticinese* (VSI) und ein walserdeutsches Wort für Graubünden
- [ ] Eigene **Illustrationen** der BG-Gruppe (`public/assets/images/illustrations/`)
- [ ] Optional: offizielle Wappen statt der vereinfachten Symbole
- [ ] **Hörfragen** mit echten Aufnahmen im Quiz
- [ ] Namen der Projektgruppe, Klasse, Lehrpersonen auf der Seite «Über das Projekt» ergänzen
- [ ] Abschlusstest auf den Präsentationsgeräten (Beamer, Tablets, Lautsprecher)

---

## 8. Getestet

- `npm run build` ohne TypeScript- oder Build-Fehler
- Automatisierter Browsertest (Chromium/Playwright): Startseite, Karte (Auswahl, Fokus, Wechsel Bern → Zürich mit Klangwechsel), Klanglabor, Vergleich, Quiz, Wappensammlung, Über das Projekt – ohne Konsolenfehler
- Smartphone-Ansicht (iPhone-13-Emulation): Menü, Karte, Detailansicht, kein horizontales Scrollen
