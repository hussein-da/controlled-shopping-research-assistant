# Shopping Research Study Platform

A complete research study platform for a Bachelor's thesis on Nudging/Agentic Commerce. This platform combines a pixel-perfect ChatGPT Shopping Assistant prototype with a structured study wrapper for controlled research.

## Overview

This is a controlled research artifact:
- NO real web search
- NO external APIs  
- NO actual shopping
- Only UI and controlled workflows for deterministic research

## Study Flow (Updated January 2026)

The complete participant flow:

```
/start → /consent → /pre → /task → /assistant → /guide → /choice → /post → /debrief
```

### Study Pages

1. **Study Start** (`/start`): Welcome page with "Studie starten" button (Schritt 1)
2. **Consent** (`/consent`): Consent form with checkboxes for age and data processing (Schritt 2)
3. **Pre-Survey** (`/pre`): 9 items (P1-P9) including demographics, shopping habits, LLM usage (Schritt 3)
4. **Task** (`/task`): Task instructions with Zielkriterien (Schritt 4)
5. **Assistant** (`/assistant`): Shopping research prototype (Schritt 5)
6. **Guide** (`/guide`): Buyer's Guide display - A/B conditions show different text (Schritt 6)
7. **Choice** (`/choice`): Final product selection from Top-6 products (Schritt 7)
8. **Post-Survey** (`/post`): 22+ items including MC1-MC4, N1-N10, O1-O8 (Schritt 8)
9. **Debrief** (`/debrief`): Study debrief with explanation (Schritt 9)
10. **Admin** (`/admin?password=<pw>`): Export study data as CSV/JSONL

### A/B Conditions

Each session is randomly assigned to:
- **A_OPENAI_GUIDE**: Guide text styled like OpenAI with "Beste Wahl" recommendation
- **B_NEUTRAL_GUIDE**: Neutral guide text without highlighting

## Product Corpus (P01-P10)

10 fictional coffee products:
- **Top-6** (P01-P06): Meet normalized target criteria (250g, bis 12€, Bio/Fairtrade, ganze Bohnen, hell)
- **Distractors** (P07-P10): Do not meet criteria

## Normalized Target Criteria

Regardless of user selections, the guide always uses:
- Budget: bis 12 €
- Röstung: hell  
- Mahlart: ganze Bohnen
- Attribute: Bio/Fairtrade
- Nutzung: Vollautomat

User selections are logged with deviation flags for analysis.

## Shopping Assistant Flow

The main research prototype at `/assistant`:

1. **Start**: "Was liegt heute an?" with centered chat input
2. **Mode Selection**: Click Plus button → Select "Shopping-Assistent"
3. **Loading**: Black dot animation + "Starting shopping research"
4. **Requirements (4 Questions)**:
   - R1 Budget: bis 8 €, bis 12 €, bis 20 €, 20 € plus
   - R2 Röstung: hell, mittel, dunkel, entkoffeiniert
   - R3 Mahlart: ganze Bohnen, Filter gemahlen, Espresso gemahlen, Pads, Kapseln
   - R4 Attribute: Bio/Fairtrade, schneller Versand, säurearm, Single Origin
5. **Review Gate**: Product collage + "Vorschau & bewerten" button
6. **Product Cards**: 10 products with Like/Dislike rating
   - Rejection reasons: Price, Taste profile, Sustainability, Brand/Trust
7. **Transition**: "Thanks for feedback" + 5s progress bar
8. **Navigate to /guide**: Automatic navigation after transition

## Pre-Survey Items (P1-P9)

- P1: Alter (18–20, 21–25, 26–30, >30, keine Angabe)
- P2: Studienstatus (Student:in, nicht Student:in, keine Angabe)
- P3: Studiengang (optional text field)
- P4: Online-Shopping Häufigkeit
- P5: Kaffee-Kaufhäufigkeit
- P6: Kaffeewissen (7-point Likert)
- P7: LLM-Nutzung (nie, selten, wöchentlich, täglich)
- P8: LLM für Kaufrecherche (ja, nein, unsicher)
- P9: Ranking-Affinität (7-point Likert)

## Post-Survey Items (MC1-MC4, N1-N10, O1-O8)

### Manipulation Checks (MC)
- MC1: Hat der Assistent eine Option als 'beste Wahl' präsentiert? (ja/nein/unsicher)
- MC2: Der Assistent hat eine Option als "beste Wahl" dargestellt (Likert)
- MC3: Welches Produkt wirkte am stärksten empfohlen? (Product selection)
- MC4: Wie genau haben Sie den Bericht gelesen? (komplett/überflogen/kaum)

### Mechanism Perception (N1-N10)
- N1-N10: Various Likert items about perceived guidance

### Outcomes (O1-O8)
- O1-O6: Likert items about purchase intent, certainty, trust, autonomy, transparency, satisfaction
- O8: Influences (multi-select)

## Data Persistence

PostgreSQL database with tables:
- `study_sessions`: Participant data, condition, survey responses, requirements, product ratings, deviation flags
- `study_events`: Event log with timestamps for all interactions

