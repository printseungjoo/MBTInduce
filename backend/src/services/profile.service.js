import { prisma } from "../lib/prisma.js";
import { isValidMbtiType, mbtiTypeToPreferenceLetters, preferenceLettersToMbtiType } from "../lib/mbtiTypes.js";

export async function getProfilePayloadByUserId(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, nickname: true, onboardingCompleted: true, role: true },
  });
  if (!user) return null;

  const pref = await prisma.mbtiPreference.findUnique({
    where: { userId },
  });
  const mbti = pref ? preferenceLettersToMbtiType(pref) : null;

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname ?? null,
    onboardingCompleted: user.onboardingCompleted,
    mbti,
    role: user.role,
    isAdmin: user.role === "ADMIN"
  };
}

/**
 * Ensures MbtiPreference exists with letters derived from a valid 16-type code.
 * @param {string} userId
 * @param {string} mbtiCode - validated uppercase type
 */
export async function upsertMbtiPreferenceFromType(userId, mbtiCode) {
  const letters = mbtiTypeToPreferenceLetters(mbtiCode);
  if (!letters) return;

  await prisma.mbtiPreference.upsert({
    where: { userId },
    update: {
      energy: letters.energy,
      information: letters.information,
      decision: letters.decision,
      lifestyle: letters.lifestyle,
    },
    create: {
      userId,
      energy: letters.energy,
      information: letters.information,
      decision: letters.decision,
      lifestyle: letters.lifestyle,
    },
  });
}

/** Default letters when no MBTI provided at signup (matches Google flow defaults). */
export async function ensureDefaultMbtiPreference(userId) {
  await prisma.mbtiPreference.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      energy: "E",
      information: "S",
      decision: "T",
      lifestyle: "J",
    },
  });
}

export async function updateProfile(userId, { nickname, mbti }) {
  if (typeof nickname === "string") {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        nickname: nickname.trim(),
        onboardingCompleted: true
    },
    });
  }

  if (typeof mbti === "string" && mbti.trim().length > 0) {
    await upsertMbtiPreferenceFromType(userId, mbti.trim().toUpperCase());
  }

  return getProfilePayloadByUserId(userId);
}
