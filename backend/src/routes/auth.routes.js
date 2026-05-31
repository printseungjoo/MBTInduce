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

router.get("/google/callback", ensureGoogleOAuthConfigured, (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      console.error("Google OAuth error:", err);
      console.error("Google OAuth error message:", err.message);

      if (err.message === "Account already registered") {
        return res.redirect("https://www.mbtinduce.com/?error=already_registered");
      }
      if (err.message === "Account not registered") {
        return res.redirect("https://www.mbtinduce.com/?error=not_registered");
      }
      return res.redirect("https://www.mbtinduce.com/?error=oauth_failed");
    }
    if (!user) {
      return res.redirect("https://www.mbtinduce.com/?error=oauth_failed");
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return handleGoogleCallbackSuccess(req, res);
    });
  })(req, res, next);
});

router.get("/google/failure", handleGoogleCallbackFailure);
router.post("/logout", requireAuth, logout);
router.delete("/withdraw", requireAuth, deleteMyAccount);

export { router as authRouter };
