import { prisma } from "../lib/prisma.js";

function mbtiToInstruction(mbti) {
  const parts = [];
  if (!mbti) return "Use a balanced and helpful tone.";

  parts.push(mbti.energy === "I" ? "Respond with a reflective tone." : "Respond with energetic tone.");
  parts.push(mbti.information === "N" ? "Focus on abstract possibilities." : "Focus on concrete details.");
  parts.push(mbti.decision === "F" ? "Include empathy and emotional context." : "Prioritize logical clarity.");
  parts.push(mbti.lifestyle === "P" ? "Allow flexible suggestions." : "Provide structured steps.");
  return parts.join(" ");
}

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

export async function postMessage(req, res, next) {
  try {
    const sessionId = req.params.id;
    const content = req.body?.content;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" });
    }

    const chatSession = await ensureSessionOwner(sessionId, req.user.id);
    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    const mbti = await prisma.mbtiPreference.findUnique({
      where: { userId: req.user.id },
    });

    const instruction = mbtiToInstruction(mbti);

    const userMessage = await prisma.message.create({
      data: {
        chatSessionId: sessionId,
        role: "USER",
        content,
      },
    });

    const assistantReplyText = `[MBTI 적용 응답] ${instruction} | 사용자 입력: ${content}`;
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

    return res.status(201).json({
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    next(error);
  }
}
