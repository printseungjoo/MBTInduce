import { prisma } from "../lib/prisma.js";

export async function requireAuth(req, res, next) {
  if (process.env.NODE_ENV === "development" && process.env.DEV_AUTH_BYPASS === "true") {
    if (!req.user) {
      const devUserId = process.env.DEV_AUTH_USER_ID || "dev-bypass-user";
      const devRole = process.env.DEV_AUTH_ROLE || "USER";

      await prisma.user.upsert({
        where: { id: devUserId },
        update: {
          role: devRole,
          status: "ACTIVE",
        },
        create: {
          id: devUserId,
          email: `${devUserId}@dev.local`,
          nickname: "Dev Bypass User",
          role: devRole,
          status: "ACTIVE",
        },
      });

      req.user = {
        id: devUserId,
        role: devRole,
        status: "ACTIVE",
      };
    }
    return next();
  }

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
