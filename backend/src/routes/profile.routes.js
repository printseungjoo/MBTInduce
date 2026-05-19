import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getProfile, patchProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, patchProfile);

export { router as profileRouter };
