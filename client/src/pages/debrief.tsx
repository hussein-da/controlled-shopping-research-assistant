import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStudy } from '@/lib/study-context';
import { Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import thumbnailBg from '@assets/thumbnail_1768858562792.jpg';

export default function Debrief() {
  const [location] = useLocation();
  const { session, logEvent } = useStudy();
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const isAborted = location.includes('aborted=true');

  const handleCopy = async () => {
    if (session?.participantId) {
      await navigator.clipboard.writeText(session.participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveNotes = async () => {
    if (notes.trim()) {
      await logEvent('participant_notes', { notes: notes.trim() });
      setNotesSaved(true);
    }
  };

  if (isAborted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${thumbnailBg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-100/90 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-gray-500" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-white">
              Abbruch
            </h1>
            <p className="text-white/80">
              Sie haben die Studie abgebrochen. Es werden keine weiteren Angaben erhoben.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 space-y-3">
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
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${thumbnailBg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-lg space-y-6">
        <div className="mb-4 text-sm text-white/80">
          Schritt 9 von 9
        </div>

        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100/90 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Vielen Dank!
          </h1>
          <p className="text-white/90">
            Vielen Dank für Ihre Teilnahme an dieser Studie.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 space-y-4">
          <h2 className="font-medium text-gray-900">Anmerkungen (optional)</h2>
          <p className="text-sm text-gray-600">
            Was denken Sie, worum es bei dieser Studie ging? Oder haben Sie sonstige Anmerkungen?
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ihre Gedanken oder Anmerkungen..."
            className="min-h-24"
            data-testid="participant-notes"
          />
          {!notesSaved ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveNotes}
              disabled={!notes.trim()}
              data-testid="save-notes-button"
            >
              Anmerkungen speichern
            </Button>
          ) : (
            <p className="text-sm text-green-600">Anmerkungen gespeichert!</p>
          )}
        </div>

        <div className="bg-blue-50/95 backdrop-blur-sm border border-blue-100 rounded-xl p-6 space-y-4">
          <h3 className="font-medium text-blue-900 text-sm">Datenschutz & Kontakt</h3>
          <p className="text-sm text-blue-800">
            Ihre Daten wurden bereits pseudonymisiert erhoben. Wenn Sie möchten, dass Ihre Daten nicht in die Analyse einfließen, können Sie deren Löschung beantragen.
          </p>
          <p className="text-sm text-blue-700">
            Studienleitung: Hussein Daoud (Hochschule Ruhr West)
          </p>
          <p className="text-sm text-blue-700">
            E-Mail: hussein.daoud@stud.hs-ruhrwest.de
          </p>
          <div className="pt-2 border-t border-blue-200">
            <Label className="text-sm text-blue-800 mb-2 block">
              Ihre Teilnehmer-ID (für Löschungsanfragen):
            </Label>
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
        </div>

        <div className="text-center text-sm text-white/70">
          Sie können dieses Fenster jetzt schließen.
        </div>
      </div>
    </div>
  );
}
