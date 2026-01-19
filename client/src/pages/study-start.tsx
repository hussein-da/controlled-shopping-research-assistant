import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import thumbnailBg from '@assets/thumbnail_1768858562792.jpg';

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
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${thumbnailBg})` }}
      data-testid="study-start"
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-lg text-center space-y-8">
        <div className="mb-4 text-sm text-white/80">
          Schritt 1 von 9
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Studie: KI-gestützte Kaufberatung
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Diese kurze Studie ist Teil einer Bachelorarbeit im Studiengang E-Commerce (Hochschule Ruhr West).
          </p>
          <p className="text-white/80">
            Dauer: ca. 5–8 Minuten. Teilnahme ist freiwillig.
          </p>
        </div>

        {error && (
          <p className="text-red-300 text-sm">{error}</p>
        )}

        <Button
          size="lg"
          onClick={handleStart}
          disabled={isLoading}
          className="w-full max-w-xs text-lg py-6 bg-white text-gray-900 hover:bg-white/90"
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
