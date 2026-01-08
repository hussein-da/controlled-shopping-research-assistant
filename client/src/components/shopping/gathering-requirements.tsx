import { useState, useEffect, useRef } from 'react';
import { Edit3 } from 'lucide-react';

interface GatheringRequirementsProps {
  state: 'budget' | 'aroma' | 'properties';
  onSelect: (value: string) => void;
  onSkip: () => void;
  timerDuration: number;
}

const questionConfig = {
  budget: {
    question: 'Gesamtes Budget?',
    options: ['Bis 10 €', 'Bis 20 €', 'Bis 30 €', '30 €+'],
  },
  aroma: {
    question: 'Gewünschtes Aroma?',
    options: ['Kräftig', 'Mild', 'Fruchtig', 'Nussig'],
  },
  properties: {
    question: 'Wichtige Eigenschaften?',
    options: ['Bio', 'Fairtrade', 'Regional', 'Entkoffeiniert'],
  },
};

export function GatheringRequirements({ 
  state, 
  onSelect, 
  onSkip, 
  timerDuration 
}: GatheringRequirementsProps) {
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const animationRef = useRef<number | null>(null);

  const config = questionConfig[state];

  useEffect(() => {
    setProgress(0);
    setSelectedOption(null);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / timerDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    timerRef.current = setTimeout(() => {
      onSkip();
    }, timerDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [state, timerDuration, onSkip]);

  const handleSelect = (option: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setSelectedOption(option);
    setTimeout(() => onSelect(option), 200);
  };

  const handleSkipClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    onSkip();
  };

  const circumference = 2 * Math.PI * 8;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="gathering-requirements"
    >
      <div>
        <p className="text-sm text-gray-500 mb-2">Gathering requirements</p>
        <h2 className="text-xl font-medium text-gray-900">{config.question}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3" data-testid="options-grid">
        {config.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all ${
              selectedOption === option
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            data-testid={`option-${option.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedOption === option ? 'border-gray-900' : 'border-gray-300'
            }`}>
              {selectedOption === option && (
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              )}
            </div>
            <span className="text-gray-900">{option}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => {}}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 transition-colors"
        data-testid="something-else-button"
      >
        <Edit3 className="w-4 h-4" />
        <span>Something else...</span>
      </button>

      <button
        onClick={handleSkipClick}
        className="flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-gray-700 transition-colors"
        data-testid="skip-button"
      >
        <span>Skip</span>
        <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>
      </button>
    </div>
  );
}
