import { prisma } from "../lib/prisma.js";
import { lettersFromWeights, normalizeMbtiWeights } from "../lib/mbtiPrompt.js";

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
      energyWeight,
      informationWeight,
      decisionWeight,
      lifestyleWeight,
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
      energy: mbtiWeights?.energy ?? energyWeight ?? baseW.energy,
      information: mbtiWeights?.information ?? informationWeight ?? baseW.information,
      decision: mbtiWeights?.decision ?? decisionWeight ?? baseW.decision,
      lifestyle: mbtiWeights?.lifestyle ?? lifestyleWeight ?? baseW.lifestyle,
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
