import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
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

export interface ProductCard {
  id: string;
  title: string;
  price: string;
  merchant: string;
  imageUrl: string;
  attributes: Record<string, string>;
  rating?: string;
  reviews?: string;
}

export interface WorkflowAnswers {
  budget?: string;
  aroma?: string;
  properties?: string[];
}

export interface WorkflowState {
  userPrompt: string;
  answers: WorkflowAnswers;
  currentProductIndex: number;
  productRatings: Record<string, 'interested' | 'not_interested' | null>;
}

export type AppState = 
  | 'start'
  | 'mode_selection'
  | 'loading'
  | 'starting'
  | 'budget'
  | 'aroma'
  | 'properties'
  | 'review_gate'
  | 'product_cards'
  | 'transition'
  | 'final_guide';

export interface Source {
  id: string;
  name: string;
  title: string;
  icon?: string;
}

export const mockProductCards: ProductCard[] = [
  {
    id: '1',
    title: 'dmBio Caffè Crema ganze Bohne Naturland',
    price: '6,95 €',
    merchant: 'dm.de',
    imageUrl: '/placeholder-coffee-1.jpg',
    rating: '4.5',
    reviews: '234',
    attributes: {
      'Marke': 'dmBio',
      'Verarbeitungsform': 'Ganze Bohne',
      'Zertifizierung': 'Naturland, Bio',
      'Herkunft': 'Peru, Honduras',
      'Röstgrad': 'Mittel',
    }
  },
  {
    id: '2',
    title: 'Fresh Ground Coffee Pack',
    price: '7,95 €',
    merchant: 'Butlers Chocolates UC',
    imageUrl: '/placeholder-coffee-2.jpg',
    rating: '4.2',
    reviews: '156',
    attributes: {
      'Verpackungsabmessungen': '8 x 10 x 25 cm',
      'Produktbezeichnung': 'Gemahlener Kaffee',
      'Netto-Gewicht': '250 Gramm',
    }
  },
  {
    id: '3',
    title: 'Jacobs Kaffee Krönung',
    price: '6,82 €',
    merchant: 'Kaffeehenk',
    imageUrl: '/placeholder-coffee-3.jpg',
    rating: '4.7',
    reviews: '4843',
    attributes: {
      'Marke': 'Jacobs',
      'Verarbeitungsform': 'Gemahlen',
      'Röstgrad': 'Mittel',
      'Aroma': 'Ausgewogen, mild',
    }
  },
  {
    id: '4',
    title: 'Tchibo Kaffeeprobierset Caffè Crema und Espresso 400g',
    price: '9,99 €',
    merchant: 'Amazon.de',
    imageUrl: '/placeholder-coffee-4.jpg',
    rating: '4.6',
    reviews: '1247',
    attributes: {
      'Marke': 'Tchibo',
      'Inhalt': '4 x 100g',
      'Verarbeitungsform': 'Ganze Bohne',
      'Röstgrad': 'Verschiedene',
    }
  },
  {
    id: '5',
    title: 'Dallmayr Home Barista Caffè Crema',
    price: '8,49 €',
    merchant: 'Amazon.de',
    imageUrl: '/placeholder-coffee-5.jpg',
    rating: '4.8',
    reviews: '8234',
    attributes: {
      'Marke': 'Dallmayr',
      'Form': 'Ganze Bohne',
      'Röstgrad': 'Mittlere Röstung',
      'Gewicht': '1kg',
    }
  },
  {
    id: '6',
    title: 'Landpark Bio Kaffee Crema',
    price: '7,49 €',
    merchant: 'bio-laden.de',
    imageUrl: '/placeholder-coffee-6.jpg',
    rating: '4.4',
    reviews: '567',
    attributes: {
      'Marke': 'Landpark',
      'Zertifizierung': 'Bio',
      'Verarbeitungsform': 'Ganze Bohne',
      'Röstgrad': 'Mittel',
    }
  },
  {
    id: '7',
    title: 'Fairglobe Bio Fairtrade Café del Mundo',
    price: '5,99 €',
    merchant: 'Lidl',
    imageUrl: '/placeholder-coffee-7.jpg',
    rating: '4.3',
    reviews: '892',
    attributes: {
      'Marke': 'Fairglobe',
      'Zertifizierung': 'Fairtrade, Bio',
      'Verarbeitungsform': 'Gemahlen',
      'Herkunft': 'Südamerika',
    }
  },
  {
    id: '8',
    title: 'GLOBO Bio-Kaffee COCLA Peru',
    price: '8,95 €',
    merchant: 'globo-fairtrade.com',
    imageUrl: '/placeholder-coffee-8.jpg',
    rating: '4.6',
    reviews: '423',
    attributes: {
      'Marke': 'GLOBO',
      'Zertifizierung': 'Bio, Fairtrade',
      'Herkunft': 'Peru',
      'Verarbeitungsform': 'Ganze Bohne',
    }
  },
  {
    id: '9',
    title: 'GEPA Faires Pfund Bio Espresso',
    price: '9,49 €',
    merchant: 'GEPA Fair Trade Shop',
    imageUrl: '/placeholder-coffee-9.jpg',
    rating: '4.7',
    reviews: '634',
    attributes: {
      'Marke': 'GEPA',
      'Zertifizierung': 'Fairtrade, Bio',
      'Verarbeitungsform': 'Ganze Bohne',
      'Röstgrad': 'Dunkel',
    }
  },
  {
    id: '10',
    title: 'Naturgut Bio Kaffee Crema',
    price: '6,49 €',
    merchant: 'Penny',
    imageUrl: '/placeholder-coffee-10.jpg',
    rating: '4.1',
    reviews: '312',
    attributes: {
      'Marke': 'Naturgut',
      'Zertifizierung': 'Bio',
      'Verarbeitungsform': 'Ganze Bohne',
      'Röstgrad': 'Mittel',
    }
  }
];

