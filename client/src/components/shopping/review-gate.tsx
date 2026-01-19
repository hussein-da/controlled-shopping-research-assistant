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

const IDLE_DURATION = 10000;
const COUNTDOWN_DURATION = 10000;

export function ReviewGate({ onPreviewAndRate, onSkipAll }: ReviewGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showRing, setShowRing] = useState(false);
  const [ringProgress, setRingProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    timerRef.current = setTimeout(() => {
      setShowRing(true);
      startTimeRef.current = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / COUNTDOWN_DURATION, 1);
        setRingProgress(progress);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
      
      countdownRef.current = setTimeout(() => {
        onPreviewAndRate();
      }, COUNTDOWN_DURATION);
    }, IDLE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [showContent, onPreviewAndRate]);

  const handlePreviewClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsLoading(true);
    setTimeout(() => {
      onPreviewAndRate();
    }, 500);
  };

  const handleSkipClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    onSkipAll();
  };

  if (!showContent) {
    return (
      <div className="animate-in fade-in duration-300">
        <StatusDisplay status="Capturing product image" showLoading={true} />
      </div>
    );
  }

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - ringProgress);

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

            <div className="flex items-center gap-3">
              <button
                onClick={handlePreviewClick}
                disabled={isLoading}
                className="flex-1 bg-gray-900 text-white rounded-full py-3.5 px-6 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                data-testid="preview-and-rate-button"
              >
                Preview and rate
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </button>
              
              {showRing && (
                <div className="flex-shrink-0" data-testid="countdown-ring">
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle
                      cx="14"
                      cy="14"
                      r="10"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="10"
                      fill="none"
                      stroke="#111827"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 14 14)"
                      style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                  </svg>
                </div>
              )}
            </div>

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
