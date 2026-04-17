import { Router } from "express";
import { postShowBoth } from "../controllers/showBoth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/", requireAuth, postShowBoth);

export { router as showBothRouter };
