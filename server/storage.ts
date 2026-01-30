import { 
  type User, 
  type InsertUser, 
  type StudySession, 
  type StudyEvent,
  studySessions,
  studyEvents
} from "@shared/schema";
import { randomUUID } from "crypto";
import { FileStorage } from "./file-storage";
import type { IStorage } from "./storage-interface";

export type { IStorage } from "./storage-interface";

export class DatabaseStorage implements IStorage {
  private users: Map<string, User>;
  private db: any;
  private eq: any;
  private desc: any;
  private initialized: boolean = false;

  constructor() {
    this.users = new Map();
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const { db } = await import("./db");
    const { eq, desc } = await import("drizzle-orm");
    this.db = db;
    this.eq = eq;
    this.desc = desc;
    this.initialized = true;
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
    await this.ensureInitialized();
    const [session] = await this.db.insert(studySessions)
      .values({})
      .returning();
    return session;
  }

  async getSession(participantId: string): Promise<StudySession | undefined> {
    await this.ensureInitialized();
    const [session] = await this.db.select()
      .from(studySessions)
      .where(this.eq(studySessions.participantId, participantId));
    return session;
  }

  async updateSession(participantId: string, data: Partial<StudySession>): Promise<StudySession | undefined> {
    await this.ensureInitialized();
    const [session] = await this.db.update(studySessions)
      .set({ ...data, updatedAt: new Date() })
      .where(this.eq(studySessions.participantId, participantId))
      .returning();
    return session;
  }

  async getAllSessions(): Promise<StudySession[]> {
    await this.ensureInitialized();
    return this.db.select().from(studySessions).orderBy(this.desc(studySessions.createdAt));
  }

  async logEvent(participantId: string, eventType: string, step?: string, eventData?: unknown): Promise<StudyEvent> {
    await this.ensureInitialized();
    const [event] = await this.db.insert(studyEvents)
      .values({ 
        participantId, 
        eventType, 
        step,
        eventData: eventData as Record<string, unknown> 
      })
      .returning();
    return event;
  }

  async getEvents(participantId: string): Promise<StudyEvent[]> {
    await this.ensureInitialized();
    return this.db.select()
      .from(studyEvents)
      .where(this.eq(studyEvents.participantId, participantId))
      .orderBy(studyEvents.timestamp);
  }

  async getAllEvents(): Promise<StudyEvent[]> {
    await this.ensureInitialized();
    return this.db.select().from(studyEvents).orderBy(studyEvents.timestamp);
  }
}

function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    console.log("[Storage] Using PostgreSQL database storage");
    return new DatabaseStorage();
  } else {
    console.log("[Storage] Using file-based storage (./data/)");
    return new FileStorage();
  }
}

export const storage = createStorage();
