import { MessageSquare, Edit3, Search, Sparkles } from 'lucide-react';

export function Sidebar() {
  return (
    <aside 
      className="w-16 border-r border-gray-100 flex flex-col items-center py-4 bg-white"
      data-testid="sidebar"
    >
      <div className="space-y-3">
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 cursor-default"
          disabled
          data-testid="sidebar-icon-chat"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 cursor-default"
          disabled
          data-testid="sidebar-icon-edit"
        >
          <Edit3 className="w-5 h-5" />
        </button>
        
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 cursor-default"
          disabled
          data-testid="sidebar-icon-search"
        >
          <Search className="w-5 h-5" />
        </button>
        
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 cursor-default"
          disabled
          data-testid="sidebar-icon-messages"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
