function bad(message) {
  return { ok: false, message };
}

export function parseFeedbackListQuery(query) {
  const raw = query || {};

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

  let rating;
  if (raw.rating !== undefined && raw.rating !== null && raw.rating !== "") {
    const n = Number(raw.rating);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return bad("rating must be an integer between 1 and 5");
    }
    rating = n;
  }

  return { ok: true, value: { page, limit, rating } };
}

export function validateQuestionTemplateCreateBody(body) {
  const raw = body || {};

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return bad("title is required");

  const content = typeof raw.content === "string" ? raw.content.trim() : "";
  if (!content) return bad("content is required");

  let category;
  if (raw.category !== undefined && raw.category !== null) {
    if (typeof raw.category !== "string") return bad("category must be a string");
    const trimmed = raw.category.trim();
    category = trimmed || null;
  }

  let isActive = true;
  if (raw.isActive !== undefined) {
    if (typeof raw.isActive !== "boolean") return bad("isActive must be a boolean");
    isActive = raw.isActive;
  }

  return { ok: true, value: { title, content, category: category ?? null, isActive } };
}

export function validateQuestionTemplatePatchBody(body) {
  const raw = body || {};
  const value = {};

  if (raw.title !== undefined) {
    if (typeof raw.title !== "string") return bad("title must be a string");
    const title = raw.title.trim();
    if (!title) return bad("title cannot be empty");
    value.title = title;
  }

  if (raw.content !== undefined) {
    if (typeof raw.content !== "string") return bad("content must be a string");
    const content = raw.content.trim();
    if (!content) return bad("content cannot be empty");
    value.content = content;
  }

  if (raw.category !== undefined) {
    if (raw.category !== null && typeof raw.category !== "string") {
      return bad("category must be a string");
    }
    value.category =
      raw.category === null ? null : String(raw.category).trim() || null;
  }

  if (raw.isActive !== undefined) {
    if (typeof raw.isActive !== "boolean") return bad("isActive must be a boolean");
    value.isActive = raw.isActive;
  }

  if (Object.keys(value).length === 0) {
    return bad("at least one field is required");
  }

  return { ok: true, value };
}
