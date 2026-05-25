import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { isAdminEmail, resolveRoleForEmail } from "../lib/adminEmails.js";
import { ensureDefaultMbtiPreference, upsertMbtiPreferenceFromType } from "./profile.service.js";

const BCRYPT_ROUNDS = 10;

function clientError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function createLocalUser({ email, password, nickname, mbti }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
        role: resolveRoleForEmail(email),
        status: "ACTIVE",
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
        role: true,
        status: true,
        onboardingCompleted: true
      },
    });

    if (mbti) {
      await upsertMbtiPreferenceFromType(user.id, mbti);
    } else {
      await ensureDefaultMbtiPreference(user.id);
    }

    return user;
  } catch (e) {
    if (e && e.code === "P2002") {
      throw clientError(409, "Email already registered");
    }
    throw e;
  }
}

/**
 * @returns {Promise<{ id: string, email: string, nickname: string | null, profileImage: string | null, role: string, status: string }>}
 */
export async function authenticateLocalUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      nickname: true,
      profileImage: true,
      role: true,
      status: true,
      passwordHash: true,
    },
  });

  if (!user || !user.passwordHash) {
    throw clientError(401, "Invalid email or password");
  }

  if (user.status === "SUSPENDED") {
    throw clientError(403, "Account suspended");
  }
  if (user.status === "DELETED") {
    throw clientError(403, "Account deleted");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw clientError(401, "Invalid email or password");
  }

  const loginUpdate = { lastLoginAt: new Date() };
  if (isAdminEmail(email) && user.role !== "ADMIN") {
    loginUpdate.role = "ADMIN";
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: loginUpdate,
    select: {
      id: true,
      email: true,
      nickname: true,
      profileImage: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
}
