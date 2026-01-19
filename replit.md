# Shopping Research Study Platform

A complete research study platform for a Bachelor's thesis on Nudging/Agentic Commerce. This platform combines a pixel-perfect ChatGPT Shopping Assistant prototype with a structured study wrapper for controlled research.

## Overview

This is a controlled research artifact:
- NO real web search
- NO external APIs  
- NO actual shopping
- Only UI and controlled workflows for deterministic research

## Study Flow

The complete participant flow:

```
/start → /consent → /pre-survey → /task → /assistant → /post-survey → /debrief
```

### Study Pages

1. **Study Start** (`/start`): Welcome page with "Studie starten" button
2. **Consent** (`/consent`): Consent form with checkboxes for age and data processing
3. **Pre-Survey** (`/pre-survey`): Demographics and prior experience questionnaire
4. **Task** (`/task`): Task instructions for participants
5. **Assistant** (`/assistant`): Shopping research prototype (main workflow)
6. **Post-Survey** (`/post-survey`): Post-task questionnaire about the experience
7. **Debrief** (`/debrief`): Study debrief with explanation
8. **Admin** (`/admin?password=<pw>`): Export study data as CSV/JSONL

### A/B Conditions

Each session is randomly assigned to:
- **baseline**: Standard Buyer's Guide without highlighting
- **nudge**: Enhanced Buyer's Guide with prominent "Top Pick" recommendation banner

## Shopping Assistant Flow

The main research prototype at `/assistant`:

1. **Start**: "Was liegt heute an?" with centered chat input
2. **Mode Selection**: Click Plus button → Select "Shopping-Assistent"
3. **Loading**: Black dot animation + "Starting shopping research"
4. **Requirements (4 Questions)**:
   - Budget: "Budget für eine Packung?" (Bis 5€, Bis 10€, Bis 20€, 20€+)
   - Röstgrad: "Röstungsgrad bevorzugt?" (Hell, Mittel, Dunkel, Espresso)
   - Merkmal: "Wichtige Merkmale?" (Bio, Fairtrade, Regional, Single Origin)
   - Zubereitung: "Zubereitung?" (Vollautomat, Filtermaschine, French Press, Espressokocher)
5. **Review Gate**: Product collage + "Preview and rate" button
6. **Product Cards**: 10 products with Like/Dislike rating
   - Rejection Dialog with German reasons (Zu teuer, Röstgrad passt nicht, etc.)
7. **Transition**: "Thanks for feedback" + progress bar
8. **Final Guide**: Complete Buyer's Guide (nudge condition shows Top Pick banner)

## Timer Behavior

All timers follow the same pattern:
- **0-10 seconds**: Idle, no visual indicator
- **10-20 seconds**: Countdown ring fills next to action button
- **At 20 seconds**: Auto-advance to next state (or default action)

Specific durations:
- **Requirements Questions**: 20s total, auto-selects "Something else"
- **Review Gate**: 20s total, auto-clicks "Preview and rate"
- **Product Cards**: 15s per card, auto-advances
- **Transition Screen**: 5s with animated progress bar

## Data Persistence

PostgreSQL database with tables:
- `study_sessions`: Participant data, condition, survey responses, requirements, product ratings
- `study_events`: Event log with timestamps for all interactions

## API Routes

- `POST /api/session`: Create new study session (random condition assignment)
- `PATCH /api/session/:participantId/consent`: Update consent status
- `PATCH /api/session/:participantId/pre-survey`: Submit pre-survey data
- `PATCH /api/session/:participantId/requirements`: Submit requirements answers
- `PATCH /api/session/:participantId/product-rating`: Submit product rating
- `PATCH /api/session/:participantId/final-choice`: Submit final product choice
- `PATCH /api/session/:participantId/post-survey`: Submit post-survey data
- `PATCH /api/session/:participantId/complete`: Mark session complete
- `POST /api/log`: Log individual event
- `GET /api/admin/export/jsonl`: Export all data as JSONL
- `GET /api/admin/export/csv`: Export all data as CSV

## How to Run

```bash
npm run dev
```

The application runs on port 5000.

## How to Customize

1. **Product Data**: Update `mockProductCards` in `shared/schema.ts`
2. **Final Guide Text**: Update `finalGuideMarkdown` in `shared/schema.ts`
3. **Sources**: Update `mockSources` in `shared/schema.ts`
4. **Timer Durations**: Edit constants in component files:
   - `IDLE_DURATION` (10000ms) - idle period before countdown
   - `COUNTDOWN_DURATION` (10000ms) - countdown period with ring
   - `PRODUCT_TIMER_DURATION` (15000ms) - per product card

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
│   ├── gathering-requirements.tsx  # Question screens with 2x2 grid options
│   ├── review-gate.tsx          # Review consideration screen
│   ├── product-card-view.tsx    # Product rating cards
│   ├── rejection-dialog.tsx     # German rejection reason dialog
│   ├── product-detail-modal.tsx # Full product detail modal
│   ├── transition-screen.tsx    # Thanks for feedback + progress bar
│   ├── final-guide.tsx          # Buyer's guide with nudge banner
│   ├── all-products-modal.tsx   # Grid of all reviewed products
│   └── sources-panel.tsx        # Right panel with source links
├── lib/
│   └── study-context.tsx        # StudyProvider for session management
├── pages/
│   ├── study-start.tsx          # Study start page
│   ├── consent.tsx              # Consent form
│   ├── pre-survey.tsx           # Pre-survey questionnaire
│   ├── task.tsx                 # Task instructions
│   ├── shopping-research.tsx    # Main shopping assistant
│   ├── post-survey.tsx          # Post-survey questionnaire
│   ├── debrief.tsx              # Study debrief
│   └── admin.tsx                # Admin export panel
└── App.tsx                      # Application entry with routing

server/
├── routes.ts                    # API endpoints
├── storage.ts                   # PostgreSQL storage interface
└── index.ts                     # Express server

shared/
└── schema.ts                    # Data models, mock data, final guide content
```

## Key Test IDs

Study pages:
- `study-start`: Study start page
- `consent-adult`, `consent-data`: Consent checkboxes
- `consent-continue-button`: Consent continue button
- `pre-survey-form`: Pre-survey form
- `task-continue-button`: Task continue button

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
- `rejection-reason-price`, `rejection-reason-roast`, etc.: Rejection reasons
- `transition-screen`: Transition screen
- `final-guide`: Final buyer's guide
- `nudge-top-pick-banner`: Nudge condition highlight (only in nudge)
- `view-products-button`: Open all products modal
- `sources-link`: Open sources panel

## Language

- System labels: English ("Gathering requirements", "Review consideration")
- User-facing content: German (questions, options, guide content)

## Disabled Interactions (Decorative Only)

- Model selector dropdown in topbar
- Sidebar icons
- Share/Add person buttons in topbar
- Chat input after first submission
