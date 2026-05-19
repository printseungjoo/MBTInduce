import { isValidMbtiType } from "../lib/mbtiTypes.js";

function bad(message) {
  return { ok: false, message };
}

/**
 * PATCH /api/profile — at least one field; nickname non-empty when present.
 */
export function validateProfilePatchBody(body) {
  const raw = body || {};
  const hasNickname = Object.prototype.hasOwnProperty.call(raw, "nickname");
  const hasMbti = Object.prototype.hasOwnProperty.call(raw, "mbti");

  if (!hasNickname && !hasMbti) {
    return bad("At least one of nickname or mbti is required");
  }

  let nickname;
  let mbti;
  if (hasNickname) {
    if (typeof raw.nickname !== "string") return bad("nickname must be a string");
    nickname = raw.nickname.trim();
    if (!nickname) return bad("nickname must not be empty");
  }

  if (hasMbti) {
    if (raw.mbti === null || raw.mbti === undefined) {
      return bad("mbti must be a string");
    }
    if (typeof raw.mbti !== "string") return bad("mbti must be a string");
    const t = raw.mbti.trim();
    if (!t) return bad("mbti must not be empty");
    if (!isValidMbtiType(t)) return bad("mbti must be one of the 16 MBTI types");
    mbti = t.toUpperCase();
  }

  return { ok: true, value: { nickname, mbti } };
}
