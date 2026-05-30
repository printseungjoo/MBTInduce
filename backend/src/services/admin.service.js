import { prisma } from "../lib/prisma.js";

export const QuestionTemplateKind = {
  MAIN_CHAT: "MAIN_CHAT",
  SIMULATION: "SIMULATION",
};

function mapPromptTemplate(row) {
  return {
    id: row.id,
    category: row.category,
    content: row.content,
    kind: row.kind,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** @param {{ score: number, _count: { score: number } }[]} groups */
function buildRatingCounts(groups) {
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of groups) {
    if (row.score >= 1 && row.score <= 5) {
      ratingCounts[row.score] = row._count.score;
    }
  }
  return ratingCounts;
}

export async function getAdminStatistics() {
  const [
    totalUsers,
    totalQuestions,
    totalRatings,
    avgRatingResult,
    ratingGroups,
    totalChatSessions,
    totalHistoryRecords,
    totalCalendarEvents,
  ] = await Promise.all([
    prisma.user.count({ where: { status: { not: "DELETED" } } }),
    prisma.message.count({ where: { role: "USER" } }),
    prisma.responseRating.count(),
    prisma.responseRating.aggregate({ _avg: { score: true } }),
    prisma.responseRating.groupBy({ by: ["score"], _count: { score: true } }),
    prisma.chatSession.count(),
    prisma.historyRecord.count(),
    prisma.calendarEvent.count(),
  ]);

  const averageRating = Number((avgRatingResult._avg.score ?? 0).toFixed(2));
  const ratingCounts = buildRatingCounts(ratingGroups);

  return {
    totalUsers,
    totalQuestions,
    totalRatings,
    averageRating,
    ratingStatistics: {
      averageRating,
      totalRatings,
      ratingCounts,
    },
    totalChatSessions,
    totalHistoryRecords,
    totalCalendarEvents,
  };
}

export async function listAdminFeedback({ page, limit, rating }) {
  const skip = (page - 1) * limit;

  if (rating !== undefined) {
    const where = { score: rating };
    const [rows, total] = await Promise.all([
      prisma.responseRating.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
          score: true,
          comment: true,
          createdAt: true,
        },
      }),
      prisma.responseRating.count({ where }),
    ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        rating: row.score,
        comment: row.comment,
        createdAt: row.createdAt,
      })),
      page,
      limit,
      total,
    };
  }

  const [rows, total] = await Promise.all([
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        userId: true,
        content: true,
        createdAt: true,
      },
    }),
    prisma.feedback.count(),
  ]);

  return {
    items: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      rating: null,
      comment: row.content,
      createdAt: row.createdAt,
    })),
    page,
    limit,
    total,
  };
}

export async function listQuestionTemplatesByKind(kind) {
  const rows = await prisma.promptTemplate.findMany({
    where: { kind },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPromptTemplate);
}

export async function createQuestionTemplateByKind(kind, data, createdById) {
  const row = await prisma.promptTemplate.create({
    data: {
      content: data.content,
      category: data.category,
      kind,
      isActive: data.isActive,
      createdById,
    },
  });
  return mapPromptTemplate(row);
}

export async function updateQuestionTemplateByKind(id, kind, data) {
  const existing = await prisma.promptTemplate.findFirst({
    where: { id, kind },
  });
  if (!existing) return null;

  const row = await prisma.promptTemplate.update({
    where: { id },
    data,
  });
  return mapPromptTemplate(row);
}

export async function deleteQuestionTemplateByKind(id, kind) {
  const existing = await prisma.promptTemplate.findFirst({
    where: { id, kind },
  });
  if (!existing) return false;

  await prisma.promptTemplate.delete({ where: { id } });
  return true;
}

/** @deprecated Use listQuestionTemplatesByKind(QuestionTemplateKind.MAIN_CHAT) */
export async function listQuestionTemplates() {
  return listQuestionTemplatesByKind(QuestionTemplateKind.MAIN_CHAT);
}

/** @deprecated Use createQuestionTemplateByKind */
export async function createQuestionTemplate(data, createdById) {
  return createQuestionTemplateByKind(QuestionTemplateKind.MAIN_CHAT, data, createdById);
}

/** @deprecated Use updateQuestionTemplateByKind */
export async function updateQuestionTemplate(id, data) {
  return updateQuestionTemplateByKind(id, QuestionTemplateKind.MAIN_CHAT, data);
}

/** @deprecated Use deleteQuestionTemplateByKind */
export async function deleteQuestionTemplate(id) {
  return deleteQuestionTemplateByKind(id, QuestionTemplateKind.MAIN_CHAT);
}
