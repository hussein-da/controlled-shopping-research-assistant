import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import type { StudySession } from '@shared/schema';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const { data: sessions, isLoading, refetch } = useQuery<StudySession[]>({
    queryKey: ['/api/admin/sessions', password],
    queryFn: async () => {
      const res = await fetch(`/api/admin/sessions?password=${encodeURIComponent(password)}`);
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const handleLogin = async () => {
    try {
      const res = await fetch(`/api/admin/sessions?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Falsches Passwort');
      }
    } catch {
      setError('Fehler beim Login');
    }
  };

  const handleExportJsonl = () => {
    window.open(`/api/admin/export/jsonl?password=${encodeURIComponent(password)}`, '_blank');
  };

  const handleExportCsv = () => {
    window.open(`/api/admin/export/csv?password=${encodeURIComponent(password)}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full space-y-6 bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900 text-center">
            Admin-Bereich
          </h1>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              data-testid="admin-password"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleLogin} className="w-full" data-testid="admin-login">
              Anmelden
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Studien-Übersicht
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} data-testid="admin-refresh">
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
            <Button variant="outline" onClick={handleExportJsonl} data-testid="admin-export-jsonl">
              <Download className="w-4 h-4 mr-2" />
              JSONL
            </Button>
            <Button variant="outline" onClick={handleExportCsv} data-testid="admin-export-csv">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Condition</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Consent</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Pre-Survey</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Post-Survey</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Choice</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions?.map((session) => (
                    <tr key={session.participantId} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {session.participantId.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          session.condition === 'nudge'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {session.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {session.consentGiven ? '✓' : '–'}
                      </td>
                      <td className="px-4 py-3">
                        {session.preSurvey ? '✓' : '–'}
                      </td>
                      <td className="px-4 py-3">
                        {session.postSurvey ? '✓' : '–'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {session.finalChoice || '–'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(session.createdAt).toLocaleString('de-DE')}
                      </td>
                    </tr>
                  ))}
                  {(!sessions || sessions.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        Noch keine Teilnehmer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {sessions && (
              <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
                {sessions.length} Teilnehmer insgesamt |{' '}
                {sessions.filter(s => s.condition === 'baseline').length} baseline |{' '}
                {sessions.filter(s => s.condition === 'nudge').length} nudge |{' '}
                {sessions.filter(s => s.completedAt).length} abgeschlossen
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
