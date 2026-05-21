import { prisma } from "../lib/prisma.js";

export const MAIN_SESSION_TITLE = "Main Chat";

export function resolveChatSessionTitle(pageType, simulationKey) {
  if (pageType === "simulation") {
    return `simulation:${simulationKey || ""}`;
  }
  return MAIN_SESSION_TITLE;
}

export async function findActiveChatSession(userId, pageType, simulationKey) {
  if (pageType === "simulation") {
    const title = resolveChatSessionTitle(pageType, simulationKey);
    return prisma.chatSession.findFirst({
      where: { userId, title, isArchived: false },
      orderBy: { updatedAt: "desc" },
    });
  }

  return prisma.chatSession.findFirst({
    where: {
      userId,
      isArchived: false,
      OR: [{ title: MAIN_SESSION_TITLE }, { title: null }],
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function deleteChatSessionById(userId, sessionId) {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return false;

  await prisma.chatSession.delete({ where: { id: sessionId } });
  return true;
}

export async function deleteChatSessionByContext(userId, pageType, simulationKey) {
  const session = await findActiveChatSession(userId, pageType, simulationKey);
  if (!session) return false;

  await prisma.chatSession.delete({ where: { id: session.id } });
  return true;
}

export async function updateChatSessionTitle(userId, sessionId, title) {
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return null;

  return prisma.chatSession.update({
    where: { id: sessionId },
    data: { title },
  });
}
