import {
  createChatMessage,
  createSimulationScenario,
  deleteChatMessage,
  deleteSimulationScenario,
  getTargetInfo,
  getUserInfo,
  listChatMessages,
  listSimulationScenarios,
  patchChatMessageRate,
  postTargetInfo,
  postUserInfo,
} from "../services/simulationPage.service.js";

function isValidRole(value) {
  return value === "user" || value === "ai";
}

export async function getChatMessageHandler(req, res, next) {
  try {
    const chatMessage = await listChatMessages(req.user.id);
    return res.status(200).json({ chatMessage });
  } catch (error) {
    next(error);
  }
}

export async function postChatMessageHandler(req, res, next) {
  try {
    const { role, content, rate } = req.body || {};
    if (!isValidRole(role)) {
      return res.status(400).json({ message: "role must be 'user' or 'ai'" });
    }
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" });
    }
    if (rate !== undefined && typeof rate !== "number") {
      return res.status(400).json({ message: "rate must be number" });
    }

    const chatMessage = await createChatMessage(req.user.id, { role, content, rate });
    return res.status(201).json({ chatMessage });
  } catch (error) {
    next(error);
  }
}

export async function patchChatMessageHandler(req, res, next) {
  try {
    const { rate } = req.body || {};
    if (rate !== undefined && typeof rate !== "number") {
      return res.status(400).json({ message: "rate must be number" });
    }

    const chatMessage = await patchChatMessageRate(req.user.id, req.params.id, { rate });
    if (!chatMessage) return res.status(404).json({ message: "chatMessage not found" });
    return res.status(200).json({ chatMessage });
  } catch (error) {
    next(error);
  }
}

export async function removeChatMessageHandler(req, res, next) {
  try {
    const removed = await deleteChatMessage(req.user.id, req.params.id);
    if (!removed) return res.status(404).json({ message: "chatMessage not found" });
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function getSimulationScenarioHandler(req, res, next) {
  try {
    const simulationScenario = await listSimulationScenarios(req.user.id);
    return res.status(200).json({ simulationScenario });
  } catch (error) {
    next(error);
  }
}

export async function postSimulationScenarioHandler(req, res, next) {
  try {
    const content = req.body?.content;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" });
    }

    const simulationScenario = await createSimulationScenario(req.user.id, content);
    return res.status(201).json({ simulationScenario });
  } catch (error) {
    next(error);
  }
}

export async function removeSimulationScenarioHandler(req, res, next) {
  try {
    const removed = await deleteSimulationScenario(req.user.id, req.params.id);
    if (!removed) return res.status(404).json({ message: "simulationScenario not found" });
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}

function validateInfoPayload(payload) {
  if (!payload || typeof payload !== "object") return "payload is required";
  if (!payload.name || typeof payload.name !== "string") return "name is required";
  if (!payload.mbti || typeof payload.mbti !== "string") return "mbti is required";
  return null;
}

export async function getUserInfoHandler(req, res, next) {
  try {
    const userInfo = await getUserInfo(req.user.id);
    return res.status(200).json({ userInfo });
  } catch (error) {
    next(error);
  }
}

export async function postUserInfoHandler(req, res, next) {
  try {
    const validation = validateInfoPayload(req.body);
    if (validation) return res.status(400).json({ message: validation });

    const userInfo = await postUserInfo(req.user.id, req.body);
    return res.status(201).json({ userInfo });
  } catch (error) {
    next(error);
  }
}

export async function getTargetInfoHandler(req, res, next) {
  try {
    const targetInfo = await getTargetInfo(req.user.id);
    return res.status(200).json({ targetInfo });
  } catch (error) {
    next(error);
  }
}

export async function postTargetInfoHandler(req, res, next) {
  try {
    const validation = validateInfoPayload(req.body);
    if (validation) return res.status(400).json({ message: validation });

    const targetInfo = await postTargetInfo(req.user.id, req.body);
    return res.status(201).json({ targetInfo });
  } catch (error) {
    next(error);
  }
}
