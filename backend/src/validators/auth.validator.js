import { isValidMbtiType } from "../lib/mbtiTypes.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(message) {
  return { ok: false, message };
}

export function validateSignupBody(body) {
  const raw = body || {};
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const password = typeof raw.password === "string" ? raw.password : "";
  const nickname = typeof raw.nickname === "string" ? raw.nickname.trim() : "";
  const mbtiRaw = raw.mbti;

  if (!email) return bad("email is required");
  if (!EMAIL_RE.test(email)) return bad("email must be a valid address");

  if (!password) return bad("password is required");
  if (password.length < 8) return bad("password must be at least 8 characters");

  if (!nickname) return bad("nickname is required");

  let mbti = null;
  if (mbtiRaw !== undefined && mbtiRaw !== null) {
    if (typeof mbtiRaw !== "string") return bad("mbti must be a string");
    const t = mbtiRaw.trim();
    if (t.length > 0) {
      if (!isValidMbtiType(t)) return bad("mbti must be one of the 16 MBTI types");
      mbti = t.toUpperCase();
    }
  }

  return { ok: true, value: { email, password, nickname, mbti } };
}

export function validateLoginBody(body) {
  const raw = body || {};
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const password = typeof raw.password === "string" ? raw.password : "";

  if (!email) return bad("email is required");
  if (!password) return bad("password is required");

  return { ok: true, value: { email, password } };
}
