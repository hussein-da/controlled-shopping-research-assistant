# Shopping Research Study Platform

A complete research study platform for a Bachelor's thesis on Nudging/Agentic Commerce. This platform features a single-variant shopping assistant prototype with a structured study wrapper for controlled research.

## Overview

This is a controlled research artifact:
- NO real web search
- NO external APIs  
- NO actual shopping
- Only UI and controlled workflows for deterministic research
- **Single variant only** (no A/B testing)

## Study Flow (Updated January 2026)

The complete participant flow:

```
/start → /consent → /pre → /task → /assistant → /guide → /choice → /post → /debrief
```

### Study Pages

1. **Study Start** (`/start`): Welcome page with Thumbnail.jpg background, "Studie starten" button (Schritt 1)
2. **Consent** (`/consent`): Consent form with checkboxes for age and data processing (Schritt 2)
3. **Pre-Survey** (`/pre`): 5 items - age (18-99), shopping frequency, LLM usage, LLM purchase, familiarity (Schritt 3)
4. **Task** (`/task`): Task instructions with Thumbnail.jpg background and Zielkriterien (Schritt 4)
5. **Assistant** (`/assistant`): Shopping research prototype (Schritt 5)
6. **Guide** (`/guide`): Buyer's Guide with ChatGPT dark UI (#212121) and horizontal scrollable table (Schritt 6)
7. **Choice** (`/choice`): Final product selection from 6 products, all priced at 9,95€ (Schritt 7)
8. **Post-Survey** (`/post`): 21 items with numbered questions (Q1-Q21) (Schritt 8)
9. **Debrief** (`/debrief`): Study debrief with participant notes field and privacy notice with participant ID (Schritt 9)
10. **Admin** (`/admin?password=<pw>`): Export study data as CSV/JSONL with health endpoint

## Product Corpus

### Rating Products (R01-R05) - Used in Rating Phase Only

5 real-world coffee products used ONLY for the product rating interaction (independent from study outcome):
- **R01**: EDEKA Bio Caffe Crema (12,70€, 1kg)
- **R02**: Melitta Barista Classic Crema (11,45€, 1kg)
- **R03**: Jacobs Krönung Signature Classic (9,99€, 500g)
- **R04**: Berliner Kaffeerösterei Azúcar Espresso (11,95€, 250g)
- **R05**: Nicaragua Flores del Café (ab 9,90€, Single Origin)

Images stored at: `attached_assets/R01*.jpg` through `attached_assets/R05*.jpg`

### Guide/Choice Products (P01-P06) - Used for Study Outcome

