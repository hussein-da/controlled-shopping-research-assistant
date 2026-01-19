import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { STUDY_PROMPT } from '@shared/schema';
import thumbnailBg from '@assets/thumbnail_1768858562792.jpg';

export default function Task() {
  const [, setLocation] = useLocation();
  const { session, logEvent } = useStudy();

  const handleStart = async () => {
    await logEvent('task_started');
    setLocation('/assistant');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${thumbnailBg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-lg space-y-8">
        <div className="mb-4 text-sm text-white/80">
          Schritt 4 von 9
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Aufgabe
          </h1>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 space-y-5 shadow-lg">
          <p className="text-gray-700 leading-relaxed">
            Stellen Sie sich vor: Sie möchten in den nächsten Tagen Kaffee online kaufen.
            Bitte nutzen Sie den Prototypen wie beschrieben.
          </p>

          <div className="bg-amber-50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-gray-900 text-sm">Ihre Zielkriterien für diese Aufgabe:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Packungsgröße: 250 g</li>
              <li>• Budget: bis 12 €</li>
              <li>• Nachhaltigkeit: Bio/Fairtrade</li>
              <li>• Mahlart: ganze Bohnen</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 text-sm">Ihre Aufgabe:</h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Klicken Sie auf das Plus-Symbol und wählen Sie 'Shopping-Assistent'.</li>
              <li>
                Kopieren Sie den folgenden Prompt und senden Sie ihn ab:
                <div className="mt-2 bg-gray-100 rounded-lg px-3 py-2 font-mono text-xs">
                  '{STUDY_PROMPT}'
                </div>
              </li>
              <li>Klicken Sie sich durch die Schritte. Danach erhalten Sie einen Bericht (Guide). Nehmen Sie sich so viel Zeit zum Lesen wie Sie möchten.</li>
              <li>Wenn Sie fertig sind, klicken Sie im Guide auf 'Weiter'.</li>
            </ol>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleStart}
          className="w-full bg-white text-gray-900 hover:bg-white/90"
          data-testid="task-start-button"
        >
          Zum Shopping Assistant
        </Button>
      </div>
    </div>
  );
}
