import { Link, useLocation } from "wouter";
import { Settings } from "lucide-react";

export function AdminLink() {
  const [location] = useLocation();
  
  if (location === "/admin") {
    return null;
  }

  return (
    <Link href="/admin">
      <button
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors shadow-sm border border-gray-200"
        title="Admin"
        data-testid="admin-link-button"
      >
        <Settings className="w-4 h-4" />
      </button>
    </Link>
  );
}