6 fictional coffee products with fictional brand names (used in Buyer's Guide and final choice):
- **P01**: PachaLumo – Chanchamayo Bio (9,95€, hell, Bio/Fairtrade)
- **P02**: Riftara – Yirgacheffe Flora (9,95€, hell, Bio/Fairtrade)
- **P03**: Kuntaro – Cocoa Dark (9,95€, dunkel, Bio/Fairtrade)
- **P04**: Bonavia – City Blend (9,95€, mittel, Bio/Fairtrade)
- **P05**: BuenaRosa – Pink Bourbon (9,95€, hell, Bio/Fairtrade)
- **P06**: Kebena Forest – Regenwald Bio (9,95€, mittel, Bio/Fairtrade)

All products: 250g, ganze Bohnen, 9,95€

## Normalized Target Criteria

Regardless of user selections, the guide always uses:
- Packungsgröße: 250g
- Budget: bis 12 €
- Attribute: Bio/Fairtrade
- Mahlart: ganze Bohnen

User selections are logged with deviation flags for analysis.

## Shopping Assistant Flow

The main research prototype at `/assistant`:

1. **Start**: "Was liegt heute an?" with centered chat input
2. **Mode Selection**: Click Plus button → Select "Shopping-Assistent"
3. **Loading**: Black dot animation + "Starting shopping research"
4. **Requirements (4 Questions)** - New order:
   - R1 Mengenbedarf: 250g, 250-500g, 500-1000g, >1kg
   - R2 Budget: bis 8 €, bis 12 €, bis 20 €, 20 € +
   - R3 Attribute: Bio/Fairtrade, schneller Versand, säurearm, Single Origin
   - R4 Mahlart: ganze Bohnen, Filter gemahlen, Espresso gemahlen, Pads/Kapseln
   - **10-second skip timer** on each question
   - **"Something else..." button** with text input for custom answers
5. **Review Gate**: Product collage + "Vorschau & bewerten" button
6. **Product Cards**: 5 real-world products (R01-R05) with Like/Dislike rating
   - Product name is NOT clickable
   - Uses actual product images from attached_assets/
   - Rejection reasons: Zu teuer, Röstgrad passt nicht, Marke unbekannt, Eigenschaften fehlen, Etwas anderes
7. **Transition**: "Thanks for feedback" + progress bar
8. **Navigate to /guide**: Automatic navigation after transition

## Pre-Survey Items (5 Questions)

- P1: Alter (numeric input, 18-99)
- P4: Online-Shopping Häufigkeit (selten, monatlich, wöchentlich, mehrmals wöchentlich)
- P7: LLM-Nutzung (nie, selten, wöchentlich, täglich)
- P8: LLM für Kaufrecherche (ja, nein, unsicher)
- P9: Vertrautheit mit KI-Shopping-Assistenten (7-point Likert)

## Post-Survey Items (Q1-Q21)

Numbered questions instead of MC/N/O prefixes:

- Q1: Hat der Assistent eine Option als 'beste Wahl' präsentiert? (ja/nein/unsicher)
- Q2: Der Assistent hat eine Option als "beste Wahl" dargestellt (Likert)
- Q3: Welches Produkt wirkte am stärksten empfohlen? (Product selection)
- Q4: Wie genau haben Sie den Bericht gelesen? (komplett/überflogen/kaum)
- Q5-Q14: Mechanism Perception (Likert items)
- Q15-Q20: Outcomes (Likert items)
- Q21: Influences (multi-select with "Sonstiges" option)

## Debrief Page

- Participant notes textarea for open-ended feedback
- Privacy notice explaining pseudonymous data collection
- Contact information for data deletion requests
- Participant ID with copy button for deletion requests

## Data Persistence

PostgreSQL database with tables:
- `study_sessions`: Participant data, survey responses, requirements, product ratings, deviation flags, participant_notes
- `study_events`: Event log with timestamps and step context for all interactions

Key session fields:
- `normalized_target`: Always uses standardized criteria
- `deviation_flags`: Tracks when user selections differ from normalized target
- `guide_view_start_ts`, `guide_continue_ts`, `guide_read_seconds`: Guide timing
- `choice_product_id`: Final product selection
- `participant_notes`: Open-ended feedback from debrief

## API Routes

- `POST /api/session`: Create new study session
- `GET /api/session/:participantId`: Get session by participant ID
- `PATCH /api/session/:participantId/consent`: Update consent status
- `PATCH /api/session/:participantId/pre-survey`: Submit pre-survey data
- `PATCH /api/session/:participantId/requirements`: Submit requirements answers with deviation flags
- `POST /api/session/:participantId/rating`: Add product rating
- `PATCH /api/session/:participantId/guide-time`: Update guide timestamps
- `PATCH /api/session/:participantId/choice`: Submit final product choice
- `PATCH /api/session/:participantId/post-survey`: Submit post-survey data
- `PATCH /api/session/:participantId/complete`: Mark session complete
- `PATCH /api/session/:participantId/notes`: Save participant notes
- `POST /api/session/:participantId/event`: Log individual event with step context
- `GET /api/admin/export/jsonl`: Export all data as JSONL
- `GET /api/admin/export/csv`: Export all data as CSV
- `GET /api/admin/health`: Health check with session statistics

## How to Run

```bash
npm run dev
```

The application runs on port 5000.

## How to Customize

1. **Product Data**: Update `products` array in `shared/schema.ts`
2. **Guide Text**: Update `GUIDE_TEXT` in `shared/schema.ts`
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
│   ├── gathering-requirements.tsx  # Question screens with options and custom input
│   ├── review-gate.tsx          # Review consideration screen
│   ├── product-card-view.tsx    # Product rating cards (non-clickable title)
│   ├── rejection-dialog.tsx     # Rejection reason dialog
│   ├── transition-screen.tsx    # Thanks for feedback + progress bar
│   └── all-products-modal.tsx   # Grid of all reviewed products
├── lib/
│   └── study-context.tsx        # StudyProvider for session management
├── pages/
│   ├── study-start.tsx          # Study start page with Thumbnail background
│   ├── consent.tsx              # Consent form
│   ├── pre-survey.tsx           # Pre-survey questionnaire (5 items)
│   ├── task.tsx                 # Task instructions with Thumbnail background
│   ├── shopping-research.tsx    # Main shopping assistant
│   ├── guide.tsx                # Buyer's guide with dark ChatGPT UI
│   ├── choice.tsx               # Final product selection (6 products)
│   ├── post-survey.tsx          # Post-survey questionnaire (Q1-Q21)
│   ├── debrief.tsx              # Study debrief with notes and privacy info
│   └── admin.tsx                # Admin export panel
└── App.tsx                      # Application entry with routing

server/
├── routes.ts                    # API endpoints
├── storage.ts                   # PostgreSQL storage interface
└── index.ts                     # Express server

shared/
└── schema.ts                    # Data models, products, guide text, constants
```

## Key Test IDs

Study pages:
- `study-start`: Study start page
- `start-study-button`: Start study button
- `consent-adult`, `consent-data`: Consent checkboxes
- `consent-continue-button`: Consent continue button
- `pre-survey-form`: Pre-survey form
- `p1-age`: Age input (numeric)
- `pre-survey-submit-button`: Pre-survey submit button
- `task-start-button`: Task start button
- `guide-page`, `guide-content`: Guide page
- `guide-continue-button`: Guide continue button
- `choice-page`: Choice page
- `product-card-P01` to `product-card-P06`: Product cards
- `choice-submit-button`: Choice submit button
- `post-survey-form`: Post-survey form
- `post-survey-submit-button`: Post-survey submit button
- `participant-notes`: Notes textarea
- `copy-participant-id`: Copy ID button

Shopping assistant:
- `shopping-research-container`: Main container
- `start-title`: "Was liegt heute an?" title
- `chat-input-plus`: Open mode selection
- `mode-shopping`: Select Shopping-Assistent
- `chat-input-send`: Send message button
- `gathering-requirements`: Requirements screen
- `option-*`: Option buttons
- `continue-button`: Continue after selection
- `skip-button`: Skip with 10s countdown
- `something-else-button`: Open custom input
- `custom-input`: Text input for custom answers
- `preview-and-rate-button`: Start product review
- `product-card-view`: Product card
- `product-title`: Product name (NOT clickable)
- `more-like-this-button`: Like product
- `not-interested-button`: Dislike product
- `rejection-dialog`: Rejection reason dialog
- `transition-screen`: Transition screen

## Language

- System labels: English ("Gathering requirements", "Review consideration")
- User-facing content: German (questions, options, guide content)
- Rejection reasons: English (Price, Taste profile, Sustainability, Brand/Trust)

## Assets

- `attached_assets/thumbnail_1768858562792.jpg`: Background for /start, /task, /debrief
- `attached_assets/Kaffee_1768855218017.png`: Product image for all products

## Studienleitung

Hussein Daoud (B.Sc. E-Commerce, Hochschule Ruhr West)
E-Mail: hussein.daoud@stud.hs-ruhrwest.de
