import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { PreSurvey } from '@shared/schema';

const llmUsageOptions = ['nie', 'selten', 'wöchentlich', 'täglich'];
const llmPurchaseOptions = ['ja', 'nein', 'unsicher'];
const shoppingFrequencyOptions = ['selten', 'monatlich', 'wöchentlich', 'mehrmals wöchentlich'];

export default function PreSurvey() {
  const [, setLocation] = useLocation();
  const { submitPreSurvey, session } = useStudy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [p1Age, setP1Age] = useState('');
  const [p4Shopping, setP4Shopping] = useState('');
  const [p7Llm, setP7Llm] = useState('');
  const [p8LlmPurchase, setP8LlmPurchase] = useState('');
  const [p9Familiarity, setP9Familiarity] = useState<number | null>(null);

  const ageValid = p1Age && parseInt(p1Age) >= 18 && parseInt(p1Age) <= 99;
  const isComplete = ageValid && p4Shopping && p7Llm && p8LlmPurchase && p9Familiarity;

  const handleSubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    
    await submitPreSurvey({
      p1_age: parseInt(p1Age),
      p4_online_shopping: p4Shopping,
      p7_llm_usage: p7Llm,
      p8_llm_purchase: p8LlmPurchase,
      p9_familiarity: p9Familiarity!,
    } as PreSurvey);
    
    setLocation('/task');
  };

  const handleBack = () => {
    setLocation('/consent');
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
          data-testid={`${name}-${opt.replace(/[^a-zA-Z0-9]/g, '-')}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const LikertScale = ({ value, onChange, name, leftLabel, rightLabel }: { 
    value: number | null, 
    onChange: (v: number) => void, 
    name: string, 
    leftLabel: string,
    rightLabel: string 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-28">{leftLabel}</span>
        <div className="flex gap-1 flex-1 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors ${
                value === n
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              data-testid={`${name}-${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500 w-24 text-right">{rightLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-4 py-8" data-testid="pre-survey-form">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 3 von 9
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Kurze Vorabfragen
          </h1>
          <p className="text-gray-600">
            Bitte beantworten Sie die folgenden Fragen.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="p1-age" className="text-sm font-medium text-gray-900">
              1. Wie alt sind Sie (in Jahren)?
            </Label>
            <Input
              id="p1-age"
              type="number"
              min={18}
              max={99}
              value={p1Age}
              onChange={(e) => setP1Age(e.target.value)}
              placeholder="z.B. 24"
              className="max-w-32"
              data-testid="p1-age"
            />
            {p1Age && !ageValid && (
              <p className="text-sm text-red-500">Bitte geben Sie ein Alter zwischen 18 und 99 an.</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              2. Wie häufig kaufen Sie online ein?
            </Label>
            <RadioGroup options={shoppingFrequencyOptions} value={p4Shopping} onChange={setP4Shopping} name="p4-shopping" />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              3. Wie häufig nutzen Sie KI-Chatbots (z. B. ChatGPT) insgesamt?
            </Label>
            <RadioGroup options={llmUsageOptions} value={p7Llm} onChange={setP7Llm} name="p7-llm" />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              4. Haben Sie KI-Chatbots schon einmal genutzt, um Produkte zu recherchieren oder Kaufentscheidungen vorzubereiten?
            </Label>
            <RadioGroup options={llmPurchaseOptions} value={p8LlmPurchase} onChange={setP8LlmPurchase} name="p8-llm-purchase" />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              5. Wie vertraut sind Sie mit KI-Shopping-Assistenten oder Shopping-Agenten (z. B. KI, die Produkte vorschlägt und vergleicht)?
            </Label>
            <LikertScale 
              value={p9Familiarity} 
              onChange={setP9Familiarity} 
              name="p9-familiarity"
              leftLabel="gar nicht vertraut"
              rightLabel="sehr vertraut"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
            data-testid="pre-survey-back-button"
          >
            Zurück
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="flex-1"
            data-testid="pre-survey-submit-button"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
