# Shopping Research Study Platform

A ChatGPT-style shopping research UI prototype for a Bachelor's thesis on Nudging/Agentic Commerce. This platform simulates a shopping assistant experience to observe choice architecture patterns and measure product selection behavior.

**Note:** All products and sources are simulated for research purposes only. No real purchases occur.

## Architecture

- **Frontend:** React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL (Drizzle ORM)
- **Data Storage:** All participant data stored in PostgreSQL with full event tracking

### Project Structure

```
client/src/           # React frontend
  pages/              # Study flow pages
  components/         # UI components
server/               # Express backend
  routes.ts           # API endpoints
  storage.ts          # Database layer
shared/               # Shared types and schemas
  schema.ts           # Data models and product definitions
attached_assets/      # Product images and backgrounds
```

## Study Flow

The study follows a 9-step participant flow:

1. **Start** (`/start`) - Welcome page with study introduction
2. **Consent** (`/consent`) - Age verification and data processing consent
3. **Pre-Survey** (`/pre`) - 5 demographic and usage questions
4. **Task** (`/task`) - Task instructions and target criteria
5. **Assistant** (`/assistant`) - Main shopping research prototype:
   - 4 requirement questions (Amount, Budget, Attributes, Grind type)
   - Product preview and rating phase (5 products: R01-R05)
6. **Guide** (`/guide`) - Buyer's Guide with product recommendations (P01-P06)
7. **Choice** (`/choice`) - Final product selection from 6 options
8. **Post-Survey** (`/post`) - 21 perception and outcome questions (Q1-Q21)
9. **Debrief** (`/debrief`) - Study completion with participant notes

## Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- PostgreSQL database

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/shopping-research-study.git
cd shopping-research-study

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Push database schema
npm run db:push

# 5. Start development server
npm run dev
```

The application will be available at `http://localhost:5000`.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env or kill existing process |
| Database connection failed | Verify DATABASE_URL in .env |
| Node version mismatch | Use Node.js 20.x (`nvm use 20`) |

## Admin Panel & Data Export

### Accessing the Admin Panel

Navigate to `/admin` and enter the admin password.

**Admin Credentials:**
- Password: `study-admin-2026`
- (Single password gate, no username required)

### Study Overview Table

The admin panel displays all participant sessions with these columns:

| Column | Description |
|--------|-------------|
| ID | Participant UUID (truncated) |
| Alter | Age from pre-survey |
| LLM | LLM usage frequency |
| Guide-Zeit | Time spent on Buyer's Guide (seconds) |
| Wahl | Selected product ID (P01-P06) |
| Status | Completion status (complete/incomplete) |
| Erstellt | Session creation timestamp |
| Events | Number of tracked events |
| Aktionen | View details (eye icon), Copy ID (copy icon) |

### Detail View (Eye Icon)

Click the eye icon to see full participant data including:
- Timestamps (created, completed)
- Consent status
- Pre-survey responses
- Requirement answers with deviation flags
- Product ratings (R01-R05)
- Guide timing data
- Final choice
- Post-survey responses
- Event log

### Data Export

Export buttons are available in the admin panel:

- **JSONL Export:** One JSON object per line, includes all session data
- **CSV Export:** Tabular format for spreadsheet analysis
- **Copy JSON:** Per-participant JSON via detail dialog

## JSON Field Documentation

### Session Fields

| Field | Type | Description |
|-------|------|-------------|
| `participantId` | string | UUID identifying the participant |
| `createdAt` | timestamp | Session start time |
| `completedAt` | timestamp | Session completion time (null if incomplete) |
| `consentAge` | boolean | Adult consent checkbox |
| `consentData` | boolean | Data processing consent checkbox |

### Pre-Survey (`preSurvey`)

| Field | Type | Description |
|-------|------|-------------|
| `p1_age` | number | Participant age (18-99) |
| `p4_online_shopping` | string | Shopping frequency: selten/monatlich/wöchentlich/mehrmals wöchentlich |
| `p7_llm_usage` | string | LLM usage: nie/selten/wöchentlich/täglich |
| `p8_llm_purchase` | string | LLM for purchases: ja/nein/unsicher |
| `p9_familiarity` | number | AI shopping assistant familiarity (1-7 Likert) |

### Requirements (`requirements`)

| Field | Type | Description |
|-------|------|-------------|
| `r1_amount` | string[] | Pack size selection |
| `r2_budget` | string[] | Budget range selection |
| `r3_attributes` | string[] | Product attributes selection |
| `r4_grind` | string[] | Grind type selection |

### Deviation Flags (`deviationFlags`)

| Field | Type | Description |
|-------|------|-------------|
| `r1_deviated` | boolean | User selected non-normalized amount |
| `r2_deviated` | boolean | User selected non-normalized budget |
| `r3_deviated` | boolean | User selected non-normalized attributes |
| `r4_deviated` | boolean | User selected non-normalized grind |

### Product Ratings (`productRatings`)

Array of rating objects:

| Field | Type | Description |
|-------|------|-------------|
| `productId` | string | Product ID (R01-R05) |
| `action` | string | "more_like_this" or "not_interested" |
| `reason` | string | Rejection reason (if not_interested) |
| `timestamp` | number | Unix timestamp of rating |

### Guide Timing

| Field | Type | Description |
|-------|------|-------------|
| `guideViewStartTs` | timestamp | When guide page was opened |
| `guideContinueTs` | timestamp | When continue button was clicked |
| `guideReadSeconds` | number | Calculated reading duration |

### Choice

| Field | Type | Description |
|-------|------|-------------|
| `choiceProductId` | string | Selected product (P01-P06) |
| `choiceTimestamp` | timestamp | When choice was made |

### Post-Survey (`postSurvey`)

| Field | Type | Description |
|-------|------|-------------|
| `q1_best_choice` | string | ja/nein/unsicher |
| `q2_best_choice_likert` | number | 1-7 Likert scale |
| `q3_which_product` | string | Product ID perceived as recommended |
| `q4_read_carefully` | string | komplett/überflogen/kaum |
| `q5_prestructured` - `q20_satisfaction` | number | Various 1-7 Likert items |
| `q21_influences` | string[] | Multi-select influence factors |

### Events (`study_events` table)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Event UUID |
| `participantId` | string | Associated participant |
| `eventType` | string | Event type (e.g., mode_selected, product_feedback) |
| `step` | string | Current study step |
| `eventData` | object | Event-specific payload |
| `timestamp` | timestamp | Event occurrence time |

## Reproducibility

This study was conducted as part of a Bachelor's thesis at Hochschule Ruhr West.

### Known-Good Configuration

- Node.js 20.x
- npm 10.x
- PostgreSQL 15.x

### Citation

If you use this platform in your research, please cite:

```
Daoud, H. (2026). Nudging in Agentic Commerce: A Study on Choice Architecture 
in AI Shopping Assistants. Bachelor's Thesis, Hochschule Ruhr West.
```

## Contact

**Studienleitung:**  
Hussein Daoud (B.Sc. E-Commerce, Hochschule Ruhr West)  
E-Mail: hussein.daoud@stud.hs-ruhrwest.de

## License

MIT License - see [LICENSE](LICENSE) file for details.
