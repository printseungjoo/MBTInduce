import { prisma } from "../lib/prisma.js";

function mapChatMessage(row) {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
    rate: row.rate ?? null,
  };
}

function mapSimulationScenario(row) {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapInfo(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    mbti: row.mbti,
  };
}

export async function listChatMessages(userId) {
  const rows = await prisma.simulationChatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapChatMessage);
}

export async function createChatMessage(userId, payload) {
  const row = await prisma.simulationChatMessage.create({
    data: {
      userId,
      role: payload.role,
      content: payload.content,
      rate: typeof payload.rate === "number" ? payload.rate : null,
    },
  });
  return mapChatMessage(row);
}

export async function patchChatMessageRate(userId, id, payload) {
  const row = await prisma.simulationChatMessage.findFirst({ where: { id, userId } });
  if (!row) return null;

  const updated = await prisma.simulationChatMessage.update({
    where: { id },
    data: {
      rate: typeof payload.rate === "number" ? payload.rate : row.rate,
    },
  });
  return mapChatMessage(updated);
}

export async function deleteChatMessage(userId, id) {
  const row = await prisma.simulationChatMessage.findFirst({ where: { id, userId } });
  if (!row) return false;
  await prisma.simulationChatMessage.delete({ where: { id } });
  return true;
}

export async function listSimulationScenarios(userId) {
  const rows = await prisma.simulationTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapSimulationScenario);
}

export async function createSimulationScenario(userId, content) {
  const row = await prisma.simulationTemplate.create({
    data: { userId, content },
  });
  return mapSimulationScenario(row);
}

export async function deleteSimulationScenario(userId, id) {
  const row = await prisma.simulationTemplate.findFirst({ where: { id, userId } });
  if (!row) return false;
  await prisma.simulationTemplate.delete({ where: { id } });
  return true;
}

async function getLatestInfo(userId, meOrNot) {
  const row = await prisma.userProfile.findFirst({
    where: { userId, meOrNot },
    orderBy: { updatedAt: "desc" },
  });
  return mapInfo(row);
}

async function saveInfo(userId, payload, meOrNot) {
  const existing = await prisma.userProfile.findFirst({
    where: { userId, meOrNot },
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    const updated = await prisma.userProfile.update({
      where: { id: existing.id },
      data: {
        name: payload.name,
        mbti: String(payload.mbti).toUpperCase(),
      },
    });
    return mapInfo(updated);
  }

  const created = await prisma.userProfile.create({
    data: {
      userId,
      name: payload.name,
      mbti: String(payload.mbti).toUpperCase(),
      meOrNot,
    },
  });
  return mapInfo(created);
}

export async function getUserInfo(userId) {
  return getLatestInfo(userId, true);
}

export async function postUserInfo(userId, payload) {
  return saveInfo(userId, payload, true);
}

export async function getTargetInfo(userId) {
  return getLatestInfo(userId, false);
}

export async function postTargetInfo(userId, payload) {
  return saveInfo(userId, payload, false);
}
