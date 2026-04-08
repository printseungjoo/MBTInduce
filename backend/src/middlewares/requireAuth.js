export function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.status === "SUSPENDED") {
    return res.status(403).json({ message: "Account suspended" });
  }

  if (req.user.status === "DELETED") {
    return res.status(403).json({ message: "Account deleted" });
  }

  return next();
}
