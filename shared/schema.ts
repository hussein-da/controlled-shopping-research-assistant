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
  participantNotes: text("participant_notes"),
});

export const studyEvents = pgTable("study_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantId: varchar("participant_id").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  step: varchar("step", { length: 50 }),
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

export interface PreSurvey {
  p1_age: number;
  p4_online_shopping: string;
  p7_llm_usage: string;
  p8_llm_purchase: string;
  p9_familiarity: number;
}

export interface PostSurvey {
  q1_best_choice: string;
  q2_best_choice_likert: number;
  q3_which_product: string;
  q4_read_carefully: string;
  q5_prestructured: number;
  q6_time_pressure: number;
  q7_skip_worse: number;
  q8_budget_influence: number;
  q9_feedback_control: number;
  q10_status_competent: number;
  q11_reduced_choice: number;
  q12_normative: number;
  q13_comparison_table: number;
  q14_more_filters: number;
  q15_purchase_intent: number;
  q16_decision_certainty: number;
  q17_trust: number;
  q18_autonomy: number;
  q19_transparency: number;
  q20_satisfaction: number;
  q21_influences: string[];
  q21_other_text?: string;
}

export interface RequirementAnswers {
  r1_amount: string[];
  r2_budget: string[];
  r3_attributes: string[];
  r4_grind: string[];
  r1_other?: string;
  r2_other?: string;
  r3_other?: string;
  r4_other?: string;
}

export interface NormalizedTarget {
  amount: string;
  budget: string;
  attributes: string;
  grind: string;
}

export const NORMALIZED_TARGET: NormalizedTarget = {
  amount: "250g",
  budget: "bis 12 €",
  attributes: "Bio/Fairtrade",
  grind: "ganze Bohnen"
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
    name: "PachaLumo – Chanchamayo Bio",
    brand: "PachaLumo",
    price_eur: 9.95,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Frucht", "Vanille", "mild"],
    shipping_days: "2-5 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Beste Gesamtwahl", "Helle Röstung aus Peru"],
    image_path: "/products/P01.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P02",
    name: "Riftara – Yirgacheffe Flora",
    brand: "Riftara",
    price_eur: 9.95,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Floral", "würzig", "Single Origin"],
    shipping_days: "1-3 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Äthiopischer Single Origin", "Florale Aromen"],
    image_path: "/products/P02.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P03",
    name: "Kuntaro – Cocoa Dark",
    brand: "Kuntaro",
    price_eur: 9.95,
    pack_g: 250,
    roast: "dunkel",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Schokolade", "Trockenobst", "kräftig"],
    shipping_days: "3-5 Tage",
    short_bullets: ["Bio & Fairtrade zertifiziert", "Kräftiges Profil", "Dunkle Schokoladennoten"],
    image_path: "/products/P03.jpg",
    suitable_for: ["vollautomat", "espresso"]
  },
  {
    id: "P04",
    name: "Bonavia – City Blend",
    brand: "Bonavia",
    price_eur: 9.95,
    pack_g: 250,
    roast: "mittel",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Nuss", "Schokolade", "ausgewogen"],
    shipping_days: "2-4 Tage",
    short_bullets: ["Spezialitätenröster", "Ausgewogener Blend", "Alltagstauglich"],
    image_path: "/products/P04.jpg",
    suitable_for: ["vollautomat"]
  },
  {
    id: "P05",
    name: "BuenaRosa – Pink Bourbon",
    brand: "BuenaRosa",
    price_eur: 9.95,
    pack_g: 250,
    roast: "hell",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Rose", "Orange", "Johannisbeere"],
    shipping_days: "2-4 Tage",
    short_bullets: ["Premium Single Origin", "Kolumbien Huila", "Florale Frucht"],
    image_path: "/products/P05.jpg",
    suitable_for: ["vollautomat", "filter"]
  },
  {
    id: "P06",
    name: "Kebena Forest – Regenwald Bio",
    brand: "Kebena Forest",
    price_eur: 9.95,
    pack_g: 250,
    roast: "mittel",
    bio_fair: true,
    whole_beans: true,
    tasting_notes: ["Zitrus", "Beere", "Gewürze"],
    shipping_days: "2-5 Tage",
    short_bullets: ["Bio-Filterkaffee", "Äthiopien", "Günstiger Bio-Alltagskaffee"],
    image_path: "/products/P06.jpg",
    suitable_for: ["vollautomat", "filter"]
  }
];

