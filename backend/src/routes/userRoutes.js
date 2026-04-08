import { Router } from "express";
import { deleteMe, getMe, patchMe } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, patchMe);
router.delete("/me", requireAuth, deleteMe);

export { router as userRouter };

