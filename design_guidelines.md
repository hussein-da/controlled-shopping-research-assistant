# Design Guidelines: Shopping Research Prototype

## Design Approach
**Reference-Based:** ChatGPT/OpenAI interface aesthetic - clean, conversation-focused, minimalist with generous whitespace.

## Core Design Principles
1. **Extreme Minimalism:** Maximum whitespace, center-focused content, no visual clutter
2. **Conversation-First:** UI elements support the chat flow, never distract from it
3. **Controlled Interaction:** Most UI is decorative; only the research workflow is interactive
4. **Professional Research Tool:** This is a controlled academic artifact, not a consumer product

## Layout System

**Three-Column Structure:**
- Left Sidebar: Fixed narrow column (~60px) with icon stack
- Main Content: Center column with generous margins (max-w-3xl centered)
- Right: Empty (reserved for future use, not in this version)

**Spacing:**
- Use Tailwind units: 2, 4, 6, 8, 12, 16, 24 primarily
- Vertical rhythm between sections: py-12 to py-16
- Content padding: px-6 to px-8
- Extreme whitespace around central content area

## Typography

**Font Family:** 
- Primary: System sans-serif stack (similar to Inter or SF Pro)
- Single family throughout

**Hierarchy:**
- Hero question: text-4xl to text-5xl, font-normal, centered
- Section headers: text-xl, font-medium
- Body text: text-base, font-normal
- Button/option text: text-sm to text-base
- Labels: text-xs to text-sm, text-gray-500

## Component Library

### Sidebar (Left)
- Width: ~60px
- Icons only, vertically stacked with py-3 spacing
- Icons: 20-24px size, gray/neutral
- No hover states, purely decorative
- Subtle border-right or background distinction

### Top Bar
- Height: ~60px
- Contains "ChatGPT 5.2" label/dropdown (non-functional)
- Centered or left-aligned
- Minimal styling, subtle bottom border

### Chat Input (Bottom)
- Large rounded container (rounded-2xl or rounded-3xl)
- Height: ~56px minimum
- Full width with max-w-3xl centered
- Left side: "Shopping-Assistent" icon/label
- Right side: Send arrow button (circular)
- After first submission: disabled state (grayed out, cursor not-allowed)

### Option Cards (Gathering Requirements)
- Layout: 2x2 grid for 4 options
- Each option: Radio-like circle (left) + text (right)
- Full width buttons with rounded corners (rounded-lg)
- Subtle border, hover state with slight background change
- Below grid: Wide "Something else..." button with different visual treatment
- Below that: "Skip" with timer circle indicator

### Product Cards
- Large horizontal card layout
- Left: Square product image (~300-400px)
- Right: Product details with scrollable attributes table
- Bottom: Two action buttons ("Not interested" with X, "More like this" with checkmark)
- Rounded-lg, subtle shadow

### Review Consideration Gate
- Left: Grid of small product preview images
- Right: Explanation text + large "Preview and rate" button + small "Skip all" link
- Generous spacing between elements

### Final Guide Display
- Full-width content area (max-w-4xl)
- Markdown-style rendering:
  - H1: text-3xl, font-bold, mb-6
  - H2: text-2xl, font-semibold, mb-4, mt-8
  - Body: text-base, leading-7
  - Tables: Bordered, alternating row backgrounds, horizontal scroll if needed
  - Lists: Proper bullet/number styling with pl-6
  - Links: Underline, blue color

## Visual Treatment

**Colors:** (Minimal palette)
- Background: Pure white (#FFFFFF)
- Text primary: Near black (#1a1a1a)
- Text secondary: Gray-600
- Borders: Gray-200 to Gray-300
- Accent (buttons): Keep neutral (gray-800) or minimal blue
- Disabled state: Gray-400

**Borders & Shadows:**
- Cards: 1px border in gray-200, optional subtle shadow (shadow-sm)
- Buttons: Rounded-lg to rounded-xl
- Input fields: Rounded-2xl to rounded-3xl

**Transitions:**
- Smooth fades between states (300-500ms)
- Optional subtle slide animations for new content appearing
- Keep animations minimal and professional

## Language Mix
- System labels: English ("Gathering requirements", "Review consideration", "Preview and rate", "Skip all")
- Questions and options: German ("Gesamtes Budget?", "Bis 10 €", etc.)
- Maintain this exact mix throughout

## Images
- **Product Images:** Square aspect ratio placeholders for product cards
- **Review Grid:** Small thumbnail previews (4-6 images in grid)
- Use neutral placeholder images until real assets provided
- No hero image - this is a chat interface

## Interaction States
**Enabled Elements:**
- Initial chat input (one-time use)
- Option selection buttons (with timer auto-advance)
- "Preview and rate" / "Skip all" buttons
- Product card rating buttons

**Disabled/Decorative Elements:**
- Sidebar icons (no interaction)
- Top bar model selector (display only)
- Chat input after first submission (locked)
- All navigation/sharing features

## Critical Constraints
- No colors specified yet - use neutral grays and white
- No distracting animations - keep professional
- Auto-advance timers must be visually indicated (circular progress)
- Baseline flow: Everything can auto-advance without user input
- UI must look like a legitimate research tool, not a playful demo