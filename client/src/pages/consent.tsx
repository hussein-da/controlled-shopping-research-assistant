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
    await giveConsent();
    setLocation('/pre');
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
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Einwilligung zur Studienteilnahme
          </h1>
          <p className="text-gray-600">
            Bitte lies dir die folgenden Informationen durch und bestätige deine Einwilligung.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Zweck der Studie</h3>
            <p>
              Diese Studie untersucht die Nutzererfahrung mit einem prototypischen KI-Shopping-Assistenten für Kaffee. Sie ist Teil einer Bachelorarbeit an einer deutschen Hochschule.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Freiwilligkeit</h3>
            <p>
              Die Teilnahme ist vollständig freiwillig. Du kannst die Studie jederzeit ohne Angabe von Gründen abbrechen, ohne dass dir Nachteile entstehen.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Datenschutz</h3>
            <p>
              Alle Daten werden pseudonymisiert gespeichert und ausschließlich zu Forschungszwecken verwendet. Es werden keine personenbezogenen Daten wie Name, E-Mail-Adresse oder IP-Adresse erhoben.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Kontakt</h3>
            <p>
              Bei Fragen oder für eine nachträgliche Löschung deiner Daten kannst du dich unter Angabe deiner Teilnehmer-ID an den Studienleiter wenden.
            </p>
            <p className="mt-2 font-mono text-xs text-gray-500">
              Deine Teilnehmer-ID: {session.participantId}
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
              Ich willige in die Verarbeitung meiner Angaben zu Forschungszwecken ein.
            </label>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
          className="w-full"
          data-testid="consent-continue-button"
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
