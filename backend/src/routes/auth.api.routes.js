import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getAuthMe,
  postApiLogout,
  postLogin,
  postSignup,
} from "../controllers/auth.api.controller.js";

const router = Router();

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/logout", requireAuth, postApiLogout);
router.get("/me", requireAuth, getAuthMe);

export { router as authApiRouter };
