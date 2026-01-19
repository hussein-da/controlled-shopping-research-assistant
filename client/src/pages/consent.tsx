import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export default function Consent() {
  const [, setLocation] = useLocation();
  const { giveConsent, session } = useStudy();
  const [isAdult, setIsAdult] = useState(false);
  const [consentsToData, setConsentsToData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = isAdult && consentsToData;

  const handleContinue = async () => {
    if (!canContinue) return;
    setIsSubmitting(true);
    await giveConsent(isAdult, consentsToData);
    setLocation('/pre');
  };

  const handleAbort = () => {
    setLocation('/debrief?aborted=true');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-lg space-y-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 2 von 9
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Einwilligung und Hinweise
          </h1>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-5 text-sm text-gray-700">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Zweck</h3>
            <p>
              Im Rahmen einer Bachelorarbeit wird ein prototypischer KI-Shopping-Assistent evaluiert. Sie bearbeiten eine kurze Kaufaufgabe und beantworten anschließend Fragen zur wahrgenommenen Nutzerführung und zur Entscheidung.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Freiwilligkeit</h3>
            <p>
              Die Teilnahme ist freiwillig. Sie können jederzeit abbrechen, ohne dass Ihnen Nachteile entstehen.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Datenschutz</h3>
            <p>
              Es werden ausschließlich pseudonymisierte Angaben gespeichert (zufällige Teilnehmer-ID, Klicks im Prototyp, Fragebogenantworten). Es werden keine Klarnamen, keine Standortdaten und keine IP-Adressen gespeichert. Die Daten werden ausschließlich für Forschungszwecke im Rahmen der Bachelorarbeit genutzt.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Kontakt</h3>
            <p>
              Studienleitung: Hussein Daoud (B.Sc. E-Commerce, Hochschule Ruhr West)
            </p>
            <p>
              E-Mail: hussein.daoud@stud.hs-ruhrwest.de
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="adult"
              checked={isAdult}
              onCheckedChange={(checked) => setIsAdult(checked === true)}
              data-testid="consent-adult"
            />
            <label htmlFor="adult" className="text-sm text-gray-700 cursor-pointer">
              Ich bin mindestens 18 Jahre alt.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consentsToData}
              onCheckedChange={(checked) => setConsentsToData(checked === true)}
              data-testid="consent-data"
            />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
              Ich willige in die Verarbeitung meiner Angaben für Forschungszwecke ein.
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleAbort}
            className="flex-1"
            data-testid="consent-abort-button"
          >
            Abbrechen
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue || isSubmitting}
            className="flex-1"
            data-testid="consent-continue-button"
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
