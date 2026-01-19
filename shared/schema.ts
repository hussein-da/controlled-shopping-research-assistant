import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const studySessions = pgTable("study_sessions", {
  participantId: varchar("participant_id").primaryKey().default(sql`gen_random_uuid()`),
  condition: varchar("condition", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  consentAge: boolean("consent_age").default(false),
  consentData: boolean("consent_data").default(false),
  preSurvey: jsonb("pre_survey"),
  postSurvey: jsonb("post_survey"),
  requirements: jsonb("requirements"),
  normalizedTarget: jsonb("normalized_target"),
  deviationFlags: jsonb("deviation_flags"),
  productRatings: jsonb("product_ratings"),
  guideViewStartTs: timestamp("guide_view_start_ts"),
  guideContinueTs: timestamp("guide_continue_ts"),
  guideReadSeconds: integer("guide_read_seconds"),
  choiceProductId: varchar("choice_product_id", { length: 10 }),
  choiceTimestamp: timestamp("choice_timestamp"),
  completedAt: timestamp("completed_at"),
});

export const studyEvents = pgTable("study_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantId: varchar("participant_id").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  eventData: jsonb("event_data"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(studySessions).omit({
  participantId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(studyEvents).omit({
  id: true,
  timestamp: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type StudyEvent = typeof studyEvents.$inferSelect;

export type StudyCondition = "A_OPENAI_GUIDE" | "B_NEUTRAL_GUIDE";

export interface PreSurvey {
  p1_age: string;
  p2_student_status: string;
  p3_study_program?: string;
  p4_online_shopping: string;
  p5_coffee_frequency: string;
  p6_coffee_knowledge: number;
  p7_llm_usage: string;
  p8_llm_purchase: string;
  p9_ranking_affinity: number;
}

export interface PostSurvey {
  mc1_best_choice: number;
  mc2_stronger_recommended: number;
  mc3_which_product: string;
  mc4_read_carefully: number;
  n1_prestructured: number;
  n2_time_pressure: number;
  n3_skip_worse: number;
  n4_budget_influence: number;
  n5_feedback_control: number;
  n6_status_competent: number;
  n7_reduced_choice: number;
  n8_normative: number;
  n9_comparison_table: number;
  n10_more_filters: number;
  o1_purchase_intent: number;
  o2_decision_certainty: number;
  o3_trust: number;
  o4_autonomy: number;
  o5_transparency: number;
  o6_satisfaction: number;
  o7_reason_text?: string;
  o8_influences: string[];
  o8_other_text?: string;
}

export interface RequirementAnswers {
  r1_budget: string[];
  r2_roast: string[];
  r3_grind: string[];
  r4_attributes: string[];
  r1_other?: string;
  r2_other?: string;
  r3_other?: string;
  r4_other?: string;
}

export interface NormalizedTarget {
  budget: string;
  roast: string;
  grind: string;
  attributes: string;
  usage: string;
}

export const NORMALIZED_TARGET: NormalizedTarget = {
  budget: "bis 12 €",
  roast: "hell",
  grind: "ganze Bohnen",
  attributes: "Bio/Fairtrade",
  usage: "Vollautomat"
};

export interface DeviationFlags {
  r1_deviated: boolean;
  r2_deviated: boolean;
  r3_deviated: boolean;
  r4_deviated: boolean;
}

export interface ProductRating {
  productId: string;
  action: "more_like_this" | "not_interested" | "skip";
  reason?: string;
  reasonText?: string;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price_eur: number;
  pack_g: number;
  roast: string;
  bio_fair: boolean;
  whole_beans: boolean;
  tasting_notes: string[];
  shipping_days: string;
  short_bullets: string[];
  image_path: string;
  suitable_for: string[];
}

export const products: Product[] = [
  {
    id: "P01",
    name: "Lunaro Vale – Andes Light",
    brand: "Lunaro Vale",
    price_eur: 9.90,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Kakao", "Zitrus", "Vanille"],
    shipping_days: "2-3 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Für Vollautomaten geeignet", "Helle Röstung aus den Anden"],
    image_path: "/products/P01.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P02",
    name: "Kafira Studio – Bloom 250",
    brand: "Kafira Studio",
    price_eur: 10.40,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Jasmin", "Honig", "Bergamotte"],
    shipping_days: "3-4 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Florale Noten", "Ganze Bohnen"],
    image_path: "/products/P02.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P03",
    name: "Sombra Verde – Alto Claro",
    brand: "Sombra Verde",
    price_eur: 8.95,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Karamell", "Mandarine", "Haselnuss"],
    shipping_days: "2-3 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Preis-Leistungs-Tipp", "Nussig-süß"],
    image_path: "/products/P03.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P04",
    name: "Nuvana Roasters – Bright Origin",
    brand: "Nuvana",
    price_eur: 11.80,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Maracuja", "Schokolade", "Blüte"],
    shipping_days: "3-5 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Micro-Lot Qualität", "Fruchtig-komplex"],
    image_path: "/products/P04.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P05",
    name: "Orienta Co-op – Fair Select",
    brand: "Orienta Co-op",
    price_eur: 7.90,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Nuss", "Mild", "Toffee"],
    shipping_days: "2-3 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Sehr günstig", "Mild und alltagstauglich"],
    image_path: "/products/P05.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P06",
    name: "Cerro Lumo – Filter Light",
    brand: "Cerro Lumo",
    price_eur: 10.95,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Apfel", "Nougat", "Karamell"],
    shipping_days: "3-4 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Ausgewogenes Profil", "Für Filter und Vollautomat"],
    image_path: "/products/P06.jpg",
    suitable_for: ["vollautomat", "filter"]
  },
  {
    id: "P07",
    name: "Noir Dock – Dark Crew",
    brand: "Noir Dock",
    price_eur: 9.50,
    pack_g: 250,
    roast: "dunkel",
    bio_fair: false,
    whole_beans: true,
    tasting_notes: ["Schokolade", "Rauch", "Walnuss"],
    shipping_days: "2-3 Tage",
    short_bullets: ["Kräftige dunkle Röstung", "Ganze Bohnen", "Intensiver Geschmack"],
    image_path: "/products/P07.jpg",
    suitable_for: ["vollautomat", "espresso"]
  },
  {
    id: "P08",
    name: "Cápsula Nova – Light Pods",
    brand: "Cápsula Nova",
    price_eur: 6.50,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: false,
    tasting_notes: ["Zitrone", "Milch", "Blume"],
    shipping_days: "1-2 Tage",
    short_bullets: ["Praktische Kapseln", "Helle Röstung", "Schnelle Zubereitung"],
    image_path: "/products/P08.jpg",
    suitable_for: ["kapselmaschine"]
  },
  {
    id: "P09",
    name: "Aurum Peak – Micro Lot",
    brand: "Aurum Peak",
    price_eur: 16.90,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Beere", "Hibiskus", "Zimt"],
    shipping_days: "5-7 Tage",
    short_bullets: ["Premium Micro-Lot", "Bio & Fairtrade", "Limitierte Edition"],
    image_path: "/products/P09.jpg",
    suitable_for: ["vollautomat", "filter"]
  },
  {
    id: "P10",
    name: "DecaLune – Soft Decaf",
    brand: "DecaLune",
    price_eur: 12.50,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Nuss", "Karamell", "Vanille"],
    shipping_days: "3-4 Tage",
    short_bullets: ["Entkoffeiniert", "Bio zertifiziert", "Sanftes Aroma"],
    image_path: "/products/P10.jpg",
    suitable_for: ["vollautomat"]
  }
];

