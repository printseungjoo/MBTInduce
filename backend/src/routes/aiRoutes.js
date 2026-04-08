import { Router } from "express";
import { postAiCompare, postAiRespond } from "../controllers/aiController.js";

const router = Router();

router.post("/respond", postAiRespond);
router.post("/compare", postAiCompare);

export { router as aiRouter };

