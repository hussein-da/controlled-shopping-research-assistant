import { useState, useEffect } from 'react';
import { mockProductCards } from '@shared/schema';
import { StatusDisplay } from './status-display';

interface TransitionScreenProps {
  onComplete: () => void;
  productsViewed: number;
}

const TRANSITION_DURATION = 5000;

export function TransitionScreen({ onComplete, productsViewed }: TransitionScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / TRANSITION_DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);

    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % Math.min(productsViewed, mockProductCards.length));
    }, 800);

    return () => {
      clearInterval(imageInterval);
    };
  }, [onComplete, productsViewed]);

  const displayProduct = mockProductCards[currentImageIndex];

  return (
    <div 
      className="space-y-4 animate-in fade-in duration-300"
      data-testid="transition-screen"
    >
      <StatusDisplay status="Clarifying product pricing" showLoading={false} />
      
      <div className="border border-gray-200 rounded-2xl p-6 bg-white">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden"
            >
              <div className="w-12 h-16 bg-amber-200 rounded flex items-center justify-center shadow-sm">
                <span className="text-xl text-amber-600">C</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
              {productsViewed}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-gray-700 text-base leading-relaxed">
              Thanks for the feedback. Your final recommendations will be ready soon.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-900 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
