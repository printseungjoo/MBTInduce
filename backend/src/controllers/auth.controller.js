import { prisma } from "../lib/prisma.js";

/** Ends Passport session, destroys express-session store row, clears cookie. */
export function clearAuthSession(req, res) {
  return new Promise((resolve, reject) => {
    req.logout((logoutError) => {
      if (logoutError) {
        return reject(logoutError);
      }
      req.session.destroy((sessionError) => {
        if (sessionError) {
          return reject(sessionError);
        }
        res.clearCookie("mbtinduce.sid");
        resolve();
      });
    });
  });
}

export async function handleGoogleCallbackSuccess(req, res) {
  const redirectUrl = process.env.AUTH_SUCCESS_REDIRECT || "http://localhost:5173";
  return res.redirect(redirectUrl);
}

export async function handleGoogleCallbackFailure(req, res) {
  const redirectUrl = process.env.AUTH_FAILURE_REDIRECT || "http://localhost:5173/login?error=oauth_failed";
  return res.redirect(redirectUrl);
}

export async function logout(req, res, next) {
  try {
    await clearAuthSession(req, res);
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const mode = process.env.ACCOUNT_DELETE_MODE || "SOFT";

    if (mode === "HARD") {
      await prisma.user.delete({ where: { id: userId } });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          status: "DELETED",
          deletedAt: new Date(),
          email: `deleted_${userId}@deleted.local`,
          profileImage: null,
          nickname: "deleted-user",
        },
      });
    }

    await clearAuthSession(req, res);
    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    next(error);
  }
}
