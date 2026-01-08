import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ReviewGateProps {
  onPreviewAndRate: () => void;
  onSkipAll: () => void;
  timerDuration: number;
}

const previewImages = [
  { id: 1, color: 'bg-amber-100', label: 'Coffee Bundle' },
  { id: 2, color: 'bg-yellow-50', label: 'Darboven Classic' },
  { id: 3, color: 'bg-orange-100', label: 'Jacobs & Melitta' },
  { id: 4, color: 'bg-red-50', label: 'Lavazza Rossa' },
];

export function ReviewGate({ onPreviewAndRate, onSkipAll, timerDuration }: ReviewGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onSkipAll();
    }, timerDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerDuration, onSkipAll]);

  const handlePreviewClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(true);
    setTimeout(() => {
      onPreviewAndRate();
    }, 500);
  };

  const handleSkipClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onSkipAll();
  };

  return (
    <div 
      className="space-y-4 animate-in fade-in duration-300"
      data-testid="review-gate"
    >
      <p className="text-sm text-gray-500">Review consideration</p>
      
      <div className="border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="grid grid-cols-2 gap-2 flex-shrink-0">
            {previewImages.map((img) => (
              <div 
                key={img.id}
                className={`w-28 h-28 rounded-lg ${img.color} flex items-center justify-center overflow-hidden`}
              >
                <div className="text-xs text-gray-500 text-center px-2">
                  {img.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-4 flex-1">
            <p className="text-gray-700">
              Give quick feedback to help ChatGPT pick the best options for you.
            </p>

            <button
              onClick={handlePreviewClick}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white rounded-full py-3 px-6 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              data-testid="preview-and-rate-button"
            >
              Preview and rate
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </button>

            <button
              onClick={handleSkipClick}
              className="text-gray-500 hover:text-gray-700 transition-colors text-center"
              data-testid="skip-all-button"
            >
              Skip all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
