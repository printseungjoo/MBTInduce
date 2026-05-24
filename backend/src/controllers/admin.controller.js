import {
  QuestionTemplateKind,
  createQuestionTemplateByKind,
  deleteQuestionTemplateByKind,
  getAdminStatistics,
  listAdminFeedback,
  listQuestionTemplatesByKind,
  updateQuestionTemplateByKind,
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

function notFoundMessageForKind(kind) {
  return kind === QuestionTemplateKind.SIMULATION
    ? "Simulation question template not found"
    : "Main chat question template not found";
}

function createQuestionTemplateHandlers(kind) {
  const notFoundMessage = notFoundMessageForKind(kind);

  return {
    async list(req, res, next) {
      try {
        const data = await listQuestionTemplatesByKind(kind);
        return ok(res, 200, data);
      } catch (err) {
        next(err);
      }
    },

    async create(req, res, next) {
      try {
        const parsed = validateQuestionTemplateCreateBody(req.body);
        if (!parsed.ok) {
          return fail(res, 400, parsed.message);
        }

        const data = await createQuestionTemplateByKind(kind, parsed.value, req.user.id);
        return ok(res, 201, data);
      } catch (err) {
        next(err);
      }
    },

    async patch(req, res, next) {
      try {
        const parsed = validateQuestionTemplatePatchBody(req.body);
        if (!parsed.ok) {
          return fail(res, 400, parsed.message);
        }

        const data = await updateQuestionTemplateByKind(req.params.id, kind, parsed.value);
        if (!data) {
          return fail(res, 404, notFoundMessage);
        }
        return ok(res, 200, data);
      } catch (err) {
        if (isNotFoundError(err)) {
          return fail(res, 404, notFoundMessage);
        }
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const deleted = await deleteQuestionTemplateByKind(req.params.id, kind);
        if (!deleted) {
          return fail(res, 404, notFoundMessage);
        }
        return ok(res, 200, { id: req.params.id });
      } catch (err) {
        if (isNotFoundError(err)) {
          return fail(res, 404, notFoundMessage);
        }
        next(err);
      }
    },
  };
}

const mainChatQuestionTemplateHandlers = createQuestionTemplateHandlers(
  QuestionTemplateKind.MAIN_CHAT
);
const simulationQuestionTemplateHandlers = createQuestionTemplateHandlers(
  QuestionTemplateKind.SIMULATION
);

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

export const listMainChatQuestionTemplatesHandler = mainChatQuestionTemplateHandlers.list;
export const createMainChatQuestionTemplateHandler = mainChatQuestionTemplateHandlers.create;
export const patchMainChatQuestionTemplateHandler = mainChatQuestionTemplateHandlers.patch;
export const deleteMainChatQuestionTemplateHandler = mainChatQuestionTemplateHandlers.remove;

export const listSimulationQuestionTemplatesHandler = simulationQuestionTemplateHandlers.list;
export const createSimulationQuestionTemplateHandler = simulationQuestionTemplateHandlers.create;
export const patchSimulationQuestionTemplateHandler = simulationQuestionTemplateHandlers.patch;
export const deleteSimulationQuestionTemplateHandler = simulationQuestionTemplateHandlers.remove;

/** @deprecated Alias for main chat templates */
export const listQuestionTemplatesHandler = listMainChatQuestionTemplatesHandler;
/** @deprecated Alias for main chat templates */
export const createQuestionTemplateHandler = createMainChatQuestionTemplateHandler;
/** @deprecated Alias for main chat templates */
export const patchQuestionTemplateHandler = patchMainChatQuestionTemplateHandler;
/** @deprecated Alias for main chat templates */
export const deleteQuestionTemplateHandler = deleteMainChatQuestionTemplateHandler;