export const TOP_6_PRODUCTS = products.filter(p => 
  p.price_eur <= 12 && 
  p.bio_fair && 
  p.whole_beans && 
  p.roast === "hell" && 
  p.suitable_for.includes("vollautomat")
);

export interface WorkflowAnswers {
  r1_budget?: string[];
  r2_roast?: string[];
  r3_grind?: string[];
  r4_attributes?: string[];
}

export interface WorkflowState {
  userPrompt: string;
  userTypedPrompt: string;
  answers: WorkflowAnswers;
  currentProductIndex: number;
  productRatings: Record<string, ProductRating>;
}

export type AppState = 
  | 'start'
  | 'mode_selection'
  | 'loading'
  | 'starting'
  | 'r1_budget'
  | 'r2_roast'
  | 'r3_grind'
  | 'r4_attributes'
  | 'review_gate'
  | 'product_cards'
  | 'transition';

export type StudyPage = 
  | 'start'
  | 'consent'
  | 'pre'
  | 'task'
  | 'assistant'
  | 'guide'
  | 'choice'
  | 'post'
  | 'debrief';

export const REQUIREMENT_OPTIONS = {
  r1_budget: [
    { value: "bis 8 €", label: "bis 8 €" },
    { value: "bis 12 €", label: "bis 12 €" },
    { value: "bis 20 €", label: "bis 20 €" },
    { value: "20 € plus", label: "20 € plus" }
  ],
  r2_roast: [
    { value: "hell", label: "hell" },
    { value: "mittel", label: "mittel" },
    { value: "dunkel", label: "dunkel" },
    { value: "entkoffeiniert", label: "entkoffeiniert" }
  ],
  r3_grind: [
    { value: "ganze Bohnen", label: "ganze Bohnen" },
    { value: "Filter gemahlen", label: "Filter gemahlen" },
    { value: "Espresso gemahlen", label: "Espresso gemahlen" },
    { value: "Pads", label: "Pads" },
    { value: "Kapseln", label: "Kapseln" }
  ],
  r4_attributes: [
    { value: "Bio/Fairtrade", label: "Bio/Fairtrade" },
    { value: "schneller Versand", label: "schneller Versand" },
    { value: "säurearm", label: "säurearm" },
    { value: "Single Origin", label: "Single Origin" }
  ]
};

