# Controlled Shopping Research Assistant (CSRA)

Ein kontrolliertes Forschungsartefakt zur Untersuchung von Nudging/Agentic Commerce im Rahmen einer Bachelorarbeit. Diese Plattform simuliert einen KI-Shopping-Assistenten in einer kontrollierten Studienumgebung.

## Projektüberblick

**CSRA** ist ein wissenschaftliches Forschungswerkzeug, das einen Shopping-Assistenten-Prototypen mit einem strukturierten Studien-Wrapper kombiniert. Es dient der Untersuchung, wie KI-gestützte Kaufempfehlungen die Entscheidungsfindung beeinflussen.

**Wichtige Eigenschaften:**
- ✅ Kein echter Web-Zugriff oder externe APIs
- ✅ Kein echtes Shopping - nur UI und kontrollierte Workflows
- ✅ Deterministisches Verhalten für reproduzierbare Forschung
- ✅ Vollständig anonymisierte Datenerfassung (nur UUID-basierte Participant-IDs)
- ✅ Single-Variant Design (kein A/B-Testing)

**Hinweis:** Alle Produkte und Quellen sind simuliert. Es finden keine echten Käufe statt.

## Tech-Stack

| Komponente | Technologie | Version |
|------------|-------------|---------|
| **Frontend** | React + TypeScript | 18.3.x |
| **Styling** | Tailwind CSS + shadcn/ui | 3.4.x |
| **Routing** | wouter | 3.3.x |
| **Backend** | Express.js | 4.21.x |
| **Build-Tool** | Vite | 7.3.x |
| **Storage** | File-based (JSONL) | - |
| **Runtime** | Node.js | >=18.0.0 |

**Storage-Modi:**
- **Standard (lokal):** Dateibasierte Speicherung in `./data/` (JSONL-Format)
- **Optional (Cloud):** PostgreSQL via `DATABASE_URL` Environment-Variable

---

## Installation & Ausführung

### Voraussetzungen

- **Node.js:** Version 18.0.0 oder höher
- **npm:** Wird mit Node.js automatisch installiert
- **Git:** Für Repository-Klon

### Schritt-für-Schritt Installation

```bash
# 1. Repository klonen
git clone https://github.com/YOUR_USERNAME/controlled-shopping-research-assistant.git
cd controlled-shopping-research-assistant

# 2. Dependencies installieren (ca. 5-10 Minuten beim ersten Mal)
npm install

# 3. Anwendung im Development-Mode starten
npm run dev
```

**Ausgabe nach `npm run dev`:**
```
✅ Server läuft auf http://localhost:5000
📁 Daten werden gespeichert in: ./data/
🔄 Development Mode - Auto-Reload aktiv
🛑 Zum Beenden: Drücke Ctrl+C
🌐 Browser öffnet sich automatisch...
```

Die Anwendung ist dann verfügbar unter: **http://localhost:5000**

Der Browser öffnet sich **automatisch**. Falls nicht, öffne manuell: `http://localhost:5000`

### Environment-Variablen (optional)

Erstelle `.env` aus `.env.example` falls benötigt:

```bash
cp .env.example .env
```

**Verfügbare Variablen:**

| Variable | Beschreibung | Default |
|----------|--------------|---------|
| `ADMIN_PASSWORD` | Admin-Bereich Passwort | `study-admin-2026` |
| `DATABASE_URL` | PostgreSQL URL (optional) | - (verwendet File-Storage) |
| `PORT` | Server Port | `5000` |
| `SESSION_SECRET` | Express Session Secret | auto-generiert |

### Datenbank & Datenspeicherung

**Standardmodus:** Dateien in `./data/`
```
./data/
├── sessions.jsonl    # Alle Session-Daten (eine JSON-Zeile pro Session)
└── events.jsonl      # Alle Events (eine JSON-Zeile pro Event)
```

**Format:** JSONL (JSON Lines) - jede Zeile ist ein valides JSON-Objekt. Ideal für Append-Only-Schreibvorgänge und einfache Verarbeitung.

### Troubleshooting

