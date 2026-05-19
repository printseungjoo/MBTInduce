import { prisma } from "../lib/prisma.js";
import { lettersFromWeights, mbtiToWeightedInstruction, normalizeMbtiWeights } from "../lib/mbtiPrompt.js";
import { deleteChatSessionById, updateChatSessionTitle } from "../services/chat.service.js";
import { getChatCompletion } from "../services/openAiService.js";
import { validateChatSessionPatchBody } from "../validators/chat.validator.js";

async function ensureSessionOwner(sessionId, userId) {
  const chatSession = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  });

  return chatSession;
}

export async function listMyChatSessions(req, res, next) {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return res.status(200).json({ sessions });
  } catch (error) {
    next(error);
  }
}

export async function createChatSession(req, res, next) {
  try {
    const title = typeof req.body?.title === "string" ? req.body.title : "New Chat";

    const session = await prisma.chatSession.create({
      data: {
        userId: req.user.id,
        title,
      },
    });

    return res.status(201).json({ session });
  } catch (error) {
    next(error);
  }
}

export async function getChatSessionDetail(req, res, next) {
  try {
    const sessionId = req.params.id;
    const chatSession = await ensureSessionOwner(sessionId, req.user.id);

    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    const messages = await prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ session: chatSession, messages });
  } catch (error) {
    next(error);
  }
}

