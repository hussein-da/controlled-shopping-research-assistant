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
  | 'prompt_sent'
  | 'budget'
  | 'aroma'
  | 'properties'
  | 'review_gate'
  | 'product_cards'
  | 'final_guide';

export const mockProductCards: ProductCard[] = [
  {
    id: '1',
    title: 'J.J. Darboven Specialty Melange Finesse',
    price: '119,90 €',
    merchant: 'Amazon.de - Amazon.de-Seller',
    imageUrl: '/placeholder-coffee-1.jpg',
    attributes: {
      'Verpackungsabmessungen': '10,5 x 31 x 30,5 cm; 6 Kilogramm',
      'Produktbezeichnung': 'Röstkaffee in Bohnen',
      'Netto-Gewicht': '6 Kilogramm',
      'Ursprungsland': 'Albanien',
      'Koffeingehalt': 'Koffeinhaltig',
      'Form': 'Ganze Bohne',
      'Röstgrad': 'Mittlere Röstung',
      'Paketinformationen': 'Tasche',
    }
  },
  {
    id: '2',
    title: 'Lavazza Qualità Rossa Kaffeebohnen',
    price: '14,99 €',
    merchant: 'Amazon.de',
    imageUrl: '/placeholder-coffee-2.jpg',
    attributes: {
      'Verpackungsabmessungen': '8 x 10 x 25 cm; 1 Kilogramm',
      'Produktbezeichnung': 'Röstkaffee in Bohnen',
      'Netto-Gewicht': '1 Kilogramm',
      'Ursprungsland': 'Italien',
      'Koffeingehalt': 'Koffeinhaltig',
      'Form': 'Ganze Bohne',
      'Röstgrad': 'Mittlere Röstung',
      'Paketinformationen': 'Vakuumverpackt',
    }
  },
  {
    id: '3',
    title: 'Jacobs Krönung Ganze Bohnen',
    price: '12,49 €',
    merchant: 'Amazon.de',
    imageUrl: '/placeholder-coffee-3.jpg',
    attributes: {
      'Verpackungsabmessungen': '9 x 12 x 22 cm; 500 Gramm',
      'Produktbezeichnung': 'Röstkaffee in Bohnen',
      'Netto-Gewicht': '500 Gramm',
      'Ursprungsland': 'Deutschland',
      'Koffeingehalt': 'Koffeinhaltig',
      'Form': 'Ganze Bohne',
      'Röstgrad': 'Leichte Röstung',
      'Paketinformationen': 'Aromaversiegelt',
    }
  }
];

export const finalGuideMarkdown = `# Kaffee kaufen: schnelle, gute Optionen für Zuhause

## Zusammenfassung

Dieser Ratgeber hilft dir, den passenden Kaffee für deinen Alltag zu finden. Basierend auf deinen Präferenzen haben wir die besten Optionen zusammengestellt – von Premium-Bohnen bis zu erschwinglichen Alternativen.

## Best overall

### J.J. Darboven Specialty Melange Finesse

**Warum diese Wahl?**
- Ausgezeichnete Balance zwischen Qualität und Geschmack
- Mittlere Röstung für vielseitigen Genuss
- Ganze Bohnen für maximale Frische

**Eigenschaften:**
- Herkunft: Hochwertige Arabica-Mischung
- Röstgrad: Mittel
- Geschmacksprofil: Ausgewogen, mild-aromatisch
- Preis: 119,90 € für 6 kg (ca. 20 €/kg)

---

## Vergleichstabelle

| Produkt | Preis | Menge | Preis/kg | Röstgrad | Bewertung |
|---------|-------|-------|----------|----------|-----------|
| J.J. Darboven Melange | 119,90 € | 6 kg | ~20 € | Mittel | ⭐⭐⭐⭐⭐ |
| Lavazza Qualità Rossa | 14,99 € | 1 kg | 14,99 € | Mittel | ⭐⭐⭐⭐ |
| Jacobs Krönung | 12,49 € | 500 g | 24,98 € | Leicht | ⭐⭐⭐⭐ |

---

## Weitere Picks

### (2) Lavazza Qualità Rossa
Italienische Traditionsmarke mit kräftigem Geschmack. Ideal für Espresso-Liebhaber, die einen vollmundigen Kaffee bevorzugen.

### (3) Jacobs Krönung
Deutscher Klassiker mit mildem Aroma. Perfekt für den täglichen Filterkaffee.

### (4) Melitta BellaCrema
Cremiger Kaffee mit nussigen Noten. Besonders gut für Vollautomaten geeignet.

### (5) Tchibo Beste Bohne
Preis-Leistungs-Sieger für den Alltag. Zuverlässige Qualität zu fairem Preis.

### (6) Dallmayr prodomo
Premium-Kaffee aus Bayern. Für anspruchsvolle Genießer.

---

## Wie diese Auswahl entstanden ist

Die Empfehlungen basieren auf:
1. **Qualitätsbewertungen** von unabhängigen Testern
2. **Kundenbewertungen** mit mindestens 4+ Sternen
3. **Preis-Leistungs-Verhältnis** im jeweiligen Segment
4. **Verfügbarkeit** bei gängigen Händlern

---

## Kurze Kauf-Hinweise

- **Frische:** Achte auf das Röstdatum – je frischer, desto besser
- **Lagerung:** Kühl, trocken und luftdicht aufbewahren
- **Mahlung:** Für beste Ergebnisse erst kurz vor der Zubereitung mahlen
- **Wasserhärte:** Weiches Wasser bringt das Aroma besser zur Geltung

---

### Quellen & Links

[1] [Amazon.de - J.J. Darboven](https://amazon.de)
[2] [Amazon.de - Lavazza](https://amazon.de)
[3] [Amazon.de - Jacobs](https://amazon.de)
[4] [Stiftung Warentest - Kaffee Test 2024](https://test.de)
[5] [Coffee Review - Bewertungen](https://coffeereview.com)
`;
