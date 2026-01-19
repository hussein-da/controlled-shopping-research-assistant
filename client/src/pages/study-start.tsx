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
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-8"
      data-testid="study-start"
    >
      <div className="max-w-lg text-center space-y-8">
        <div className="mb-4 text-sm text-gray-500">
          Schritt 1 von 9
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Studie: KI-gestützte Kaufberatung (Kaffee)
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Diese kurze Studie ist Teil einer Bachelorarbeit im Studiengang E-Commerce (Hochschule Ruhr West).
          </p>
          <p className="text-gray-600">
            Dauer: ca. 5–8 Minuten. Teilnahme ist freiwillig.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          size="lg"
          onClick={handleStart}
          disabled={isLoading}
          className="w-full max-w-xs text-lg py-6"
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
