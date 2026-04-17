import { prisma } from "../lib/prisma.js";

const ALLOWED_AXES = new Set(["EI", "SN", "FT", "PJ"]);

/**
 * Frontend RightScreen sends JSON body: string[] e.g. ["EI","SN"] (Generate on Show Both).
 */
function normalizeShowBothBody(body) {
  if (!Array.isArray(body)) return null;
  const out = [];
  for (const item of body) {
    if (typeof item !== "string") continue;
    const code = item.trim().toUpperCase();
    if (!ALLOWED_AXES.has(code)) continue;
    if (!out.includes(code)) out.push(code);
  }
  return out;
}

export async function postShowBoth(req, res, next) {
  try {
    const modes = normalizeShowBothBody(req.body);
    if (modes === null) {
      return res.status(400).json({
        message: "Request body must be a JSON array of axis codes: EI, SN, FT, PJ",
      });
    }

    const mbti = await prisma.mbtiPreference.upsert({
      where: { userId: req.user.id },
      update: { showBothAxes: modes },
      create: {
        userId: req.user.id,
        showBothAxes: modes,
      },
    });

    return res.status(200).json({
      ok: true,
      showBothAxes: mbti.showBothAxes,
    });
  } catch (err) {
    next(err);
  }
}
