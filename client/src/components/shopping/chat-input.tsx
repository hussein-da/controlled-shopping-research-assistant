import { Plus, ShoppingBag, Mic, ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({ value, onChange, onSend, disabled, placeholder }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 bg-white" data-testid="chat-input-container">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <ArrowUp className="w-4 h-4 text-gray-400" />
        </div>
        
        <div 
          className={`border border-gray-200 rounded-3xl px-4 py-3 ${disabled ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={disabled ? placeholder || '' : value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={placeholder}
              className={`flex-1 text-base outline-none bg-transparent ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
              data-testid="chat-input"
            />
            
            <button
              className="w-4 h-4 text-gray-400 cursor-default"
              disabled
              data-testid="chat-input-mic"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <button
              onClick={onSend}
              disabled={disabled || !value.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                disabled || !value.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white'
              }`}
              data-testid="chat-input-send"
            >
              {disabled ? (
                <Square className="w-4 h-4" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
            <button
              className="text-gray-400 cursor-default"
              disabled
              data-testid="chat-input-plus"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 text-blue-500 text-sm">
              <ShoppingBag className="w-4 h-4" />
              <span>Shopping-Assistent</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          ChatGPT kann Fehler machen. Überprüfe wichtige Informationen. Siehe <a href="#" className="underline">Cookie-Voreinstellungen</a>.
        </p>
      </div>
    </div>
  );
}
