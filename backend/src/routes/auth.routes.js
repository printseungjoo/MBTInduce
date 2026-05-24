import { Router } from "express";
import { passport } from "../config/passport.js";
import {
  deleteMyAccount,
  handleGoogleCallbackFailure,
  handleGoogleCallbackSuccess,
  logout,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

function ensureGoogleOAuthConfigured(req, res, next) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ message: "Google OAuth is not configured" });
  }
  return next();
}

router.get("/google", ensureGoogleOAuthConfigured, (req, res, next) => {
  const mode = req.query.mode === "login" ? "login" : "signup";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    state: mode,
  })(req, res, next);
});

router.get(
  "/google/callback",
  ensureGoogleOAuthConfigured,
  passport.authenticate("google", { failureRedirect: "/auth/google/failure", session: true }),
  handleGoogleCallbackSuccess
);

router.get("/google/failure", handleGoogleCallbackFailure);
router.post("/logout", requireAuth, logout);
router.delete("/withdraw", requireAuth, deleteMyAccount);

export { router as authRouter };