| Problem | Lösung |
|---------|--------|
| Port 5000 belegt | `npm run dev` stoppt automatisch und versucht einen anderen Port |
| `npm install` sehr langsam | Nutze `npm ci --ignore-engines` für schneller Installation (Windows) |
| Browser öffnet sich nicht | Öffne manuell: `http://localhost:5000` |
| Node.js Version zu alt | `npm warn EBADENGINE` ist nur eine Warnung, sollte trotzdem funktionieren |

---

## Study-Flow (User Journey)

Der vollständige Ablauf für Teilnehmer:

```
/start → /consent → /pre → /task → /assistant → /guide → /choice → /post → /debrief
```

### Detaillierter Schritt-für-Schritt Ablauf

| Schritt | Route | Beschreibung | Erfasste Daten |
|---------|-------|--------------|----------------|
| 1 | `/start` | Willkommensseite mit Thumbnail.jpg Background | - |
| 2 | `/consent` | Einwilligungserklärung mit Checkboxes | Altersbestätigung, Datenverarbeitung |
| 3 | `/pre` | Pre-Survey (5 Items) | Alter (18-99), Shopping-Frequenz, LLM-Nutzung |
| 4 | `/task` | Aufgabeninstruktionen mit Zielkriterien | - |
| 5 | `/assistant` | Shopping-Assistent Prototyp | Anforderungen, Produktbewertungen |
| 6 | `/guide` | Buyer's Guide mit Produkttabelle | Lesezeit (Sekunden) |
| 7 | `/choice` | Produktauswahl (6 Optionen) | Gewähltes Produkt (P01-P06) |
| 8 | `/post` | Post-Survey (21 Items, Q1-Q21) | Mechanism-Wahrnehmung, Outcomes |
| 9 | `/debrief` | Debriefing + Feedback | Optionale Notizen, Participant ID |

---

## Shopping-Assistent (Hauptprototyp)

Der Kern der Studie befindet sich unter `/assistant`:

### Flow

1. **Start:** "Was liegt heute an?" mit zentriertem Chat-Input
2. **Mode-Selection:** Plus-Button → "Shopping-Assistent" auswählen
3. **Loading:** Schwarzer Punkt Animation + "Starting shopping research"
4. **Anforderungen (4 Fragen)** - Mit 10-Sekunden Skip-Timer pro Frage:
   - **R1 Mengenbedarf:** 250g, 250-500g, 500-1000g, >1kg
   - **R2 Budget:** bis 8 €, bis 12 €, bis 20 €, 20 € +
   - **R3 Attribute:** Bio/Fairtrade, schneller Versand, säurearm, Single Origin
   - **R4 Mahlart:** ganze Bohnen, Filter gemahlen, Espresso gemahlen, Pads/Kapseln
   - **"Etwas anderes..."-Button** für freie Texteingabe
5. **Review Gate:** Produktcollage + "Vorschau & bewerten" Button
6. **Produktkarten:** 5 echte Produkte (R01-R05) mit Like/Dislike Ratings
   - Nutzt echte Produktbilder aus `attached_assets/`
   - Ablehnungsgründe: Zu teuer, Röstgrad passt nicht, Marke unbekannt, Eigenschaften fehlen, Etwas anderes
7. **Transition:** "Thanks for feedback" + Fortschrittsbalken
8. **Automatische Navigation zu /guide**

### Rating-Produkte (R01-R05)

5 echte Kaffeprodukte - verwendet **nur** in der Rating-Phase:
- **R01:** EDEKA Bio Caffe Crema (12,70€, 1kg)
- **R02:** Melitta Barista Classic Crema (11,45€, 1kg)
- **R03:** Jacobs Krönung Signature Classic (9,99€, 500g)
- **R04:** Berliner Kaffeerösterei Azúcar Espresso (11,95€, 250g)
- **R05:** Nicaragua Flores del Café (ab 9,90€, Single Origin)

Bilder: `attached_assets/R01*.jpg` bis `attached_assets/R05*.jpg`

---

## Produkt-Auswahl & Buyer's Guide

### Guide/Choice-Produkte (P01-P06)

