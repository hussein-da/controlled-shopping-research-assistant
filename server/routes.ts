import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { ProductRating, NORMALIZED_TARGET } from "@shared/schema";

const preSurveySchema = z.object({
  p1_age: z.number().min(18).max(99),
  p4_online_shopping: z.string(),
  p7_llm_usage: z.string(),
  p8_llm_purchase: z.string(),
  p9_familiarity: z.number().min(1).max(7),
});

const postSurveySchema = z.object({
  q1_best_choice: z.string(),
  q2_best_choice_likert: z.number().min(1).max(7),
  q3_which_product: z.string(),
  q4_read_carefully: z.string(),
  q5_prestructured: z.number().min(1).max(7),
  q6_time_pressure: z.number().min(1).max(7),
  q7_skip_worse: z.number().min(1).max(7),
  q8_budget_influence: z.number().min(1).max(7),
  q9_feedback_control: z.number().min(1).max(7),
  q10_status_competent: z.number().min(1).max(7),
  q11_reduced_choice: z.number().min(1).max(7),
  q12_normative: z.number().min(1).max(7),
  q13_comparison_table: z.number().min(1).max(7),
  q14_more_filters: z.number().min(1).max(7),
  q15_purchase_intent: z.number().min(1).max(7),
  q16_decision_certainty: z.number().min(1).max(7),
  q17_trust: z.number().min(1).max(7),
  q18_autonomy: z.number().min(1).max(7),
  q19_transparency: z.number().min(1).max(7),
  q20_satisfaction: z.number().min(1).max(7),
  q21_influences: z.array(z.string()),
  q21_other_text: z.string().optional(),
});

const requirementsSchema = z.object({
  requirements: z.object({
    r1_amount: z.array(z.string()),
    r2_budget: z.array(z.string()),
    r3_attributes: z.array(z.string()),
    r4_grind: z.array(z.string()),
    r1_other: z.string().optional(),
    r2_other: z.string().optional(),
    r3_other: z.string().optional(),
    r4_other: z.string().optional(),
  }),
  deviationFlags: z.object({
    r1_deviated: z.boolean(),
    r2_deviated: z.boolean(),
    r3_deviated: z.boolean(),
    r4_deviated: z.boolean(),
  }),
});

const productRatingSchema = z.object({
  productId: z.string(),
  action: z.enum(["more_like_this", "not_interested", "skip"]),
  reason: z.string().optional(),
  reasonText: z.string().optional(),
  timestamp: z.number(),
});

const eventSchema = z.object({
  eventType: z.string(),
  step: z.string().optional(),
  eventData: z.unknown().optional(),
});

const consentSchema = z.object({
  consentAge: z.boolean(),
  consentData: z.boolean(),
});

const guideTimeSchema = z.object({
  guideViewStartTs: z.string(),
  guideContinueTs: z.string(),
  guideReadSeconds: z.number(),
});