Key session fields:
- `normalized_target`: Always uses standardized criteria
- `deviation_flags`: Tracks when user selections differ from normalized target
- `guide_view_start_ts`, `guide_continue_ts`, `guide_read_seconds`: Guide timing
- `choice_product_id`: Final product selection

## API Routes

- `POST /api/session`: Create new study session (random condition assignment)
- `GET /api/session/:participantId`: Get session by participant ID
- `PATCH /api/session/:participantId/consent`: Update consent status
- `PATCH /api/session/:participantId/pre-survey`: Submit pre-survey data
- `PATCH /api/session/:participantId/requirements`: Submit requirements answers with deviation flags
- `POST /api/session/:participantId/rating`: Add product rating
- `PATCH /api/session/:participantId/guide-time`: Update guide timestamps
- `PATCH /api/session/:participantId/choice`: Submit final product choice
- `PATCH /api/session/:participantId/post-survey`: Submit post-survey data
- `PATCH /api/session/:participantId/complete`: Mark session complete
- `POST /api/session/:participantId/event`: Log individual event
- `GET /api/admin/export/jsonl`: Export all data as JSONL
- `GET /api/admin/export/csv`: Export all data as CSV

## How to Run

```bash
npm run dev
```

The application runs on port 5000.

## How to Customize

1. **Product Data**: Update `products` array in `shared/schema.ts`
2. **Guide Texts**: Update `GUIDE_TEXT_A` and `GUIDE_TEXT_B` in `shared/schema.ts`
3. **Normalized Target**: Update `NORMALIZED_TARGET` in `shared/schema.ts`

## Project Structure

```
client/src/
├── components/shopping/
│   ├── sidebar.tsx              # Left icon sidebar (decorative)
│   ├── topbar.tsx               # Top navigation bar (decorative)
│   ├── chat-input.tsx           # Bottom chat input with mode selection
│   ├── mode-selection-overlay.tsx  # Plus menu with mode options
│   ├── start-screen.tsx         # Initial welcome screen
│   ├── user-message.tsx         # User message bubble
│   ├── status-display.tsx       # Loading dots and status text
│   ├── gathering-requirements.tsx  # Question screens with options
│   ├── review-gate.tsx          # Review consideration screen
│   ├── product-card-view.tsx    # Product rating cards
│   ├── rejection-dialog.tsx     # Rejection reason dialog
│   ├── product-detail-modal.tsx # Full product detail modal
│   ├── transition-screen.tsx    # Thanks for feedback + progress bar
│   └── all-products-modal.tsx   # Grid of all reviewed products
├── lib/
│   └── study-context.tsx        # StudyProvider for session management
├── pages/
│   ├── study-start.tsx          # Study start page
│   ├── consent.tsx              # Consent form
│   ├── pre-survey.tsx           # Pre-survey questionnaire (P1-P9)
│   ├── task.tsx                 # Task instructions
│   ├── shopping-research.tsx    # Main shopping assistant
│   ├── guide.tsx                # Buyer's guide display
│   ├── choice.tsx               # Final product selection
│   ├── post-survey.tsx          # Post-survey questionnaire (MC, N, O items)
│   ├── debrief.tsx              # Study debrief
│   └── admin.tsx                # Admin export panel
└── App.tsx                      # Application entry with routing

server/
├── routes.ts                    # API endpoints
├── storage.ts                   # PostgreSQL storage interface
└── index.ts                     # Express server

shared/
└── schema.ts                    # Data models, products, guide texts, constants
```

## Key Test IDs

Study pages:
- `study-start`: Study start page
- `start-study-button`: Start study button
- `consent-adult`, `consent-data`: Consent checkboxes
- `consent-continue-button`: Consent continue button
- `pre-survey-form`: Pre-survey form
- `pre-survey-submit-button`: Pre-survey submit button
- `task-start-button`: Task start button
- `guide-page`, `guide-content`: Guide page
- `guide-continue-button`: Guide continue button
- `choice-page`: Choice page
- `product-card-P01` to `product-card-P06`: Product cards
- `choice-submit-button`: Choice submit button
- `post-survey-form`: Post-survey form
- `post-survey-submit-button`: Post-survey submit button

Shopping assistant:
- `shopping-research-container`: Main container
- `start-title`: "Was liegt heute an?" title
- `chat-input-plus`: Open mode selection
- `mode-shopping`: Select Shopping-Assistent
- `chat-input-send`: Send message button
- `gathering-requirements`: Requirements screen
- `continue-button`: Continue after selection
- `preview-and-rate-button`: Start product review
- `product-card-view`: Product card
- `more-like-this-button`: Like product
- `not-interested-button`: Dislike product
- `rejection-dialog`: Rejection reason dialog
- `transition-screen`: Transition screen

## Language

- System labels: English ("Gathering requirements", "Review consideration")
- User-facing content: German (questions, options, guide content)
- Rejection reasons: English (Price, Taste profile, Sustainability, Brand/Trust)

## Studienleitung

Hussein Daoud (B.Sc. E-Commerce, Hochschule Ruhr West)
E-Mail: hussein.daoud@stud.hs-ruhrwest.de
