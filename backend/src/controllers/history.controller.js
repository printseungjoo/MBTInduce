import {
  createHistoryRecord,
  deleteHistoryRecord,
  getHistoryRecordById,
  listHistoryRecords,
} from "../services/history.service.js";
import { parseHistoryListQuery, validateHistoryCreateBody } from "../validators/history.validator.js";

function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function ok(res, status, data) {
  return res.status(status).json({ success: true, data });
}

export async function listHistoryHandler(req, res, next) {
  try {
    const parsed = parseHistoryListQuery(req.query);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }
    const data = await listHistoryRecords(req.user.id, parsed.value);
    return ok(res, 200, data);
  } catch (err) {
    next(err);
  }
}

export async function getHistoryHandler(req, res, next) {
  try {
    const row = await getHistoryRecordById(req.user.id, req.params.id);
    if (!row) {
      return fail(res, 404, "History record not found");
    }
    return ok(res, 200, row);
  } catch (err) {
    next(err);
  }
}

export async function postHistoryHandler(req, res, next) {
  try {
    const parsed = validateHistoryCreateBody(req.body);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }
    const data = await createHistoryRecord(req.user.id, parsed.value);
    return ok(res, 201, data);
  } catch (err) {
    if (err.statusCode) {
      return fail(res, err.statusCode, err.message);
    }
    next(err);
  }
}

export async function deleteHistoryHandler(req, res, next) {
  try {
    const deleted = await deleteHistoryRecord(req.user.id, req.params.id);
    if (!deleted) {
      return fail(res, 404, "History record not found");
    }
    return ok(res, 200, null);
  } catch (err) {
    next(err);
  }
}
