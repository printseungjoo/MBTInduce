/** Hangul syllables, compatibility jamo, and choseong/jungseong. */
const HANGUL_RE = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/g;
const LATIN_RE = /[a-zA-Z]/g;

/**
 * Heuristic language of a single user message (English vs Korean vs mixed).
 * @param {string} text
 * @returns {"en" | "ko" | "mixed"}
 */
export function detectMessageLanguage(text) {
  if (!text || typeof text !== "string") return "en";

  const trimmed = text.trim();
  if (!trimmed) return "en";

  const hangul = (trimmed.match(HANGUL_RE) || []).length;
  const latin = (trimmed.match(LATIN_RE) || []).length;

  if (hangul === 0 && latin === 0) return "en";
  if (hangul === 0) return "en";
  if (latin === 0) return "ko";

  const total = hangul + latin;
  const hangulShare = hangul / total;
  const latinShare = latin / total;

  if (hangul >= 2 && latin >= 2 && hangulShare < 0.65 && latinShare < 0.65) {
    return "mixed";
  }

  return hangul > latin ? "ko" : "en";
}

/**
 * One-line system injection from detected language (latest user message).
 * @param {"en" | "ko" | "mixed"} lang
 * @returns {string}
 */
export function languageDirectiveForDetected(lang) {
  switch (lang) {
    case "ko":
      return "Detected language of the user's latest message: Korean. You must respond entirely in Korean.";
    case "mixed":
      return "Detected language of the user's latest message: mixed Korean and English. Use the language that carries most of the question; when unclear, respond in English.";
    case "en":
    default:
      return "Detected language of the user's latest message: English. You must respond entirely in English. Do not use Korean.";
  }
}