export const REJECTION_REASONS = [
  { value: "price", label: "Price" },
  { value: "taste_profile", label: "Taste profile" },
  { value: "sustainability", label: "Sustainability" },
  { value: "brand_trust", label: "Brand/Trust" },
  { value: "something_else", label: "Something else" }
];

export const GUIDE_TEXT_A = `# Gute, bezahlbare Kaffees für den sofortigen Kauf (Prototyp)

## Kurzfassung
Sie suchen Kaffee als ganze Bohnen für den Vollautomaten, hell geröstet, Bio/Fairtrade, 250 g, und bis 12 €. Unter diesen Kriterien lassen sich mehrere passende Optionen unterscheiden. Der Bericht priorisiert eine besonders stimmige Gesamtwahl und nennt fünf weitere Alternativen, die nur kleine Kompromisse verlangen (z. B. Lieferzeit oder Geschmacksprofil).

## Bestes Gesamtpaket (Empfehlung)
**Lunaro Vale – Andes Light (P01)**

**Warum diese Wahl am besten zu Ihren Kriterien passt**
- **Passgenauigkeit:** 250 g, ganze Bohnen, hell geröstet, Bio/Fairtrade, geeignet für Vollautomaten und klar unter 12 €.
- **Geschmacksprofil (hell & klar):** Noten von Kakao, Zitrus und Vanille – frisch, aber nicht aggressiv; ideal als Alltagskaffee im Vollautomaten.
- **Guter Kompromiss aus Preis und Qualität:** Mit 9,90 € bleibt die Wahl deutlich im Budget, ohne dass typische Nachhaltigkeits- oder Qualitätsmarker fehlen.

**Trade-offs**
- **Helle Röstung kann lebendiger wirken:** Wer sehr „klassisch-dunkel" sucht, empfindet das Profil eventuell als zu leicht.
- **Single-Origin-Stil ist weniger „uniform":** Leichte Schwankungen im Aromaeindruck sind möglich (typisch für hellere Profile).

**Für wen ideal**
Wenn Sie einen hellen, nachhaltigen Alltagskaffee als ganze Bohnen für den Vollautomaten möchten, ohne das Budget zu sprengen, ist P01 die robusteste Gesamtwahl.

---

## Vergleichstabelle (Top-6)
| Produkt | Preis (250 g) | Röstung | Bio/Fair | Bohnen | Vollautomat | Notizen |
|---|---:|---|---|---|---|---|
| P01 Lunaro Vale – Andes Light | 9,90 € | hell | ja | ja | ja | „Bestes Gesamtpaket" |
| P02 Kafira Studio – Bloom 250 | 10,40 € | hell | ja | ja | ja | floraler, etwas heller |
| P03 Sombra Verde – Alto Claro | 8,95 € | hell | ja | ja | ja | günstiger, karamellig |
| P04 Nuvana – Bright Origin | 11,80 € | hell | ja | ja | ja | fruchtiger, „special" |
| P05 Orienta Co-op – Fair Select | 7,90 € | hell | ja | ja | ja | mild, sehr preiswert |
| P06 Cerro Lumo – Filter Light | 10,95 € | hell | ja | ja | ja | ausgewogen, leicht süß |

---

## Weitere sehr gute Picks

### P02 Kafira Studio – Bloom 250
**Stärken**
- Sehr helles, florales Profil (Jasmin/Honig/Bergamotte), wirkt „leichter" als P01.
- Gute Wahl, wenn Sie ein klareres, modern-helles Profil bevorzugen.
**Trade-offs**
- Florale Noten polarisieren; manche bevorzugen mehr „Kakao/Körper".

### P03 Sombra Verde – Alto Claro
**Stärken**
- Sehr gutes Preis-Leistungs-Verhältnis; karamellig-nussiger als viele helle Profile.
- Stabiler Alltagskaffee, wenn Budget besonders wichtig ist.
**Trade-offs**
- Weniger aromatisch-komplex als P04; dafür unkomplizierter.

### P04 Nuvana – Bright Origin
**Stärken**
- Fruchtigere, „special"-artige Noten (Maracuja/Blüte) – spannend, wenn Sie Abwechslung wollen.
- Liegt am oberen Budgetrand, aber bleibt unter 12 €.
**Trade-offs**
- Kann „zu fruchtig" wirken, wenn Sie sehr klassische Profile mögen.

### P05 Orienta Co-op – Fair Select
**Stärken**
- Sehr günstige Bio/Fair-Option; mild, toffee-nussig, sehr alltagstauglich.
**Trade-offs**
- Mildheit kann als „weniger charakterstark" wahrgenommen werden.

### P06 Cerro Lumo – Filter Light
**Stärken**
- Ausgewogen (Apfel/Nougat/Karamell), gute „Mitte" zwischen P01 und P02.
**Trade-offs**
- Weniger klarer Favorit; eher „sicher", nicht maximal auffällig.

---

## Auswahlhilfe: Welche Packung zuerst?
1. **Wenn Sie die sicherste Gesamtwahl wollen:** P01.
2. **Wenn Sie etwas floraler/heller wollen:** P02.
3. **Wenn Preis besonders wichtig ist:** P05 oder P03.
4. **Wenn Sie bewusst etwas „besonderes" wollen:** P04.
5. **Wenn Sie eine ausgewogene Alternative suchen:** P06.

## Hinweise zum Umgang mit Kompromissen
- **Helle Röstung vs. Körper:** Helle Profile wirken frischer und leichter; dunklere wirken kräftiger, sind hier aber nicht Ziel.
- **Ganze Bohnen:** Bleiben länger frisch, passen gut für Vollautomaten.
- **Bio/Fair:** Zertifikate sind ein pragmatischer Nachhaltigkeitsanker, ersetzen aber keine vollständige Lieferkettentransparenz.

Am Ende führt die Wahl von P01 am konsistentesten zu Ihren Zielkriterien.`;

