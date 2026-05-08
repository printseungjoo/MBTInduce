import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEventById,
  listCalendarEvents,
  updateCalendarEvent,
} from "../services/calendarEventService.js";
import { recommendCalendarEvent } from "../services/calendarRecommend.service.js";
import {
  parseListRange,
  validateCreateBody,
  validatePatchBody,
  validateRecommendBody,
} from "../validators/calendarEventValidator.js";

function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function ok(res, status, data) {
  return res.status(status).json({ success: true, data });
}

export async function listCalendarEventsHandler(req, res, next) {
  try {
    const parsed = parseListRange(req.query);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }
    const payload = await listCalendarEvents(req.user.id, parsed.range, req.query?.view);
    return ok(res, 200, payload);
  } catch (err) {
    next(err);
  }
}

export async function getCalendarEventHandler(req, res, next) {
  try {
    const event = await getCalendarEventById(req.user.id, req.params.id);
    if (!event) {
      return fail(res, 404, "Event not found");
    }
    return ok(res, 200, { event });
  } catch (err) {
    next(err);
  }
}

export async function postCalendarEventHandler(req, res, next) {
  try {
    const validated = validateCreateBody(req.body || {});
    if (!validated.ok) {
      return fail(res, 400, validated.message);
    }
    const event = await createCalendarEvent(req.user.id, validated.value);
    return ok(res, 201, { event });
  } catch (err) {
    next(err);
  }
}

export async function patchCalendarEventHandler(req, res, next) {
  try {
    const validated = validatePatchBody(req.body || {});
    if (!validated.ok) {
      return fail(res, 400, validated.message);
    }
    const event = await updateCalendarEvent(req.user.id, req.params.id, validated.value);
    if (!event) {
      return fail(res, 404, "Event not found");
    }
    return ok(res, 200, { event });
  } catch (err) {
    if (err.statusCode === 400) {
      return fail(res, 400, err.message);
    }
    next(err);
  }
}

export async function deleteCalendarEventHandler(req, res, next) {
  try {
    const removed = await deleteCalendarEvent(req.user.id, req.params.id);
    if (!removed) {
      return fail(res, 404, "Event not found");
    }
    return ok(res, 200, { id: req.params.id });
  } catch (err) {
    next(err);
  }
}

/**
 * Uses GPT (default gpt-4o-mini) with current events in range; picks an empty UTC day if any,
 * otherwise the UTC day with the fewest events; returns a JSON suggestion for that day.
 */
export async function postCalendarRecommendHandler(req, res, next) {
  try {
    const parsed = validateRecommendBody(req.body || {});
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }
    const data = await recommendCalendarEvent(req.user.id, parsed.value);
    return ok(res, 200, data);
  } catch (err) {
    if (err.statusCode === 400) {
      return fail(res, 400, err.message);
    }
    next(err);
  }
}