6 **fiktive** Kaffeprodukte - verwendet in Buyer's Guide und finaler Auswahl:
- **P01:** PachaLumo – Chanchamayo Bio (9,95€, hell, Bio/Fairtrade)
- **P02:** Riftara – Yirgacheffe Flora (9,95€, hell, Bio/Fairtrade)
- **P03:** Kuntaro – Cocoa Dark (9,95€, dunkel, Bio/Fairtrade)
- **P04:** Bonavia – City Blend (9,95€, mittel, Bio/Fairtrade)
- **P05:** BuenaRosa – Pink Bourbon (9,95€, hell, Bio/Fairtrade)
- **P06:** Kebena Forest – Regenwald Bio (9,95€, mittel, Bio/Fairtrade)

**Alle:** 250g, ganze Bohnen, 9,95€

### Normalisierte Zielkriterien

Unabhängig von Benutzerauswahl verwendet der Guide **immer:**
- **Packungsgröße:** 250g
- **Budget:** bis 12 €
- **Attribute:** Bio/Fairtrade
- **Mahlart:** ganze Bohnen

Benutzerauswahl werden mit `deviation_flags` geloggt zur Analyse.

---

## Survey-Fragen

### Pre-Survey (5 Items)

- **P1:** Alter (numerische Eingabe, 18-99)
- **P4:** Online-Shopping Häufigkeit (selten, monatlich, wöchentlich, mehrmals wöchentlich)
- **P7:** LLM-Nutzung (nie, selten, wöchentlich, täglich)
- **P8:** LLM für Kaufrecherche (ja, nein, unsicher)
- **P9:** Vertrautheit mit KI-Shopping-Assistenten (7-Point Likert)

### Post-Survey (21 Items, Q1-Q21)

- **Q1-Q2:** Präsentation als "beste Wahl" (ja/nein/unsicher + Likert)
- **Q3:** Welches Produkt wirkte am stärksten empfohlen? (Produktauswahl)
- **Q4:** Wie genau wurde der Bericht gelesen? (komplett/überflogen/kaum)
- **Q5-Q14:** Mechanism Perception (9 Likert-Items)
- **Q15-Q20:** Outcomes (6 Likert-Items)
- **Q21:** Influences (Multi-Select mit "Sonstiges" Option)

---

## Datenmodell & Speicherung

### Erfasste Session-Daten

```json
{
  "participantId": "uuid",
  "createdAt": "ISO-Timestamp",
  "updatedAt": "ISO-Timestamp",
  "consentAge": boolean,
  "consentData": boolean,
  "preSurvey": { ... },
  "postSurvey": { ... },
  "requirements": {
    "r1_amount": [...],
    "r2_budget": [...],
    "r3_attributes": [...],
    "r4_grind": [...]
  },
  "normalizedTarget": { ... },
  "deviationFlags": { ... },
  "productRatings": [ ... ],
  "guideReadSeconds": number,
  "choiceProductId": "P01-P06",
  "completedAt": "ISO-Timestamp",
  "participantNotes": string | null
}
```

### Erfasste Event-Daten

Jeder Benutzer-Interaktion wird ein Event geloggt:
- `eventType`: Art des Events (navigation, click, selection, rating, etc.)
- `step`: Aktueller Studien-Schritt
- `eventData`: Kontextspezifische Daten
- `timestamp`: Zeitpunkt der Aktion

---

## Datenschutz & Anonymisierung

### ✅ Datenschutz-Merkmale

- **Keine personenbezogenen Daten (PII):** Keine Namen, E-Mails, IP-Adressen
- **Anonymisierung:** Nur UUID-basierte Participant-IDs
- **Lokale Speicherung:** Alle Daten bleiben auf dem lokalen System
- **Einfacher Reset:** Lösche einfach `/data/` Folder für kompletten Datenlöschung
- **Transparenz:** Participant ID wird auf Debrief-Seite angezeigt für Löschanfragen

### Datenfluss

1. Session erstellt → UUID generiert
2. Daten gesammelt → JSONL-Datei geschrieben
3. Kein Upload → Bleibt lokal
4. Admin-Zugang → Export als CSV/JSONL möglich

---

## API Routes (Backend)

### Session Management

