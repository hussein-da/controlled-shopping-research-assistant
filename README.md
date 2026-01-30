# Controlled Shopping Research Assistant (CSRA)

Ein kontrolliertes Forschungsartefakt zur Untersuchung von Nudging/Agentic Commerce im Rahmen einer Bachelorarbeit. Diese Plattform simuliert einen KI-Shopping-Assistenten in einer kontrollierten Studienumgebung.

## Projektüberblick

**CSRA** ist ein wissenschaftliches Forschungswerkzeug, das einen Shopping-Assistenten-Prototypen mit einem strukturierten Studien-Wrapper kombiniert. Es dient der Untersuchung, wie KI-gestützte Kaufempfehlungen die Entscheidungsfindung beeinflussen.

**Wichtige Eigenschaften:**
- Kein echter Web-Zugriff oder externe APIs
- Kein echtes Shopping - nur UI und kontrollierte Workflows
- Deterministisches Verhalten für reproduzierbare Forschung
- Vollständig anonymisierte Datenerfassung (nur UUID-basierte Participant-IDs)

**Hinweis:** Alle Produkte und Quellen sind simuliert. Es finden keine echten Käufe statt.

## Tech-Stack

| Komponente | Technologie | Version |
|------------|-------------|---------|
| **Frontend** | React + TypeScript | 18.3.x |
| **Styling** | Tailwind CSS + shadcn/ui | 3.4.x |
| **Routing** | wouter | 3.3.x |
| **Backend** | Express.js | 4.21.x |
| **Build** | Vite | 7.3.x |
| **Storage** | File-based (JSONL) | - |
| **Runtime** | Node.js | >=18.0.0 |

**Storage-Modi:**
- **Standard (lokal):** Dateibasierte Speicherung in `./data/` (JSONL-Format)
- **Optional (Cloud):** PostgreSQL via `DATABASE_URL` Environment-Variable

## Study-Flow (User Journey)

Der vollständige Ablauf für Teilnehmer:

```
/start → /consent → /pre → /task → /assistant → /guide → /choice → /post → /debrief
```

### Schritt-für-Schritt

| Schritt | Route | Beschreibung | Erfasste Daten |
|---------|-------|--------------|----------------|
| 1 | `/start` | Willkommensseite | - |
| 2 | `/consent` | Einwilligungserklärung | Altersbestätigung, Datenverarbeitung |
| 3 | `/pre` | Pre-Survey (5 Items) | Alter, Shopping-Frequenz, LLM-Nutzung |
| 4 | `/task` | Aufgabeninstruktionen | - |
| 5 | `/assistant` | Shopping-Assistent Prototyp | Anforderungen, Produktbewertungen |
| 6 | `/guide` | Buyer's Guide Anzeige | Lesezeit |
| 7 | `/choice` | Produktauswahl (6 Optionen) | Gewähltes Produkt |
| 8 | `/post` | Post-Survey (21 Items) | Mechanismus-Wahrnehmung, Outcomes |
| 9 | `/debrief` | Debriefing + Feedback | Optionale Notizen |

### Shopping-Assistent Details

Der Hauptprototyp unter `/assistant` umfasst:
- 4 Requirement-Fragen (Menge, Budget, Attribute, Mahlart)
- Produktvorschau und Bewertungsphase (5 Produkte: R01-R05)
- 10-Sekunden Skip-Timer pro Frage
- "Etwas anderes..."-Option für freie Texteingabe

## Datenmodell & Speicherung

### Erfasste Datenfelder

**Session-Daten:**
- `participantId`: Anonyme UUID
- `createdAt`, `updatedAt`: Zeitstempel
- `consentAge`, `consentData`: Einwilligungsstatus
- `preSurvey`: Antworten Pre-Survey (5 Items)
- `postSurvey`: Antworten Post-Survey (21 Items)
- `requirements`: Gewählte Produktanforderungen
- `deviationFlags`: Abweichungen von normalisierten Zielkriterien
- `productRatings`: Bewertungen der Beispielprodukte (R01-R05)
- `choiceProductId`: Final gewähltes Produkt (P01-P06)
- `guideReadSeconds`: Lesezeit des Buyer's Guide
- `completedAt`: Abschluss-Zeitstempel
- `participantNotes`: Optionales Feedback

**Event-Daten:**
- `eventType`: Art des Events (navigation, click, selection, etc.)
- `step`: Aktueller Studien-Schritt
- `eventData`: Kontextdaten zum Event
- `timestamp`: Zeitpunkt

### Speicherort & Format

```
./data/
├── sessions.jsonl    # Alle Session-Daten (eine JSON-Zeile pro Session)
└── events.jsonl      # Alle Events (eine JSON-Zeile pro Event)
```

**Format:** JSONL (JSON Lines) - jede Zeile ist ein valides JSON-Objekt. Ideal für Append-Only-Schreibvorgänge und einfache Verarbeitung.

### Datenschutz

- **Keine personenbezogenen Daten (PII):** Keine Namen, E-Mails, IP-Adressen
- **Anonymisierung:** Nur UUID-basierte Participant-IDs
- **Lokale Speicherung:** Daten bleiben auf dem lokalen System
- **Reset möglich:** Vollständiges Löschen aller Daten jederzeit möglich

## Installation & Ausführung

### Voraussetzungen

- **Node.js:** Version 18.0.0 oder höher
- **npm:** Wird mit Node.js installiert
- **Git:** Für Repository-Klon

### Schritt-für-Schritt Installation

```bash
# 1. Repository klonen
git clone https://github.com/YOUR_USERNAME/controlled-shopping-research-assistant.git

# 2. In Projektordner wechseln
cd controlled-shopping-research-assistant

# 3. Dependencies installieren
npm install

# 4. Anwendung starten
npm run dev
```

Die Anwendung ist dann verfügbar unter: **http://localhost:5000**

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
| `SESSION_SECRET` | Express Session Secret | auto-generiert |

### Troubleshooting

| Problem | Lösung |
|---------|--------|
| Port 5000 belegt | Anderen Port verwenden oder Prozess beenden |
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
