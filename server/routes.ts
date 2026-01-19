import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { StudyCondition, PreSurvey, PostSurvey, RequirementAnswers, ProductRating } from "@shared/schema";

const preSurveySchema = z.object({
  age: z.string(),
  studentStatus: z.string(),
  onlineShopping: z.string(),
  llmUsage: z.string(),
  llmForPurchase: z.string(),
});

const postSurveySchema = z.object({
  mc1Highlight: z.number().min(1).max(7),
  mc2ProductRecommended: z.string(),
  purchaseIntent: z.number().min(1).max(7),
  trust: z.number().min(1).max(7),
  autonomy: z.number().min(1).max(7),
  transparency: z.number().min(1).max(7),
});

const requirementsSchema = z.object({
  budget: z.string().optional(),
  roestgrad: z.string().optional(),
  merkmal: z.string().optional(),
  zubereitung: z.string().optional(),
});

const productRatingSchema = z.object({
  productId: z.string(),
  rating: z.enum(["interested", "not_interested"]),
  reason: z.string().optional(),
  timestamp: z.number(),
});

const eventSchema = z.object({
  eventType: z.string(),
  eventData: z.unknown().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/session", async (req, res) => {
    try {
      const condition: StudyCondition = Math.random() < 0.5 ? "baseline" : "nudge";
      const session = await storage.createSession(condition);
      await storage.logEvent(session.participantId, "session_created", { condition });
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.get("/api/session/:participantId", async (req, res) => {
    try {
      const { participantId } = req.params;
      const session = await storage.getSession(participantId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error getting session:", error);
      res.status(500).json({ error: "Failed to get session" });
    }
  });

  app.patch("/api/session/:participantId/consent", async (req, res) => {
    try {
      const { participantId } = req.params;
      const session = await storage.updateSession(participantId, { consentGiven: true });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "consent_given");
      res.json(session);
    } catch (error) {
      console.error("Error updating consent:", error);
      res.status(500).json({ error: "Failed to update consent" });
    }
  });

  app.patch("/api/session/:participantId/pre-survey", async (req, res) => {
    try {
      const { participantId } = req.params;
      const preSurvey = preSurveySchema.parse(req.body);
      const session = await storage.updateSession(participantId, { 
        preSurvey: preSurvey as unknown as Record<string, unknown>
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "pre_survey_completed", preSurvey);
      res.json(session);
    } catch (error) {
      console.error("Error updating pre-survey:", error);
      res.status(500).json({ error: "Failed to update pre-survey" });
    }
  });

  app.patch("/api/session/:participantId/requirements", async (req, res) => {
    try {
      const { participantId } = req.params;
      const requirements = requirementsSchema.parse(req.body);
      const session = await storage.updateSession(participantId, { 
        requirements: requirements as unknown as Record<string, unknown>
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "requirements_updated", requirements);
      res.json(session);
    } catch (error) {
      console.error("Error updating requirements:", error);
      res.status(500).json({ error: "Failed to update requirements" });
    }
  });

  app.post("/api/session/:participantId/rating", async (req, res) => {
    try {
      const { participantId } = req.params;
      const rating = productRatingSchema.parse(req.body);
      
      const existingSession = await storage.getSession(participantId);
      if (!existingSession) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const existingRatings = (existingSession.productRatings as ProductRating[] | null) || [];
      const updatedRatings = [...existingRatings, rating];
      
      const session = await storage.updateSession(participantId, { 
        productRatings: updatedRatings as unknown as Record<string, unknown>
      });
      
      await storage.logEvent(participantId, "product_rated", rating);
      res.json(session);
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ error: "Failed to add rating" });
    }
  });

  app.patch("/api/session/:participantId/post-survey", async (req, res) => {
    try {
      const { participantId } = req.params;
      const postSurvey = postSurveySchema.parse(req.body);
      const session = await storage.updateSession(participantId, { 
        postSurvey: postSurvey as unknown as Record<string, unknown>,
        completedAt: new Date()
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "post_survey_completed", postSurvey);
      res.json(session);
    } catch (error) {
      console.error("Error updating post-survey:", error);
      res.status(500).json({ error: "Failed to update post-survey" });
    }
  });

  app.patch("/api/session/:participantId/choice", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { productId } = req.body;
      const session = await storage.updateSession(participantId, { finalChoice: productId });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "final_choice_made", { productId });
      res.json(session);
    } catch (error) {
      console.error("Error updating choice:", error);
      res.status(500).json({ error: "Failed to update choice" });
    }
  });

  app.post("/api/session/:participantId/event", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { eventType, eventData } = eventSchema.parse(req.body);
      const event = await storage.logEvent(participantId, eventType, eventData);
      res.json(event);
    } catch (error) {
      console.error("Error logging event:", error);
      res.status(500).json({ error: "Failed to log event" });
    }
  });

  const adminPassword = process.env.ADMIN_PASSWORD || "study-admin-2024";

  app.get("/api/admin/sessions", async (req, res) => {
    const { password } = req.query;
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error getting sessions:", error);
      res.status(500).json({ error: "Failed to get sessions" });
    }
  });

  app.get("/api/admin/events", async (req, res) => {
    const { password } = req.query;
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({ error: "Failed to get events" });
    }
  });

  app.get("/api/admin/export/jsonl", async (req, res) => {
    const { password } = req.query;
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const sessions = await storage.getAllSessions();
      const jsonl = sessions.map(s => JSON.stringify(s)).join("\n");
      res.setHeader("Content-Type", "application/jsonl");
      res.setHeader("Content-Disposition", "attachment; filename=study_sessions.jsonl");
      res.send(jsonl);
    } catch (error) {
      console.error("Error exporting JSONL:", error);
      res.status(500).json({ error: "Failed to export" });
    }
  });

  app.get("/api/admin/export/csv", async (req, res) => {
    const { password } = req.query;
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const sessions = await storage.getAllSessions();
      
      const headers = [
        "participant_id", "condition", "created_at", "completed_at",
        "consent_given", "final_choice",
        "pre_age", "pre_student", "pre_shopping", "pre_llm", "pre_llm_purchase",
        "post_mc1", "post_mc2", "post_purchase_intent", "post_trust", "post_autonomy", "post_transparency",
        "req_budget", "req_roestgrad", "req_merkmal", "req_zubereitung"
      ];
      
      const rows = sessions.map(s => {
        const pre = s.preSurvey as Record<string, unknown> | null;
        const post = s.postSurvey as Record<string, unknown> | null;
        const req = s.requirements as Record<string, unknown> | null;
        
        return [
          s.participantId,
          s.condition,
          s.createdAt?.toISOString() || "",
          s.completedAt?.toISOString() || "",
          s.consentGiven ? "true" : "false",
          s.finalChoice || "",
          pre?.age || "",
          pre?.studentStatus || "",
          pre?.onlineShopping || "",
          pre?.llmUsage || "",
          pre?.llmForPurchase || "",
          post?.mc1Highlight || "",
          post?.mc2ProductRecommended || "",
          post?.purchaseIntent || "",
          post?.trust || "",
          post?.autonomy || "",
          post?.transparency || "",
          req?.budget || "",
          req?.roestgrad || "",
          req?.merkmal || "",
          req?.zubereitung || ""
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
      });
      
      const csv = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=study_sessions.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ error: "Failed to export" });
    }
  });

  return httpServer;
}