- `POST /api/session` - Neue Study Session erstellen
- `GET /api/session/:participantId` - Session abrufen
- `PATCH /api/session/:participantId/consent` - Einwilligungsstatus aktualisieren
- `PATCH /api/session/:participantId/pre-survey` - Pre-Survey Daten speichern
- `PATCH /api/session/:participantId/requirements` - Anforderungen speichern (mit deviation_flags)
- `POST /api/session/:participantId/rating` - Produktbewertung hinzufügen
- `PATCH /api/session/:participantId/guide-time` - Guide-Lesezeit speichern
- `PATCH /api/session/:participantId/choice` - Finale Produktwahl speichern
- `PATCH /api/session/:participantId/post-survey` - Post-Survey Daten speichern
- `PATCH /api/session/:participantId/complete` - Session als abgeschlossen markieren
- `PATCH /api/session/:participantId/notes` - Participant Notes speichern
- `POST /api/session/:participantId/event` - Event mit Step-Kontext loggen

### Admin & Export

- `GET /api/admin/export/jsonl?password=<pw>` - Alle Daten als JSONL exportieren
- `GET /api/admin/export/csv?password=<pw>` - Alle Daten als CSV exportieren
- `GET /api/admin/health` - Health-Check mit Session-Statistiken

---

## Build & Produktiv-Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Erstellt optimierte Production-Bundles in `./dist/`

### Production Starten

```bash
npm start
```

Setzt `NODE_ENV=production` und startet kompilierten Server.

---

## Projektstruktur

```
.
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # React Komponenten
│   │   │   ├── shopping/      # Study-Flow Seiten
│   │   │   └── ui/            # shadcn/ui Komponenten
│   │   ├── pages/             # Studien-Seiten
│   │   ├── lib/               # Utilities & Context
│   │   ├── hooks/             # Custom React Hooks
│   │   └── main.tsx           # Entry Point
│   └── index.html
│
├── server/                    # Express Backend
│   ├── index.ts               # Server Entry Point
│   ├── routes.ts              # API Routes
│   ├── db.ts                  # Datenbank-Zugriff
│   ├── storage.ts             # File/DB Storage
│   └── vite.ts                # Vite Dev Server Integration
│
├── shared/                    # Geteilter Code
│   └── schema.ts              # Datenmodelle & Zod Schemas
│
├── data/                      # 📁 Lokale Daten (in .gitignore)
│   ├── sessions.jsonl
│   └── events.jsonl
│
├── attached_assets/           # Produktbilder
│   ├── R01*.jpg
│   ├── R02*.jpg
│   └── ...
│
├── package.json               # Dependencies & Scripts
├── tsconfig.json              # TypeScript Config
├── vite.config.ts             # Vite Build Config
├── tailwind.config.ts         # Tailwind CSS Config
├── drizzle.config.ts          # Drizzle ORM Config (optional)
├── .gitignore                 # Git Ignore Rules
├── README.md                  # 📄 Diese Datei
└── LICENSE                    # Lizenz
```

---

## Git & GitHub Vorbereitung

### ✅ Git-Ready Checklist

- ✅ **Sensible Daten:** `./data/` ist in `.gitignore` (wird nicht hochgeladen)
- ✅ **Environment:** `.env.example` exists, `.env` wird nicht committed
- ✅ **node_modules:** In `.gitignore` - nicht committen
- ✅ **Build Output:** `./dist/` in `.gitignore`

### GitHub Push

```bash
# 1. Git Repository initialisieren (falls noch nicht geschehen)
git init

# 2. Remote hinzufügen
git remote add origin https://github.com/YOUR_USERNAME/controlled-shopping-research-assistant.git

# 3. Alle Dateien stagen (außer .gitignore)
git add .

# 4. Initial Commit
git commit -m "Initial commit: CSRA - Controlled Shopping Research Assistant"

# 5. Main Branch erstellen & pushen
git branch -M main
git push -u origin main
```

---

## Development Tools

### Type Checking
```bash
npm run check
```

### Database Push (falls PostgreSQL genutzt wird)
```bash
npm run db:push
```

### Data Export
```bash
# JSONL Export
curl "http://localhost:5000/api/admin/export/jsonl?password=study-admin-2026"

# CSV Export
curl "http://localhost:5000/api/admin/export/csv?password=study-admin-2026"
```

---

## FAQ

**F: Werden meine Testdaten auf GitHub hochgeladen?**  
A: Nein! Der `./data/` Ordner ist in `.gitignore`. Nur der Code wird hochgeladen.

