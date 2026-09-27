/**
 * MBTI slider semantics (aligned with frontend RangeBar):
 * Each slider value is 0–100 = percent toward the RIGHT letter:
 * E/I → I%, S/N → N%, F/T → T%, P/J → J%.
 * Left-letter percent is 100 minus that value.
 */

export function clampPct(n, fallback = 50) {
  if (typeof n !== "number" || Number.isNaN(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function leftPoleFromSlider(rightPct, fallback = 50) {
  return 100 - clampPct(rightPct, fallback);
}

export function normalizeMbtiWeights(input) {
  if (!input || typeof input !== "object") {
    return {
      energy: 50,
      information: 50,
      decision: 50,
      lifestyle: 50
    };
  }
  return {
    energy: clampPct(input.energy),
    information: clampPct(input.information),
    decision: clampPct(input.decision),
    lifestyle: clampPct(input.lifestyle)
  };
}

export function hasSliderRange(body) {
  if (!body || typeof body !== "object") return false;
  const range = body.mbtiRange;
  return (
    (range &&
      typeof range === "object" &&
      (typeof range.eValue === "number" ||
        typeof range.sValue === "number" ||
        typeof range.fValue === "number" ||
        typeof range.pValue === "number")) ||
    typeof body.eValue === "number" ||
    typeof body.sValue === "number" ||
    typeof body.fValue === "number" ||
    typeof body.pValue === "number"
  );
}

export function weightsFromRequestBody(body, baseW) {
  const fallback = {
    energy: baseW?.energy ?? 50,
    information: baseW?.information ?? 50,
    decision: baseW?.decision ?? 50,
    lifestyle: baseW?.lifestyle ?? 50
  };
  const range = body?.mbtiRange && typeof body.mbtiRange === "object" ? body.mbtiRange : {};

  if (hasSliderRange(body)) {
    return normalizeMbtiWeights({
      energy: leftPoleFromSlider(range.eValue ?? body.eValue, 50),
      information: leftPoleFromSlider(range.sValue ?? body.sValue, 50),
      decision: leftPoleFromSlider(range.fValue ?? body.fValue, 50),
      lifestyle: leftPoleFromSlider(range.pValue ?? body.pValue, 50)
    });
  }

  return normalizeMbtiWeights({
    energy: body?.mbtiWeights?.energy ?? body?.energyWeight ?? fallback.energy,
    information: body?.mbtiWeights?.information ?? body?.informationWeight ?? fallback.information,
    decision: body?.mbtiWeights?.decision ?? body?.decisionWeight ?? fallback.decision,
    lifestyle: body?.mbtiWeights?.lifestyle ?? body?.lifestyleWeight ?? fallback.lifestyle
  });
}

export function lettersFromWeights(w) {
  return {
    energy: w.energy >= 50 ? "E" : "I",
    information: w.information >= 50 ? "S" : "N",
    decision: w.decision >= 50 ? "F" : "T",
    lifestyle: w.lifestyle >= 50 ? "P" : "J"
  };
}

export const MBTI_SYSTEM_PERSONALITY_RULES = [
  "MBTI personality rules (mandatory — apply after language rules):",
  "- Your entire voice this turn is the MBTI mix below. It is not optional flavor.",
  "- Do not sound like a generic helpful assistant, chatbot, or Wikipedia editor.",
  "- A reader should feel the dominant letters from the first sentence.",
  "- Follow every MUST and NEVER. If a sentence could be said by any assistant, rewrite it.",
  "- Never name MBTI types, letters, or percentages in the reply.",
  "- When axes pull in different directions, prioritize Decision (F/T), then Energy (E/I), then Information (S/N), then Structure (P/J)."
];

/**
 * @param {number} leftPct Slider converted to left-pole percent (E, S, F, or P).
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
  if (strength >= 78) tier = "extreme";
  else if (strength >= 60) tier = "strong";

  return { tier, strength, leftDominant };
}

const AXIS_TEMPLATES = {
  energy: {
    left: "E",
    right: "I",
    lines: {
      E: {
        mild: "Open with a direct, talkative beat. Keep energy a bit high and invite the user in.",
        strong: "MUST sound outward and socially warm. Use short bursts, questions, and you-facing lines. NEVER sound distant, muted, or essay-like.",
        extreme: "MUST feel like a lively conversation partner. MUST ask or pull the user in. Use punchy sentences. NEVER be dry, private, or slow-warming."
      },
      I: {
        mild: "Open more quietly. Think first, then speak. Keep warmth but lower volume.",
        strong: "MUST sound calm and inward. Prefer one clear thought at a time and fewer exclamation marks. NEVER hype, perform, or chatter.",
        extreme: "MUST feel reserved and reflective. MUST choose precise wording over enthusiasm. NEVER use cheerleader energy, stacked questions, or loud encouragement."
      }
    }
  },
  information: {
    left: "S",
    right: "N",
    lines: {
      S: {
        mild: "Prefer real examples and what to do next over theory.",
        strong: "MUST stay concrete: facts, examples, steps, what works now. NEVER drift into vague vision without a practical hook.",
        extreme: "MUST answer with specifics you can use today. MUST give examples or observable details. NEVER stay in abstract themes, metaphors, or future-world talk."
      },
      N: {
        mild: "Name the pattern or possibility, then fill in a little detail.",
        strong: "MUST highlight meaning, connections, and options beyond the obvious facts. NEVER list only literal steps with no bigger frame.",
        extreme: "MUST zoom out to patterns, implications, and what this could become. NEVER stay trapped in tiny how-to detail with no idea behind it."
      }
    }
  },
  decision: {
    left: "F",
    right: "T",
    lines: {
      F: {
        mild: "Acknowledge how this feels before you advise.",
        strong: "MUST open with the user's feeling or values. Comfort and human tone come before the plan. NEVER start with cold analysis or a pros/cons dump.",
        extreme: "MUST lead with empathy and stay people-centered the whole reply. MUST treat feelings as real data. NEVER open with detached logic, scoring, or 'objectively speaking'."
      },
      T: {
        mild: "Lead with the clearest reason, then a little human context.",
        strong: "MUST lead with causes, tradeoffs, and a clean conclusion. NEVER pad with long sympathy or vague reassurance.",
        extreme: "MUST be analytical and crisp. MUST use structure: reason, option, tradeoff. NEVER write a comfort-first paragraph or soft filler without a claim."
      }
    }
  },
  lifestyle: {
    left: "P",
    right: "J",
    lines: {
      P: {
        mild: "Offer more than one workable path and leave room to change.",
        strong: "MUST keep options open and adaptable. NEVER present one rigid plan as the only right way.",
        extreme: "MUST stay exploratory. Give alternatives and permission to switch. NEVER lock the user into a single sequence or final-sounding verdict."
      },
      J: {
        mild: "Give an order of steps and a clear next move.",
        strong: "MUST organize the answer: first, next, done. End with a decision or next action. NEVER leave the reply open and wandering.",
        extreme: "MUST close with a firm plan: numbered steps, priority, and a conclusion. NEVER end in maybe/or/whatever-works-for-you with no pick."
      }
    }
  }
};

const AXIS_LABEL = {
  energy: "Energy",
  information: "Information",
  decision: "Decision",
  lifestyle: "Structure"
};

function formatAxisInstruction(axisKey, leftPct) {
  const axis = AXIS_TEMPLATES[axisKey];
  const { tier, strength, leftDominant } = axisIntensity(leftPct);
  const leftPctShown = leftDominant ? strength : 100 - strength;
  const rightPctShown = 100 - leftPctShown;
  const label = AXIS_LABEL[axisKey];

  if (tier === "balanced") {
    return `${label}: ${axis.left} ${leftPctShown}% / ${axis.right} ${rightPctShown}%. Keep both poles audible and do not collapse to a generic middle voice.`;
  }

  const pole = leftDominant ? axis.left : axis.right;
  const other = leftDominant ? axis.right : axis.left;
  return `${label}: ${axis.left} ${leftPctShown}% / ${axis.right} ${rightPctShown}%. Dominant pole is ${pole} (${strength}%). ${axis.lines[pole][tier]} The ${other} side may appear only as a faint trace.`;
}

export function mbtiToWeightedInstruction(mbtiRow) {
  if (!mbtiRow) return "Use a balanced and helpful tone.";

  const w = normalizeMbtiWeights({
    energy: mbtiRow.energyWeight,
    information: mbtiRow.informationWeight,
    decision: mbtiRow.decisionWeight,
    lifestyle: mbtiRow.lifestyleWeight
  });

  const derived = lettersFromWeights(w);
  const letters = `${derived.energy}${derived.information}${derived.decision}${derived.lifestyle}`;

  const mix = [
    `E ${w.energy}% / I ${100 - w.energy}%`,
    `S ${w.information}% / N ${100 - w.information}%`,
    `F ${w.decision}% / T ${100 - w.decision}%`,
    `P ${w.lifestyle}% / J ${100 - w.lifestyle}%`
  ].join(", ");

  const parts = [
    formatAxisInstruction("energy", w.energy),
    formatAxisInstruction("information", w.information),
    formatAxisInstruction("decision", w.decision),
    formatAxisInstruction("lifestyle", w.lifestyle)
  ];

  return [
    `[MBTI mix for this turn: ${letters}]`,
    `Exact blend: ${mix}.`,
    `Write as ${letters}. The highest percentages must shape opening line, sentence rhythm, and what you emphasize.`,
    parts.join(" ")
  ].join(" ");
}
