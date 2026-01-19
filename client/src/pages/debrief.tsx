import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Debrief() {
  const [location] = useLocation();
  const { session } = useStudy();
  const [copied, setCopied] = useState(false);

  const isAborted = location.includes('aborted=true');

  const handleCopy = async () => {
    if (session?.participantId) {
      await navigator.clipboard.writeText(session.participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isAborted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="max-w-lg space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-gray-500" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Abbruch
            </h1>
            <p className="text-gray-600">
              Sie haben die Studie abgebrochen. Es werden keine weiteren Angaben erhoben.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">Kontakt</h3>
            <p className="text-sm text-gray-700">
              Studienleitung: Hussein Daoud (Hochschule Ruhr West)
            </p>
            <p className="text-sm text-gray-700">
              E-Mail: hussein.daoud@stud.hs-ruhrwest.de
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          Schritt 9 von 9
        </div>

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
            Vielen Dank für Ihre Teilnahme.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-gray-900">Hinweis zur Studie</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Es gab zwei Varianten des Berichts (Guide). In einer Variante wurde eine Option stärker als beste Wahl dargestellt, in der anderen Variante wurden die Optionen neutraler präsentiert. Ziel ist zu untersuchen, wie Darstellungsformen Entscheidungen beeinflussen.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
          <h3 className="font-medium text-blue-900 text-sm">Kontakt</h3>
          <p className="text-sm text-blue-700">
            Studienleitung: Hussein Daoud (Hochschule Ruhr West)
          </p>
          <p className="text-sm text-blue-700">
            E-Mail: hussein.daoud@stud.hs-ruhrwest.de
          </p>
          <p className="text-sm text-blue-700 mt-4">
            Wenn Sie Fragen haben oder eine Löschung Ihrer Angaben wünschen, nennen Sie bitte Ihre Teilnehmer-ID:
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg px-3 py-2 font-mono text-xs text-gray-700 break-all border border-blue-200">
              {session.participantId}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
              data-testid="copy-participant-id"
            >
              {copied ? 'Kopiert!' : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          Sie können dieses Fenster jetzt schließen.
        </div>
      </div>
    </div>
  );
}
