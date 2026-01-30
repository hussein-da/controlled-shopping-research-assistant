import { 
  type User, 
  type InsertUser, 
  type StudySession, 
  type StudyEvent 
} from "@shared/schema";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import type { IStorage } from "./storage-interface";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.jsonl");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function appendJsonl(filePath: string, data: unknown): void {
  ensureDataDir();
  const line = JSON.stringify(data) + "\n";
  fs.appendFileSync(filePath, line, "utf-8");
}

function readJsonl<T>(filePath: string): T[] {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter(line => line.trim());
  return lines.map(line => JSON.parse(line) as T);
}

function writeJsonl<T>(filePath: string, items: T[]): void {
  ensureDataDir();
  const content = items.map(item => JSON.stringify(item)).join("\n") + (items.length > 0 ? "\n" : "");
  fs.writeFileSync(filePath, content, "utf-8");
}

export class FileStorage implements IStorage {
  private users: Map<string, User>;
  private sessionsCache: Map<string, StudySession>;
  private eventsCache: StudyEvent[];

  constructor() {
    this.users = new Map();
    this.sessionsCache = new Map();
    this.eventsCache = [];
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    ensureDataDir();
    
    const sessions = readJsonl<StudySession>(SESSIONS_FILE);
    sessions.forEach(session => {
      const normalizedSession = {
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        guideViewStartTs: session.guideViewStartTs ? new Date(session.guideViewStartTs) : null,
        guideContinueTs: session.guideContinueTs ? new Date(session.guideContinueTs) : null,
        choiceTimestamp: session.choiceTimestamp ? new Date(session.choiceTimestamp) : null,
        completedAt: session.completedAt ? new Date(session.completedAt) : null,
      };
      this.sessionsCache.set(session.participantId, normalizedSession as StudySession);
    });

    const events = readJsonl<StudyEvent>(EVENTS_FILE);
    this.eventsCache = events.map(event => ({
      ...event,
      timestamp: new Date(event.timestamp)
    }));
  }

  private persistSessions(): void {
    const sessions = Array.from(this.sessionsCache.values());
    writeJsonl(SESSIONS_FILE, sessions);
  }

  private persistEvents(): void {
    writeJsonl(EVENTS_FILE, this.eventsCache);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSession(): Promise<StudySession> {
    const now = new Date();
    const session: StudySession = {
      participantId: randomUUID(),
      createdAt: now,
      updatedAt: now,
      consentAge: false,
      consentData: false,
      preSurvey: null,
      postSurvey: null,
      requirements: null,
      normalizedTarget: null,
      deviationFlags: null,
      productRatings: null,
      guideViewStartTs: null,
      guideContinueTs: null,
      guideReadSeconds: null,
      choiceProductId: null,
      choiceTimestamp: null,
      completedAt: null,
      participantNotes: null,
    };
    
    this.sessionsCache.set(session.participantId, session);
    this.persistSessions();
    return session;
  }

  async getSession(participantId: string): Promise<StudySession | undefined> {
    return this.sessionsCache.get(participantId);
  }

  async updateSession(participantId: string, data: Partial<StudySession>): Promise<StudySession | undefined> {
    const existing = this.sessionsCache.get(participantId);
    if (!existing) {
      return undefined;
    }
    
    const updated: StudySession = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    
    this.sessionsCache.set(participantId, updated);
    this.persistSessions();
    return updated;
  }

  async getAllSessions(): Promise<StudySession[]> {
    const sessions = Array.from(this.sessionsCache.values());
    return sessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async logEvent(participantId: string, eventType: string, step?: string, eventData?: unknown): Promise<StudyEvent> {
    const event: StudyEvent = {
      id: randomUUID(),
      participantId,
      eventType,
      step: step || null,
      eventData: (eventData as Record<string, unknown>) || null,
      timestamp: new Date()
    };
    
    this.eventsCache.push(event);
    appendJsonl(EVENTS_FILE, event);
    return event;
  }

  async getEvents(participantId: string): Promise<StudyEvent[]> {
    return this.eventsCache
      .filter(e => e.participantId === participantId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async getAllEvents(): Promise<StudyEvent[]> {
    return this.eventsCache.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}
