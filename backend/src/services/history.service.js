import { prisma } from "../lib/prisma.js";

function listSelectShape(row) {
  return {
    id: row.id,
    chatSessionId: row.chatSessionId,
    title: row.title,
    preview: row.preview,
    mbti: row.mbti,
    sourceType: row.sourceType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listHistoryRecords(userId, filters) {
  const { mbti, sourceType, search, limit, page } = filters;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(mbti ? { mbti } : {}),
    ...(sourceType ? { sourceType } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { preview: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const rows = await prisma.historyRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    select: {
      id: true,
      chatSessionId: true,
      title: true,
      preview: true,
      mbti: true,
      sourceType: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return rows.map(listSelectShape);
}

export async function getHistoryRecordById(userId, id) {
  const row = await prisma.historyRecord.findFirst({
    where: { id, userId },
  });
  if (!row) return null;
  return {
    id: row.id,
    chatSessionId: row.chatSessionId,
    title: row.title,
    preview: row.preview,
    content: row.content,
    mbti: row.mbti,
    sourceType: row.sourceType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createHistoryRecord(userId, payload) {
  if (payload.chatSessionId) {
    const ownedSession = await prisma.chatSession.findFirst({
      where: { id: payload.chatSessionId, userId },
      select: { id: true },
    });
    if (!ownedSession) {
      const err = new Error("Chat session not found");
      err.statusCode = 404;
      throw err;
    }
  }

  const row = await prisma.historyRecord.create({
    data: {
      userId,
      chatSessionId: payload.chatSessionId,
      title: payload.title,
      content: payload.content,
      preview: payload.preview,
      mbti: payload.mbti,
      sourceType: payload.sourceType,
    },
  });
  return listSelectShape(row);
}

export async function deleteHistoryRecord(userId, id) {
  const result = await prisma.historyRecord.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
