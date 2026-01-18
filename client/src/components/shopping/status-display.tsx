import { useState, useEffect } from 'react';

interface StatusDisplayProps {
  status: string;
  showLoading?: boolean;
}

export function StatusDisplay({ status, showLoading = true }: StatusDisplayProps) {
  if (!status) return null;

  return (
    <div 
      className="flex items-center gap-2 text-sm text-gray-500 mb-4 animate-in fade-in duration-200"
      data-testid="status-display"
    >
      {showLoading && (
        <div className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
      )}
      <span>{status}</span>
    </div>
  );
}

export function LoadingDots() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-start py-4" data-testid="loading-dots">
      <div 
        className={`w-3 h-3 rounded-full bg-gray-900 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-40'
        }`}
      />
    </div>
  );
}