**F: Wie lange läuft `npm install`?**  
A: Beim ersten Mal 5-10 Minuten. Danach sehr schnell (`npm ci`).

**F: Kann ich die App auch offline nutzen?**  
A: Ja! Alles läuft lokal. Kein Internet nötig nach dem npm install.

**F: Was ist der Default Admin-Passwort?**  
A: `study-admin-2026` (änderbar via `ADMIN_PASSWORD` Environment-Variable)

**F: Wie lösche ich alle Testdaten?**  
A: `rm -r ./data/` und neu starten - neue `data/` Folder wird beim Start erstellt.

---

## Lizenz

MIT License - siehe LICENSE Datei

---

## Support & Kontakt

Für Fragen zur Implementierung oder Bugs: [GitHub Issues erstellen]

Für Datenlöschanfragen: Participant ID von der Debrief-Seite verwenden

| Node.js Version zu alt | Node.js 18+ installieren: `nvm install 18` |
| Permission denied auf data/ | `mkdir -p data && chmod 755 data` |
| Module not found | `rm -rf node_modules && npm install` |
| ENOENT data/sessions.jsonl | Normal beim ersten Start - Ordner wird automatisch erstellt |

## Admin & Export

### Admin-Zugang

1. **Admin-Button:** Kleines Zahnrad-Icon unten rechts auf allen Seiten
2. **Passwort eingeben:** Standard ist `study-admin-2026`
3. **Navigation:** "Zur Studie" Button führt zurück zum Study-Flow

### Admin-Übersicht

Die Admin-Seite zeigt alle Teilnehmer-Sessions mit folgenden Spalten:

| Spalte | Beschreibung |
|--------|-------------|
| ID | Participant UUID (gekürzt) |
| Alter | Alter aus Pre-Survey |
| LLM | LLM-Nutzungshäufigkeit |
| Guide-Zeit | Lesezeit Buyer's Guide (Sekunden) |
| Wahl | Gewähltes Produkt (P01-P06) |
| Status | Abschlussstatus |
| Erstellt | Session-Erstellungszeitpunkt |
| Events | Anzahl getrackte Events |
| Aktionen | Details (Auge), ID kopieren |

### Detailansicht (Auge-Icon)

Klick auf das Auge-Icon zeigt alle Daten einer Session:
- Zeitstempel (erstellt, abgeschlossen)
- Consent-Status
- Pre-Survey Antworten
- Requirement-Antworten mit Deviation-Flags
- Produktbewertungen (R01-R05)
- Guide-Timing-Daten
- Finale Produktwahl
- Post-Survey Antworten
- Event-Log

### Export-Funktionen

Export-Buttons in der Admin-Oberfläche:

- **JSONL Export:** Ein JSON-Objekt pro Zeile, enthält alle Session-Daten
- **CSV Export:** Tabellenformat für Excel/SPSS-Analyse

Downloads werden vom Browser gespeichert:
- `csra-export-YYYY-MM-DD.jsonl`
- `csra-export-YYYY-MM-DD.csv`

## Reset / Clean Slate

### Lokale Daten löschen

```bash
# Manuell: data-Ordner leeren
rm -rf data/*

# Alternative: Ordner löschen (wird beim nächsten Start neu erstellt)
rm -rf data/
```

**Hinweis:** Reset löscht nur Studiendaten, nicht den Code.

### Für neue Testläufe

1. Daten löschen (siehe oben)
2. Anwendung neu starten: `npm run dev`
3. Studie beginnt automatisch mit leerer Datenbank

## Optionaler DB-Modus

Falls PostgreSQL gewünscht ist (z.B. für Cloud-Deployment):

