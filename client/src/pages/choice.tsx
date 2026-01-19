import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { TOP_6_PRODUCTS } from '@shared/schema';

export default function Choice() {
  const [, setLocation] = useLocation();
  const { session, setFinalChoice, logEvent } = useStudy();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    await setFinalChoice(selectedProduct);
    logEvent('choice_made', { productId: selectedProduct });
    setLocation('/post');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="choice-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 7 von 9
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Entscheidung
        </h1>
        <p className="text-gray-600 mb-6">
          Welches Produkt würden Sie am ehesten kaufen?
        </p>

        <RadioGroup value={selectedProduct || ""} onValueChange={handleSelect}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {TOP_6_PRODUCTS.map((product) => (
              <Card 
                key={product.id}
                className={`cursor-pointer transition-all ${
                  selectedProduct === product.id 
                    ? 'ring-2 ring-gray-900 bg-gray-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(product.id)}
                data-testid={`product-card-${product.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem 
                      value={product.id} 
                      id={product.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-4xl text-gray-300">
                          {product.id}
                        </span>
                      </div>
                      <Label htmlFor={product.id} className="cursor-pointer">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">
                          {product.name}
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                          {product.price_eur.toFixed(2).replace('.', ',')} €
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>Röstung: {product.roast}</li>
                          <li>{product.bio_fair ? 'Bio/Fairtrade' : 'Konventionell'}</li>
                        </ul>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card 
            className={`cursor-pointer transition-all ${
              selectedProduct === 'none' 
                ? 'ring-2 ring-gray-900 bg-gray-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelect('none')}
            data-testid="product-card-none"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer text-gray-700">
                  Keines davon
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        <div className="mt-8">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedProduct || isSubmitting}
            className="w-full"
            data-testid="choice-submit-button"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Auswählen
          </Button>
        </div>
      </div>
    </div>
  );
}
