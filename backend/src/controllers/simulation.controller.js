import {
  createChatMessage,
  createSimulationTemplate,
  createUserProfile,
  deleteChatMessage,
  deleteSimulationTemplate,
  deleteUserProfile,
  getChatMessageList,
  getSimulationTemplateList,
  patchSimulationTemplate,
  patchUserProfile,
  getUserProfiles,
  patchChatMessage,
} from "../services/simulation.service.js";

function isValidRole(value) {
  return value === "user" || value === "ai";
}

export async function getSimulationTemplate(req, res, next) {
  try {
    const simulationTemplate = await getSimulationTemplateList(req.user.id);
    return res.status(200).json({ simulationTemplate });
  } catch (error) {
    next(error);
  }
}

export async function postSimulationTemplate(req, res, next) {
  try {
    const content = req.body?.content;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" });
    }

    const simulationTemplate = await createSimulationTemplate(req.user.id, content);
    return res.status(201).json({ simulationTemplate });
  } catch (error) {
    next(error);
  }
}

export async function removeSimulationTemplate(req, res, next) {
  try {
    const removed = await deleteSimulationTemplate(req.user.id, req.params.id);
    if (!removed) return res.status(404).json({ message: "simulationTemplate not found" });
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function patchSimulationTemplateHandler(req, res, next) {
  try {
    const { content } = req.body || {};
    if (content !== undefined && (typeof content !== "string" || !content.trim())) {
      return res.status(400).json({ message: "content must be non-empty string" });
    }

    const simulationTemplate = await patchSimulationTemplate(req.user.id, req.params.id, req.body || {});
    if (!simulationTemplate) return res.status(404).json({ message: "simulationTemplate not found" });
    return res.status(200).json({ simulationTemplate });
  } catch (error) {
    next(error);
  }
}

export async function getUserProfilesHandler(req, res, next) {
  try {
    const userProfiles = await getUserProfiles(req.user.id);
    return res.status(200).json({ userProfiles });
  } catch (error) {
    next(error);
  }
}

export async function postUserProfiles(req, res, next) {
  try {
    const { name, meOrNot, mbti } = req.body || {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    if (typeof meOrNot !== "boolean") {
      return res.status(400).json({ message: "meOrNot must be boolean" });
    }
    if (!mbti || typeof mbti !== "string") {
      return res.status(400).json({ message: "mbti is required" });
    }

    const userProfiles = await createUserProfile(req.user.id, { name, meOrNot, mbti });
    return res.status(201).json({ userProfiles });
  } catch (error) {
    next(error);
  }
}

export async function removeUserProfiles(req, res, next) {
  try {
    const removed = await deleteUserProfile(req.user.id, req.params.id);
    if (!removed) return res.status(404).json({ message: "userProfiles not found" });
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function patchUserProfiles(req, res, next) {
  try {
    const { name, meOrNot, mbti } = req.body || {};
    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({ message: "name must be non-empty string" });
    }
    if (meOrNot !== undefined && typeof meOrNot !== "boolean") {
      return res.status(400).json({ message: "meOrNot must be boolean" });
    }
    if (
      mbti !== undefined &&
      (typeof mbti !== "string" || !mbti.trim())
    ) {
      return res.status(400).json({ message: "mbti must be non-empty string" });
    }

    const userProfiles = await patchUserProfile(req.user.id, req.params.id, req.body || {});
    if (!userProfiles) return res.status(404).json({ message: "userProfiles not found" });
    return res.status(200).json({ userProfiles });
  } catch (error) {
    next(error);
  }
}

export async function getChatMessage(req, res, next) {
  try {
    const chatMessage = await getChatMessageList(req.user.id);
    return res.status(200).json({ chatMessage });
  } catch (error) {
    next(error);
  }
}

export async function postChatMessage(req, res, next) {
  try {
    const { role, content, mbtiRange, rate } = req.body || {};
    if (!isValidRole(role)) {
      return res.status(400).json({ message: "role must be 'user' or 'ai'" });
    }
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" });
    }
    if (!mbtiRange || typeof mbtiRange !== "object") {
      return res.status(400).json({ message: "mbtiRange is required" });
    }

    const chatMessage = await createChatMessage(req.user.id, { role, content, mbtiRange, rate });
    return res.status(201).json({ chatMessage });
  } catch (error) {
    next(error);
  }
}

export async function patchChatMessageHandler(req, res, next) {
  try {
    const { role } = req.body || {};
    if (role !== undefined && !isValidRole(role)) {
      return res.status(400).json({ message: "role must be 'user' or 'ai'" });
    }

    const chatMessage = await patchChatMessage(req.user.id, req.params.id, req.body || {});
    if (!chatMessage) return res.status(404).json({ message: "chatMessage not found" });
    return res.status(200).json({ chatMessage });
  } catch (error) {
    next(error);
  }
}

export async function removeChatMessage(req, res, next) {
  try {
    const removed = await deleteChatMessage(req.user.id, req.params.id);
    if (!removed) return res.status(404).json({ message: "chatMessage not found" });
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}
