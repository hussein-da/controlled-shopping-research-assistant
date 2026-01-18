import { useState, useEffect, useRef, useCallback } from 'react';
import { Edit3 } from 'lucide-react';
import { StatusDisplay } from './status-display';

interface GatheringRequirementsProps {
  state: 'budget' | 'aroma' | 'properties';
  onSelect: (value: string) => void;
  onSkip: () => void;
  timerDuration: number;
  previousSelection?: string;
}

const questionConfig = {
  budget: {
    question: 'Budget für eine Packung?',
    options: ['Bis 5 €', 'Bis 10 €', 'Bis 20 €', '20 €+'],
    statusPrefix: 'Gathering requirements',
  },
  aroma: {
    question: 'Röstungsgrad bevorzugt?',
    options: ['Hell', 'Mittel', 'Dunkel', 'Entkoffeiniert'],
    statusPrefix: '',
  },
  properties: {
    question: 'Wichtige Merkmale?',
    options: ['Fairtrade/Bio', 'Ganze Bohnen', 'Gemahlen', 'Besonders aromatisch'],
    statusPrefix: '',
  },
};

const COUNTDOWN_DELAY = 10000;
const COUNTDOWN_DURATION = 10000;

export function GatheringRequirements({ 
  state, 
  onSelect, 
  onSkip, 
  timerDuration,
  previousSelection
}: GatheringRequirementsProps) {
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownDelayRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const animationRef = useRef<number | null>(null);

  const config = questionConfig[state];
  
  const statusText = previousSelection 
    ? `Updated search: ${previousSelection}` 
    : config.statusPrefix;

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownDelayRef.current) clearTimeout(countdownDelayRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    setProgress(0);
    setSelectedOption(null);
    setShowCountdown(false);
    setShowContinue(false);

    countdownDelayRef.current = setTimeout(() => {
      setShowCountdown(true);
      startTimeRef.current = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / COUNTDOWN_DURATION) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress < 100) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      timerRef.current = setTimeout(() => {
        onSkip();
      }, COUNTDOWN_DURATION);
    }, COUNTDOWN_DELAY);

    return () => {
      clearAllTimers();
    };
  }, [state, onSkip, clearAllTimers]);

  const handleSelect = (option: string) => {
    clearAllTimers();
    setSelectedOption(option);
    setShowContinue(true);
    setShowCountdown(false);
  };

  const handleContinue = () => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  const handleSkipClick = () => {
    clearAllTimers();
    onSkip();
  };

  const circumference = 2 * Math.PI * 8;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="gathering-requirements"
    >
      {statusText && (
        <StatusDisplay status={statusText} showLoading={!previousSelection} />
      )}

      <div>
        <h2 className="text-xl font-medium text-gray-900">{config.question}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3" data-testid="options-grid">
        {config.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`flex items-center gap-3 px-4 py-3.5 border rounded-full transition-all ${
              selectedOption === option
                ? 'border-gray-300 bg-gray-100'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            data-testid={`option-${option.toLowerCase().replace(/[^\w]+/g, '-')}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedOption === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            }`}>
              {selectedOption === option && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-gray-900 text-left">{option}</span>
          </button>
        ))}
      </div>

      {showContinue ? (
        <button
          onClick={handleContinue}
          className="w-full py-3.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          data-testid="continue-button"
        >
          Continue
        </button>
      ) : (
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-200 rounded-full text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          data-testid="something-else-button"
        >
          <Edit3 className="w-4 h-4" />
          <span>Something else...</span>
        </button>
      )}

      <button
        onClick={handleSkipClick}
        className="flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-gray-700 transition-colors py-2"
        data-testid="skip-button"
      >
        <span>Skip</span>
        {showCountdown && (
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
        )}
      </button>
    </div>
  );
}
