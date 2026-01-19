import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { PostSurvey } from '@shared/schema';
import { TOP_6_PRODUCTS } from '@shared/schema';

const mc1_options = ['ja', 'nein', 'unsicher'];
const mc4_options = ['komplett', 'überflogen', 'kaum'];

const likertQuestions: { id: string; label: string }[] = [
  { id: 'mc2', label: 'MC2. Der Assistent hat eine Option als "beste Wahl" dargestellt.' },
  { id: 'n1', label: 'N1. Die Struktur des Berichts hat mich dazu gebracht, bestimmte Optionen stärker zu beachten.' },
  { id: 'n2', label: 'N2. Ich habe mich unter Zeitdruck gefühlt.' },
  { id: 'n3', label: 'N3. Es war hilfreich, weniger passende Optionen früh auszusortieren.' },
  { id: 'n4', label: 'N4. Die Budgetfrage hat meine spätere Auswahl beeinflusst.' },
  { id: 'n5', label: 'N5. Durch mein Like/Dislike-Feedback hatte ich Kontrolle über das Ergebnis.' },
  { id: 'n6', label: 'N6. Die "Beste Wahl" wirkte besonders kompetent ausgewählt.' },
  { id: 'n7', label: 'N7. Weniger angezeigt zu bekommen hat mir die Entscheidung erleichtert.' },
  { id: 'n8', label: 'N8. Ich wollte dem Rat des Assistenten folgen.' },
  { id: 'n9', label: 'N9. Die Vergleichstabelle war hilfreich.' },
  { id: 'n10', label: 'N10. Mehr Filteroptionen hätte ich bevorzugt.' },
  { id: 'o1', label: 'O1. Ich würde das gewählte Produkt kaufen.' },
  { id: 'o2', label: 'O2. Ich bin mir sicher, die richtige Entscheidung getroffen zu haben.' },
  { id: 'o3', label: 'O3. Ich vertraue den Empfehlungen des Assistenten.' },
  { id: 'o4', label: 'O4. Ich habe mich frei in meiner Entscheidung gefühlt.' },
  { id: 'o5', label: 'O5. Mir war klar, wie der Assistent zu seinen Empfehlungen kam.' },
  { id: 'o6', label: 'O6. Ich bin zufrieden mit dem Ergebnis.' },
];

const o8_influences = [
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
  
  const [mc1, setMc1] = useState('');
  const [mc3, setMc3] = useState('');
  const [mc4, setMc4] = useState('');
  const [likertAnswers, setLikertAnswers] = useState<Record<string, number>>({});
  const [o8Influences, setO8Influences] = useState<string[]>([]);

  const allLikertAnswered = likertQuestions.every(q => likertAnswers[q.id] !== undefined);
  const isComplete = mc1 && mc3 && mc4 && allLikertAnswered && o8Influences.length > 0;

  const handleLikert = (id: string, value: number) => {
    setLikertAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleInfluence = (influence: string, checked: boolean) => {
    setO8Influences(prev => 
      checked ? [...prev, influence] : prev.filter(i => i !== influence)
    );
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    
    await submitPostSurvey({
      mc1_best_choice: mc1,
      mc2_stronger_recommended: likertAnswers.mc2,
      mc3_which_product: mc3,
      mc4_read_carefully: mc4,
      n1_prestructured: likertAnswers.n1,
      n2_time_pressure: likertAnswers.n2,
      n3_skip_worse: likertAnswers.n3,
      n4_budget_influence: likertAnswers.n4,
      n5_feedback_control: likertAnswers.n5,
      n6_status_competent: likertAnswers.n6,
      n7_reduced_choice: likertAnswers.n7,
      n8_normative: likertAnswers.n8,
      n9_comparison_table: likertAnswers.n9,
      n10_more_filters: likertAnswers.n10,
      o1_purchase_intent: likertAnswers.o1,
      o2_decision_certainty: likertAnswers.o2,
      o3_trust: likertAnswers.o3,
      o4_autonomy: likertAnswers.o4,
      o5_transparency: likertAnswers.o5,
      o6_satisfaction: likertAnswers.o6,
      o8_influences: o8Influences,
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
              MC1. Hat der Assistent eine Option als 'beste Wahl' präsentiert?
            </Label>
            <RadioGroup options={mc1_options} value={mc1} onChange={setMc1} name="mc1" />
          </div>

          {likertQuestions.slice(0, 1).map(q => (
            <div key={q.id} className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">{q.label}</Label>
              <LikertScale id={q.id} value={likertAnswers[q.id]} />
            </div>
          ))}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              MC3. Welches Produkt wirkte am stärksten empfohlen?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOP_6_PRODUCTS.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setMc3(product.id)}
                  className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                    mc3 === product.id
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  data-testid={`mc3-${product.id}`}
                >
                  {product.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMc3('none')}
                className={`px-4 py-3 text-sm rounded-lg border transition-colors text-left ${
                  mc3 === 'none'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                data-testid="mc3-none"
              >
                Keines besonders
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              MC4. Wie genau haben Sie den Bericht (Guide) gelesen?
            </Label>
            <RadioGroup options={mc4_options} value={mc4} onChange={setMc4} name="mc4" />
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
              O8. Was hat Ihre Entscheidung am meisten beeinflusst? (Mehrfachauswahl)
            </Label>
            <div className="space-y-2">
              {o8_influences.map(influence => (
                <div key={influence} className="flex items-center gap-3">
                  <Checkbox
                    id={`o8-${influence}`}
                    checked={o8Influences.includes(influence)}
                    onCheckedChange={(checked) => handleInfluence(influence, checked === true)}
                    data-testid={`o8-${influence.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  />
                  <label htmlFor={`o8-${influence}`} className="text-sm text-gray-700 cursor-pointer">
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
