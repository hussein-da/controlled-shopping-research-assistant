import { ArrowDown, Edit3 } from 'lucide-react';
import { StatusDisplay } from './status-display';

interface RejectionDialogProps {
  productName: string;
  onSelectReason: (reason: string) => void;
  onSkip: () => void;
}

const rejectionReasons = [
  { id: 'price', label: 'Zu teuer' },
  { id: 'roast', label: 'Röstgrad passt nicht' },
  { id: 'brand', label: 'Marke unbekannt' },
  { id: 'features', label: 'Eigenschaften fehlen' },
];

export function RejectionDialog({ productName, onSelectReason, onSkip }: RejectionDialogProps) {
  return (
    <div 
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="rejection-dialog"
    >
      <StatusDisplay status="Clarifying product pricing" showLoading={false} />

      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <span className="text-2xl text-amber-600">C</span>
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{productName}</h4>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Warum gefällt dir dieses Produkt nicht?
        </h3>

        <div className="space-y-2">
          {rejectionReasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => onSelectReason(reason.id)}
              className="w-full py-3.5 px-4 border border-gray-200 rounded-full text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors text-center"
              data-testid={`rejection-reason-${reason.id}`}
            >
              {reason.label}
            </button>
          ))}
          
          <button
            onClick={() => onSelectReason('other')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            data-testid="rejection-reason-something-else"
          >
            <Edit3 className="w-4 h-4" />
            <span>Etwas anderes...</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onSkip}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          data-testid="rejection-skip-button"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
