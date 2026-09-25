import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authRateLimit } from "../middlewares/rateLimit.js";
import { deleteMyAccount } from "../controllers/auth.controller.js";
import {
  getAuthMe,
  postApiLogout,
  postLogin,
  postSignup,
} from "../controllers/auth.api.controller.js";

const router = Router();

router.post("/signup", authRateLimit, postSignup);
router.post("/login", authRateLimit, postLogin);
router.post("/logout", requireAuth, postApiLogout);
router.get("/me", requireAuth, getAuthMe);
router.delete("/withdraw", requireAuth, deleteMyAccount);

export { router as authApiRouter };