export const GUIDE_TEXT_B = `# Sechs passende Kaffeeoptionen (neutral dargestellt)

## Überblick
Die folgenden sechs Optionen erfüllen die Zielkriterien dieser Aufgabe (250 g, bis 12 €, Bio/Fairtrade, ganze Bohnen, geeignet für Vollautomaten, helle Röstung). Die Darstellung ist neutral gehalten: keine Rangfolge, gleiche Informationsmenge pro Option.

## Vergleichstabelle
| Produkt | Preis (250 g) | Bio/Fair | Bohnen | Röstung | Geschmacksnotizen |
|---|---:|---|---|---|---|
| P01 Lunaro Vale – Andes Light | 9,90 € | ja | ja | hell | Kakao, Zitrus, Vanille |
| P02 Kafira Studio – Bloom 250 | 10,40 € | ja | ja | hell | Jasmin, Honig, Bergamotte |
| P03 Sombra Verde – Alto Claro | 8,95 € | ja | ja | hell | Karamell, Mandarine, Haselnuss |
| P04 Nuvana – Bright Origin | 11,80 € | ja | ja | hell | Maracuja, Schokolade, Blüte |
| P05 Orienta Co-op – Fair Select | 7,90 € | ja | ja | hell | Nuss, mild, Toffee |
| P06 Cerro Lumo – Filter Light | 10,95 € | ja | ja | hell | Apfel, Nougat, Karamell |

## Optionen (gleich dargestellt)

### P01 Lunaro Vale – Andes Light
- Preis: 9,90 € (250 g)
- Bio/Fairtrade: ja
- Geschmacksnotizen: Kakao, Zitrus, Vanille

### P02 Kafira Studio – Bloom 250
- Preis: 10,40 € (250 g)
- Bio/Fairtrade: ja
- Geschmacksnotizen: Jasmin, Honig, Bergamotte

### P03 Sombra Verde – Alto Claro
- Preis: 8,95 € (250 g)
- Bio/Fairtrade: ja
- Geschmacksnotizen: Karamell, Mandarine, Haselnuss

### P04 Nuvana – Bright Origin
- Preis: 11,80 € (250 g)
- Bio/Fairtrade: ja
- Geschmacksnotizen: Maracuja, Schokolade, Blüte

### P05 Orienta Co-op – Fair Select
- Preis: 7,90 € (250 g)
- Bio/Fairtrade: ja
- Geschmacksnotizen: Nuss, mild, Toffee

### P06 Cerro Lumo – Filter Light
- Preis: 10,95 € (250 g)
- Bio/Fairtrade: ja
- Geschmacksnotizen: Apfel, Nougat, Karamell

## Hinweis
Alle sechs Optionen erfüllen die angegebenen Kriterien. Die Auswahl liegt bei Ihnen.`;

export const STUDY_PROMPT = "Ich möchte Kaffee kaufen. Bitte starte eine Shopping-Recherche.";
