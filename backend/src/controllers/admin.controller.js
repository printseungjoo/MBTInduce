import {
  createQuestionTemplate,
  deleteQuestionTemplate,
  getAdminStatistics,
  listAdminFeedback,
  listQuestionTemplates,
  updateQuestionTemplate,
} from "../services/admin.service.js";
import {
  parseFeedbackListQuery,
  validateQuestionTemplateCreateBody,
  validateQuestionTemplatePatchBody,
} from "../validators/admin.validator.js";

function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function ok(res, status, data) {
  return res.status(status).json({ success: true, data });
}

function isNotFoundError(err) {
  return err && err.code === "P2025";
}

export async function getStatisticsHandler(req, res, next) {
  try {
    const data = await getAdminStatistics();
    return ok(res, 200, data);
  } catch (err) {
    next(err);
  }
}

export async function listFeedbackHandler(req, res, next) {
  try {
    const parsed = parseFeedbackListQuery(req.query);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }

    const data = await listAdminFeedback(parsed.value);
    return ok(res, 200, data);
  } catch (err) {
    next(err);
  }
}

export async function listQuestionTemplatesHandler(req, res, next) {
  try {
    const data = await listQuestionTemplates();
    return ok(res, 200, data);
  } catch (err) {
    next(err);
  }
}

export async function createQuestionTemplateHandler(req, res, next) {
  try {
    const parsed = validateQuestionTemplateCreateBody(req.body);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }

    const data = await createQuestionTemplate(parsed.value, req.user.id);
    return ok(res, 201, data);
  } catch (err) {
    next(err);
  }
}

export async function patchQuestionTemplateHandler(req, res, next) {
  try {
    const parsed = validateQuestionTemplatePatchBody(req.body);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }

    const data = await updateQuestionTemplate(req.params.id, parsed.value);
    return ok(res, 200, data);
  } catch (err) {
    if (isNotFoundError(err)) {
      return fail(res, 404, "Question template not found");
    }
    next(err);
  }
}

export async function deleteQuestionTemplateHandler(req, res, next) {
  try {
    await deleteQuestionTemplate(req.params.id);
    return ok(res, 200, { id: req.params.id });
  } catch (err) {
    if (isNotFoundError(err)) {
      return fail(res, 404, "Question template not found");
    }
    next(err);
  }
}
