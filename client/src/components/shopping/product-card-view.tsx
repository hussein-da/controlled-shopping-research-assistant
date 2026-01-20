import { useState, useEffect, useRef } from 'react';
import { X, Check, ArrowDown } from 'lucide-react';
import { RatingProduct } from '@shared/schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusDisplay } from './status-display';
import { RejectionDialog } from './rejection-dialog';

interface ProductCardViewProps {
  product: RatingProduct;
  onNotInterested: (reason?: string) => void;
  onMoreLikeThis: () => void;
  onTimeout: () => void;
  timerDuration: number;
  statusText?: string;
  isFirstProduct?: boolean;
}

export function ProductCardView({ 
  product, 
  onNotInterested, 
  onMoreLikeThis, 
  onTimeout,
  timerDuration,
  statusText,
  isFirstProduct = false
}: ProductCardViewProps) {
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setShowRejectionDialog(false);
    
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timerDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [product.id, timerDuration, onTimeout]);

  const handleNotInterested = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowRejectionDialog(true);
  };

  const handleRejectionReason = (reason: string) => {
    onNotInterested(reason);
  };

  const handleMoreLikeThis = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onMoreLikeThis();
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onTimeout();
  };

  if (showRejectionDialog) {
    return (
      <RejectionDialog
        productName={product.name}
        onSelectReason={handleRejectionReason}
        onSkip={() => onNotInterested()}
      />
    );
  }

  const displayStatus = statusText || (isFirstProduct ? 'Searching for options' : `Finding more like ${product.name.split(' ').slice(0, 3).join(' ')}`);

  const attributes: Record<string, string> = {
    'Packungsgröße': product.pack_size,
    'Geschmacksnoten': product.tasting_notes.join(', '),
    'Besonderheit': product.special,
  };

  return (
    <div 
      className="space-y-4 animate-in fade-in duration-300"
      data-testid="product-card-view"
    >
      <StatusDisplay status={displayStatus} showLoading={false} />
      
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-72 h-72 bg-amber-50 flex items-center justify-center p-6 flex-shrink-0">
            <img 
              src={product.image_path} 
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="flex-1 p-4 md:p-6">
            <div className="mb-1">
              <h3 className="text-lg font-medium text-gray-900" data-testid="product-title">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>{product.price}</span>
              <span>·</span>
              <span>{product.brand}</span>
            </div>

            <ScrollArea className="h-44">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(attributes).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium align-top whitespace-nowrap">
                        {key}
                      </td>
                      <td className="py-2.5 text-gray-900">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>

        <div className="border-t border-gray-200 grid grid-cols-2">
          <button
            onClick={handleNotInterested}
            className="flex items-center justify-center gap-2 py-4 text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-200"
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
        onClick={handleSkip}
        className="block mx-auto text-gray-400 text-sm hover:text-gray-600 transition-colors"
        data-testid="skip-product-button"
      >
        Überspringen
      </button>
    </div>
  );
}
