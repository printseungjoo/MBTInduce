/** Canonical 16-type MBTI codes (uppercase). */
export const MBTI_TYPES = Object.freeze([
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
]);

const SET = new Set(MBTI_TYPES);

export function isValidMbtiType(value) {
  if (value === undefined || value === null) return false;
  if (typeof value !== "string") return false;
  const upper = value.trim().toUpperCase();
  if (upper.length === 0) return false;
  return SET.has(upper);
}

/**
 * @param {string} code - e.g. "INTJ"
 * @returns {{ energy: string, information: string, decision: string, lifestyle: string } | null}
 */
export function mbtiTypeToPreferenceLetters(code) {
  if (!isValidMbtiType(code)) return null;
  const u = code.trim().toUpperCase();
  return {
    energy: u[0],
    information: u[1],
    decision: u[2],
    lifestyle: u[3],
  };
}

/**
 * @param {{ energy?: string, information?: string, decision?: string, lifestyle?: string } | null} pref
 * @returns {string | null} four-letter type or null if invalid
 */
export function preferenceLettersToMbtiType(pref) {
  if (!pref) return null;
  const e = typeof pref.energy === "string" ? pref.energy.toUpperCase() : "";
  const i = typeof pref.information === "string" ? pref.information.toUpperCase() : "";
  const d = typeof pref.decision === "string" ? pref.decision.toUpperCase() : "";
  const l = typeof pref.lifestyle === "string" ? pref.lifestyle.toUpperCase() : "";
  const code = `${e}${i}${d}${l}`;
  return SET.has(code) ? code : null;
}