export const mockSources: Source[] = [
  { id: '1', name: 'Coffeeness', title: 'Die 10 besten Discounter-Kaffeebohnen im Test 2026: Aldi, Lidl & Co' },
  { id: '2', name: 'SupermarktCheck', title: 'Fairglobe Bio Cafe del Mundo ganze Bohne: Preis, Angebote & Bewertungen' },
  { id: '3', name: 'Coffeeness', title: 'Die besten Discounter-Kaffeebohnen im Test 2026: Aldi, Lidl & Co' },
  { id: '4', name: 'Lidl', title: 'Fairglobe Bio Fairtrade Cafe del Mundo kaufen | LIDL' },
  { id: '5', name: 'GLOBO', title: 'Bio-Kaffee COCLA PERU - hier auf globo-fairtrade.com | GLOBO' },
  { id: '6', name: 'GLOBO', title: 'Bio-Kaffee COCLA PERU - hier auf globo-fairtrade.com | GLOBO' },
  { id: '7', name: 'GEPA Shop', title: 'Faires Pfund Bio Espresso | Bohnen – GEPA Fair Trade Shop' },
  { id: '8', name: 'GEPA Shop', title: 'Faires Pfund Bio Espresso | Bohnen – GEPA Fair Trade Shop' },
];

export const finalGuideMarkdown = `# Kaffee kaufen: schnelle, gute Optionen für Vollautomat und kleines Budget

## Kurzer Überblick

Du suchst fair/bio-zertifizierten Kaffee für deinen Vollautomaten, bei einem Budget unter 10 € pro Packung. Die Auswahl fokussiert sich auf ganze Bohnen, die für Vollautomaten geeignet sind, mit Fairtrade- oder Bio-Zertifizierung.

---

## Beste Gesamtwahl

### dmBio Caffè Crema ganze Bohne Naturland

**Warum diese Wahl zuerst?**
- Erfüllt beide Kriterien: Bio (Naturland) und Budget unter 10 €
- Speziell für Vollautomaten konzipiert
- Bei dm flächendeckend verfügbar

**Typischer Geschmack / Einsatz:**
- Ausgewogen, mild-aromatisch
- Ideal für Caffè Crema aus dem Vollautomaten
- Mittlere Röstung für vielseitigen Genuss

**Tradeoffs:**
- Keine Fairtrade-Zertifizierung (nur Bio/Naturland)
- Geschmack eher mild – für kräftigeren Espresso weniger geeignet

**Verfügbarkeit / Hinweis:**
- dm-Märkte deutschlandweit, auch online
- Preis: 6,95 € für 250g

---

## Vergleichstabelle

| Produkt | Preis pro Packung | Fair/Bio | Geschmack/Einsatz | Verfügbarkeit |
|---------|-------------------|----------|-------------------|---------------|
| dmBio Caffè Crema | 6,95 € | Bio | Mild, Crema | dm |
| Fairglobe Café del Mundo | 5,99 € | Fairtrade, Bio | Ausgewogen | Lidl |
| GLOBO COCLA Peru | 8,95 € | Fairtrade, Bio | Nussig, kräftig | Online |

---

## Weitere starke Picks

### 2) Budget-Top, stets fair/bio

**Fairglobe Bio Fairtrade Café del Mundo**

**Was spricht dafür:**
- Günstigster Preis mit doppelter Zertifizierung
- Bei Lidl regelmäßig verfügbar

**Einsatz:**
- Vollautomaten und Filtermaschinen
- Ausgewogenes Aroma

**Tradeoffs:**
- Nur als gemahlener Kaffee verfügbar
- Verfügbarkeit schwankt je nach Filiale

**Wann wählen:**
- Wenn Preis wichtigstes Kriterium ist

### 3) Solide Mittelpreis-Alternative für kräftigeren Geschmack

**GLOBO Bio-Kaffee COCLA Peru**

**Was spricht dafür:**
- Kräftigeres Aroma als dmBio
- Direkter Fairtrade-Bezug

**Einsatz:**
- Espresso und Caffè Crema
- Für Liebhaber intensiverer Röstungen

**Tradeoffs:**
- Nur online erhältlich
- Höherer Preis (8,95 €)

**Wann wählen:**
- Wenn du einen kräftigeren Geschmack bevorzugst

---

## Wie du die Auswahl weiter eingrenzt

- **Budget strikt ≤ 10 €?** Starte mit dmBio oder Fairglobe; beide erfüllen Budget, sind fair/bio und für Vollautomaten praxistauglich.
- **Testen kleineren Packs?** Nimm Globo 250g, um zu prüfen, ob du nussig-schokoladige, etwas kräftigere Profile magst, ohne gleich eine 500g-Packung zu kaufen.
- **Mehr Fair/Bio-Vertrauen, etwas kräftiger?** Wähle GEPA, wenn du bereit bist, knapp über Budget zu gehen, aber dafür eine sehr starke, auf Fair-Trade spezialisierte Marke zu nutzen.
- **Wenn nichts verfügbar ist:** Naturgut als Ersatz, aber Charge prüfen; oder im nächsten Einkauf bei dm oder Lidl erneut nach dmBio bzw. Fairglobe schauen.

---

## Hinweise zu Lagerung und Nutzung im Vollautomaten

- **Frisch öffnen, trocken und dunkel lagern;** idealerweise in einem luftdichten Behälter.
- **Für längere Haltbarkeit und besseren Geschmack** lohnt sich, eine 500g-Packung innerhalb von 2–4 Wochen zu verbrauchen. Kleinere Packungen wie 250g können helfen, wenn du selten Kaffee trinkst oder öfter verschiedene Sorten ausprobieren möchtest.

So bekommst du zuverlässig fair/bio-zertifizierten Kaffee für deinen Vollautomaten, ohne das Budget zu sprengen – mit klaren Alternativen, falls Verfügbarkeit oder Geschmack variieren.
`;
