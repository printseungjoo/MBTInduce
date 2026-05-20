import { Router } from "express";
import {
  createQuestionTemplateHandler,
  deleteQuestionTemplateHandler,
  getStatisticsHandler,
  listFeedbackHandler,
  listQuestionTemplatesHandler,
  patchQuestionTemplateHandler,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/statistics", getStatisticsHandler);
router.get("/feedback", listFeedbackHandler);
router.get("/question-templates", listQuestionTemplatesHandler);
router.post("/question-templates", createQuestionTemplateHandler);
router.patch("/question-templates/:id", patchQuestionTemplateHandler);
router.delete("/question-templates/:id", deleteQuestionTemplateHandler);

export { router as adminRouter };
