function trimString(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string") return null;
  return v.trim();
}

/**
 * @param {unknown} value
 * @returns {Date | null} null = invalid
 */
export function parseDateTime(value) {
  if (value === undefined || value === null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const d = new Date(`${s}T00:00:00.000Z`);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * @param {boolean} allDay
 * @param {Date} start
 * @param {Date} end
 */
export function normalizeAllDayRange(allDay, start, end) {
  if (!allDay) {
    return { startAt: start, endAt: end };
  }
  const startUtc = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0)
  );
  const endUtc = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999)
  );
  if (endUtc < startUtc) {
    return { startAt: startUtc, endAt: startUtc };
  }
  return { startAt: startUtc, endAt: endUtc };
}

/**
 * @param {Record<string, unknown>} body
 * @returns {{ ok: true, value: object } | { ok: false, message: string }}
 */
export function validateCreateBody(body) {
  const title = trimString(body?.title);
  if (!title) {
    return { ok: false, message: "title is required" };
  }

  const allDay = body?.allDay;
  if (typeof allDay !== "boolean") {
    return { ok: false, message: "allDay must be a boolean" };
  }

  const startRaw = parseDateTime(body?.startAt);
  const endRaw = parseDateTime(body?.endAt);
  if (!startRaw) {
    return { ok: false, message: "startAt must be a valid date" };
  }
  if (!endRaw) {
    return { ok: false, message: "endAt must be a valid date" };
  }

  const { startAt, endAt } = normalizeAllDayRange(allDay, startRaw, endRaw);
  if (endAt < startAt) {
    return { ok: false, message: "endAt must be on or after startAt" };
  }

  const description = trimString(body?.description);
  const mbti = trimString(body?.mbti);
  const planningNote = trimString(body?.planningNote);

  return {
    ok: true,
    value: {
      title,
      description: description === undefined ? undefined : description || null,
      startAt,
      endAt,
      allDay,
      mbti: mbti === undefined ? undefined : mbti || null,
      planningNote: planningNote === undefined ? undefined : planningNote || null,
    },
  };
}

/**
 * @param {Record<string, unknown>} body
 * @returns {{ ok: true, value: object } | { ok: false, message: string }}
 */
export function validatePatchBody(body) {
  const patch = {};

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    const title = trimString(body.title);
    if (!title) {
      return { ok: false, message: "title cannot be empty" };
    }
    patch.title = title;
  }

  if (Object.prototype.hasOwnProperty.call(body, "description")) {
    const d = trimString(body.description);
    patch.description = d === undefined ? null : d || null;
  }

  if (Object.prototype.hasOwnProperty.call(body, "allDay")) {
    if (typeof body.allDay !== "boolean") {
      return { ok: false, message: "allDay must be a boolean" };
    }
    patch.allDay = body.allDay;
  }

  if (Object.prototype.hasOwnProperty.call(body, "mbti")) {
    const m = trimString(body.mbti);
    patch.mbti = m === undefined ? null : m || null;
  }

  if (Object.prototype.hasOwnProperty.call(body, "planningNote")) {
    const p = trimString(body.planningNote);
    patch.planningNote = p === undefined ? null : p || null;
  }

  let startAt = null;
  let endAt = null;
  if (Object.prototype.hasOwnProperty.call(body, "startAt")) {
    startAt = parseDateTime(body.startAt);
    if (!startAt) {
      return { ok: false, message: "startAt must be a valid date" };
    }
    patch.startAt = startAt;
  }
  if (Object.prototype.hasOwnProperty.call(body, "endAt")) {
    endAt = parseDateTime(body.endAt);
    if (!endAt) {
      return { ok: false, message: "endAt must be a valid date" };
    }
    patch.endAt = endAt;
  }

  if (Object.keys(patch).length === 0) {
    return { ok: false, message: "no valid fields to update" };
  }

  return { ok: true, value: patch };
}

/**
 * @param {import('express').Request['query']} query
 */
export function parseListRange(query) {
  const startQ = query?.start;
  const endQ = query?.end;
  const hasStart = startQ !== undefined && String(startQ).trim() !== "";
  const hasEnd = endQ !== undefined && String(endQ).trim() !== "";

  if (hasStart !== hasEnd) {
    return { ok: false, message: "start and end must both be provided for date range filtering" };
  }

  if (!hasStart && !hasEnd) {
    return { ok: true, range: null };
  }

  const rangeStart = parseDateTime(startQ);
  const rangeEnd = parseDateTime(endQ);
  if (!rangeStart || !rangeEnd) {
    return { ok: false, message: "start and end must be valid dates" };
  }
  if (rangeEnd < rangeStart) {
    return { ok: false, message: "end must be on or after start" };
  }

  return { ok: true, range: { start: rangeStart, end: rangeEnd } };
}

/**
 * Default UTC window for recommendations: today 00:00 UTC through +28 days 23:59:59.999 UTC.
 * @returns {{ start: Date, end: Date }}
 */
export function defaultRecommendRange() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 28);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * @param {Record<string, unknown>} body
 * @returns {{ ok: true, value: { range: { start: Date, end: Date }, topic: string | null } } | { ok: false, message: string }}
 */
export function validateRecommendBody(body) {
  const topicRaw = body?.topic;
  const topic =
    typeof topicRaw === "string" && topicRaw.trim() ? topicRaw.trim().slice(0, 500) : null;

  const rs = body?.rangeStart;
  const re = body?.rangeEnd;
  const hasRs = rs !== undefined && String(rs).trim() !== "";
  const hasRe = re !== undefined && String(re).trim() !== "";

  if (hasRs !== hasRe) {
    return {
      ok: false,
      message: "rangeStart and rangeEnd must both be provided when customizing the range",
    };
  }

  if (!hasRs && !hasRe) {
    const range = defaultRecommendRange();
    if (range.end < range.start) {
      return { ok: false, message: "invalid default recommend range" };
    }
    return { ok: true, value: { range, topic } };
  }

  const rangeStart = parseDateTime(rs);
  const rangeEnd = parseDateTime(re);
  if (!rangeStart || !rangeEnd) {
    return { ok: false, message: "rangeStart and rangeEnd must be valid dates" };
  }
  if (rangeEnd < rangeStart) {
    return { ok: false, message: "rangeEnd must be on or after rangeStart" };
  }

  return { ok: true, value: { range: { start: rangeStart, end: rangeEnd }, topic } };
}
