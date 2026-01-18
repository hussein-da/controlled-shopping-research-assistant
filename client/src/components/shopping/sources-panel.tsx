import { X } from 'lucide-react';
import { Source } from '@shared/schema';

interface SourcesPanelProps {
  sources: Source[];
  onClose: () => void;
}

const sourceIcons: Record<string, string> = {
  'Coffeeness': 'C',
  'SupermarktCheck': 'S',
  'Lidl': 'L',
  'GLOBO': 'G',
  'GEPA Shop': 'G',
};

const sourceColors: Record<string, string> = {
  'Coffeeness': 'bg-orange-100 text-orange-600',
  'SupermarktCheck': 'bg-gray-100 text-gray-600',
  'Lidl': 'bg-yellow-100 text-yellow-600',
  'GLOBO': 'bg-green-100 text-green-600',
  'GEPA Shop': 'bg-blue-100 text-blue-600',
};

export function SourcesPanel({ sources, onClose }: SourcesPanelProps) {
  return (
    <div 
      className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 animate-in slide-in-from-right duration-300"
      data-testid="sources-panel"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Quellenangaben</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          data-testid="close-sources-panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-65px)] p-4 space-y-3">
        {sources.map((source) => {
          const iconLetter = sourceIcons[source.name] || source.name[0];
          const colorClass = sourceColors[source.name] || 'bg-gray-100 text-gray-600';
          
          return (
            <button
              key={source.id}
              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
              data-testid={`source-${source.id}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium ${colorClass}`}>
                {iconLetter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{source.name}</p>
                <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {source.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