export const TOP_6_PRODUCTS = products;

export interface RatingProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  pack_size: string;
  tasting_notes: string[];
  special: string;
  image_path: string;
}

export const RATING_PRODUCTS: RatingProduct[] = [
  {
    id: "R01",
    name: "EDEKA Bio Caffè Crema",
    brand: "EDEKA Bio",
    price: "12,70 €",
    pack_size: "1 kg",
    tasting_notes: ["mittel", "rund", "vielfältig"],
    special: "Unabhängiger Testsieg",
    image_path: "/attached_assets/R01_1768905979935.jpg"
  },
  {
    id: "R02",
    name: "Melitta Barista Classic Crema",
    brand: "Melitta",
    price: "11,45 €",
    pack_size: "1 kg",
    tasting_notes: ["zartbitter", "rund"],
    special: "Milchdrinks / Vollautomat",
    image_path: "/attached_assets/R02_1768905979935.jpg"
  },
  {
    id: "R03",
    name: "Jacobs Krönung Signature Classic",
    brand: "Jacobs",
    price: "9,99 €",
    pack_size: "500 g",
    tasting_notes: ["ausgewogen", "leicht nussig"],
    special: "Alltagskaffee",
    image_path: "/attached_assets/R03_1768905979934.jpg"
  },
  {
    id: "R04",
    name: "Berliner Kaffeerösterei Azúcar Espresso",
    brand: "Berliner Kaffeerösterei",
    price: "11,95 €",
    pack_size: "250 g",
    tasting_notes: ["karamellig", "kräftige Süße"],
    special: "Sofort verfügbar, 2–5 Tage",
    image_path: "/attached_assets/R04_1768905979934.jpg"
  },
  {
    id: "R05",
    name: "Nicaragua Flores del Café",
    brand: "Berliner Kaffeekontor",
    price: "ab 9,90 €",
    pack_size: "Single Origin",
    tasting_notes: ["nussig", "feinfruchtig", "mild"],
    special: "Social-Project Single Origin",
    image_path: "/attached_assets/R05_1768905979933.jpg"
  }
];

export interface WorkflowAnswers {
  r1_amount?: string[];
  r2_budget?: string[];
  r3_attributes?: string[];
  r4_grind?: string[];
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
  | 'r1_amount'
  | 'r2_budget'
  | 'r3_attributes'
  | 'r4_grind'
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
  r1_amount: [
    { value: "250g", label: "250g" },
    { value: "250-500g", label: "250-500g" },
    { value: "500-1000g", label: "500-1000g" },
    { value: ">1kg", label: ">1kg" }
  ],
  r2_budget: [
    { value: "bis 8 €", label: "bis 8 €" },
    { value: "bis 12 €", label: "bis 12 €" },
    { value: "bis 20 €", label: "bis 20 €" },
    { value: "20 € +", label: "20 € +" }
  ],
  r3_attributes: [
    { value: "Bio/Fairtrade", label: "Bio/Fairtrade" },
    { value: "schneller Versand", label: "schneller Versand" },
    { value: "säurearm", label: "säurearm" },
    { value: "Single Origin", label: "Single Origin" }
  ],
  r4_grind: [
    { value: "ganze Bohnen", label: "ganze Bohnen" },
    { value: "Filter gemahlen", label: "Filter gemahlen" },
    { value: "Espresso gemahlen", label: "Espresso gemahlen" },
    { value: "Pads/Kapseln", label: "Pads/Kapseln" }
  ]
};

export const REJECTION_REASONS = [
  { value: "price", label: "Price" },
  { value: "taste_profile", label: "Taste profile" },
  { value: "sustainability", label: "Sustainability" },
  { value: "brand_trust", label: "Brand/Trust" },
  { value: "something_else", label: "Something else" }
];

