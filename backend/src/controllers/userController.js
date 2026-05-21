import { prisma } from "../lib/prisma.js";
import { clearAuthSession } from "./auth.controller.js";

export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function patchMe(req, res, next) {
  try {
    const { nickname, profileImage } = req.body || {};

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        nickname: typeof nickname === "string" ? nickname : undefined,
        profileImage: typeof profileImage === "string" ? profileImage : undefined,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
        role: true,
        status: true,
      },
    });

    return res.status(200).json({ user: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteMe(req, res, next) {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
        email: `deleted_${req.user.id}@deleted.local`,
        profileImage: null,
        nickname: "deleted-user",
      },
    });

    await clearAuthSession(req, res);
    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    next(error);
  }
}

