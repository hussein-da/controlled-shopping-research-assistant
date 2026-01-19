import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StudySession, StudyCondition, PreSurvey, PostSurvey, RequirementAnswers } from '@shared/schema';
import { apiRequest } from './queryClient';

interface StudyContextType {
  session: StudySession | null;
  isLoading: boolean;
  error: string | null;
  initSession: () => Promise<void>;
  loadSession: (participantId: string) => Promise<void>;
  giveConsent: () => Promise<void>;
  submitPreSurvey: (data: PreSurvey) => Promise<void>;
  updateRequirements: (data: RequirementAnswers) => Promise<void>;
  submitRating: (productId: string, rating: 'interested' | 'not_interested', reason?: string) => Promise<void>;
  submitPostSurvey: (data: PostSurvey) => Promise<void>;
  setFinalChoice: (productId: string) => Promise<void>;
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

  const giveConsent = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/consent`, { method: 'PATCH' });
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

  const updateRequirements = useCallback(async (data: RequirementAnswers) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/requirements`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update requirements');
      const result = await res.json();
      setSession(result);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  const submitRating = useCallback(async (productId: string, rating: 'interested' | 'not_interested', reason?: string) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/session/${session.participantId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, reason, timestamp: Date.now() }),
      });
      if (!res.ok) throw new Error('Failed to submit rating');
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
      submitPostSurvey,
      setFinalChoice,
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
