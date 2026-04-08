/**
 * MBTI slider semantics (aligned with frontend RangeBar):
 * Each weight is 0–100 = percent toward the "left" pole of that row:
 * E/I → E%, S/N → S%, F/T → F%, P/J → P%.
 */

export function clampPct(n, fallback = 50) {
  if (typeof n !== "number" || Number.isNaN(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function normalizeMbtiWeights(input) {
  if (!input || typeof input !== "object") {
    return {
      energy: 50,
      information: 50,
      decision: 50,
      lifestyle: 50,
    };
  }
  return {
    energy: clampPct(input.energy),
    information: clampPct(input.information),
    decision: clampPct(input.decision),
    lifestyle: clampPct(input.lifestyle),
  };
}

export function lettersFromWeights(w) {
  return {
    energy: w.energy >= 50 ? "E" : "I",
    information: w.information >= 50 ? "S" : "N",
    decision: w.decision >= 50 ? "F" : "T",
    lifestyle: w.lifestyle >= 50 ? "P" : "J",
  };
}

/**
 * Build a short instruction string for the AI layer from discrete letters + slider weights.
 */
export function mbtiToWeightedInstruction(mbtiRow) {
  if (!mbtiRow) return "Use a balanced and helpful tone.";

  const w = normalizeMbtiWeights({
    energy: mbtiRow.energyWeight,
    information: mbtiRow.informationWeight,
    decision: mbtiRow.decisionWeight,
    lifestyle: mbtiRow.lifestyleWeight,
  });

  const ePct = w.energy;
  const iPct = 100 - ePct;
  const sPct = w.information;
  const nPct = 100 - sPct;
  const fPct = w.decision;
  const tPct = 100 - fPct;
  const pPct = w.lifestyle;
  const jPct = 100 - pPct;

  const parts = [];

  if (ePct > iPct) {
    parts.push(
      `Energy: lean energetic/outward (${ePct}% E) with ${iPct}% reflective/quiet tone.`
    );
  } else if (iPct > ePct) {
    parts.push(
      `Energy: lean reflective/quiet (${iPct}% I) with ${ePct}% outward energy.`
    );
  } else {
    parts.push("Energy: balance E and I evenly.");
  }

  if (sPct > nPct) {
    parts.push(
      `Information: concrete and practical (${sPct}% S) with ${nPct}% abstract/possibility framing.`
    );
  } else if (nPct > sPct) {
    parts.push(
      `Information: abstract possibilities (${nPct}% N) with ${sPct}% concrete detail.`
    );
  } else {
    parts.push("Information: balance S and N evenly.");
  }

  if (fPct > tPct) {
    parts.push(`Decision style: empathy-first (${fPct}% F) with ${tPct}% logical clarity.`);
  } else if (tPct > fPct) {
    parts.push(`Decision style: analysis-first (${tPct}% T) with ${fPct}% emotional context.`);
  } else {
    parts.push("Decision style: balance F and T evenly.");
  }

  if (pPct > jPct) {
    parts.push(`Structure: flexible and open-ended (${pPct}% P) with ${jPct}% clear steps.`);
  } else if (jPct > pPct) {
    parts.push(`Structure: organized steps (${jPct}% J) with ${pPct}% room to adapt.`);
  } else {
    parts.push("Structure: balance P and J evenly.");
  }

  const letters = [
    mbtiRow.energy,
    mbtiRow.information,
    mbtiRow.decision,
    mbtiRow.lifestyle,
  ].join("");

  return `[MBTI target ~${letters}] ${parts.join(" ")}`;
}
