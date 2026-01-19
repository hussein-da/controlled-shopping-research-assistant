import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { PreSurvey } from '@shared/schema';

const questions = [
  {
    id: 'age',
    label: 'Wie alt bist du?',
    options: ['18–20', '21–25', '26–30', 'Über 30', 'Keine Angabe'],
  },
  {
    id: 'studentStatus',
    label: 'Bist du Student:in?',
    options: ['Ja, Student:in', 'Nein, nicht Student:in', 'Keine Angabe'],
  },
  {
    id: 'onlineShopping',
    label: 'Wie häufig kaufst du online ein?',
    options: ['Selten / nie', 'Monatlich', 'Wöchentlich', 'Mehrmals wöchentlich'],
  },
  {
    id: 'llmUsage',
    label: 'Wie häufig nutzt du ChatGPT oder ähnliche KI-Assistenten?',
    options: ['Nie', 'Selten', 'Monatlich', 'Wöchentlich', 'Täglich'],
  },
  {
    id: 'llmForPurchase',
    label: 'Hast du schon einmal einen KI-Assistenten für eine Kaufrecherche genutzt?',
    options: ['Ja', 'Nein', 'Unsicher'],
  },
];

export default function PreSurvey() {
  const [, setLocation] = useLocation();
  const { submitPreSurvey, session } = useStudy();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAnswered = questions.every(q => answers[q.id]);

  const handleSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleContinue = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    await submitPreSurvey(answers as PreSurvey);
    setLocation('/task');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Kurze Hintergrundfragen
          </h1>
          <p className="text-gray-600">
            Diese Angaben helfen uns bei der Auswertung.
          </p>
        </div>

        <div className="space-y-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                {idx + 1}. {q.label}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(q.id, option)}
                    className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                      answers[q.id] === option
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    data-testid={`pre-survey-${q.id}-${option.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!allAnswered || isSubmitting}
          className="w-full"
          data-testid="pre-survey-continue-button"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Weiter
        </Button>
      </div>
    </div>
  );
}
