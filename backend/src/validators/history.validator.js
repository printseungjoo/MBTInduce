import { isValidMbtiType } from "../lib/mbtiTypes.js";

function bad(message) {
  return { ok: false, message };
}

export function parseHistoryListQuery(query) {
  const raw = query || {};

  let mbti;
  if (raw.mbti !== undefined && raw.mbti !== null && String(raw.mbti).trim() !== "") {
    const t = String(raw.mbti).trim();
    if (!isValidMbtiType(t)) return bad("mbti filter must be one of the 16 MBTI types");
    mbti = t.toUpperCase();
  }

  let sourceType;
  if (raw.sourceType !== undefined && raw.sourceType !== null && String(raw.sourceType).trim() !== "") {
    sourceType = String(raw.sourceType).trim();
  }

  let search;
  if (raw.search !== undefined && raw.search !== null && String(raw.search).trim() !== "") {
    search = String(raw.search).trim();
  }

  let limit = 20;
  if (raw.limit !== undefined && raw.limit !== null && raw.limit !== "") {
    const n = Number(raw.limit);
    if (!Number.isFinite(n) || n < 1) return bad("limit must be a positive number");
    limit = Math.min(100, Math.floor(n));
  }

  let page = 1;
  if (raw.page !== undefined && raw.page !== null && raw.page !== "") {
    const n = Number(raw.page);
    if (!Number.isFinite(n) || n < 1) return bad("page must be a positive number");
    page = Math.floor(n);
  }

  return { ok: true, value: { mbti, sourceType, search, limit, page } };
}

export function validateHistoryCreateBody(body) {
  const raw = body || {};

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return bad("title is required");

  const content = typeof raw.content === "string" ? raw.content : "";
  if (!content.trim()) return bad("content is required");

  let preview = null;
  if (raw.preview !== undefined && raw.preview !== null) {
    if (typeof raw.preview !== "string") return bad("preview must be a string");
    preview = raw.preview.trim() || null;
  }

  let mbti = null;
  if (raw.mbti !== undefined && raw.mbti !== null) {
    if (typeof raw.mbti !== "string") return bad("mbti must be a string");
    const t = raw.mbti.trim();
    if (t.length > 0) {
      if (!isValidMbtiType(t)) return bad("mbti must be one of the 16 MBTI types");
      mbti = t.toUpperCase();
    }
  }

  let sourceType = null;
  if (raw.sourceType !== undefined && raw.sourceType !== null) {
    if (typeof raw.sourceType !== "string") return bad("sourceType must be a string");
    sourceType = raw.sourceType.trim() || null;
  }

  let chatSessionId = null;
  if (raw.chatSessionId !== undefined && raw.chatSessionId !== null) {
    if (typeof raw.chatSessionId !== "string") return bad("chatSessionId must be a string");
    chatSessionId = raw.chatSessionId.trim() || null;
  }

  return { ok: true, value: { title, content, preview, mbti, sourceType, chatSessionId } };
}
