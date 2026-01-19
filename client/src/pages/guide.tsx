import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { NORMALIZED_TARGET, products } from '@shared/schema';
import kaffeeImage from '@assets/Kaffee_1768855218017.png';

const productDetails = [
  {
    id: "P01",
    headline: "Klarer Top-Pick unter 12 €",
    bioText: "Bio klar, Fair-Details stark: unabh. Lob",
    taste: "Mild, fruchtig, hell geröstet",
    availability: "2-5 Tage",
    bestUse: "Täglich, Budget"
  },
  {
    id: "P02", 
    headline: "Klarer zweitbester Kauf unter 12 €",
    bioText: "Ursprung & Werte stark: Info umfangreich",
    taste: "Floral, lebhaft, Single Origin",
    availability: "1-3 Tage",
    bestUse: "Anspruchsvoll, günstige Spezialität"
  },
  {
    id: "P03",
    headline: "Bester dunkler Kaffee im Vergleich",
    bioText: "Fair-Trade/Bio/Rainforest erwähnt",
    taste: "Dunkel, schokoladig, kräftig",
    availability: "3-5 Tage",
    bestUse: "Espresso/Milchkaffee"
  },
  {
    id: "P04",
    headline: "Ausgewogener Allrounder",
    bioText: "eher Geschmack und Balance",
    taste: "Ausgewogen, Alltagstauglich",
    availability: "Hoch, Händlernetz",
    bestUse: "Premium-Alltag, etwas über Budget"
  },
  {
    id: "P05",
    headline: "Premium Single Origin",
    bioText: "Premium-Single-Origin, Herkunft transparent",
    taste: "Florale, hochwertige Single Origin",
    availability: "Hoch, Händlernetz",
    bestUse: "Anspruchsvolle Single-Origin"
  },
  {
    id: "P06",
    headline: "Günstiger Bio-Alltagskaffee",
    bioText: "Bio-Filterkaffee",
    taste: "Mittel, fruchtig-würzig",
    availability: "2-5 Tage",
    bestUse: "Günstiger Bio-Alltagskaffee"
  }
];

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

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-8" data-testid="guide-content">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Gute, preiswerte ganze Kaffeebohnen in Deutschland</h1>
            
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Kurzfassung</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Du willst ganze Bohnen, 250-g-Packung, möglichst bis etwa 12 € und idealerweise Bio/Fairtrade. 
              Unten stehen 6 konkrete, sofort bestellbare Optionen – zwei klare Top-Empfehlungen innerhalb deines 
              Budgets plus vier starke Alternativen. Jede Empfehlung nennt Preis, Verfügbarkeit, Geschmackstyp, 
              Vor- und Nachteile sowie eine unabhängige Resonanz oder Quelle, wo vorhanden.
            </p>
          </div>

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
            <div className="mt-3 text-gray-700">
              <p className="font-medium mb-2">Was diesen Kaffee stark macht</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {bestProduct.short_bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
                <li>Geschmacksnoten: {bestProduct.tasting_notes.join(', ')}</li>
                <li>Lieferzeit: {bestProduct.shipping_days}</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Weitere Top-Optionen</h2>
            <div className="space-y-6">
              {otherProducts.map((product, idx) => {
                const details = productDetails[idx + 1];
                return (
                  <div key={product.id}>
                    <h3 className="text-base font-medium text-gray-800 mb-3">
                      {idx + 2}) {details.headline}
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
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-medium">Was diesen Kaffee stark macht</p>
                      <ul className="list-disc pl-5 mt-1 space-y-0.5">
                        {product.short_bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
                          <span className="text-gray-500 text-xs">{product.price_eur.toFixed(2).replace('.', ',')} € • {product.brand}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 border-b border-gray-100 px-3 py-2 font-medium text-gray-700">Preis</td>
                    {products.map((product) => (
                      <td key={product.id} className="border-b border-gray-100 px-3 py-2 text-gray-600">
                        {product.price_eur.toFixed(2).replace('.', ',')} €
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 border-b border-gray-100 px-3 py-2 font-medium text-gray-700">Bio/Fairtrade</td>
                    {productDetails.map((details, idx) => (
                      <td key={idx} className="border-b border-gray-100 px-3 py-2 text-gray-600 text-xs">
                        {details.bioText}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 border-b border-gray-100 px-3 py-2 font-medium text-gray-700">Geschmacksstil</td>
                    {productDetails.map((details, idx) => (
                      <td key={idx} className="border-b border-gray-100 px-3 py-2 text-gray-600 text-xs">
                        {details.taste}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 border-b border-gray-100 px-3 py-2 font-medium text-gray-700">Verfügbarkeit</td>
                    {productDetails.map((details, idx) => (
                      <td key={idx} className="border-b border-gray-100 px-3 py-2 text-gray-600 text-xs">
                        {details.availability}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 border-b border-gray-100 px-3 py-2 font-medium text-gray-700">Beste Nutzung</td>
                    {productDetails.map((details, idx) => (
                      <td key={idx} className="border-b border-gray-100 px-3 py-2 text-gray-600 text-xs">
                        {details.bestUse}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 font-medium mb-2">Quellen (simuliert):</p>
            <ol className="text-xs text-gray-400 space-y-0.5 list-decimal pl-4">
              <li>Kaffee-Test.de – Produktbewertungen 2024</li>
              <li>Öko-Test – Bio-Kaffee Vergleich</li>
              <li>Stiftung Warentest – Kaffeebohnen Test</li>
              <li>Verbraucherzentrale – Fairtrade Kaffee Guide</li>
              <li>Trusted Shops – Kundenbewertungen</li>
            </ol>
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
