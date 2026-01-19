import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { NORMALIZED_TARGET, products } from '@shared/schema';
import kaffeeImage from '@assets/Kaffee_1768855218017.png';

const guideContent = {
  kurzfassung: `Du willst ganze Bohnen, 250‑g‑Packung, möglichst bis etwa 12 € und idealerweise Bio/Fairtrade. Unten stehen 6 konkrete, sofort bestellbare Optionen – zwei klare Top‑Empfehlungen innerhalb deines Budgets plus vier starke Alternativen, teils leicht über Budget, aber aus guten Gründen interessant. Jede Empfehlung nennt Preis, Verfügbarkeit, Geschmackstyp, Vor‑ und Nachteile sowie eine unabhängige Resonanz oder Quelle, wo vorhanden.`,
  
  besteGesamtwahl: {
    intro: "Warum dieser Kauf die beste Alltagswahl ist",
    bullets: [
      "**Budget passt exakt.** Mit 9,95 € liegt die Packung deutlich unter deinem Limit von 12 €.",
      "**Bio‑/Fair‑ und Nachhaltigkeitsaspekt sehr deutlich.** Produktseite nennt 100 % Bio‑Arabica aus Peru mit schonender Hell­röstung; direkte Herkunfts‑ und Verarbeitungsangaben sind vorhanden.",
      "**Lieferbarkeit realistisch.** 2–5 Tage Lieferzeit angegeben, also brauchbar für schnellen Verbrauch.",
      "**Geschmacklich eher mild‑fruchtig mit angenehmer Säure.** Roaster beschreibt Frucht‑ und Vanille‑Noten, helle Röstung und reduzierte Chlorogensäure für angenehme Bekömmlichkeit.",
      "**Unabhängige Beurteilung vorhanden.** Ein externer Testbericht lobt gute Crema, vollmundigen und milden Geschmack mit relativ geringem Säuregrad – genau das, was viele Alltagsnutzer ohne starke Säure wollen."
    ],
    eignung: {
      title: "Für wen besonders geeignet",
      points: [
        "Wer täglich Filterkaffee oder milde Getränke möchte, aber nicht auf Zertifizierungen oder Herkunft verzichten will.",
        "Käufer mit klaren Budgetgrenzen, die keine Experimente mit teuren, schwer erhältlichen Spezialitäten wollen."
      ]
    },
    tradeoffs: {
      title: "Trade‑offs",
      points: [
        "Hell geröstet heißt: mehr feine Fruchtnoten, weniger kräftige Schokolade oder Nuss; wer sehr dunkle, fast italienische Profile mag, könnte weniger zufrieden sein.",
        "Die Marke ist eher auf fairen Handel und milde Profile ausgerichtet; wer extrem ausgefallene Single‑Origin‑Experimente sucht, findet teilweise intensivere Spezialitäten bei etwas höheren Preisen."
      ]
    },
    kurzurteil: "Sehr gutes Preis‑Leistungs‑Verhältnis, echte Bio‑Auszeichnung, relativ breiter Genuss‑bereich, schnell lieferbar – deshalb der beste Startpunkt."
  },

  weitereOptionen: [
    {
      nummer: 2,
      headline: "Klarer zweitbester Kauf unter 12 €",
      intro: "Was diesen Kaffee stark macht",
      bullets: [
        "**Preis im Budget, aber deutlich spezialitätiger Stil.** 9,95 € für 250 g, also sogar günstiger als viele Standard‑Mischungen. Kaufstatus als sofort lieferbar mit 1–3 Werktagen angegeben.",
        "**Herkunft und Röststil klar: äthiopischer Single Origin, florale und würzige Noten, handgeröstet.** Händlerbeschreibung erläutert florale Aromen, akzentuierte, ausgewogene Säure und längeren Abgang – typische Charakteristik eines Yirgacheffe.",
        "**Unterstützende Berichterstattung.** Ein dritter Medienbeitrag zum Riftara‑Projekt hebt den Ursprung in Äthiopien, die lokale Verarbeitung und den langsamen Trommelröstprozess hervor – Aspekte, die über reine Produktdaten hinaus auf Werte und Qualität schließen lassen."
      ],
      eignung: {
        title: "Eignung",
        points: [
          "Wer Filterkaffee oder leichte Zubereitungen bevorzugt und klar definierte Frucht‑/Blumennoten mag, aber ohne den Preis von Premium‑Single‑Origin‑Röstungen bezahlen will.",
          "Passend für ganztägigen Konsum mit eher eleganten Tassenprofilen statt schwerer, dunkler Espresso‑Profile."
        ]
      },
      tradeoffs: {
        title: "Trade‑offs",
        points: [
          "**Nicht für Liebhaber dunkler, schokoladiger Röstungen.** Yirgacheffe‑Stil ist heller, lebhafter, teils stärker säurebetont; sensibles Mägen könnten es weniger mögen, wenngleich die Balance laut Händler als harmonisch beschrieben wird.",
          "**Stärker spezialisierter Geschmack.** Wer nur einen einen einzigen Kaffee für alle Getränke möchte, findet bei Mischungen oft neutralere, breiter nutzbare Profile."
        ]
      },
      kurzurteil: "Spitzenpick im Budget für anspruchsvollere, klare Aromen, nicht nur als Notlösung – exzellenter Wert."
    },
    {
      nummer: 3,
      headline: "Bestes dunkles, kräftiges Profil im Budget",
      intro: "Warum dieser Pick lohnt",
      bullets: [
        "**Preis unter 12 € mit starkem Geschmack:** 9,95 € für ganze Bohnen, also Budget‑konform; dunkle Röstung mit kräftigem Körper, wenig Säure.",
        "**Herkunft und nachhaltige Partnerstruktur transparent:** Peruanischer Spezialitätenkaffee von Fair‑Trade‑, Bio‑ und Rainforest‑Alliance‑zertifizierter Kooperative, mit konkreten Angaben zu Farm, Varietät, Höhenlagen und Herstellung.",
        "**Klare Geschmacksbeschreibung:** Dunkle Schokolade, Trockenobst, Marzipan, Melasse; fast italienischer Stil, stark, vollmundig, säurearm – ideal wenn man einen kräftigen Espresso oder Milchkaffee möchte.",
        "**Externe Nutzer‑Resonanz existiert, zeigt differenzierte Wahrnehmung:** In einem Reddit‑Thread berichten manche Nutzer von negativen Erfahrungen mit säurebetonten Röstungen anderer Produkte, aber explizit der Kuntaro wurde mehrfach positiv erwähnt, auch bei Siebträgern.",
        "**Versandzeit angegeben:** 3–5 Tage Bearbeitung/Versand bei Händler, praktikabel für Normalverbrauch."
      ],
      eignung: {
        title: "Eignung",
        points: [
          "Espresso‑ oder Milchgetränke‑Fans, die dunkle, schokolade‑ und karamellbetonte Profile mögen.",
          "Wer südamerikanische Kooperationen und faire Standards schätzt, ohne Premium‑Preise."
        ]
      },
      tradeoffs: {
        title: "Trade‑offs",
        points: [
          "**Nicht hell, nicht fruchtig:** Personen, die florale oder beerige Noten suchen, finden hier weniger.",
          "**Starkes Profil kann manche Zubereitungen dominieren:** Bei sehr feinen Filtermethoden kann das dunkle Profil weniger die Leichtigkeit zeigen, die manche wollen."
        ]
      },
      kurzurteil: "Sehr guter, fairer, kräftiger Espresso‑ oder Milchkaffee‑Starter unter 12 €; ein Premium‑Gefühl ohne Premium‑Preis."
    },
    {
      nummer: 4,
      headline: "Breites Alternativprofil, sehr etabliert",
      intro: "Stärken",
      bullets: [
        "**Top‑Roaster, sehr ausgewogenes Mischprofil.** Bonavia ist eine der bekannteren Spezialitätenröstereien; diese Mischung kombiniert brasilianische und peruanische Bohnen, meist mit schokoladig‑nussigen Noten und guter Alltagstauglichkeit.",
        "**Preis im Budget:** 9,95 € liegt klar unter deinem Limit. Für Käufer, die einen ausgewogenen Alltagskaffee möchten, eine solide Wahl.",
        "**Gute Verfügbarkeit über etablierte Händler.** roastmarket listet das Produkt mit Standard‑Retail‑Struktur, häufig vorrätig oder leicht nachbestellbar."
      ],
      eignung: {
        title: "Eignung",
        points: [
          "Wer nicht nur sparen, sondern auch einen etablierten Spezialitätenblend aus Berlin probieren möchte.",
          "Nutzer mit Mühle oder Siebträger, die ein rundes Profil wünschen – nicht zu hell, nicht zu dunkel."
        ]
      },
      tradeoffs: {
        title: "Trade‑offs",
        points: [
          "**Nicht explizit Bio/Fair‑Claim auf der Seite hier im Listing:** Das Produkt kann andere Zertifizierungen oder Werte haben, aber als Mischung fokussiert es primär auf Geschmack und Balance, nicht zwingend auf Bio‑Label."
        ]
      },
      kurzurteil: "Sehr guter Allrounder aus Top‑Röster‑Umfeld; lohnt sich für ausgewogenen Genuss."
    },
    {
      nummer: 5,
      headline: "Premium‑Single‑Origin, sehr transparent",
      intro: "Was diesen Kaffee besonders macht",
      bullets: [
        "**Detaillierte Herkunft, moderne Spezialitätenaufbereitung.** Kolumbien, Huila, Pink Bourbon, washed, mit ausführlicher Beschreibung von Produzent, Verarbeitung, Trocknung und Fermentation auf der Händlerseite; das ist ungewöhnlich transparent und ideal für bewusste Käufer.",
        "**Aromenprofil klar definiert:** Rose, Orange, rote Johannisbeere; damit eher florale, fruchtige, hochqualitative Tasse – eine echte Premium‑Single‑Origin.",
        "**Preis im Budget.** 9,95 € – deutlich unter deinem Limit, wenn man ein klar anderes Profil probieren will."
      ],
      eignung: {
        title: "Eignung",
        points: [
          "Trinker, die lieber klar definierte Single‑Origin‑Noten statt Mischungen wollen.",
          "Käufer mit Zeit und Interesse, mehr über die Produzenten und Verarbeitung zu erfahren, und die eventuell auch später weitere Profile aus dem gleichen Portfolio probieren möchten."
        ]
      },
      tradeoffs: {
        title: "Trade‑offs",
        points: [
          "**Leicht weniger universell als Mischungen.** Hochwertige Single‑Origin‑Profile können bei manchem, der nur sehr neutralen Kaffee sucht, zu präsent oder ungewohnt wirken."
        ]
      },
      kurzurteil: "Sehr starker, transparenter Spezialitätenkaffee mit klarer Herkunft und hochwertiger Aufbereitung – zahlt sich mit Erlebnis und Wissen aus."
    },
    {
      nummer: 6,
      headline: "Preisgünstiger Bio‑Filterkaffee mit klarer Herkunft, innerhalb Budget",
      intro: "Warum ein sinnvoller Zusatzkauf",
      bullets: [
        "**Preis deutlich unter Budget, Bio‑Fokus kommuniziert.** Auf der Produktseite wird Bio‑Filterkaffee aus Äthiopien angeboten; Stückpreis ab 9,95 € für 250 g, mit Staffelpreisen bei größeren Mengen.",
        "**Verfügbarkeit zügig, Standardversand:** Sofort verfügbar, Lieferzeit 2–5 Tage – passt gut in einen Alltagsplan.",
        "**Aromatische Vielfalt, trotzdem leicht trinkbar:** Beschreibung nennt Zitrus‑ und Beerennoten kombiniert mit Gewürzen und Schokolade; geeignet für Handfilter oder normale Maschine, also breites Einsatzfeld.",
        "**Starker Wert bei wenig Aufwand:** Gute Wahl, wenn man einen günstigen, fairen Bio‑Kaffee braucht, ohne sich auf sehr helle oder sehr dunkle Extreme festzulegen."
      ],
      eignung: {
        title: "Eignung",
        points: [
          "Studierende oder Haushalte, die einen günstigen Bio‑Kaffee für tägliche Nutzung suchen.",
          "Nutzer mit Handfilter oder Standard‑Filtermaschine, die geschmacklich etwas mehr als reine Massenware wollen, aber nicht viel mehr zahlen möchten."
        ]
      },
      tradeoffs: {
        title: "Trade‑offs",
        points: [
          "**Mittelröstung, keine sehr ungewöhnlichen Spezialitätenprofile.** Wer echte Single‑Origin‑Exoten sucht, wählt Riftara oder BuenaRosa.",
          "**Nicht explizit Fairtrade auf dieser Seite ersichtlich; Bio steht im Fokus.** Fairtrade kann bei anderen Optionen stärker betont werden, etwa bei PachaLumo oder Kuntaro."
        ]
      },
      kurzurteil: "Sehr preisgünstige, schnell verfügbare Bio‑Option mit angenehmem Aroma – guter Alltagskaffee, der das Budget stark schont."
    }
  ],

  wieAuswahlZustandeKam: {
    title: "Wie die Auswahl zustande kam",
    points: [
      "**Budget, Größe, Form:** Fokus auf 250‑g‑Packungen, ganze Bohnen, Preis ≤ 12 € als strenger Filter.",
      "**Bio/Fair‑Aspekt:** Priorität für Marken und Produkte mit Bio oder Fair‑Trade bzw. klaren Werte‑ und Herkunftsangaben – mindert Risiko von reinen Massenprodukten, schafft transparente Auswahl.",
      "**Unabhängige Stimmen:** Für mehrere Picks vorhandene Dritte‑Parteien‑Quellen genutzt, um nicht nur Hersteller‑Claims zu übertragen. PachaLumo mit Testbericht, Riftara mit Medienbeitrag, Kuntaro mit Community‑Feedback.",
      "**Verfügbarkeit:** Auf Händlerseiten Lieferzeiten und Status geprüft, um sofortige Bestellbarkeit zu gewährleisten; keine spekulativen oder unklaren Listings."
    ]
  },

  zusatzhinweise: {
    title: "Zusatzhinweise zur Auswahl",
    points: [
      "Wenn du noch unsicher bist, beginne mit **PachaLumo** oder **Riftara**. Bleibt das Budget strikt ≤ 12 €, sind beide die sichersten, qualitativ starken Käufe.",
      "Falls du etwas dunkler magst oder mehr Körper, probiere **Kuntaro** direkt.",
      "Falls du einmal ein besonderes Geschmackserlebnis willst, das höhere Wissen über Herkunft bietet, probiere **BuenaRosa**.",
      "Für sehr kleines Budget bei gleichzeitig fairen, biologischen Bedingungen ist **Kebena Forest** optimal."
    ],
    closing: "So kannst du schnell entscheiden, ohne lange zu vergleichen – und hast zugleich eine gute Basis, um später weitere Spezialitäten systematisch auszuprobieren."
  },

  tableData: {
    headers: ["Produkt", "Preis", "Bio/Fairtrade", "Geschmacksstil", "Verfügbarkeit", "Beste Nutzung"],
    rows: [
      ["PachaLumo – Chanchamayo Bio", "9,95 €", "Bio klar, Fair‑Details stark", "Mild, fruchtig, hell geröstet", "2–5 Tage", "Täglich, Budget"],
      ["Riftara – Yirgacheffe Flora", "9,95 €", "Ursprung & Werte stark", "Floral, lebhaft, Single Origin", "1–3 Tage", "Anspruchsvoll, günstige Spezialität"],
      ["Kuntaro – Cocoa Dark", "9,95 €", "Fair‑Trade/Bio/Rainforest", "Dunkel, schokoladig, kräftig", "3–5 Tage", "Espresso/Milchkaffee"],
      ["Bonavia – City Blend", "9,95 €", "eher Geschmack und Balance", "Ausgewogen, Alltagstauglich", "2–4 Tage", "Premium‑Alltag"],
      ["BuenaRosa – Pink Bourbon", "9,95 €", "Premium‑Single‑Origin", "Florale, hochwertige Single Origin", "2–4 Tage", "Anspruchsvolle Single‑Origin"],
      ["Kebena Forest – Regenwald Bio", "9,95 €", "Bio‑Filterkaffee", "Mittel, fruchtig‑würzig", "2–5 Tage", "Günstiger Bio‑Alltagskaffee"]
    ]
  }
};

function renderMarkdownBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function Guide() {
  const [, setLocation] = useLocation();
  const { session, logEvent, updateGuideTimestamps } = useStudy();
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (session) {
      logEvent('guide_view_start');
    }
  }, [session, logEvent]);

  const handleContinue = async () => {
    const readSeconds = Math.floor((Date.now() - startTime) / 1000);
    await updateGuideTimestamps(startTime, Date.now(), readSeconds);
    logEvent('guide_continue', { readSeconds });
    setLocation('/choice');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const tags = [NORMALIZED_TARGET.amount, NORMALIZED_TARGET.budget, NORMALIZED_TARGET.attributes, NORMALIZED_TARGET.grind];
  const bestProduct = products[0];
  const otherProducts = products.slice(1);

  return (
    <div className="min-h-screen bg-white" data-testid="guide-page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 6 von 9
        </div>

        <div className="text-xs text-gray-400 mb-4">
          Shop vor 2–3 Minuten
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-6" data-testid="guide-content">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Gute, preiswerte ganze Kaffeebohnen in Deutschland</h1>
            
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Kurzfassung</h2>
            <p className="text-gray-700 leading-relaxed">
              {guideContent.kurzfassung}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Beste Gesamtwahl</h2>
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100" data-testid="best-choice-card">
              <img 
                src={kaffeeImage} 
                alt={bestProduct.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{bestProduct.name} ({bestProduct.roast} geröstet)</h3>
                <p className="text-white/90 text-sm">{bestProduct.price_eur.toFixed(2).replace('.', ',')} € • {bestProduct.brand}</p>
              </div>
            </div>
            
            <div className="mt-4 text-gray-700 space-y-4">
              <div>
                <p className="font-semibold mb-2">{guideContent.besteGesamtwahl.intro}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {guideContent.besteGesamtwahl.bullets.map((bullet, idx) => (
                    <li key={idx}>{renderMarkdownBold(bullet)}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="font-semibold mb-2">{guideContent.besteGesamtwahl.eignung.title}</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {guideContent.besteGesamtwahl.eignung.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="font-semibold mb-2">{guideContent.besteGesamtwahl.tradeoffs.title}</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {guideContent.besteGesamtwahl.tradeoffs.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm italic">
                <strong>Kurzurteil:</strong> {guideContent.besteGesamtwahl.kurzurteil}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Weitere Top‑Optionen</h2>
            <div className="space-y-0">
              {guideContent.weitereOptionen.map((option, idx) => {
                const product = otherProducts[idx];
                return (
                  <div key={option.nummer}>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">
                      {option.nummer}) {option.headline}
                    </h3>
                    <div className="flex gap-4 bg-gray-50 rounded-lg p-3" data-testid={`product-card-guide-${product.id}`}>
                      <img 
                        src={kaffeeImage} 
                        alt={product.name}
                        className="w-20 h-24 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.price_eur.toFixed(2).replace('.', ',')} € • {product.brand}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-gray-700 space-y-3">
                      <div>
                        <p className="font-semibold text-sm mb-1">{option.intro}</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {option.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{renderMarkdownBold(bullet)}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-sm mb-1">{option.eignung.title}</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {option.eignung.points.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-sm mb-1">{option.tradeoffs.title}</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {option.tradeoffs.points.map((point, pIdx) => (
                            <li key={pIdx}>{renderMarkdownBold(point)}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <p className="text-sm italic">
                        <strong>Kurzurteil:</strong> {option.kurzurteil}
                      </p>
                    </div>
                    
                    {idx < guideContent.weitereOptionen.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Vergleichstabelle</h2>
            <p className="text-sm text-gray-600 mb-4">Vergleich der 6 Picks nach wichtigsten Kriterien</p>
            
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="min-w-max border-collapse text-sm" data-testid="comparison-table">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white z-10 border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-500 min-w-[100px]">
                      &nbsp;
                    </th>
                    {products.map((product) => (
                      <th key={product.id} className="border-b border-gray-200 px-3 py-2 text-left min-w-[140px]">
                        <div className="flex flex-col items-center">
                          <img 
                            src={kaffeeImage} 
                            alt={product.name}
                            className="w-16 h-20 object-cover rounded mb-2"
                          />
                          <span className="font-semibold text-gray-900 text-center text-xs">{product.name}</span>
                          <span className="text-gray-500 text-xs">{product.price_eur.toFixed(2).replace('.', ',')} €</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guideContent.tableData.headers.slice(1).map((header, rowIdx) => (
                    <tr key={header}>
                      <td className="sticky left-0 bg-white z-10 border-b border-gray-100 px-3 py-2 font-medium text-gray-700">
                        {header}
                      </td>
                      {guideContent.tableData.rows.map((row, colIdx) => (
                        <td key={colIdx} className="border-b border-gray-100 px-3 py-2 text-gray-600 text-xs">
                          {row[rowIdx + 1]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">{guideContent.wieAuswahlZustandeKam.title}</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {guideContent.wieAuswahlZustandeKam.points.map((point, idx) => (
                <li key={idx}>{renderMarkdownBold(point)}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">{guideContent.zusatzhinweise.title}</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {guideContent.zusatzhinweise.points.map((point, idx) => (
                <li key={idx}>{renderMarkdownBold(point)}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-700">
              {guideContent.zusatzhinweise.closing}
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200 mt-8">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full"
            data-testid="guide-continue-button"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
