import { Router } from "express";
import {
  createMainChatQuestionTemplateHandler,
  createQuestionTemplateHandler,
  createSimulationQuestionTemplateHandler,
  deleteMainChatQuestionTemplateHandler,
  deleteQuestionTemplateHandler,
  deleteSimulationQuestionTemplateHandler,
  getStatisticsHandler,
  listFeedbackHandler,
  listMainChatQuestionTemplatesHandler,
  listQuestionTemplatesHandler,
  listSimulationQuestionTemplatesHandler,
  patchMainChatQuestionTemplateHandler,
  patchQuestionTemplateHandler,
  patchSimulationQuestionTemplateHandler,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/statistics", getStatisticsHandler);
router.get("/feedback", listFeedbackHandler);

router.get("/main-chat-question-templates", listMainChatQuestionTemplatesHandler);
router.post("/main-chat-question-templates", createMainChatQuestionTemplateHandler);
router.patch("/main-chat-question-templates/:id", patchMainChatQuestionTemplateHandler);
router.delete("/main-chat-question-templates/:id", deleteMainChatQuestionTemplateHandler);

router.get("/simulation-question-templates", listSimulationQuestionTemplatesHandler);
router.post("/simulation-question-templates", createSimulationQuestionTemplateHandler);
router.patch("/simulation-question-templates/:id", patchSimulationQuestionTemplateHandler);
router.delete("/simulation-question-templates/:id", deleteSimulationQuestionTemplateHandler);

// Legacy aliases (main chat)
router.get("/question-templates", listQuestionTemplatesHandler);
router.post("/question-templates", createQuestionTemplateHandler);
router.patch("/question-templates/:id", patchQuestionTemplateHandler);
router.delete("/question-templates/:id", deleteQuestionTemplateHandler);

export { router as adminRouter };
