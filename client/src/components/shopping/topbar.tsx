import { ChevronDown, Upload, UserPlus, MoreHorizontal } from 'lucide-react';

export function Topbar() {
  return (
    <header 
      className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white"
      data-testid="topbar"
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-gray-900">ChatGPT 5.2</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 text-sm text-gray-500 cursor-default"
          disabled
          data-testid="topbar-share"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Gemeinsam nutzen</span>
        </button>
        
        <button
          className="flex items-center gap-2 text-sm text-gray-500 cursor-default"
          disabled
          data-testid="topbar-add-person"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Personen hinzufügen</span>
        </button>
        
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 cursor-default"
          disabled
          data-testid="topbar-more"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
