import { prisma } from "../lib/prisma.js";
import { postMessageCore } from "./chat.controller.js";

const MAIN_SESSION_TITLE = "Main Chat";

function getChatSessionTitle(pageType, simulationKey) {
  if (pageType === "simulation") {
    return `simulation:${simulationKey}`;
  }
}

async function getOrCreateChatSession(userId, pageType, simulationKey) {
  const title = getChatSessionTitle(pageType, simulationKey);
  let session = await prisma.chatSession.findFirst({
    where: { userId, title, isArchived: false },
    orderBy: { updatedAt: "desc" },
  });
  if (!session) {
    session = await prisma.chatSession.create({
      data: { userId, title },
    });
  }
  return session;
}

function mbtiRangeFromPreference(mbti) {
  if (!mbti || typeof mbti.energyWeight !== "number") {
    return { eValue: 50, sValue: 50, fValue: 50, pValue: 50 };
  }
  return {
    eValue: mbti.energyWeight,
    sValue: mbti.informationWeight,
    fValue: mbti.decisionWeight,
    pValue: mbti.lifestyleWeight,
  };
}

async function loadLatestRatingsByMessageId(userId, messageIds) {
  if (messageIds.length === 0) return new Map();
  const rows = await prisma.responseRating.findMany({
    where: { userId, messageId: { in: messageIds } },
    orderBy: { createdAt: "desc" },
  });
  const map = new Map();
  for (const r of rows) {
    if (r.messageId && !map.has(r.messageId)) {
      map.set(r.messageId, r.score);
    }
  }
  return map;
}

function mapMessagesToFrontendShape(messages, mbtiRange, ratingByMessageId) {
  return messages.map((m) => {
    const role = m.role === "USER" ? "user" : m.role === "ASSISTANT" ? "ai" : "ai";
    const rate = ratingByMessageId.get(m.id);
    return {
      id: m.id,
      role,
      content: m.content,
      mbtiRange: { ...mbtiRange },
      createdAt: m.createdAt.toISOString(),
      ...(typeof rate === "number" ? { rate } : {}),
    };
  });
}

async function buildFrontendChatArray(userId, sessionId) {
  const [messages, mbti] = await Promise.all([
    prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.mbtiPreference.findUnique({ where: { userId } }),
  ]);
  const mbtiRange = mbtiRangeFromPreference(mbti);
  const ids = messages.map((m) => m.id);
  const ratingByMessageId = await loadLatestRatingsByMessageId(userId, ids);
  return mapMessagesToFrontendShape(messages, mbtiRange, ratingByMessageId);
}

/**
 * GET /api/chat — 프론트 FullMainScreen: ChatMessage[]
 */
export async function getMainChatFlat(req, res, next) {
  try {
    const pageType = req.query.pageType || "main";
    const simulationKey = req.query.simulationKey || "";
    const session = await getOrCreateChatSession(
      req.user.id,
      pageType,
      simulationKey
    );
    const payload = await buildFrontendChatArray(req.user.id, session.id);
    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chat — 프론트 FullMainScreen: body { content, role?, mbtiRange? } → ChatMessage[]
 */
export async function postMainChatFlat(req, res, next) {
  try {
    const pageType = req.body?.pageType || "main";
    const simulationKey = req.body?.simulationKey || "";
    const session = await getOrCreateChatSession(
      req.user.id,
      pageType,
      simulationKey
    );
    await postMessageCore(req.user.id, session.id, req.body || {});
    const payload = await buildFrontendChatArray(req.user.id, session.id);
    return res.status(200).json(payload);
  } catch (error) {
    if (error && typeof error.status === "number" && error.message) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
}

/**
 * PATCH /api/chat/:messageId — 프론트: body { rate } (1–5)
 */
export async function patchMainChatMessageRate(req, res, next) {
  try {
    const messageId = req.params.messageId;
    const rate = req.body?.rate ?? req.body?.score;
    if (typeof rate !== "number" || !Number.isInteger(rate) || rate < 1 || rate > 5) {
      return res.status(400).json({ message: "rate must be an integer 1–5" });
    }

    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        chatSession: { userId: req.user.id },
      },
      include: { chatSession: true },
    });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.role !== "ASSISTANT") {
      return res.status(400).json({ message: "Only assistant messages can be rated" });
    }

    const existing = await prisma.responseRating.findFirst({
      where: { userId: req.user.id, messageId },
      orderBy: { createdAt: "desc" },
    });
    if (existing) {
      await prisma.responseRating.update({
        where: { id: existing.id },
        data: { score: rate },
      });
    } else {
      await prisma.responseRating.create({
        data: {
          userId: req.user.id,
          chatSessionId: message.chatSessionId,
          messageId,
          score: rate,
        },
      });
    }

    const payload = await buildFrontendChatArray(req.user.id, message.chatSessionId);
    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
}