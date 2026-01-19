import { 
  type User, 
  type InsertUser, 
  type StudySession, 
  type StudyEvent,
  type PreSurvey,
  type PostSurvey,
  type RequirementAnswers,
  type ProductRating,
  type StudyCondition,
  studySessions,
  studyEvents
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSession(condition: StudyCondition): Promise<StudySession>;
  getSession(participantId: string): Promise<StudySession | undefined>;
  updateSession(participantId: string, data: Partial<StudySession>): Promise<StudySession | undefined>;
  getAllSessions(): Promise<StudySession[]>;
  
  logEvent(participantId: string, eventType: string, eventData?: unknown): Promise<StudyEvent>;
  getEvents(participantId: string): Promise<StudyEvent[]>;
  getAllEvents(): Promise<StudyEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
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

  async createSession(condition: StudyCondition): Promise<StudySession> {
    const [session] = await db.insert(studySessions)
      .values({ condition })
      .returning();
    return session;
  }

  async getSession(participantId: string): Promise<StudySession | undefined> {
    const [session] = await db.select()
      .from(studySessions)
      .where(eq(studySessions.participantId, participantId));
    return session;
  }

  async updateSession(participantId: string, data: Partial<StudySession>): Promise<StudySession | undefined> {
    const [session] = await db.update(studySessions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(studySessions.participantId, participantId))
      .returning();
    return session;
  }

  async getAllSessions(): Promise<StudySession[]> {
    return db.select().from(studySessions).orderBy(desc(studySessions.createdAt));
  }

  async logEvent(participantId: string, eventType: string, eventData?: unknown): Promise<StudyEvent> {
    const [event] = await db.insert(studyEvents)
      .values({ 
        participantId, 
        eventType, 
        eventData: eventData as Record<string, unknown> 
      })
      .returning();
    return event;
  }

  async getEvents(participantId: string): Promise<StudyEvent[]> {
    return db.select()
      .from(studyEvents)
      .where(eq(studyEvents.participantId, participantId))
      .orderBy(studyEvents.timestamp);
  }

  async getAllEvents(): Promise<StudyEvent[]> {
    return db.select().from(studyEvents).orderBy(studyEvents.timestamp);
  }
}

export const storage = new MemStorage();
