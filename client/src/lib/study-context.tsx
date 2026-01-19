import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StudySession, PreSurvey, PostSurvey, RequirementAnswers, DeviationFlags, ProductRating } from '@shared/schema';

interface StudyContextType {
  session: StudySession | null;
  isLoading: boolean;
  error: string | null;
  initSession: () => Promise<void>;
  loadSession: (participantId: string) => Promise<void>;
  giveConsent: (consentAge: boolean, consentData: boolean) => Promise<void>;
  submitPreSurvey: (data: PreSurvey) => Promise<void>;
  updateRequirements: (data: RequirementAnswers, deviations: DeviationFlags) => Promise<void>;
  submitRating: (rating: ProductRating) => Promise<void>;
  updateGuideTimestamps: (startTs: number, continueTs: number, readSeconds: number) => Promise<void>;
  setFinalChoice: (productId: string) => Promise<void>;
  submitPostSurvey: (data: PostSurvey) => Promise<void>;
  markComplete: () => Promise<void>;
  logEvent: (eventType: string, eventData?: unknown) => Promise<void>;
}

const StudyContext = createContext<StudyContextType | null>(null);

const PARTICIPANT_ID_KEY = 'study_participant_id';

export function StudyProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedId = sessionStorage.getItem(PARTICIPANT_ID_KEY);
    if (savedId) {
      loadSession(savedId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadSession = useCallback(async (participantId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/session/${participantId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        sessionStorage.setItem(PARTICIPANT_ID_KEY, participantId);
      } else {
        sessionStorage.removeItem(PARTICIPANT_ID_KEY);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/session', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      setSession(data);
      sessionStorage.setItem(PARTICIPANT_ID_KEY, data.participantId);
    } catch (err) {
      setError('Fehler beim Starten der Studie');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const giveConsent = useCallback(async (consentAge: boolean, consentData: boolean) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/consent`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentAge, consentData }),
      });
      if (!res.ok) throw new Error('Failed to give consent');
      const data = await res.json();
      setSession(data);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const submitPreSurvey = useCallback(async (data: PreSurvey) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/pre-survey`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit pre-survey');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const updateRequirements = useCallback(async (data: RequirementAnswers, deviations: DeviationFlags) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/requirements`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirements: data, deviationFlags: deviations }),
      });
      if (!res.ok) throw new Error('Failed to update requirements');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const submitRating = useCallback(async (rating: ProductRating) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rating),
      });
      if (!res.ok) throw new Error('Failed to submit rating');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const updateGuideTimestamps = useCallback(async (startTs: number, continueTs: number, readSeconds: number) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/guide-time`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guideViewStartTs: new Date(startTs).toISOString(),
          guideContinueTs: new Date(continueTs).toISOString(),
          guideReadSeconds: readSeconds
        }),
      });
      if (!res.ok) throw new Error('Failed to update guide timestamps');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const setFinalChoice = useCallback(async (productId: string) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/choice`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error('Failed to set choice');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const submitPostSurvey = useCallback(async (data: PostSurvey) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/post-survey`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit post-survey');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const logEvent = useCallback(async (eventType: string, eventData?: unknown) => {
    if (!session) return;
    try {
      await fetch(`/api/session/${session.participantId}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventData }),
      });
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const markComplete = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to mark complete');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  return (
    <StudyContext.Provider value={{
      session,
      isLoading,
      error,
      initSession,
      loadSession,
      giveConsent,
      submitPreSurvey,
      updateRequirements,
      submitRating,
      updateGuideTimestamps,
      setFinalChoice,
      submitPostSurvey,
      markComplete,
      logEvent,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within StudyProvider');
  }
  return context;
}
