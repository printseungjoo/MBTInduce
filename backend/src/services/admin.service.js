import { prisma } from "../lib/prisma.js";

function mapPromptTemplate(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    content: row.content,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getAdminStatistics() {
  const [
    totalUsers,
    totalQuestions,
    totalRatings,
    avgRatingResult,
    totalChatSessions,
    totalHistoryRecords,
    totalCalendarEvents,
  ] = await Promise.all([
    prisma.user.count({ where: { status: { not: "DELETED" } } }),
    prisma.message.count({ where: { role: "USER" } }),
    prisma.responseRating.count(),
    prisma.responseRating.aggregate({ _avg: { score: true } }),
    prisma.chatSession.count(),
    prisma.historyRecord.count(),
    prisma.calendarEvent.count(),
  ]);

  return {
    totalUsers,
    totalQuestions,
    totalRatings,
    averageRating: avgRatingResult._avg.score ?? 0,
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

export async function listQuestionTemplates() {
  const rows = await prisma.promptTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPromptTemplate);
}

export async function createQuestionTemplate(data, createdById) {
  const row = await prisma.promptTemplate.create({
    data: {
      title: data.title,
      content: data.content,
      category: data.category,
      isActive: data.isActive,
      createdById,
    },
  });
  return mapPromptTemplate(row);
}

export async function updateQuestionTemplate(id, data) {
  const row = await prisma.promptTemplate.update({
    where: { id },
    data,
  });
  return mapPromptTemplate(row);
}

export async function deleteQuestionTemplate(id) {
  await prisma.promptTemplate.delete({ where: { id } });
}
