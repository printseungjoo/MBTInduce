import { getChatCompletionJson } from "./openAiService.js";
import { listCalendarEvents } from "./calendarEventService.js";
import { normalizeAllDayRange } from "../validators/calendarEventValidator.js";

/**
 * @param {Date} d
 * @returns {string} YYYY-MM-DD (UTC calendar day)
 */
function utcDayKey(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 * @returns {Date[]}
 */
function eachUtcDayInclusive(rangeStart, rangeEnd) {
  const days = [];
  let cur = new Date(
    Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth(), rangeStart.getUTCDate(), 0, 0, 0, 0)
  );
  const endTs = Date.UTC(
    rangeEnd.getUTCFullYear(),
    rangeEnd.getUTCMonth(),
    rangeEnd.getUTCDate(),
    23,
    59,
    59,
    999
  );
  while (cur.getTime() <= endTs) {
    days.push(new Date(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

/**
 * @param {string} isoStart
 * @param {string} isoEnd
 * @param {Date} day
 */
function eventOverlapsUtcDay(isoStart, isoEnd, day) {
  const dayStart = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, 0, 0, 0);
  const dayEnd = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 23, 59, 59, 999);
  const es = new Date(isoStart).getTime();
  const ee = new Date(isoEnd).getTime();
  return es <= dayEnd && ee >= dayStart;
}

/**
 * @param {Array<{ startAt: string, endAt: string, title: string }>} events
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 */
function buildUtcDayStats(events, rangeStart, rangeEnd) {
  const days = eachUtcDayInclusive(rangeStart, rangeEnd);
  return days.map((day) => {
    const key = utcDayKey(day);
    const overlapping = events.filter((ev) => eventOverlapsUtcDay(ev.startAt, ev.endAt, day));
    return {
      dayKey: key,
      day,
      count: overlapping.length,
      titles: overlapping.map((e) => e.title),
    };
  });
}

/**
 * @param {ReturnType<typeof buildUtcDayStats>} stats
 */
function pickTargetDay(stats) {
  if (stats.length === 0) {
    return null;
  }
  const empty = stats.filter((s) => s.count === 0);
  if (empty.length > 0) {
    return { dayKey: empty[0].dayKey, day: empty[0].day, count: 0, reason: "empty" };
  }
  const minCount = Math.min(...stats.map((s) => s.count));
  const sparse = stats.find((s) => s.count === minCount);
  return { dayKey: sparse.dayKey, day: sparse.day, count: sparse.count, reason: "sparse" };
}

function utcDayBounds(dayKey) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
  return { start, end };
}

function suggestionWithinDay(dayKey, suggestion) {
  const { start, end } = utcDayBounds(dayKey);
  const s = new Date(suggestion.startAt).getTime();
  const e = new Date(suggestion.endAt).getTime();
  return s >= start.getTime() && e <= end.getTime() && e >= s;
}

function buildFallbackSuggestion(dayKey, topic) {
  const { start, end } = utcDayBounds(dayKey);
  const { startAt, endAt } = normalizeAllDayRange(true, start, end);
  return {
    title: topic || "Recommended calendar block",
    description: null,
    allDay: true,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    mbti: null,
    planningNote: null,
  };
}

/**
 * @param {string} userId
 * @param {{ range: { start: Date, end: Date }, topic: string | null }} input
 */
export async function recommendCalendarEvent(userId, input) {
  const { range, topic } = input;
  const { events } = await listCalendarEvents(userId, { start: range.start, end: range.end }, "recommend");

  const slimEvents = events.map((ev) => ({
    title: ev.title,
    startAt: ev.startAt,
    endAt: ev.endAt,
    allDay: ev.allDay,
  }));

  const stats = buildUtcDayStats(events, range.start, range.end);
  const pick = pickTargetDay(stats);
  if (!pick) {
    const err = new Error("No days in recommend range");
    err.statusCode = 400;
    throw err;
  }

  const payload = {
    topic,
    recommendedDate: pick.dayKey,
    targetReason: pick.reason,
    dayEventCountBefore: pick.count,
    existingEvents: slimEvents,
  };

  const system = [
    "You help users schedule one new calendar event.",
    "You MUST respond with a single JSON object only (no markdown). Keys: title (string), description (string or null),",
    "allDay (boolean), startAt (ISO8601 string), endAt (ISO8601 string), planningNote (string or null, optional).",
    "The event must fall entirely within recommendedDate interpreted as a UTC calendar day (00:00:00.000Z through 23:59:59.999Z that day).",
    "If allDay is true, span the full UTC day. If allDay is false, pick a reasonable 1–2 hour window inside that UTC day.",
    "If the user's topic is in Korean, use Korean for title/description.",
  ].join(" ");

  const userContent = JSON.stringify(payload);

  let raw;
  try {
    raw = await getChatCompletionJson([
      { role: "system", content: system },
      { role: "user", content: userContent },
    ]);
  } catch {
    raw = null;
  }

  let suggestion = raw
    ? {
        title: typeof raw.title === "string" ? raw.title.trim() : "",
        description: typeof raw.description === "string" ? raw.description.trim() : null,
        allDay: raw.allDay === true,
        startAt: typeof raw.startAt === "string" ? raw.startAt.trim() : "",
        endAt: typeof raw.endAt === "string" ? raw.endAt.trim() : "",
        mbti: typeof raw.mbti === "string" ? raw.mbti.trim() : null,
        planningNote: typeof raw.planningNote === "string" ? raw.planningNote.trim() : null,
      }
    : null;

  if (
    !suggestion ||
    !suggestion.title ||
    !suggestion.startAt ||
    !suggestion.endAt ||
    Number.isNaN(new Date(suggestion.startAt).getTime()) ||
    Number.isNaN(new Date(suggestion.endAt).getTime()) ||
    new Date(suggestion.endAt) < new Date(suggestion.startAt) ||
    !suggestionWithinDay(pick.dayKey, suggestion)
  ) {
    suggestion = buildFallbackSuggestion(pick.dayKey, topic);
  }

  return {
    targetReason: pick.reason,
    recommendedDate: pick.dayKey,
    dayEventCountBefore: pick.count,
    range: {
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    },
    suggestion,
  };
}
