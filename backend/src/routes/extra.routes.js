import { Router } from "express";
import {
  createFeedback,
  createRating,
  createTemplate,
  deleteTemplate,
  getAdminDashboard,
  getSimulationQuestionTemplates,
  getTemplates,
  updateTemplate,
} from "../controllers/extra.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.post("/ratings", requireAuth, createRating);
router.post("/feedback", requireAuth, createFeedback);
router.get("/templates", getTemplates);
router.get("/simulation-question-templates", getSimulationQuestionTemplates);

router.get("/admin/dashboard", requireAuth, requireAdmin, getAdminDashboard);
router.post("/admin/templates", requireAuth, requireAdmin, createTemplate);
router.patch("/admin/templates/:id", requireAuth, requireAdmin, updateTemplate);
router.delete("/admin/templates/:id", requireAuth, requireAdmin, deleteTemplate);

export { router as extraRouter };
