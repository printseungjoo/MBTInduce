import { Router } from "express";
import { postAiCompare, postAiRespond } from "../controllers/aiController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { aiRateLimit } from "../middlewares/rateLimit.js";

const router = Router();

router.post("/respond", requireAuth, aiRateLimit, postAiRespond);
router.post("/compare", requireAuth, aiRateLimit, postAiCompare);

export { router as aiRouter };

