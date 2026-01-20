import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RefreshCw, Eye, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { StudySession, StudyEvent, PreSurvey, PostSurvey, RequirementAnswers, ProductRating, DeviationFlags } from '@shared/schema';
import { products } from '@shared/schema';

interface MergedSession extends StudySession {
  events: StudyEvent[];
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState<MergedSession | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery<StudySession[]>({
    queryKey: ['/api/admin/sessions', password],
    queryFn: async () => {
      const res = await fetch(`/api/admin/sessions?password=${encodeURIComponent(password)}`);
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useQuery<StudyEvent[]>({
    queryKey: ['/api/admin/events', password],
    queryFn: async () => {
      const res = await fetch(`/api/admin/events?password=${encodeURIComponent(password)}`);
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const isLoading = sessionsLoading || eventsLoading;

  const mergedSessions: MergedSession[] = (sessions || []).map(session => ({
    ...session,
    events: (events || []).filter(e => e.participantId === session.participantId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }));

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

  const handleRefresh = () => {
    refetchSessions();
    refetchEvents();
  };

  const handleExportJsonl = () => {
    window.open(`/api/admin/export/jsonl?password=${encodeURIComponent(password)}`, '_blank');
  };

  const copySessionJson = async (session: MergedSession) => {
    const jsonStr = JSON.stringify(session, null, 2);
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopiedId(session.participantId);
      toast({ title: 'JSON kopiert', description: 'Teilnehmer-Daten in Zwischenablage kopiert' });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({ title: 'Fehler', description: 'Kopieren fehlgeschlagen. Bitte manuell kopieren.', variant: 'destructive' });
    }
  };

  const handleExportCsvEnhanced = () => {
    if (!mergedSessions.length) return;
    
    const headers = [
      'Participant ID',
      'Erstellt',
      'Abgeschlossen',
      'Consent Alter',
      'Consent Daten',
      'Alter',
      'Shopping Häufigkeit',
      'LLM Nutzung',
      'LLM Kaufrecherche',
      'KI Vertrautheit',
      'Req: Menge',
      'Req: Budget',
      'Req: Attribute',
      'Req: Mahlart',
      'Abweichung R1',
      'Abweichung R2',
      'Abweichung R3',
      'Abweichung R4',
      'Bewertungen (JSON)',
      'Guide Lesezeit (s)',
      'Produktwahl',
      'Q1 Beste Wahl',
      'Q2 Beste Wahl Likert',
      'Q3 Welches Produkt',
      'Q4 Gelesen',
      'Q5 Vorstrukturiert',
      'Q6 Zeitdruck',
      'Q7 Skip worse',
      'Q8 Budget Einfluss',
      'Q9 Feedback Kontrolle',
      'Q10 Status Kompetent',
      'Q11 Reduzierte Wahl',
      'Q12 Normativ',
      'Q13 Vergleichstabelle',
      'Q14 Mehr Filter',
      'Q15 Kaufabsicht',
      'Q16 Entscheidungssicherheit',
      'Q17 Vertrauen',
      'Q18 Autonomie',
      'Q19 Transparenz',
      'Q20 Zufriedenheit',
      'Q21 Einflüsse',
      'Notizen',
      'Events Anzahl'
    ];

    const escapeCell = (val: unknown): string => {
      if (val === null || val === undefined) return '';
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = mergedSessions.map(s => {
      const pre = s.preSurvey as PreSurvey | null;
      const post = s.postSurvey as PostSurvey | null;
      const req = s.requirements as RequirementAnswers | null;
      const dev = s.deviationFlags as DeviationFlags | null;
      
      return [
        s.participantId,
        s.createdAt ? new Date(s.createdAt).toLocaleString('de-DE') : '',
        s.completedAt ? new Date(s.completedAt).toLocaleString('de-DE') : '',
        s.consentAge ? 'Ja' : 'Nein',
        s.consentData ? 'Ja' : 'Nein',
        pre?.p1_age ?? '',
        pre?.p4_online_shopping ?? '',
        pre?.p7_llm_usage ?? '',
        pre?.p8_llm_purchase ?? '',
        pre?.p9_familiarity ?? '',
        req?.r1_amount?.join(', ') ?? '',
        req?.r2_budget?.join(', ') ?? '',
        req?.r3_attributes?.join(', ') ?? '',
        req?.r4_grind?.join(', ') ?? '',
        dev?.r1_deviated ? 'Ja' : 'Nein',
        dev?.r2_deviated ? 'Ja' : 'Nein',
        dev?.r3_deviated ? 'Ja' : 'Nein',
        dev?.r4_deviated ? 'Ja' : 'Nein',
        JSON.stringify(s.productRatings || []),
        s.guideReadSeconds ?? '',
        s.choiceProductId ?? '',
        post?.q1_best_choice ?? '',
        post?.q2_best_choice_likert ?? '',
        post?.q3_which_product ?? '',
        post?.q4_read_carefully ?? '',
        post?.q5_prestructured ?? '',
        post?.q6_time_pressure ?? '',
        post?.q7_skip_worse ?? '',
        post?.q8_budget_influence ?? '',
        post?.q9_feedback_control ?? '',
        post?.q10_status_competent ?? '',
        post?.q11_reduced_choice ?? '',
        post?.q12_normative ?? '',
        post?.q13_comparison_table ?? '',
        post?.q14_more_filters ?? '',
        post?.q15_purchase_intent ?? '',
        post?.q16_decision_certainty ?? '',
        post?.q17_trust ?? '',
        post?.q18_autonomy ?? '',
        post?.q19_transparency ?? '',
        post?.q20_satisfaction ?? '',
        post?.q21_influences?.join(', ') ?? '',
        s.participantNotes ?? '',
        s.events.length
      ].map(escapeCell).join(',');
    });

    const BOM = '\uFEFF';
    const csv = BOM + headers.join(',') + '\n' + rows.join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studie-export-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '–';
    return new Date(date).toLocaleString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (date: string | Date | null) => {
    if (!date) return '–';
    return new Date(date).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getProductName = (id: string | null) => {
    if (!id) return '–';
    const product = products.find(p => p.id === id);
    return product ? `${id} (${product.brand})` : id;
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Studien-Übersicht
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleRefresh} data-testid="admin-refresh">
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
            <Button variant="outline" onClick={handleExportJsonl} data-testid="admin-export-jsonl">
              <Download className="w-4 h-4 mr-2" />
              JSONL
            </Button>
            <Button variant="outline" onClick={handleExportCsvEnhanced} data-testid="admin-export-csv">
              <Download className="w-4 h-4 mr-2" />
              CSV (Excel)
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
                    <th className="px-3 py-3 text-left font-medium text-gray-700">ID</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Alter</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">LLM</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Guide</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Wahl</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Erstellt</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Events</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-700">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedSessions.map((session) => {
                    const pre = session.preSurvey as PreSurvey | null;
                    return (
                      <tr key={session.participantId} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-3 font-mono text-xs text-gray-600">
                          {session.participantId.slice(0, 8)}...
                        </td>
                        <td className="px-3 py-3 text-gray-700">
                          {pre?.p1_age ?? '–'}
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-600">
                            {pre?.p7_llm_usage ?? '–'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {session.guideReadSeconds != null ? (
                            <span className="text-gray-700">{session.guideReadSeconds}s</span>
                          ) : '–'}
                        </td>
                        <td className="px-3 py-3">
                          {session.choiceProductId ? (
                            <Badge variant="secondary" className="text-xs">
                              {session.choiceProductId}
                            </Badge>
                          ) : '–'}
                        </td>
                        <td className="px-3 py-3" data-testid={`status-${session.participantId.slice(0, 8)}`}>
                          {session.completedAt ? (
                            <Badge variant="default" className="text-xs">Komplett</Badge>
                          ) : session.postSurvey ? (
                            <Badge variant="secondary" className="text-xs">Post-Survey</Badge>
                          ) : session.choiceProductId ? (
                            <Badge variant="secondary" className="text-xs">Wahl</Badge>
                          ) : session.preSurvey ? (
                            <Badge variant="outline" className="text-xs">Pre-Survey</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Start</Badge>
                          )}
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">
                          {formatDate(session.createdAt)}
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">
                          {session.events.length}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedSession(session)}
                              data-testid={`view-details-${session.participantId.slice(0, 8)}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copySessionJson(session)}
                              data-testid={`copy-json-${session.participantId.slice(0, 8)}`}
                            >
                              {copiedId === session.participantId ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {mergedSessions.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        Noch keine Teilnehmer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {mergedSessions.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
                {mergedSessions.length} Teilnehmer insgesamt |{' '}
                {mergedSessions.filter(s => s.completedAt).length} abgeschlossen |{' '}
                {mergedSessions.reduce((sum, s) => sum + s.events.length, 0)} Events
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" data-testid="admin-detail-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>Teilnehmer: {selectedSession?.participantId.slice(0, 12)}...</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => selectedSession && copySessionJson(selectedSession)}
              >
                <Copy className="w-4 h-4 mr-2" />
                JSON kopieren
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Zeitstempel</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Erstellt:</span> {formatDate(selectedSession.createdAt)}</div>
                    <div><span className="text-gray-500">Abgeschlossen:</span> {formatDate(selectedSession.completedAt)}</div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Consent</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Volljährig:</span> {selectedSession.consentAge ? 'Ja' : 'Nein'}</div>
                    <div><span className="text-gray-500">Datenverarbeitung:</span> {selectedSession.consentData ? 'Ja' : 'Nein'}</div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Pre-Survey</h3>
                  {(() => {
                    const pre = selectedSession.preSurvey as PreSurvey | null;
                    if (!pre) return <p className="text-sm text-gray-500">Nicht ausgefüllt</p>;
                    return (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">P1 Alter:</span> {pre.p1_age}</div>
                        <div><span className="text-gray-500">P4 Shopping:</span> {pre.p4_online_shopping}</div>
                        <div><span className="text-gray-500">P7 LLM-Nutzung:</span> {pre.p7_llm_usage}</div>
                        <div><span className="text-gray-500">P8 LLM für Kauf:</span> {pre.p8_llm_purchase}</div>
                        <div><span className="text-gray-500">P9 Vertrautheit:</span> {pre.p9_familiarity}/7</div>
                      </div>
                    );
                  })()}
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                  {(() => {
                    const req = selectedSession.requirements as RequirementAnswers | null;
                    const dev = selectedSession.deviationFlags as DeviationFlags | null;
                    if (!req) return <p className="text-sm text-gray-500">Nicht ausgefüllt</p>;
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">R1 Menge:</span> 
                          <span>{req.r1_amount?.join(', ')}</span>
                          {dev?.r1_deviated && <Badge variant="outline" className="text-xs text-amber-600">Abweichung</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">R2 Budget:</span> 
                          <span>{req.r2_budget?.join(', ')}</span>
                          {dev?.r2_deviated && <Badge variant="outline" className="text-xs text-amber-600">Abweichung</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">R3 Attribute:</span> 
                          <span>{req.r3_attributes?.join(', ')}</span>
                          {dev?.r3_deviated && <Badge variant="outline" className="text-xs text-amber-600">Abweichung</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">R4 Mahlart:</span> 
                          <span>{req.r4_grind?.join(', ')}</span>
                          {dev?.r4_deviated && <Badge variant="outline" className="text-xs text-amber-600">Abweichung</Badge>}
                        </div>
                        {req.r1_other && <div><span className="text-gray-500">R1 Sonstiges:</span> {req.r1_other}</div>}
                        {req.r2_other && <div><span className="text-gray-500">R2 Sonstiges:</span> {req.r2_other}</div>}
                        {req.r3_other && <div><span className="text-gray-500">R3 Sonstiges:</span> {req.r3_other}</div>}
                        {req.r4_other && <div><span className="text-gray-500">R4 Sonstiges:</span> {req.r4_other}</div>}
                      </div>
                    );
                  })()}
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Produkt-Bewertungen</h3>
                  {(() => {
                    const ratings = selectedSession.productRatings as ProductRating[] | null;
                    if (!ratings || ratings.length === 0) return <p className="text-sm text-gray-500">Keine Bewertungen</p>;
                    return (
                      <div className="space-y-2">
                        {ratings.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary">{r.productId}</Badge>
                            <span className={r.action === 'more_like_this' ? 'text-green-600' : r.action === 'not_interested' ? 'text-red-600' : 'text-gray-500'}>
                              {r.action === 'more_like_this' ? 'Like' : r.action === 'not_interested' ? 'Dislike' : 'Skip'}
                            </span>
                            {r.reason && <span className="text-gray-500">({r.reason})</span>}
                            {r.reasonText && <span className="text-gray-400 italic">"{r.reasonText}"</span>}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Guide & Wahl</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Guide-Start:</span> {formatDate(selectedSession.guideViewStartTs)}</div>
                    <div><span className="text-gray-500">Guide-Weiter:</span> {formatDate(selectedSession.guideContinueTs)}</div>
                    <div><span className="text-gray-500">Lesezeit:</span> {selectedSession.guideReadSeconds ?? '–'} Sekunden</div>
                    <div><span className="text-gray-500">Gewählt:</span> {getProductName(selectedSession.choiceProductId)}</div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Post-Survey (Q1-Q21)</h3>
                  {(() => {
                    const post = selectedSession.postSurvey as PostSurvey | null;
                    if (!post) return <p className="text-sm text-gray-500">Nicht ausgefüllt</p>;
                    return (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div><span className="text-gray-500">Q1:</span> {post.q1_best_choice}</div>
                        <div><span className="text-gray-500">Q2:</span> {post.q2_best_choice_likert}</div>
                        <div><span className="text-gray-500">Q3:</span> {post.q3_which_product}</div>
                        <div><span className="text-gray-500">Q4:</span> {post.q4_read_carefully}</div>
                        <div><span className="text-gray-500">Q5:</span> {post.q5_prestructured}</div>
                        <div><span className="text-gray-500">Q6:</span> {post.q6_time_pressure}</div>
                        <div><span className="text-gray-500">Q7:</span> {post.q7_skip_worse}</div>
                        <div><span className="text-gray-500">Q8:</span> {post.q8_budget_influence}</div>
                        <div><span className="text-gray-500">Q9:</span> {post.q9_feedback_control}</div>
                        <div><span className="text-gray-500">Q10:</span> {post.q10_status_competent}</div>
                        <div><span className="text-gray-500">Q11:</span> {post.q11_reduced_choice}</div>
                        <div><span className="text-gray-500">Q12:</span> {post.q12_normative}</div>
                        <div><span className="text-gray-500">Q13:</span> {post.q13_comparison_table}</div>
                        <div><span className="text-gray-500">Q14:</span> {post.q14_more_filters}</div>
                        <div><span className="text-gray-500">Q15:</span> {post.q15_purchase_intent}</div>
                        <div><span className="text-gray-500">Q16:</span> {post.q16_decision_certainty}</div>
                        <div><span className="text-gray-500">Q17:</span> {post.q17_trust}</div>
                        <div><span className="text-gray-500">Q18:</span> {post.q18_autonomy}</div>
                        <div><span className="text-gray-500">Q19:</span> {post.q19_transparency}</div>
                        <div><span className="text-gray-500">Q20:</span> {post.q20_satisfaction}</div>
                        <div className="col-span-3"><span className="text-gray-500">Q21:</span> {post.q21_influences?.join(', ')}</div>
                        {post.q21_other_text && <div className="col-span-3"><span className="text-gray-500">Q21 Sonstiges:</span> {post.q21_other_text}</div>}
                      </div>
                    );
                  })()}
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Events ({selectedSession.events.length})</h3>
                  {selectedSession.events.length === 0 ? (
                    <p className="text-sm text-gray-500">Keine Events</p>
                  ) : (
                    <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
                      {selectedSession.events.map((event, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <span className="text-gray-400 font-mono text-xs w-20 flex-shrink-0">
                            {formatTime(event.timestamp)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {event.eventType}
                          </Badge>
                          {event.step && <span className="text-gray-500 text-xs">@ {event.step}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {selectedSession.participantNotes && (
                  <>
                    <Separator />
                    <section>
                      <h3 className="font-semibold text-gray-900 mb-2">Notizen</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedSession.participantNotes}
                      </p>
                    </section>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
