import { Router } from "express";
import { getMyMbti, upsertMyMbti } from "../controllers/mbti.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAuth, getMyMbti);
router.put("/", requireAuth, upsertMyMbti);

export { router as mbtiRouter };