export async function deleteChatSession(req, res, next) {
  try {
    const deleted = await deleteChatSessionById(req.user.id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Chat session not found" });
    }
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function patchChatSession(req, res, next) {
  try {
    const parsed = validateChatSessionPatchBody(req.body);
    if (!parsed.ok) {
      return res.status(400).json({ message: parsed.message });
    }

    const session = await updateChatSessionTitle(req.user.id, req.params.id, parsed.value.title);
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
}

/**
 * Shared pipeline for POST .../sessions/:id/messages and frontend-compat POST /api/chat.
 * @throws {{ status: number, message: string }}
 */
export async function postMessageCore(userId, sessionId, body = {}) {
  const content = body.content ?? body.text;
  const persistMbtiWeights = body.persistMbtiWeights !== false;

  if (!content || typeof content !== "string") {
    throw { status: 400, message: "content is required" };
  }

  const chatSession = await ensureSessionOwner(sessionId, userId);
  if (!chatSession) {
    throw { status: 404, message: "Chat session not found" };
  }

  let mbti = await prisma.mbtiPreference.findUnique({
    where: { userId },
  });

  const hasInlineWeights =
    (body.mbtiWeights && typeof body.mbtiWeights === "object") ||
    (body.mbtiRange && typeof body.mbtiRange === "object") ||
    typeof body.eValue === "number" ||
    typeof body.sValue === "number" ||
    typeof body.fValue === "number" ||
    typeof body.pValue === "number" ||
    typeof body.energyWeight === "number" ||
    typeof body.informationWeight === "number" ||
    typeof body.decisionWeight === "number" ||
    typeof body.lifestyleWeight === "number";

  if (hasInlineWeights) {
    const baseE = mbti?.energyWeight ?? 50;
    const baseI = mbti?.informationWeight ?? 50;
    const baseD = mbti?.decisionWeight ?? 50;
    const baseL = mbti?.lifestyleWeight ?? 50;

    const nextW = normalizeMbtiWeights({
      energy:
        body.mbtiWeights?.energy ??
        body.mbtiRange?.eValue ??
        body.eValue ??
        body.energyWeight ??
        baseE,
      information:
        body.mbtiWeights?.information ??
        body.mbtiRange?.sValue ??
        body.sValue ??
        body.informationWeight ??
        baseI,
      decision:
        body.mbtiWeights?.decision ??
        body.mbtiRange?.fValue ??
        body.fValue ??
        body.decisionWeight ??
        baseD,
      lifestyle:
        body.mbtiWeights?.lifestyle ??
        body.mbtiRange?.pValue ??
        body.pValue ??
        body.lifestyleWeight ??
        baseL,
    });
    const letters = lettersFromWeights(nextW);

    if (persistMbtiWeights) {
      mbti = await prisma.mbtiPreference.upsert({
        where: { userId },
        update: {
          energyWeight: nextW.energy,
          informationWeight: nextW.information,
          decisionWeight: nextW.decision,
          lifestyleWeight: nextW.lifestyle,
          energy: letters.energy,
          information: letters.information,
          decision: letters.decision,
          lifestyle: letters.lifestyle,
        },
        create: {
          userId,
          energyWeight: nextW.energy,
          informationWeight: nextW.information,
          decisionWeight: nextW.decision,
          lifestyleWeight: nextW.lifestyle,
          energy: letters.energy,
          information: letters.information,
          decision: letters.decision,
          lifestyle: letters.lifestyle,
        },
      });
    } else if (mbti) {
      mbti = {
        ...mbti,
        energy: letters.energy,
        information: letters.information,
        decision: letters.decision,
        lifestyle: letters.lifestyle,
        energyWeight: nextW.energy,
        informationWeight: nextW.information,
        decisionWeight: nextW.decision,
        lifestyleWeight: nextW.lifestyle,
      };
    } else {
      mbti = {
        energy: letters.energy,
        information: letters.information,
        decision: letters.decision,
        lifestyle: letters.lifestyle,
        energyWeight: nextW.energy,
        informationWeight: nextW.information,
        decisionWeight: nextW.decision,
        lifestyleWeight: nextW.lifestyle,
      };
    }
  }

  const instruction = mbtiToWeightedInstruction(mbti);

  const userMessage = await prisma.message.create({
    data: {
      chatSessionId: sessionId,
      role: "USER",
      content,
    },
  });

  const history = await prisma.message.findMany({
    where: { chatSessionId: sessionId },
    orderBy: { createdAt: "asc" },
  });

  const maxTurns = Number(process.env.CHAT_MAX_MESSAGES) || 40;
  const recent = history.length > maxTurns ? history.slice(-maxTurns) : history;

  const systemContent = [
    "You are a helpful assistant in an app called MBTInduce.",
    "Follow the MBTI style guidance below for tone and structure.",
    "Match the user's language (e.g. Korean if they write Korean).",
    "Do not prefix your answer with meta labels like [MBTI 적용 응답]. Answer directly.",
    "",
    instruction,
  ].join("\n");

  const openaiMessages = [
    { role: "system", content: systemContent },
    ...recent.map((m) => ({
      role: m.role === "USER" ? "user" : m.role === "ASSISTANT" ? "assistant" : "system",
      content: m.content,
    })),
  ];

  let assistantReplyText;
  try {
    assistantReplyText = await getChatCompletion(openaiMessages);
  } catch (aiError) {
    assistantReplyText = `[AI 응답 생성 실패] ${aiError?.message || "unknown error"}`;
  }

  const assistantMessage = await prisma.message.create({
    data: {
      chatSessionId: sessionId,
      role: "ASSISTANT",
      content: assistantReplyText,
    },
  });

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: {
      updatedAt: new Date(),
    },
  });

  const appliedMbti =
    mbti && typeof mbti.energyWeight === "number"
      ? {
          energy: mbti.energy,
          information: mbti.information,
          decision: mbti.decision,
          lifestyle: mbti.lifestyle,
          energyWeight: mbti.energyWeight,
          informationWeight: mbti.informationWeight,
          decisionWeight: mbti.decisionWeight,
          lifestyleWeight: mbti.lifestyleWeight,
        }
      : null;

  return {
    userMessage,
    assistantMessage,
    appliedMbti,
  };
}

export async function postMessage(req, res, next) {
  try {
    const result = await postMessageCore(req.user.id, req.params.id, req.body || {});
    return res.status(201).json(result);
  } catch (error) {
    if (error && typeof error.status === "number" && error.message) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
}

export async function postMessageCompat(req, res, next) {
  const sessionId =
    req.params?.id ||
    req.body?.chatSessionId ||
    req.body?.sessionId ||
    req.body?.id;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ message: "chatSessionId or sessionId is required" });
  }

  req.params.id = sessionId;
  return postMessage(req, res, next);
}
