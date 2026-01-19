import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function StudyStart() {
  const [, setLocation] = useLocation();
  const { initSession, isLoading, error, session } = useStudy();

  const handleStart = async () => {
    if (session) {
      setLocation('/consent');
      return;
    }
    await initSession();
    setLocation('/consent');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Willkommen zur Studie
          </h1>
          <p className="text-lg text-gray-600">
            Vielen Dank, dass du an dieser Studie teilnimmst! In den nächsten Minuten wirst du einen KI-Shopping-Assistenten für Kaffee testen.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
          <h2 className="font-medium text-gray-900">Was erwartet dich:</h2>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">1.</span>
              <span>Kurze Einwilligung und Hintergrundfragen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">2.</span>
              <span>Interaktion mit dem Shopping-Assistenten</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">3.</span>
              <span>Kurze Abschlussfragen</span>
            </li>
          </ul>
          <p className="text-sm text-gray-500 pt-2">
            Geschätzte Dauer: 5-10 Minuten
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          size="lg"
          onClick={handleStart}
          disabled={isLoading}
          className="w-full max-w-xs"
          data-testid="start-study-button"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Studie starten
        </Button>
      </div>
    </div>
  );
}