export const GUIDE_TEXT = `# Gute, preiswerte ganze Kaffeebohnen in Deutschland

## Kurzfassung

Du willst ganze Bohnen, 250‑g‑Packung, möglichst bis etwa 12 € und idealerweise Bio/Fairtrade. Unten stehen 6 konkrete, sofort bestellbare Optionen – zwei klare Top‑Empfehlungen innerhalb deines Budgets plus vier starke Alternativen, teils leicht über Budget, aber aus guten Gründen interessant. Jede Empfehlung nennt Preis, Verfügbarkeit, Geschmackstyp, Vor‑ und Nachteile sowie eine unabhängige Resonanz oder Quelle, wo vorhanden.

---

## Beste Gesamtwahl

**Warum dieser Kauf die beste Alltagswahl ist**

* **Budget passt exakt.** Mit 9,95 € liegt die Packung deutlich unter deinem Limit von 12 €.
* **Bio‑/Fair‑ und Nachhaltigkeitsaspekt sehr deutlich.** Produktseite nennt 100 % Bio‑Arabica aus Peru mit schonender Hell­röstung; direkte Herkunfts‑ und Verarbeitungsangaben sind vorhanden. ([peru-kaffee-kaufen.de][1])
* **Lieferbarkeit realistisch.** 2–5 Tage Lieferzeit angegeben, also brauchbar für schnellen Verbrauch. ([peru-kaffee-kaufen.de][2])
* **Geschmacklich eher mild‑fruchtig mit angenehmer Säure.** Roaster beschreibt Frucht‑ und Vanille‑Noten, helle Röstung und reduzierte Chlorogensäure für angenehme Bekömmlichkeit. ([peru-kaffee-kaufen.de][3])
* **Unabhängige Beurteilung vorhanden.** Ein externer Testbericht lobt gute Crema, vollmundigen und milden Geschmack mit relativ geringem Säuregrad – genau das, was viele Alltagsnutzer ohne starke Säure wollen. ([Produkttests von uns für Euch!][4])

**Für wen besonders geeignet**

* Wer täglich Filterkaffee oder milde Getränke möchte, aber nicht auf Zertifizierungen oder Herkunft verzichten will.
* Käufer mit klaren Budgetgrenzen, die keine Experimente mit teuren, schwer erhältlichen Spezialitäten wollen.

**Trade‑offs**

* Hell geröstet heißt: mehr feine Fruchtnoten, weniger kräftige Schokolade oder Nuss; wer sehr dunkle, fast italienische Profile mag, könnte weniger zufrieden sein.
* Die Marke ist eher auf fairen Handel und milde Profile ausgerichtet; wer extrem ausgefallene Single‑Origin‑Experimente sucht, findet teilweise intensivere Spezialitäten bei etwas höheren Preisen.

**Kurzurteil:** Sehr gutes Preis‑Leistungs‑Verhältnis, echte Bio‑Auszeichnung, relativ breiter Genuss‑bereich, schnell lieferbar – deshalb der beste Startpunkt.

---

## Weitere Top‑Optionen

### 2) Klarer zweitbester Kauf unter 12 €

**Was diesen Kaffee stark macht**

* **Preis im Budget, aber deutlich spezialitätiger Stil.** 9,95 € für 250 g, also sogar günstiger als viele Standard‑Mischungen. Kaufstatus als sofort lieferbar mit 1–3 Werktagen angegeben. ([Kaffeezentrale DE GmbH][5])
* **Herkunft und Röststil klar: äthiopischer Single Origin, florale und würzige Noten, handgeröstet.** Händlerbeschreibung erläutert florale Aromen, akzentuierte, ausgewogene Säure und längeren Abgang – typische Charakteristik eines Yirgacheffe. ([Kaffeezentrale DE GmbH][6])
* **Unterstützende Berichterstattung.** Ein dritter Medienbeitrag zum Riftara‑Projekt hebt den Ursprung in Äthiopien, die lokale Verarbeitung und den langsamen Trommelröstprozess hervor – Aspekte, die über reine Produktdaten hinaus auf Werte und Qualität schließen lassen. ([Espresso Kaffee Blog.de][7])

**Eignung**

* Wer Filterkaffee oder leichte Zubereitungen bevorzugt und klar definierte Frucht‑/Blumennoten mag, aber ohne den Preis von Premium‑Single‑Origin‑Röstungen bezahlen will.
* Passend für ganztägigen Konsum mit eher eleganten Tassenprofilen statt schwerer, dunkler Espresso‑Profile.

**Trade‑offs**

* **Nicht für Liebhaber dunkler, schokoladiger Röstungen.** Yirgacheffe‑Stil ist heller, lebhafter, teils stärker säurebetont; sensibles Mägen könnten es weniger mögen, wenngleich die Balance laut Händler als harmonisch beschrieben wird.
* **Stärker spezialisierter Geschmack.** Wer nur einen einen einzigen Kaffee für alle Getränke möchte, findet bei Mischungen oft neutralere, breiter nutzbare Profile.

**Kurzurteil:** Spitzenpick im Budget für anspruchsvollere, klare Aromen, nicht nur als Notlösung – exzellenter Wert.

---

### 3) Bestes dunkles, kräftiges Profil im Budget

**Warum dieser Pick lohnt**

* **Preis unter 12 € mit starkem Geschmack:** 9,95 € für ganze Bohnen, also Budget‑konform; dunkle Röstung mit kräftigem Körper, wenig Säure.
* **Herkunft und nachhaltige Partnerstruktur transparent:** Peruanischer Spezialitätenkaffee von Fair‑Trade‑, Bio‑ und Rainforest‑Alliance‑zertifizierter Kooperative, mit konkreten Angaben zu Farm, Varietät, Höhenlagen und Herstellung. ([Mókuska Caffè][8])
* **Klare Geschmacksbeschreibung:** Dunkle Schokolade, Trockenobst, Marzipan, Melasse; fast italienischer Stil, stark, vollmundig, säurearm – ideal wenn man einen kräftigen Espresso oder Milchkaffee möchte. ([Mókuska Caffè][9])
* **Externe Nutzer‑Resonanz existiert, zeigt differenzierte Wahrnehmung:** In einem Reddit‑Thread berichten manche Nutzer von negativen Erfahrungen mit säurebetonten Röstungen anderer Produkte, aber explizit der Kuntaro wurde mehrfach positiv erwähnt, auch bei Siebträgern. ([Reddit][10])
* **Versandzeit angegeben:** 3–5 Tage Bearbeitung/Versand bei Händler, praktikabel für Normalverbrauch. ([Mókuska Caffè][11])

**Eignung**

* Espresso‑ oder Milchgetränke‑Fans, die dunkle, schokolade‑ und karamellbetonte Profile mögen.
* Wer südamerikanische Kooperationen und faire Standards schätzt, ohne Premium‑Preise.

**Trade‑offs**

* **Nicht hell, nicht fruchtig:** Personen, die florale oder beerige Noten suchen, finden hier weniger.
* **Starkes Profil kann manche Zubereitungen dominieren:** Bei sehr feinen Filtermethoden kann das dunkle Profil weniger die Leichtigkeit zeigen, die manche wollen.

**Kurzurteil:** Sehr guter, fairer, kräftiger Espresso‑ oder Milchkaffee‑Starter unter 12 €; ein Premium‑Gefühl ohne Premium‑Preis.

---

### 4) Breites Alternativprofil, sehr etabliert

**Stärken**

* **Top‑Roaster, sehr ausgewogenes Mischprofil.** Bonavia ist eine der bekannteren Spezialitätenröstereien; diese Mischung kombiniert brasilianische und peruanische Bohnen, meist mit schokoladig‑nussigen Noten und guter Alltagstauglichkeit.
* **Preis im Budget:** 9,95 € liegt klar unter deinem Limit. Für Käufer, die einen ausgewogenen Alltagskaffee möchten, eine solide Wahl.
* **Gute Verfügbarkeit über etablierte Händler.** roastmarket listet das Produkt mit Standard‑Retail‑Struktur, häufig vorrätig oder leicht nachbestellbar.

**Eignung**

* Wer nicht nur sparen, sondern auch einen etablierten Spezialitätenblend aus Berlin probieren möchte.
* Nutzer mit Mühle oder Siebträger, die ein rundes Profil wünschen – nicht zu hell, nicht zu dunkel.

**Trade‑offs**

* **Nicht explizit Bio/Fair‑Claim auf der Seite hier im Listing:** Das Produkt kann andere Zertifizierungen oder Werte haben, aber als Mischung fokussiert es primär auf Geschmack und Balance, nicht zwingend auf Bio‑Label.

**Kurzurteil:** Sehr guter Allrounder aus Top‑Röster‑Umfeld; lohnt sich für ausgewogenen Genuss.

---

### 5) Premium‑Single‑Origin, sehr transparent

**Was diesen Kaffee besonders macht**

* **Detaillierte Herkunft, moderne Spezialitätenaufbereitung.** Kolumbien, Huila, Pink Bourbon, washed, mit ausführlicher Beschreibung von Produzent, Verarbeitung, Trocknung und Fermentation auf der Händlerseite; das ist ungewöhnlich transparent und ideal für bewusste Käufer. ([elbgold][12])
* **Aromenprofil klar definiert:** Rose, Orange, rote Johannisbeere; damit eher florale, fruchtige, hochqualitative Tasse – eine echte Premium‑Single‑Origin.
* **Preis im Budget.** 9,95 € – deutlich unter deinem Limit, wenn man ein klar anderes Profil probieren will.

**Eignung**

* Trinker, die lieber klar definierte Single‑Origin‑Noten statt Mischungen wollen.
* Käufer mit Zeit und Interesse, mehr über die Produzenten und Verarbeitung zu erfahren, und die eventuell auch später weitere Profile aus dem gleichen Portfolio probieren möchten.

**Trade‑offs**

* **Leicht weniger universell als Mischungen.** Hochwertige Single‑Origin‑Profile können bei manchem, der nur sehr neutralen Kaffee sucht, zu präsent oder ungewohnt wirken.

**Kurzurteil:** Sehr starker, transparenter Spezialitätenkaffee mit klarer Herkunft und hochwertiger Aufbereitung – zahlt sich mit Erlebnis und Wissen aus.

---

### 6) Preisgünstiger Bio‑Filterkaffee mit klarer Herkunft, innerhalb Budget

**Warum ein sinnvoller Zusatzkauf**

* **Preis deutlich unter Budget, Bio‑Fokus kommuniziert.** Auf der Produktseite wird Bio‑Filterkaffee aus Äthiopien angeboten; Stückpreis ab 9,95 € für 250 g, mit Staffelpreisen bei größeren Mengen. ([Berliner Kaffeerösterei][13])
* **Verfügbarkeit zügig, Standardversand:** Sofort verfügbar, Lieferzeit 2–5 Tage – passt gut in einen Alltagsplan. ([Berliner Kaffeerösterei][14])
* **Aromatische Vielfalt, trotzdem leicht trinkbar:** Beschreibung nennt Zitrus‑ und Beerennoten kombiniert mit Gewürzen und Schokolade; geeignet für Handfilter oder normale Maschine, also breites Einsatzfeld. ([Berliner Kaffeerösterei][15])
* **Starker Wert bei wenig Aufwand:** Gute Wahl, wenn man einen günstigen, fairen Bio‑Kaffee braucht, ohne sich auf sehr helle oder sehr dunkle Extreme festzulegen.

**Eignung**

* Studierende oder Haushalte, die einen günstigen Bio‑Kaffee für tägliche Nutzung suchen.
* Nutzer mit Handfilter oder Standard‑Filtermaschine, die geschmacklich etwas mehr als reine Massenware wollen, aber nicht viel mehr zahlen möchten.

**Trade‑offs**

* **Mittelröstung, keine sehr ungewöhnlichen Spezialitätenprofile.** Wer echte Single‑Origin‑Exoten sucht, wählt Riftara oder BuenaRosa.
* **Nicht explizit Fairtrade auf dieser Seite ersichtlich; Bio steht im Fokus.** Fairtrade kann bei anderen Optionen stärker betont werden, etwa bei PachaLumo oder Kuntaro.

**Kurzurteil:** Sehr preisgünstige, schnell verfügbare Bio‑Option mit angenehmem Aroma – guter Alltagskaffee, der das Budget stark schont.

---

## Vergleichstabelle

Vergleich der 6 Picks nach wichtigsten Kriterien

| Produkt | Preis | Bio/Fairtrade | Geschmacksstil | Verfügbarkeit | Beste Nutzung |
| :--- | :---: | :--- | :--- | :---: | :--- |
| PachaLumo – Chanchamayo Bio | 9,95 € | Bio klar, Fair‑Details stark | Mild, fruchtig, hell geröstet | 2–5 Tage | Täglich, Budget |
| Riftara – Yirgacheffe Flora | 9,95 € | Ursprung & Werte stark | Floral, lebhaft, Single Origin | 1–3 Tage | Anspruchsvoll, günstige Spezialität |
| Kuntaro – Cocoa Dark | 9,95 € | Fair‑Trade/Bio/Rainforest | Dunkel, schokoladig, kräftig | 3–5 Tage | Espresso/Milchkaffee |
| Bonavia – City Blend | 9,95 € | eher Geschmack und Balance | Ausgewogen, Alltagstauglich | 2–4 Tage | Premium‑Alltag |
| BuenaRosa – Pink Bourbon | 9,95 € | Premium‑Single‑Origin | Florale, hochwertige Single Origin | 2–4 Tage | Anspruchsvolle Single‑Origin |
| Kebena Forest – Regenwald Bio | 9,95 € | Bio‑Filterkaffee | Mittel, fruchtig‑würzig | 2–5 Tage | Günstiger Bio‑Alltagskaffee |

---

## Wie die Auswahl zustande kam

* **Budget, Größe, Form:** Fokus auf 250‑g‑Packungen, ganze Bohnen, Preis ≤ 12 € als strenger Filter.
* **Bio/Fair‑Aspekt:** Priorität für Marken und Produkte mit Bio oder Fair‑Trade bzw. klaren Werte‑ und Herkunftsangaben – mindert Risiko von reinen Massenprodukten, schafft transparente Auswahl.
* **Unabhängige Stimmen:** Für mehrere Picks vorhandene Dritte‑Parteien‑Quellen genutzt, um nicht nur Hersteller‑Claims zu übertragen. PachaLumo mit Testbericht, Riftara mit Medienbeitrag, Kuntaro mit Community‑Feedback.
* **Verfügbarkeit:** Auf Händlerseiten Lieferzeiten und Status geprüft, um sofortige Bestellbarkeit zu gewährleisten; keine spekulativen oder unklaren Listings.

---

## Zusatzhinweise zur Auswahl

* Wenn du noch unsicher bist, beginne mit **PachaLumo** oder **Riftara**. Bleibt das Budget strikt ≤ 12 €, sind beide die sichersten, qualitativ starken Käufe.
* Falls du etwas dunkler magst oder mehr Körper, probiere **Kuntaro** direkt.
* Falls du einmal ein besonderes Geschmackserlebnis willst, das höhere Wissen über Herkunft bietet, probiere **BuenaRosa**.
* Für sehr kleines Budget bei gleichzeitig fairen, biologischen Bedingungen ist **Kebena Forest** optimal.

So kannst du schnell entscheiden, ohne lange zu vergleichen – und hast zugleich eine gute Basis, um später weitere Spezialitäten systematisch auszuprobieren.

[1]: https://example.com/pachalumo-1 "PachaLumo Kaffee 250g (hell geröstet)"
[2]: https://example.com/pachalumo-2 "PachaLumo Kaffee 250g (hell geröstet)"
[3]: https://example.com/pachalumo-3 "PachaLumo Kaffee 250g (hell geröstet)"
[4]: https://example.com/pachalumo-test "Fairtrade Kaffee PachaLumo im Test"
[5]: https://example.com/riftara-1 "Riftara Yirgacheffe, 250 g Bohne"
[6]: https://example.com/riftara-2 "Riftara Yirgacheffe, 250 g Bohne"
[7]: https://example.com/riftara-3 "Riftara-Kaffee: Zu 100 Prozent aus Äthiopien"
[8]: https://example.com/kuntaro-1 "Espresso Kuntaro | Mókuska Kaffeerösterei"
[9]: https://example.com/kuntaro-2 "Espresso Kuntaro | Mókuska Kaffeerösterei"
[10]: https://example.com/kuntaro-reddit "Community-Feedback zu Kuntaro"
[11]: https://example.com/kuntaro-3 "Espresso Kuntaro | Mókuska Kaffeerösterei"
[12]: https://example.com/buenarosa-1 "BuenaRosa Pink Bourbon | elbgold"
[13]: https://example.com/kebena-1 "Kebena Forest Regenwald Bio"
[14]: https://example.com/kebena-2 "Kebena Forest Regenwald Bio"
[15]: https://example.com/kebena-3 "Kebena Forest Regenwald Bio"`;

export const STUDY_PROMPT = "Ich möchte Kaffee kaufen. Bitte starte eine Shopping-Recherche.";
