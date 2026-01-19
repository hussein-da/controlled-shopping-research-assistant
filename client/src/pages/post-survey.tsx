import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { PostSurvey } from '@shared/schema';
import { mockProductCards } from '@shared/schema';

const likertQuestions = [
  { id: 'mc1Highlight', label: 'Der Assistent hat ein Produkt besonders hervorgehoben oder empfohlen.' },
  { id: 'purchaseIntent', label: 'Ich würde das ausgewählte Produkt tatsächlich kaufen.' },
  { id: 'trust', label: 'Ich vertraue den Empfehlungen des Assistenten.' },
  { id: 'autonomy', label: 'Ich hatte das Gefühl, meine Entscheidung selbstständig zu treffen.' },
  { id: 'transparency', label: 'Mir war klar, wie der Assistent zu seinen Empfehlungen kam.' },
];

export default function PostSurvey() {
  const [, setLocation] = useLocation();
  const { submitPostSurvey, session } = useStudy();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [recommendedProduct, setRecommendedProduct] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAnswered = likertQuestions.every(q => answers[q.id]) && recommendedProduct;

  const handleLikert = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleContinue = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    await submitPostSurvey({
      mc1Highlight: answers.mc1Highlight,
      mc2ProductRecommended: recommendedProduct,
      purchaseIntent: answers.purchaseIntent,
      trust: answers.trust,
      autonomy: answers.autonomy,
      transparency: answers.transparency,
    } as PostSurvey);
    setLocation('/debrief');
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
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Abschlussfragen
          </h1>
          <p className="text-gray-600">
            Bitte beantworte die folgenden Fragen zu deiner Erfahrung mit dem Assistenten.
          </p>
        </div>

        <div className="space-y-8">
          {likertQuestions.map((q, idx) => (
            <div key={q.id} className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                {idx + 1}. {q.label}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24">Stimme nicht zu</span>
                <div className="flex gap-1 flex-1 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7].map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleLikert(q.id, value)}
                      className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors ${
                        answers[q.id] === value
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                      data-testid={`post-survey-${q.id}-${value}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500 w-24 text-right">Stimme zu</span>
              </div>
            </div>
          ))}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              6. Welches Produkt wirkte am stärksten empfohlen?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mockProductCards.slice(0, 6).map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setRecommendedProduct(product.id)}
                  className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                    recommendedProduct === product.id
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  data-testid={`post-survey-recommended-${product.id}`}
                >
                  {product.title.length > 40 ? product.title.slice(0, 40) + '...' : product.title}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setRecommendedProduct('none')}
                className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                  recommendedProduct === 'none'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                data-testid="post-survey-recommended-none"
              >
                Keines besonders
              </button>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!allAnswered || isSubmitting}
          className="w-full"
          data-testid="post-survey-submit-button"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Absenden
        </Button>
      </div>
    </div>
  );
}
