# Shopping Research Prototype

A clickable UI prototype for a Bachelor's thesis on Nudging/Agentic Commerce. This prototype replicates a "Shopping Research" workflow similar to ChatGPT's interface but with controlled, deterministic interactions.

## Overview

This is a controlled research artifact - NO real web search, NO external APIs, NO actual shopping. Only UI and controlled workflows.

## Features

- ChatGPT-like interface with sidebar and topbar (decorative only)
- Single-use chat input (disabled after first message)
- Gathering requirements flow with 3 questions (Budget, Aroma, Properties)
- Auto-advance timers that skip without user interaction
- Review consideration gate with product previews
- Product card rating system
- Final shopping guide with markdown rendering

## State Machine Flow

1. **Start**: "Wie kann ich dir helfen?" with chat input
2. **Prompt Sent**: User message displayed, workflow begins
3. **Budget**: "Gesamtes Budget?" with 4 options + skip timer
4. **Aroma**: "Gewünschtes Aroma?" with 4 options + skip timer
5. **Properties**: "Wichtige Eigenschaften?" with 4 options + skip timer
6. **Review Gate**: "Preview and rate" button + "Skip all"
7. **Product Cards**: Individual product review with rating buttons
8. **Final Guide**: Complete shopping guide rendered from markdown

## How to Run

```bash
npm run dev
```

The application runs on port 5000.

## How to Replace Images/Final Guide

1. **Product Images**: Update `mockProductCards` in `shared/schema.ts` with new `imageUrl` values
2. **Final Guide Text**: Update `finalGuideMarkdown` in `shared/schema.ts` with your markdown content
3. **Timer Durations**: Adjust `TIMER_DURATION` and `PRODUCT_TIMER_DURATION` in `client/src/pages/shopping-research.tsx`

## Project Structure

```
client/src/
├── components/shopping/
│   ├── sidebar.tsx          # Left icon sidebar (decorative)
│   ├── topbar.tsx           # Top navigation bar (decorative)
│   ├── chat-input.tsx       # Bottom chat input
│   ├── start-screen.tsx     # Initial welcome screen
│   ├── user-message.tsx     # User message bubble
│   ├── gathering-requirements.tsx  # Question screens with options
│   ├── review-gate.tsx      # Review consideration screen
│   ├── product-card-view.tsx      # Product rating cards
│   └── final-guide.tsx      # Final markdown guide renderer
├── pages/
│   └── shopping-research.tsx  # Main page with state machine
└── App.tsx                   # Application entry point

shared/
└── schema.ts                 # Data models and mock data
```

## Disabled Interactions

- Model selector dropdown (display only)
- Sidebar icons (decorative)
- Share/Add person buttons (decorative)
- Chat input after first submission (locked)

## Timer Behavior

- Questions auto-advance after 4 seconds
- Review gate auto-advances after 5 seconds
- Product cards auto-advance after 5 seconds
- All baseline flows complete without user interaction

## Language Mix

- System labels: English ("Gathering requirements", "Review consideration")
- Questions and options: German ("Gesamtes Budget?", "Bis 10 €")
