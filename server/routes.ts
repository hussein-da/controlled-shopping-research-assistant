import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { StudyCondition, ProductRating, NORMALIZED_TARGET } from "@shared/schema";

const preSurveySchema = z.object({
  p1_age: z.string(),
  p2_student_status: z.string(),
  p3_study_program: z.string().optional(),
  p4_online_shopping: z.string(),
  p5_coffee_frequency: z.string(),
  p6_coffee_knowledge: z.number().min(1).max(7),
  p7_llm_usage: z.string(),
  p8_llm_purchase: z.string(),
  p9_ranking_affinity: z.number().min(1).max(7),
});

const postSurveySchema = z.object({
  mc1_best_choice: z.string(),
  mc2_stronger_recommended: z.number().min(1).max(7),
  mc3_which_product: z.string(),
  mc4_read_carefully: z.string(),
  n1_prestructured: z.number().min(1).max(7),
  n2_time_pressure: z.number().min(1).max(7),
  n3_skip_worse: z.number().min(1).max(7),
  n4_budget_influence: z.number().min(1).max(7),
  n5_feedback_control: z.number().min(1).max(7),
  n6_status_competent: z.number().min(1).max(7),
  n7_reduced_choice: z.number().min(1).max(7),
  n8_normative: z.number().min(1).max(7),
  n9_comparison_table: z.number().min(1).max(7),
  n10_more_filters: z.number().min(1).max(7),
  o1_purchase_intent: z.number().min(1).max(7),
  o2_decision_certainty: z.number().min(1).max(7),
  o3_trust: z.number().min(1).max(7),
  o4_autonomy: z.number().min(1).max(7),
  o5_transparency: z.number().min(1).max(7),
  o6_satisfaction: z.number().min(1).max(7),
  o7_reason_text: z.string().max(300).optional(),
  o8_influences: z.array(z.string()),
  o8_other_text: z.string().optional(),
});

const requirementsSchema = z.object({
  requirements: z.object({
    r1_budget: z.array(z.string()),
    r2_roast: z.array(z.string()),
    r3_grind: z.array(z.string()),
    r4_attributes: z.array(z.string()),
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
      const condition: StudyCondition = Math.random() < 0.5 ? "A_OPENAI_GUIDE" : "B_NEUTRAL_GUIDE";
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
      const { consentAge, consentData } = consentSchema.parse(req.body);
      const session = await storage.updateSession(participantId, { 
        consentAge, 
        consentData 
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "consent_given", { consentAge, consentData });
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
      const { requirements, deviationFlags } = requirementsSchema.parse(req.body);
      
      const normalizedTarget = {
        budget: "bis 12 €",
        roast: "hell",
        grind: "ganze Bohnen",
        attributes: "Bio/Fairtrade",
        usage: "Vollautomat"
      };
      
      const session = await storage.updateSession(participantId, { 
        requirements: requirements as unknown as Record<string, unknown>,
        normalizedTarget: normalizedTarget as unknown as Record<string, unknown>,
        deviationFlags: deviationFlags as unknown as Record<string, unknown>
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "requirements_updated", { requirements, deviationFlags });
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
      
      await storage.logEvent(participantId, "rating_action", rating);
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
      
      await storage.logEvent(participantId, "guide_continue", { guideReadSeconds });
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
      await storage.logEvent(participantId, "choice_made", { productId });
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
      await storage.logEvent(participantId, "post_submit", postSurvey);
      res.json(session);
    } catch (error) {
      console.error("Error updating post-survey:", error);
      res.status(500).json({ error: "Failed to update post-survey" });
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

  app.patch("/api/session/:participantId/complete", async (req, res) => {
    try {
      const { participantId } = req.params;
      const session = await storage.updateSession(participantId, { 
        completedAt: new Date()
      });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      await storage.logEvent(participantId, "study_completed");
      res.json(session);
    } catch (error) {
      console.error("Error marking complete:", error);
      res.status(500).json({ error: "Failed to mark complete" });
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
        "participant_id", "condition", "created_at", "completed_at",
        "consent_age", "consent_data", "guide_read_seconds", "choice_product_id",
        "p1_age", "p2_student_status", "p3_study_program", "p4_online_shopping",
        "p5_coffee_frequency", "p6_coffee_knowledge", "p7_llm_usage", "p8_llm_purchase", "p9_ranking_affinity",
        "mc1_best_choice", "mc2_stronger_recommended", "mc3_which_product", "mc4_read_carefully",
        "n1_prestructured", "n2_time_pressure", "n3_skip_worse", "n4_budget_influence",
        "n5_feedback_control", "n6_status_competent", "n7_reduced_choice", "n8_normative",
        "n9_comparison_table", "n10_more_filters",
        "o1_purchase_intent", "o2_decision_certainty", "o3_trust", "o4_autonomy",
        "o5_transparency", "o6_satisfaction", "o7_reason_text"
      ];
      
      const rows = sessions.map(s => {
        const pre = s.preSurvey as Record<string, unknown> | null;
        const post = s.postSurvey as Record<string, unknown> | null;
        
        return [
          s.participantId,
          s.condition,
          s.createdAt?.toISOString() || "",
          s.completedAt?.toISOString() || "",
          s.consentAge ? "true" : "false",
          s.consentData ? "true" : "false",
          s.guideReadSeconds || "",
          s.choiceProductId || "",
          pre?.p1_age || "",
          pre?.p2_student_status || "",
          pre?.p3_study_program || "",
          pre?.p4_online_shopping || "",
          pre?.p5_coffee_frequency || "",
          pre?.p6_coffee_knowledge || "",
          pre?.p7_llm_usage || "",
          pre?.p8_llm_purchase || "",
          pre?.p9_ranking_affinity || "",
          post?.mc1_best_choice || "",
          post?.mc2_stronger_recommended || "",
          post?.mc3_which_product || "",
          post?.mc4_read_carefully || "",
          post?.n1_prestructured || "",
          post?.n2_time_pressure || "",
          post?.n3_skip_worse || "",
          post?.n4_budget_influence || "",
          post?.n5_feedback_control || "",
          post?.n6_status_competent || "",
          post?.n7_reduced_choice || "",
          post?.n8_normative || "",
          post?.n9_comparison_table || "",
          post?.n10_more_filters || "",
          post?.o1_purchase_intent || "",
          post?.o2_decision_certainty || "",
          post?.o3_trust || "",
          post?.o4_autonomy || "",
          post?.o5_transparency || "",
          post?.o6_satisfaction || "",
          post?.o7_reason_text || ""
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

  return httpServer;
}
