import { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronRight, ArrowDown } from 'lucide-react';
import { ProductCard } from '@shared/schema';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductCardViewProps {
  product: ProductCard;
  onNotInterested: () => void;
  onMoreLikeThis: () => void;
  onTimeout: () => void;
  timerDuration: number;
}

export function ProductCardView({ 
  product, 
  onNotInterested, 
  onMoreLikeThis, 
  onTimeout,
  timerDuration 
}: ProductCardViewProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timerDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [product.id, timerDuration, onTimeout]);

  const handleNotInterested = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onNotInterested();
  };

  const handleMoreLikeThis = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onMoreLikeThis();
  };

  return (
    <div 
      className="space-y-4 animate-in fade-in duration-300"
      data-testid="product-card-view"
    >
      <p className="text-sm text-gray-500">Review consideration</p>
      
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-72 h-72 bg-gray-50 flex items-center justify-center p-6 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-32 bg-amber-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-4xl text-amber-600">C</span>
                </div>
                <span className="text-xs text-amber-700">Coffee Package</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900 pr-4" data-testid="product-title">
                {product.title}
              </h3>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {product.price} • {product.merchant}
            </p>

            <ScrollArea className="h-48">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-4 text-gray-500 font-medium align-top whitespace-nowrap">
                        {key}
                      </td>
                      <td className="py-2 text-gray-900">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>

        <div className="border-t border-gray-200 grid grid-cols-2 divide-x divide-gray-200">
          <button
            onClick={handleNotInterested}
            className="flex items-center justify-center gap-2 py-4 text-gray-700 hover:bg-gray-50 transition-colors"
            data-testid="not-interested-button"
          >
            <X className="w-4 h-4" />
            <span>Not interested</span>
          </button>
          
          <button
            onClick={handleMoreLikeThis}
            className="flex items-center justify-center gap-2 py-4 text-gray-700 hover:bg-gray-50 transition-colors"
            data-testid="more-like-this-button"
          >
            <Check className="w-4 h-4" />
            <span>More like this</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <ArrowDown className="w-5 h-5 text-gray-400" />
      </div>

      <button
        onClick={handleNotInterested}
        className="block mx-auto text-gray-400 text-sm hover:text-gray-600 transition-colors"
        data-testid="skip-product-button"
      >
        Überspringen
      </button>
    </div>
  );
}
