import { prisma } from "../lib/prisma.js";
import { normalizeAllDayRange } from "../validators/calendarEventValidator.js";

const LIST_LIMIT = 500;

function mapRow(e) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    startAt: e.startAt.toISOString(),
    endAt: e.endAt.toISOString(),
    allDay: e.allDay,
    mbti: e.mbti,
    planningNote: e.planningNote,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

/**
 * @param {string} userId
 * @param {{ start: Date, end: Date } | null} range
 * @param {string | undefined} view
 */
export async function listCalendarEvents(userId, range, view) {
  const where = {
    userId,
    ...(range
      ? {
          AND: [{ startAt: { lte: range.end } }, { endAt: { gte: range.start } }],
        }
      : {}),
  };

  const rows = await prisma.calendarEvent.findMany({
    where,
    orderBy: { startAt: "asc" },
    take: LIST_LIMIT,
  });

  return {
    events: rows.map(mapRow),
    view: view || null,
  };
}

export async function getCalendarEventById(userId, id) {
  const row = await prisma.calendarEvent.findFirst({
    where: { id, userId },
  });
  return row ? mapRow(row) : null;
}

export async function createCalendarEvent(userId, data) {
  const row = await prisma.calendarEvent.create({
    data: {
      userId,
      title: data.title,
      description: data.description ?? null,
      startAt: data.startAt,
      endAt: data.endAt,
      allDay: data.allDay,
      mbti: data.mbti ?? null,
      planningNote: data.planningNote ?? null,
    },
  });
  return mapRow(row);
}

export async function updateCalendarEvent(userId, id, patch) {
  const existing = await prisma.calendarEvent.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return null;
  }

  let nextStart = patch.startAt ?? existing.startAt;
  let nextEnd = patch.endAt ?? existing.endAt;
  const nextAllDay = patch.allDay ?? existing.allDay;

  if (nextAllDay) {
    const n = normalizeAllDayRange(true, nextStart, nextEnd);
    nextStart = n.startAt;
    nextEnd = n.endAt;
  }

  if (nextEnd < nextStart) {
    const err = new Error("endAt must be on or after startAt");
    err.statusCode = 400;
    throw err;
  }

  const data = {
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
    ...(patch.allDay !== undefined ? { allDay: patch.allDay } : {}),
    ...(patch.mbti !== undefined ? { mbti: patch.mbti } : {}),
    ...(patch.planningNote !== undefined ? { planningNote: patch.planningNote } : {}),
  };

  const startChanged = patch.startAt !== undefined || patch.allDay !== undefined;
  const endChanged = patch.endAt !== undefined || patch.allDay !== undefined;
  if (startChanged) {
    data.startAt = nextStart;
  }
  if (endChanged) {
    data.endAt = nextEnd;
  }

  const row = await prisma.calendarEvent.update({
    where: { id },
    data,
  });
  return mapRow(row);
}

export async function deleteCalendarEvent(userId, id) {
  const existing = await prisma.calendarEvent.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return false;
  }
  await prisma.calendarEvent.delete({ where: { id } });
  return true;
}
