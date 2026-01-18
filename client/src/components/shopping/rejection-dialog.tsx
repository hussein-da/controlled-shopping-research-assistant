import { ProductCard } from '@shared/schema';
import { ArrowDown } from 'lucide-react';

interface RejectionDialogProps {
  product: ProductCard;
  onSelectReason: (reason: string) => void;
  onSkip: () => void;
}

const rejectionReasons = ['Price', 'Style', 'Brand', 'Features', 'Something else...'];

export function RejectionDialog({ product, onSelectReason, onSkip }: RejectionDialogProps) {
  return (
    <div 
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="rejection-dialog"
    >
      <p className="text-sm text-gray-500">Clarifying product pricing</p>

      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <span className="text-2xl text-amber-600">C</span>
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
          <p className="text-sm text-gray-500">{product.price} • {product.merchant}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Why don't you like this product?
        </h3>

        <div className="space-y-2">
          {rejectionReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => onSelectReason(reason)}
              className="w-full py-3.5 px-4 border border-gray-200 rounded-full text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors text-center"
              data-testid={`rejection-reason-${reason.toLowerCase().replace(/[^\w]+/g, '-')}`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <ArrowDown className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
