# Shopping Research Prototype

A clickable UI prototype for a Bachelor's thesis on Nudging/Agentic Commerce. This prototype replicates a "Shopping Research" workflow similar to ChatGPT's Shopping Assistant interface with controlled, deterministic interactions.

## Overview

This is a controlled research artifact - NO real web search, NO external APIs, NO actual shopping. Only UI and controlled workflows.

## Features

- **ChatGPT-like interface** with sidebar and topbar (decorative only)
- **Mode Selection Screen** with Plus menu (Shopping-Assistent option)
- **Single-use chat input** (disabled after first message)
- **Gathering requirements flow** with 3 questions (Budget, Aroma, Properties)
- **Auto-advance timers** that skip without user interaction (10s idle + 10s countdown)
- **Review Gate** with product collage and "Preview and rate" button
- **Product card rating system** with Like/Dislike + Rejection Dialog
- **Transition Screen** with animated progress bar
- **Final Buyer's Guide** with tags, comparison table, recommendations
- **All Products Modal** showing liked/not interested products
- **Sources Panel** with reference links

## State Machine Flow

1. **Start**: "Was liegt heute an?" with chat input
2. **Mode Selection**: Click Plus button → Select "Shopping-Assistent"
3. **Loading**: Black dot animation + "Starting shopping research"
4. **Budget**: "Budget für eine Packung?" with 4 options (Bis 5€, Bis 10€, Bis 20€, 20€+)
5. **Aroma**: "Röstungsgrad bevorzugt?" with 4 options
6. **Properties**: "Wichtige Merkmale?" with 4 options
7. **Review Gate**: Product collage + "Preview and rate" button + "Skip all"
8. **Product Cards**: Individual product review with Like/Dislike buttons
   - Rejection Dialog: "Why don't you like this product?" with reasons
   - Product Detail Modal: Full product info with image gallery
9. **Transition**: "Thanks for the feedback" + animated progress bar
10. **Final Guide**: Complete shopping guide with:
    - Header: "Shopped for 3m · 13 products viewed"
    - Tags: Kaffee, Fairtrade/Bio, Vollautomat, Bis 10 €
    - Kurzer Überblick, Beste Gesamtwahl, Vergleichstabelle
    - Weitere starke Picks, Lagerungshinweise
    - View products button → All Products Modal
    - Quellen link → Sources Panel

## How to Run

```bash
npm run dev
```

The application runs on port 5000.

## How to Customize

1. **Product Data**: Update `mockProductCards` in `shared/schema.ts`
2. **Final Guide Text**: Update `finalGuideMarkdown` in `shared/schema.ts`
3. **Sources**: Update `mockSources` in `shared/schema.ts`
4. **Timer Durations**: 
   - `TIMER_DURATION` (20000ms) for requirements/review gate
   - `PRODUCT_TIMER_DURATION` (15000ms) for product cards

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
│   ├── rejection-dialog.tsx     # Why don't you like this product?
│   ├── product-detail-modal.tsx # Full product detail modal
│   ├── transition-screen.tsx    # Thanks for feedback + progress bar
│   ├── final-guide.tsx          # Buyer's guide with all sections
│   ├── all-products-modal.tsx   # Grid of all reviewed products
│   └── sources-panel.tsx        # Right panel with source links
├── pages/
│   └── shopping-research.tsx    # Main page with state machine
└── App.tsx                      # Application entry point

shared/
└── schema.ts                    # Data models, mock data, final guide content
```

## Disabled Interactions (Decorative Only)

- Model selector dropdown in topbar
- Sidebar icons
- Share/Add person buttons in topbar
- Chat input after first submission

## Timer Behavior

- **Requirements Questions**: 10s idle + 10s countdown = 20s total
- **Review Gate**: 20s auto-advance
- **Product Cards**: 15s per card auto-advance
- **Transition Screen**: 5s with animated progress bar

## Language

- System labels: English ("Gathering requirements", "Review consideration", "Preview and rate")
- Questions and options: German ("Budget für eine Packung?", "Bis 10 €", "Fairtrade/Bio")
- Final Guide: German content

## Key Test IDs

- `chat-input-plus`: Open mode selection
- `mode-shopping`: Select Shopping-Assistent
- `chat-input-send`: Send message
- `gathering-requirements`: Requirements form
- `continue-button`: Continue after selection
- `preview-and-rate-button`: Start product review
- `product-card-view`: Product card
- `more-like-this-button`: Like product
- `not-interested-button`: Dislike product
- `rejection-dialog`: Rejection reason dialog
- `transition-screen`: Transition screen
- `final-guide`: Final buyer's guide
- `view-products-button`: Open all products modal
- `sources-link`: Open sources panel
