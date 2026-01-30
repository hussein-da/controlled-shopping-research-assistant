import * as fs from "fs";
import * as path from "path";

async function exportDbToLogs() {
  console.log("=== DB to Logs Export ===\n");

  if (!process.env.DATABASE_URL) {
    console.log("INFO: DATABASE_URL not set.");
    console.log("No database connection available - nothing to export.");
    console.log("This is expected if running locally without PostgreSQL.\n");
    process.exit(0);
  }

  console.log("DATABASE_URL detected. Connecting to database...\n");

  try {
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = (await import("postgres")).default;
    const { studySessions, studyEvents } = await import("../shared/schema");
    const { desc } = await import("drizzle-orm");

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client);

    const DATA_DIR = path.join(process.cwd(), "data");
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    console.log("Fetching sessions...");
    const sessions = await db.select().from(studySessions).orderBy(desc(studySessions.createdAt));
    console.log(`Found ${sessions.length} sessions.\n`);

    console.log("Fetching events...");
    const events = await db.select().from(studyEvents).orderBy(studyEvents.timestamp);
    console.log(`Found ${events.length} events.\n`);

    const sessionsFile = path.join(DATA_DIR, "sessions.jsonl");
    const sessionsContent = sessions.map(s => JSON.stringify(s)).join("\n") + (sessions.length > 0 ? "\n" : "");
    fs.writeFileSync(sessionsFile, sessionsContent, "utf-8");
    console.log(`Sessions exported to: ${sessionsFile}`);

    const eventsFile = path.join(DATA_DIR, "events.jsonl");
    const eventsContent = events.map(e => JSON.stringify(e)).join("\n") + (events.length > 0 ? "\n" : "");
    fs.writeFileSync(eventsFile, eventsContent, "utf-8");
    console.log(`Events exported to: ${eventsFile}`);

    console.log("\n=== Export complete ===");
    console.log(`Data directory: ${DATA_DIR}`);
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error("Export failed:", error);
    process.exit(1);
  }
}

exportDbToLogs();
