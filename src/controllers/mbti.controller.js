import { prisma } from "../lib/prisma.js";

function normalizeLetter(value, allowed, fallback) {
  if (typeof value !== "string") return fallback;
  const upper = value.toUpperCase();
  return allowed.includes(upper) ? upper : fallback;
}

export async function getMyMbti(req, res, next) {
  try {
    const mbti = await prisma.mbtiPreference.findUnique({
      where: { userId: req.user.id },
    });

    return res.status(200).json({ mbti });
  } catch (error) {
    next(error);
  }
}

export async function upsertMyMbti(req, res, next) {
  try {
    const { energy, information, decision, lifestyle } = req.body || {};

    const updated = await prisma.mbtiPreference.upsert({
      where: { userId: req.user.id },
      update: {
        energy: normalizeLetter(energy, ["E", "I"], "E"),
        information: normalizeLetter(information, ["S", "N"], "S"),
        decision: normalizeLetter(decision, ["F", "T"], "T"),
        lifestyle: normalizeLetter(lifestyle, ["P", "J"], "J"),
      },
      create: {
        userId: req.user.id,
        energy: normalizeLetter(energy, ["E", "I"], "E"),
        information: normalizeLetter(information, ["S", "N"], "S"),
        decision: normalizeLetter(decision, ["F", "T"], "T"),
        lifestyle: normalizeLetter(lifestyle, ["P", "J"], "J"),
      },
    });

    return res.status(200).json({ mbti: updated });
  } catch (error) {
    next(error);
  }
}
