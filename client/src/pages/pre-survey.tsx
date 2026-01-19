import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { PreSurvey } from '@shared/schema';

const ageOptions = ['18–20', '21–25', '26–30', '>30', 'keine Angabe'];
const studentOptions = ['Student:in', 'nicht Student:in', 'keine Angabe'];
const frequencyOptions = ['selten', 'monatlich', 'wöchentlich', 'mehrmals wöchentlich'];
const llmUsageOptions = ['nie', 'selten', 'wöchentlich', 'täglich'];
const llmPurchaseOptions = ['ja', 'nein', 'unsicher'];

export default function PreSurvey() {
  const [, setLocation] = useLocation();
  const { submitPreSurvey, session } = useStudy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [p1Age, setP1Age] = useState('');
  const [p2Student, setP2Student] = useState('');
  const [p3Program, setP3Program] = useState('');
  const [p4Shopping, setP4Shopping] = useState('');
  const [p5Coffee, setP5Coffee] = useState('');
  const [p6Knowledge, setP6Knowledge] = useState<number | null>(null);
  const [p7Llm, setP7Llm] = useState('');
  const [p8LlmPurchase, setP8LlmPurchase] = useState('');
  const [p9Ranking, setP9Ranking] = useState<number | null>(null);

  const isComplete = p1Age && p2Student && p4Shopping && p5Coffee && p6Knowledge && p7Llm && p8LlmPurchase && p9Ranking;

  const handleSubmit = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    
    await submitPreSurvey({
      p1_age: p1Age,
      p2_student_status: p2Student,
      p3_study_program: p3Program || undefined,
      p4_online_shopping: p4Shopping,
      p5_coffee_frequency: p5Coffee,
      p6_coffee_knowledge: p6Knowledge!,
      p7_llm_usage: p7Llm,
      p8_llm_purchase: p8LlmPurchase,
      p9_ranking_affinity: p9Ranking!,
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

  const LikertScale = ({ value, onChange, name, label }: { value: number | null, onChange: (v: number) => void, name: string, label: string }) => (
    <div className="space-y-3">
      <Label className="text-sm text-gray-900">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-28">stimme gar nicht zu</span>
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
        <span className="text-xs text-gray-500 w-24 text-right">stimme voll zu</span>
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
            Bitte beantworten Sie die folgenden Fragen. Sie können bei sensiblen Angaben 'keine Angabe' wählen.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">P1. Alter</Label>
            <RadioGroup options={ageOptions} value={p1Age} onChange={setP1Age} name="p1-age" />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">P2. Studienstatus</Label>
            <RadioGroup options={studentOptions} value={p2Student} onChange={setP2Student} name="p2-student" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="p3-program" className="text-sm font-medium text-gray-900">P3. Studiengang (optional)</Label>
            <Input
              id="p3-program"
              type="text"
              maxLength={60}
              value={p3Program}
              onChange={(e) => setP3Program(e.target.value)}
              placeholder="z.B. E-Commerce, Informatik..."
              className="max-w-md"
              data-testid="p3-program"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">P4. Online-Shopping Häufigkeit</Label>
            <RadioGroup options={frequencyOptions} value={p4Shopping} onChange={setP4Shopping} name="p4-shopping" />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">P5. Kaffee-Kaufhäufigkeit</Label>
            <RadioGroup options={frequencyOptions} value={p5Coffee} onChange={setP5Coffee} name="p5-coffee" />
          </div>

          <LikertScale 
            value={p6Knowledge} 
            onChange={setP6Knowledge} 
            name="p6-knowledge"
            label="P6. Ich kenne mich mit Kaffeeprodukten gut aus."
          />

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">P7. LLM-Nutzung (ChatGPT, Claude, etc.)</Label>
            <RadioGroup options={llmUsageOptions} value={p7Llm} onChange={setP7Llm} name="p7-llm" />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">P8. LLM für Kaufrecherche genutzt?</Label>
            <RadioGroup options={llmPurchaseOptions} value={p8LlmPurchase} onChange={setP8LlmPurchase} name="p8-llm-purchase" />
          </div>

          <LikertScale 
            value={p9Ranking} 
            onChange={setP9Ranking} 
            name="p9-ranking"
            label="P9. Vergleichstabellen und Rankings helfen mir beim Kauf."
          />
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
