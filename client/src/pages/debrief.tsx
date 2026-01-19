import { useStudy } from '@/lib/study-context';
import { Loader2, CheckCircle } from 'lucide-react';

export default function Debrief() {
  const { session } = useStudy();

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
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Vielen Dank!
          </h1>
          <p className="text-gray-600">
            Du hast die Studie erfolgreich abgeschlossen.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-gray-900">Aufklärung zur Studie</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            In dieser Studie gab es <strong>zwei Versionen</strong> der Oberfläche. Eine Variante hebt eine Empfehlung stärker hervor als die andere.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Ziel der Studie:</strong> Wir untersuchen, wie unterschiedliche Darstellungsformen Kaufentscheidungen beeinflussen können. Dies ist Teil einer Bachelorarbeit zum Thema "Nudging in KI-Shopping-Assistenten".
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Deine Bedingung:</strong>{' '}
            <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">
              {session.condition}
            </span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <h3 className="font-medium text-blue-900 text-sm">Datenlöschung</h3>
          <p className="text-sm text-blue-700">
            Falls du möchtest, dass deine Daten gelöscht werden, kannst du dies jederzeit beim Studienleiter anfordern. Gib dabei bitte deine Teilnehmer-ID an:
          </p>
          <div className="bg-white rounded-lg px-3 py-2 font-mono text-xs text-gray-700 break-all">
            {session.participantId}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          Du kannst dieses Fenster jetzt schließen.
        </div>
      </div>
    </div>
  );
}
