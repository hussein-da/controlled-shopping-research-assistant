import { 
  type User, 
  type InsertUser, 
  type StudySession, 
  type StudyEvent 
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSession(): Promise<StudySession>;
  getSession(participantId: string): Promise<StudySession | undefined>;
  updateSession(participantId: string, data: Partial<StudySession>): Promise<StudySession | undefined>;
  getAllSessions(): Promise<StudySession[]>;
  
  logEvent(participantId: string, eventType: string, step?: string, eventData?: unknown): Promise<StudyEvent>;
  getEvents(participantId: string): Promise<StudyEvent[]>;
  getAllEvents(): Promise<StudyEvent[]>;
}