const choiceSchema = z.object({
  productId: z.string(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/session", async (req, res) => {
    try {
      const session = await storage.createSession();
      await storage.logEvent(session.participantId, "session_created", "start", {});
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
      const { consentAge, consentData } = consentSchema.parse(req.body);
      const session = await storage.updateSession(participantId, { 
        consentAge, 
        consentData 
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "consent_given", "consent", { consentAge, consentData });
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
      await storage.logEvent(participantId, "pre_survey_completed", "pre", preSurvey);
      res.json(session);
    } catch (error) {
      console.error("Error updating pre-survey:", error);
      res.status(500).json({ error: "Failed to update pre-survey" });
    }
  });

  app.patch("/api/session/:participantId/requirements", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { requirements, deviationFlags } = requirementsSchema.parse(req.body);
      
      const normalizedTarget = {
        amount: "250g",
        budget: "bis 12 €",
        attributes: "Bio/Fairtrade",
        grind: "ganze Bohnen"
      };
      
      const session = await storage.updateSession(participantId, { 
        requirements: requirements as unknown as Record<string, unknown>,
        normalizedTarget: normalizedTarget as unknown as Record<string, unknown>,
        deviationFlags: deviationFlags as unknown as Record<string, unknown>
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "requirements_updated", "assistant", { requirements, deviationFlags, normalizedTarget });
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
      
      await storage.logEvent(participantId, "product_rating", "assistant", rating);
      res.json(session);
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ error: "Failed to add rating" });
    }
  });

  app.patch("/api/session/:participantId/guide-time", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { guideViewStartTs, guideContinueTs, guideReadSeconds } = guideTimeSchema.parse(req.body);
      
      const session = await storage.updateSession(participantId, { 
        guideViewStartTs: new Date(guideViewStartTs),
        guideContinueTs: new Date(guideContinueTs),
        guideReadSeconds
      });
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      await storage.logEvent(participantId, "guide_continue", "guide", { guideReadSeconds });
      res.json(session);
    } catch (error) {
      console.error("Error updating guide time:", error);
      res.status(500).json({ error: "Failed to update guide time" });
    }
  });

  app.patch("/api/session/:participantId/choice", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { productId } = choiceSchema.parse(req.body);
      const session = await storage.updateSession(participantId, { 
        choiceProductId: productId,
        choiceTimestamp: new Date()
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "choice_made", "choice", { productId });
      res.json(session);
    } catch (error) {
      console.error("Error updating choice:", error);
      res.status(500).json({ error: "Failed to update choice" });
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
      await storage.logEvent(participantId, "post_survey_completed", "post", postSurvey);
      res.json(session);
    } catch (error) {
      console.error("Error updating post-survey:", error);
      res.status(500).json({ error: "Failed to update post-survey" });
    }
  });

  app.post("/api/session/:participantId/event", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { eventType, step, eventData } = eventSchema.parse(req.body);
      const event = await storage.logEvent(participantId, eventType, step, eventData);
      res.json(event);
    } catch (error) {
      console.error("Error logging event:", error);
      res.status(500).json({ error: "Failed to log event" });
    }
  });

  app.patch("/api/session/:participantId/complete", async (req, res) => {
    try {
      const { participantId } = req.params;
      const session = await storage.updateSession(participantId, { 
        completedAt: new Date()
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "study_completed", "debrief", {});
      res.json(session);
    } catch (error) {
      console.error("Error marking complete:", error);
      res.status(500).json({ error: "Failed to mark complete" });
    }
  });

  app.patch("/api/session/:participantId/notes", async (req, res) => {
    try {
      const { participantId } = req.params;
      const { notes } = z.object({ notes: z.string().max(2000) }).parse(req.body);
      const session = await storage.updateSession(participantId, { 
        participantNotes: notes
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "notes_saved", "debrief", { notes });
      res.json(session);
    } catch (error) {
      console.error("Error saving notes:", error);
      res.status(500).json({ error: "Failed to save notes" });
    }
  });

  const adminPassword = process.env.ADMIN_PASSWORD || "study-admin-2026";

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
      const events = await storage.getAllEvents();
      
      const sessionEvents: Record<string, unknown[]> = {};
      events.forEach(e => {
        if (!sessionEvents[e.participantId]) {
          sessionEvents[e.participantId] = [];
        }
        sessionEvents[e.participantId].push(e);
      });
      
      const jsonl = sessions.map(s => JSON.stringify({
        ...s,
        events: sessionEvents[s.participantId] || []
      })).join("\n");
      
      res.setHeader("Content-Type", "application/jsonl");
      res.setHeader("Content-Disposition", "attachment; filename=study_data.jsonl");
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
        "participant_id", "created_at", "completed_at",
        "consent_age", "consent_data", "guide_read_seconds", "choice_product_id",
        "p1_age", "p4_online_shopping", "p7_llm_usage", "p8_llm_purchase", "p9_familiarity",
        "q1_best_choice", "q2_best_choice_likert", "q3_which_product", "q4_read_carefully",
        "q5_prestructured", "q6_time_pressure", "q7_skip_worse", "q8_budget_influence",
        "q9_feedback_control", "q10_status_competent", "q11_reduced_choice", "q12_normative",
        "q13_comparison_table", "q14_more_filters",
        "q15_purchase_intent", "q16_decision_certainty", "q17_trust", "q18_autonomy",
        "q19_transparency", "q20_satisfaction", "q21_influences", "participant_notes"
      ];
      
      const rows = sessions.map(s => {
        const pre = s.preSurvey as Record<string, unknown> | null;
        const post = s.postSurvey as Record<string, unknown> | null;
        
        return [
          s.participantId,
          s.createdAt?.toISOString() || "",
          s.completedAt?.toISOString() || "",
          s.consentAge ? "true" : "false",
          s.consentData ? "true" : "false",
          s.guideReadSeconds || "",
          s.choiceProductId || "",
          pre?.p1_age || "",
          pre?.p4_online_shopping || "",
          pre?.p7_llm_usage || "",
          pre?.p8_llm_purchase || "",
          pre?.p9_familiarity || "",
          post?.q1_best_choice || "",
          post?.q2_best_choice_likert || "",
          post?.q3_which_product || "",
          post?.q4_read_carefully || "",
          post?.q5_prestructured || "",
          post?.q6_time_pressure || "",
          post?.q7_skip_worse || "",
          post?.q8_budget_influence || "",
          post?.q9_feedback_control || "",
          post?.q10_status_competent || "",
          post?.q11_reduced_choice || "",
          post?.q12_normative || "",
          post?.q13_comparison_table || "",
          post?.q14_more_filters || "",
          post?.q15_purchase_intent || "",
          post?.q16_decision_certainty || "",
          post?.q17_trust || "",
          post?.q18_autonomy || "",
          post?.q19_transparency || "",
          post?.q20_satisfaction || "",
          JSON.stringify(post?.q21_influences || []),
          s.participantNotes || ""
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
      });
      
      const csv = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=study_data.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ error: "Failed to export" });
    }
  });

  app.get("/api/admin/health", async (req, res) => {
    const { password } = req.query;
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const sessions = await storage.getAllSessions();
      const events = await storage.getAllEvents();
      const completedSessions = sessions.filter(s => s.completedAt);
      
      res.json({
        status: "ok",
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        totalEvents: events.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error getting health:", error);
      res.status(500).json({ error: "Failed to get health" });
    }
  });

  return httpServer;
}