1. PostgreSQL-Datenbank bereitstellen
2. `DATABASE_URL` in `.env` setzen:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```
3. Schema pushen: `npm run db:push`
4. Anwendung starten

**Wichtig:** Der Default-Modus ist File-Storage. PostgreSQL ist nur für spezielle Anforderungen gedacht.

## Projektstruktur

```
├── client/src/
│   ├── components/         # UI-Komponenten
│   │   ├── shopping/       # Shopping-Assistent Komponenten
│   │   └── ui/             # shadcn/ui Basiskomponenten
│   ├── pages/              # Seiten (Study-Flow + Admin)
│   └── lib/                # Utilities und Context
├── server/
│   ├── index.ts            # Express Server Entry
│   ├── routes.ts           # API Endpoints
│   ├── storage.ts          # Storage Interface (wählt File oder DB)
│   └── file-storage.ts     # File-based Implementation
├── shared/
│   └── schema.ts           # Datenmodelle und Typen
├── scripts/                # Utility Scripts
├── data/                   # Lokale Studiendaten (gitignored)
└── attached_assets/        # Statische Bilder
```

## JSON-Feld-Dokumentation

### Pre-Survey (`preSurvey`)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `p1_age` | number | Alter (18-99) |
| `p4_online_shopping` | string | selten/monatlich/wöchentlich/mehrmals wöchentlich |
| `p7_llm_usage` | string | nie/selten/wöchentlich/täglich |
| `p8_llm_purchase` | string | ja/nein/unsicher |
| `p9_familiarity` | number | KI-Assistenten-Vertrautheit (1-7 Likert) |

### Requirements (`requirements`)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `r1_amount` | string[] | Mengenbedarf-Auswahl |
| `r2_budget` | string[] | Budget-Auswahl |
| `r3_attributes` | string[] | Attribut-Auswahl |
| `r4_grind` | string[] | Mahlart-Auswahl |

### Deviation Flags (`deviationFlags`)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `r1_deviated` | boolean | Abweichung bei Menge |
| `r2_deviated` | boolean | Abweichung bei Budget |
| `r3_deviated` | boolean | Abweichung bei Attributen |
| `r4_deviated` | boolean | Abweichung bei Mahlart |

### Product Ratings (`productRatings`)

Array von Rating-Objekten:

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `productId` | string | Produkt-ID (R01-R05) |
| `action` | string | "more_like_this" oder "not_interested" |
| `reason` | string | Ablehnungsgrund (falls not_interested) |
| `timestamp` | number | Unix-Zeitstempel |

### Post-Survey (`postSurvey`)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `q1_best_choice` | string | ja/nein/unsicher |
| `q2_best_choice_likert` | number | 1-7 Likert |
| `q3_which_product` | string | Wahrgenommen empfohlenes Produkt |
| `q4_read_carefully` | string | komplett/überflogen/kaum |
| `q5-q20` | number | Diverse 1-7 Likert Items |
| `q21_influences` | string[] | Multi-Select Einflussfaktoren |

## Prüfer-Testcheckliste (5 Minuten)

1. **Starten**
   ```bash
   npm install && npm run dev
   ```
   Browser öffnen: http://localhost:5000

2. **Survey durchführen**
   - "Studie starten" klicken
   - Einwilligung geben
   - Pre-Survey ausfüllen
   - Durch Shopping-Assistent navigieren
   - Produkt wählen
   - Post-Survey ausfüllen

3. **Admin öffnen**
   - Zahnrad-Icon unten rechts klicken
   - Passwort: `study-admin-2026`

4. **Ergebnisse sehen**
   - Session in Liste finden
   - Auge-Icon für Details klicken

5. **Export ziehen**
   - "JSONL" oder "CSV" Button klicken
   - Download prüfen

6. **Reset testen**
   ```bash
   rm -rf data/
   ```
   Anwendung neu starten - Admin zeigt leere Liste

## Reproduzierbarkeit

### Getestete Konfiguration

- Node.js 18.x / 20.x
- npm 9.x / 10.x
- macOS / Linux / Windows (WSL)

### Zitation

Falls Sie diese Plattform in Ihrer Forschung verwenden:

```
Daoud, H. (2026). Nudging in Agentic Commerce: A Study on Choice Architecture 
in AI Shopping Assistants. Bachelor's Thesis, Hochschule Ruhr West.
```

## Lizenz

MIT License - siehe [LICENSE](LICENSE)

## Kontakt

**Studienleitung:**  
Hussein Daoud (B.Sc. E-Commerce, Hochschule Ruhr West)  
E-Mail: hussein.daoud@stud.hs-ruhrwest.de

---

*Dieses Artefakt wurde im Rahmen einer Bachelorarbeit zum Thema Nudging/Agentic Commerce entwickelt.*
