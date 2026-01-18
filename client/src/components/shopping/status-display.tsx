import { useState, useEffect } from 'react';

interface StatusDisplayProps {
  status: string;
  showLoading?: boolean;
}

export function StatusDisplay({ status, showLoading = true }: StatusDisplayProps) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (!showLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev >= 3 ? 1 : prev + 1);
    }, 400);

    return () => clearInterval(interval);
  }, [showLoading]);

  if (!status) return null;

  return (
    <div 
      className="flex items-center gap-2 text-sm text-gray-500 mb-4 animate-in fade-in duration-200"
      data-testid="status-display"
    >
      {showLoading && (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                i <= dots ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
      <span>{status}</span>
    </div>
  );
}

export function LoadingDots() {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev >= 3 ? 1 : prev + 1);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-start py-4" data-testid="loading-dots">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full bg-gray-900 transition-opacity duration-200 ${
              i <= dots ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
