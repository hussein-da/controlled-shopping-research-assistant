import { Paperclip, Image, Search, ShoppingCart, Network, MoreHorizontal, ChevronRight } from 'lucide-react';

interface ModeSelectionOverlayProps {
  onSelectMode: (mode: string) => void;
  onClose: () => void;
}

const modes = [
  {
    id: 'files',
    icon: Paperclip,
    label: 'Fotos und Dateien hinzufügen',
    disabled: true,
  },
  {
    id: 'image',
    icon: Image,
    label: 'Bild erstellen',
    disabled: true,
  },
  {
    id: 'research',
    icon: Search,
    label: 'Deep Research',
    disabled: true,
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    label: 'Shopping-Assistent',
    disabled: false,
  },
  {
    id: 'agent',
    icon: Network,
    label: 'Agentenmodus',
    disabled: true,
  },
  {
    id: 'more',
    icon: MoreHorizontal,
    label: 'Mehr',
    hasArrow: true,
    disabled: true,
  },
];

export function ModeSelectionOverlay({ onSelectMode, onClose }: ModeSelectionOverlayProps) {
  const handleSelectMode = (mode: typeof modes[0]) => {
    if (!mode.disabled) {
      onSelectMode(mode.id);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
        data-testid="mode-selection-backdrop"
      />
      <div 
        className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 min-w-[280px] animate-in slide-in-from-bottom-2 duration-200"
        data-testid="mode-selection-menu"
      >
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              disabled={mode.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                mode.disabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
              data-testid={`mode-${mode.id}`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">{mode.label}</span>
              {mode.hasArrow && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
