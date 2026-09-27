export function requireOnboarding(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return next();
  }

  if (req.user.role === "ADMIN") {
    return next();
  }

  if (req.user.onboardingCompleted === false) {
    return res.status(403).json({ message: "Onboarding required" });
  }

  return next();
}

export function isOnboardingExemptApiPath(path) {
  return (
    path === "/auth" ||
    path.startsWith("/auth/") ||
    path === "/profile" ||
    path.startsWith("/profile/") ||
    path === "/me" ||
    path.startsWith("/me/")
  );
}
