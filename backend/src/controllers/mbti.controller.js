import { prisma } from "../lib/prisma.js";
import { lettersFromWeights, normalizeMbtiWeights } from "../lib/mbtiPrompt.js";

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
    const body = req.body || {};
    const {
      energy,
      information,
      decision,
      lifestyle,
      mbtiWeights,
      mbtiRange,
      energyWeight,
      informationWeight,
      decisionWeight,
      lifestyleWeight,
      eValue,
      sValue,
      fValue,
      pValue,
    } = body;

    const existing = await prisma.mbtiPreference.findUnique({
      where: { userId: req.user.id },
    });

    const baseW = {
      energy: existing?.energyWeight ?? 50,
      information: existing?.informationWeight ?? 50,
      decision: existing?.decisionWeight ?? 50,
      lifestyle: existing?.lifestyleWeight ?? 50,
    };

    const nextW = normalizeMbtiWeights({
      energy:
        mbtiWeights?.energy ??
        mbtiRange?.eValue ??
        eValue ??
        energyWeight ??
        baseW.energy,
      information:
        mbtiWeights?.information ??
        mbtiRange?.sValue ??
        sValue ??
        informationWeight ??
        baseW.information,
      decision:
        mbtiWeights?.decision ??
        mbtiRange?.fValue ??
        fValue ??
        decisionWeight ??
        baseW.decision,
      lifestyle:
        mbtiWeights?.lifestyle ??
        mbtiRange?.pValue ??
        pValue ??
        lifestyleWeight ??
        baseW.lifestyle,
    });

    const derived = lettersFromWeights(nextW);

    const nextLetters = {
      energy:
        energy !== undefined ? normalizeLetter(energy, ["E", "I"], derived.energy) : derived.energy,
      information:
        information !== undefined
          ? normalizeLetter(information, ["S", "N"], derived.information)
          : derived.information,
      decision:
        decision !== undefined ? normalizeLetter(decision, ["F", "T"], derived.decision) : derived.decision,
      lifestyle:
        lifestyle !== undefined
          ? normalizeLetter(lifestyle, ["P", "J"], derived.lifestyle)
          : derived.lifestyle,
    };

    const updated = await prisma.mbtiPreference.upsert({
      where: { userId: req.user.id },
      update: {
        ...nextLetters,
        energyWeight: nextW.energy,
        informationWeight: nextW.information,
        decisionWeight: nextW.decision,
        lifestyleWeight: nextW.lifestyle,
      },
      create: {
        userId: req.user.id,
        ...nextLetters,
        energyWeight: nextW.energy,
        informationWeight: nextW.information,
        decisionWeight: nextW.decision,
        lifestyleWeight: nextW.lifestyle,
      },
    });

    return res.status(200).json({ mbti: updated });
  } catch (error) {
    next(error);
  }
}
