import { prisma } from "../lib/prisma.js";

function clampRange(value, fallback = 50) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function mapTemplate(row) {
  return {
    id: row.id,
    content: row.content,
  };
}

function mapProfile(row) {
  return {
    id: row.id,
    name: row.name,
    meOrNot: row.meOrNot,
    mbti: row.mbti,
  };
}

function mapChatMessage(row) {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    mbtiRange: {
      eValue: row.eValue,
      sValue: row.sValue,
      fValue: row.fValue,
      pValue: row.pValue,
    },
    createdAt: row.createdAt.toISOString(),
    rate: row.rate ?? null,
  };
}

export async function getSimulationTemplateList(userId) {
  const rows = await prisma.simulationTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapTemplate);
}

export async function createSimulationTemplate(userId, content) {
  const row = await prisma.simulationTemplate.create({
    data: { userId, content },
  });
  return mapTemplate(row);
}

export async function deleteSimulationTemplate(userId, id) {
  const row = await prisma.simulationTemplate.findFirst({ where: { id, userId } });
  if (!row) return false;
  await prisma.simulationTemplate.delete({ where: { id } });
  return true;
}

export async function patchSimulationTemplate(userId, id, payload) {
  const row = await prisma.simulationTemplate.findFirst({ where: { id, userId } });
  if (!row) return null;

  const updated = await prisma.simulationTemplate.update({
    where: { id },
    data: {
      content: payload.content ?? undefined,
    },
  });

  return mapTemplate(updated);
}

export async function getUserProfiles(userId) {
  const rows = await prisma.userProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProfile);
}

export async function createUserProfile(userId, payload) {
  const row = await prisma.userProfile.create({
    data: {
      userId,
      name: payload.name,
      meOrNot: Boolean(payload.meOrNot),
      mbti: String(payload.mbti || "").toUpperCase(),
    },
  });
  return mapProfile(row);
}

export async function deleteUserProfile(userId, id) {
  const row = await prisma.userProfile.findFirst({ where: { id, userId } });
  if (!row) return false;
  await prisma.userProfile.delete({ where: { id } });
  return true;
}

export async function patchUserProfile(userId, id, payload) {
  const row = await prisma.userProfile.findFirst({ where: { id, userId } });
  if (!row) return null;

  const updated = await prisma.userProfile.update({
    where: { id },
    data: {
      name: payload.name ?? undefined,
      meOrNot: typeof payload.meOrNot === "boolean" ? payload.meOrNot : undefined,
      mbti: payload.mbti !== undefined ? String(payload.mbti).toUpperCase() : undefined,
    },
  });

  return mapProfile(updated);
}

export async function getChatMessageList(userId) {
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
      eValue: clampRange(payload?.mbtiRange?.eValue),
      sValue: clampRange(payload?.mbtiRange?.sValue),
      fValue: clampRange(payload?.mbtiRange?.fValue),
      pValue: clampRange(payload?.mbtiRange?.pValue),
      rate: typeof payload.rate === "number" ? payload.rate : null,
    },
  });
  return mapChatMessage(row);
}

export async function patchChatMessage(userId, id, payload) {
  const row = await prisma.simulationChatMessage.findFirst({
    where: { id, userId },
  });
  if (!row) return null;

  const updated = await prisma.simulationChatMessage.update({
    where: { id },
    data: {
      role: payload.role ?? undefined,
      content: payload.content ?? undefined,
      eValue:
        payload?.mbtiRange?.eValue !== undefined ? clampRange(payload.mbtiRange.eValue) : undefined,
      sValue:
        payload?.mbtiRange?.sValue !== undefined ? clampRange(payload.mbtiRange.sValue) : undefined,
      fValue:
        payload?.mbtiRange?.fValue !== undefined ? clampRange(payload.mbtiRange.fValue) : undefined,
      pValue:
        payload?.mbtiRange?.pValue !== undefined ? clampRange(payload.mbtiRange.pValue) : undefined,
      rate: typeof payload.rate === "number" ? payload.rate : undefined,
    },
  });

  return mapChatMessage(updated);
}

export async function deleteChatMessage(userId, id) {
  const row = await prisma.simulationChatMessage.findFirst({
    where: { id, userId },
  });
  if (!row) return false;
  await prisma.simulationChatMessage.delete({ where: { id } });
  return true;
}
