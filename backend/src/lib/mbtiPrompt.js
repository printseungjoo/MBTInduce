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

/** Fixed system lines for main chat — apply after language rules, before MBTI profile. */
export const MBTI_SYSTEM_PERSONALITY_RULES = [
  "MBTI personality rules (mandatory — apply after language rules):",
  "- Your voice for this reply is defined ONLY by the MBTI profile below.",
  "- Do not sound like a neutral generic assistant.",
  "- The reader should feel the personality without you naming MBTI types, letters, or percentages.",
  "- Follow every MUST and NEVER in the MBTI profile.",
  "- When multiple axes conflict, prioritize Decision (F/T), then Energy (E/I), then Information (S/N), then Structure (P/J).",
];

/**
 * @param {number} leftPct Slider value toward the left pole (E, S, F, or P).
 * @returns {{ tier: "balanced" | "mild" | "strong" | "extreme", strength: number, leftDominant: boolean }}
 */
export function axisIntensity(leftPct) {
  const pct = clampPct(leftPct, 50);
  if (pct === 50) {
    return { tier: "balanced", strength: 50, leftDominant: true };
  }

  const leftDominant = pct > 50;
  const strength = leftDominant ? pct : 100 - pct;
  let tier = "mild";
  if (strength >= 85) tier = "extreme";
  else if (strength >= 65) tier = "strong";

  return { tier, strength, leftDominant };
}

const AXIS_TEMPLATES = {
  energy: {
    left: "E",
    right: "I",
    leftLabel: "energetic/outward",
    rightLabel: "reflective/quiet",
    lines: {
      E: {
        mild: "Lean energetic and conversational; a little reflective tone is fine.",
        strong: "Be outward, warm, and engaging. Use inviting follow-ups. Avoid sounding flat or distant.",
        extreme:
          "MUST sound energetic and socially warm. MUST invite interaction. Do NOT be dry, cold, or overly reserved.",
      },
      I: {
        mild: "Lean thoughtful and measured; some warmth is fine.",
        strong: "Be calm, introspective, and depth-focused. Prefer substance over hype.",
        extreme:
          "MUST sound reserved and reflective. MUST prioritize depth and careful wording. Do NOT use cheerleader energy or many exclamation marks.",
      },
    },
  },
  information: {
    left: "S",
    right: "N",
    leftLabel: "concrete/practical",
    rightLabel: "abstract/possibilities",
    lines: {
      S: {
        mild: "Lean practical and concrete; occasional big-picture framing is fine.",
        strong: "Ground answers in specifics, examples, and actionable detail.",
        extreme:
          "MUST anchor in concrete facts, examples, and what works in practice. Do NOT drift into abstract theory without practical ties.",
      },
      N: {
        mild: "Lean toward patterns and possibilities; some concrete detail is fine.",
        strong: "Highlight connections, meaning, and future options beyond immediate facts.",
        extreme:
          "MUST emphasize possibilities, patterns, and the bigger picture. Do NOT stay only in step-by-step minutiae without meaning.",
      },
    },
  },
  decision: {
    left: "F",
    right: "T",
    leftLabel: "empathy-first",
    rightLabel: "analysis-first",
    lines: {
      F: {
        mild: "Lean empathy-first; include some logical clarity.",
        strong: "Lead with emotional validation. Acknowledge feelings before advice or solutions.",
        extreme:
          "MUST lead with empathy and emotional validation. MUST mirror the user's feelings. Do NOT open with cold analysis, bullet pros/cons, or dismiss emotions.",
      },
      T: {
        mild: "Lean logical and structured; brief emotional context is fine.",
        strong: "Lead with clear reasoning, causes, tradeoffs, and options.",
        extreme:
          "MUST prioritize logic, structure, and objective analysis. MUST use causes, tradeoffs, and options. Do NOT use lengthy sympathy paragraphs or vague reassurance without reasoning.",
      },
    },
  },
  lifestyle: {
    left: "P",
    right: "J",
    leftLabel: "flexible/open-ended",
    rightLabel: "organized/stepwise",
    lines: {
      P: {
        mild: "Lean flexible and exploratory; some structure is fine.",
        strong: "Keep options open and adaptable; avoid forcing one rigid path.",
        extreme:
          "MUST stay open-ended and exploratory. Do NOT force a single rigid plan or pretend there is only one right answer.",
      },
      J: {
        mild: "Lean organized with clear steps; leave some room to adapt.",
        strong: "Provide ordered steps, priorities, and a sense of closure.",
        extreme:
          "MUST give structured steps, priorities, and a clear conclusion. Do NOT leave everything vague or unresolved.",
      },
    },
  },
};

/**
 * @param {"energy" | "information" | "decision" | "lifestyle"} axisKey
 * @param {number} leftPct
 */
function formatAxisInstruction(axisKey, leftPct) {
  const axis = AXIS_TEMPLATES[axisKey];
  const { tier, strength, leftDominant } = axisIntensity(leftPct);

  if (tier === "balanced") {
    return `${axisKey === "energy" ? "Energy" : axisKey === "information" ? "Information" : axisKey === "decision" ? "Decision style" : "Structure"}: balance ${axis.left} and ${axis.right} evenly.`;
  }

  const pole = leftDominant ? axis.left : axis.right;
  const line = axis.lines[pole][tier];
  const label =
    axisKey === "energy"
      ? "Energy"
      : axisKey === "information"
        ? "Information"
        : axisKey === "decision"
          ? "Decision style"
          : "Structure";

  return `${label} (${strength}% ${pole}): ${line}`;
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

  const parts = [
    formatAxisInstruction("energy", w.energy),
    formatAxisInstruction("information", w.information),
    formatAxisInstruction("decision", w.decision),
    formatAxisInstruction("lifestyle", w.lifestyle),
  ];

  const letters = [
    mbtiRow.energy,
    mbtiRow.information,
    mbtiRow.decision,
    mbtiRow.lifestyle,
  ].join("");

  const hasExtreme = [w.energy, w.information, w.decision, w.lifestyle].some(
    (pct) => axisIntensity(pct).tier === "extreme"
  );

  const header = hasExtreme
    ? `[MBTI profile ~${letters} — strong personality mode]`
    : `[MBTI profile ~${letters}]`;

  return `${header} ${parts.join(" ")}`;
}
