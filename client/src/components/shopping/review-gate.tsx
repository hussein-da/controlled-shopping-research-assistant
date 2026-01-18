import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { StatusDisplay } from './status-display';

interface ReviewGateProps {
  onPreviewAndRate: () => void;
  onSkipAll: () => void;
  timerDuration: number;
}

const previewImages = [
  { id: 1, label: 'Coffee Machine' },
  { id: 2, label: 'Coffee Beans' },
  { id: 3, label: 'Ground Coffee' },
  { id: 4, label: 'Coffee Pack' },
];

export function ReviewGate({ onPreviewAndRate, onSkipAll, timerDuration }: ReviewGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    timerRef.current = setTimeout(() => {
      onPreviewAndRate();
    }, timerDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showContent, timerDuration, onPreviewAndRate]);

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

  if (!showContent) {
    return (
      <div className="animate-in fade-in duration-300">
        <StatusDisplay status="Capturing product image" showLoading={true} />
      </div>
    );
  }

  return (
    <div 
      className="space-y-4 animate-in fade-in duration-300"
      data-testid="review-gate"
    >
      <StatusDisplay status="Capturing product image" showLoading={false} />
      
      <div className="border border-gray-200 rounded-2xl p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="grid grid-cols-2 gap-2 flex-shrink-0">
            {previewImages.map((img) => (
              <div 
                key={img.id}
                className="w-28 h-28 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden"
              >
                <div className="w-16 h-20 bg-amber-100 rounded flex items-center justify-center">
                  <span className="text-2xl text-amber-500">C</span>
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
              className="w-full bg-gray-900 text-white rounded-full py-3.5 px-6 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
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
