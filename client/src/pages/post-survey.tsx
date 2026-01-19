import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { PostSurvey } from '@shared/schema';
import { TOP_6_PRODUCTS } from '@shared/schema';

const q1_options = ['ja', 'nein', 'unsicher'];
const q4_options = ['komplett', 'überflogen', 'kaum'];

const likertQuestions: { id: string; label: string }[] = [
  { id: 'q2', label: '2. Der Assistent hat eine Option als "beste Wahl" dargestellt.' },
  { id: 'q5', label: '5. Die Struktur des Berichts hat mich dazu gebracht, bestimmte Optionen stärker zu beachten.' },
  { id: 'q6', label: '6. Ich habe mich unter Zeitdruck gefühlt.' },
  { id: 'q7', label: '7. Es war hilfreich, weniger passende Optionen früh auszusortieren.' },
  { id: 'q8', label: '8. Die Budgetfrage hat meine spätere Auswahl beeinflusst.' },
  { id: 'q9', label: '9. Durch mein Like/Dislike-Feedback hatte ich Kontrolle über das Ergebnis.' },
  { id: 'q10', label: '10. Die "Beste Wahl" wirkte besonders kompetent ausgewählt.' },
  { id: 'q11', label: '11. Weniger angezeigt zu bekommen hat mir die Entscheidung erleichtert.' },
  { id: 'q12', label: '12. Ich wollte dem Rat des Assistenten folgen.' },
  { id: 'q13', label: '13. Die Vergleichstabelle war hilfreich.' },
  { id: 'q14', label: '14. Mehr Filteroptionen hätte ich bevorzugt.' },
  { id: 'q15', label: '15. Ich würde das gewählte Produkt kaufen.' },
  { id: 'q16', label: '16. Ich bin mir sicher, die richtige Entscheidung getroffen zu haben.' },
  { id: 'q17', label: '17. Ich vertraue den Empfehlungen des Assistenten.' },
  { id: 'q18', label: '18. Ich habe mich frei in meiner Entscheidung gefühlt.' },
  { id: 'q19', label: '19. Mir war klar, wie der Assistent zu seinen Empfehlungen kam.' },
  { id: 'q20', label: '20. Ich bin zufrieden mit dem Ergebnis.' },
];

const q21_influences = [
  'Preis',
  'Bewertungen/Sterne',
  '"Beste Wahl" Hervorhebung',
  'Nachhaltigkeit',
  'Geschmack/Röstung',
  'Marke',
  'Sonstiges',
];

export default function PostSurvey() {
  const [, setLocation] = useLocation();
  const { submitPostSurvey, session, markComplete } = useStudy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [q1, setQ1] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [likertAnswers, setLikertAnswers] = useState<Record<string, number>>({});
  const [q21Influences, setQ21Influences] = useState<string[]>([]);

  const allLikertAnswered = likertQuestions.every(q => likertAnswers[q.id] !== undefined);
  const isComplete = q1 && q3 && q4 && allLikertAnswered && q21Influences.length > 0;

  const handleLikert = (id: string, value: number) => {
    setLikertAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleInfluence = (influence: string, checked: boolean) => {
    setQ21Influences(prev => 
      checked ? [...prev, influence] : prev.filter(i => i !== influence)
    );
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    
    await submitPostSurvey({
      q1_best_choice: q1,
      q2_best_choice_likert: likertAnswers.q2,
      q3_which_product: q3,
      q4_read_carefully: q4,
      q5_prestructured: likertAnswers.q5,
      q6_time_pressure: likertAnswers.q6,
      q7_skip_worse: likertAnswers.q7,
      q8_budget_influence: likertAnswers.q8,
      q9_feedback_control: likertAnswers.q9,
      q10_status_competent: likertAnswers.q10,
      q11_reduced_choice: likertAnswers.q11,
      q12_normative: likertAnswers.q12,
      q13_comparison_table: likertAnswers.q13,
      q14_more_filters: likertAnswers.q14,
      q15_purchase_intent: likertAnswers.q15,
      q16_decision_certainty: likertAnswers.q16,
      q17_trust: likertAnswers.q17,
      q18_autonomy: likertAnswers.q18,
      q19_transparency: likertAnswers.q19,
      q20_satisfaction: likertAnswers.q20,
      q21_influences: q21Influences,
    } as PostSurvey);

    await markComplete();
    setLocation('/debrief');
  };

  const handleBack = () => {
    setLocation('/choice');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const RadioGroup = ({ options, value, onChange, name }: { options: string[], value: string, onChange: (v: string) => void, name: string }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
            value === opt
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
          data-testid={`${name}-${opt}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const LikertScale = ({ id, value }: { id: string, value: number | undefined }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-28 shrink-0">stimme gar nicht zu</span>
      <div className="flex gap-1 flex-1 justify-center">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => handleLikert(id, n)}
            className={`w-9 h-9 rounded-full border text-sm font-medium transition-colors ${
              value === n
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
            data-testid={`post-${id}-${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500 w-24 text-right shrink-0">stimme voll zu</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-4 py-8" data-testid="post-survey-form">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 8 von 9
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Abschlussfragen
          </h1>
          <p className="text-gray-600">
            Bitte bewerten Sie Ihre Erfahrung mit dem Assistenten.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              1. Hat der Assistent eine Option als 'beste Wahl' präsentiert?
            </Label>
            <RadioGroup options={q1_options} value={q1} onChange={setQ1} name="q1" />
          </div>

          {likertQuestions.slice(0, 1).map(q => (
            <div key={q.id} className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">{q.label}</Label>
              <LikertScale id={q.id} value={likertAnswers[q.id]} />
            </div>
          ))}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              3. Welches Produkt wirkte am stärksten empfohlen?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOP_6_PRODUCTS.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setQ3(product.id)}
                  className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                    q3 === product.id
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  data-testid={`q3-${product.id}`}
                >
                  {product.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setQ3('none')}
                className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                  q3 === 'none'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                data-testid="q3-none"
              >
                Keines besonders
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              4. Wie genau haben Sie den Bericht (Guide) gelesen?
            </Label>
            <RadioGroup options={q4_options} value={q4} onChange={setQ4} name="q4" />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Wahrgenommene Führung</h3>
          </div>

          {likertQuestions.slice(1, 11).map(q => (
            <div key={q.id} className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">{q.label}</Label>
              <LikertScale id={q.id} value={likertAnswers[q.id]} />
            </div>
          ))}

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ergebnis</h3>
          </div>

          {likertQuestions.slice(11).map(q => (
            <div key={q.id} className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">{q.label}</Label>
              <LikertScale id={q.id} value={likertAnswers[q.id]} />
            </div>
          ))}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              21. Was hat Ihre Entscheidung am meisten beeinflusst? (Mehrfachauswahl)
            </Label>
            <div className="space-y-2">
              {q21_influences.map(influence => (
                <div key={influence} className="flex items-center gap-3">
                  <Checkbox
                    id={`q21-${influence}`}
                    checked={q21Influences.includes(influence)}
                    onCheckedChange={(checked) => handleInfluence(influence, checked === true)}
                    data-testid={`q21-${influence.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  />
                  <label htmlFor={`q21-${influence}`} className="text-sm text-gray-700 cursor-pointer">
                    {influence}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
            data-testid="post-survey-back-button"
          >
            Zurück
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="flex-1"
            data-testid="post-survey-submit-button"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Absenden
          </Button>
        </div>
      </div>
    </div>
  );
}
