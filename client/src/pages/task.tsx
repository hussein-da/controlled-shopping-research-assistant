import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Button } from '@/components/ui/button';
import { Loader2, Coffee } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Deine Aufgabe
          </h1>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Stell dir vor: Du möchtest in den nächsten Tagen <strong>Kaffee online kaufen</strong>. Du nutzt meist einen <strong>Vollautomaten</strong>. Du willst etwas Alltags-taugliches, <strong>Preis-Leistung</strong> ist dir wichtig.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nutze den Shopping-Assistenten und wähle am Ende das Produkt, das du am ehesten kaufen würdest.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <strong>Hinweis:</strong> Der Assistent wird automatisch eine Kaffee-Recherche starten. Beantworte die Fragen und bewerte die vorgeschlagenen Produkte.
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleStart}
          className="w-full"
          data-testid="task-start-button"
        >
          Zum Assistenten
        </Button>
      </div>
    </div>
  );
}
