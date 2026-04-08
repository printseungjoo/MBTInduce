import { prisma } from "../lib/prisma.js";

export async function createRating(req, res, next) {
  try {
    const { chatSessionId, messageId, score, comment } = req.body || {};
    if (!chatSessionId || typeof score !== "number") {
      return res.status(400).json({ message: "chatSessionId and numeric score are required" });
    }

    const owned = await prisma.chatSession.findFirst({
      where: { id: chatSessionId, userId: req.user.id },
    });
    if (!owned) return res.status(404).json({ message: "Chat session not found" });

    const rating = await prisma.responseRating.create({
      data: { userId: req.user.id, chatSessionId, messageId: messageId || null, score, comment: comment || null },
    });
    return res.status(201).json({ rating });
  } catch (error) {
    next(error);
  }
}

export async function createFeedback(req, res, next) {
  try {
    const { content, category } = req.body || {};
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" });
    }

    const feedback = await prisma.feedback.create({
      data: { userId: req.user.id, content, category: category || null },
    });
    return res.status(201).json({ feedback });
  } catch (error) {
    next(error);
  }
}

export async function getTemplates(req, res, next) {
  try {
    const templates = await prisma.promptTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
}

export async function getAdminDashboard(req, res, next) {
  try {
    const [totalUsers, totalQueries, avgRating, ratingGroups, feedbacks] = await Promise.all([
      prisma.user.count({ where: { status: { not: "DELETED" } } }),
      prisma.message.count({ where: { role: "USER" } }),
      prisma.responseRating.aggregate({ _avg: { score: true } }),
      prisma.responseRating.groupBy({ by: ["score"], _count: { score: true } }),
      prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    ]);

    return res.status(200).json({
      totalUsers,
      totalQueries,
      averageRating: avgRating._avg.score || 0,
      ratingDistribution: ratingGroups,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTemplate(req, res, next) {
  try {
    const { title, content, category } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }

    const template = await prisma.promptTemplate.create({
      data: { title, content, category: category || null, createdById: req.user.id },
    });
    return res.status(201).json({ template });
  } catch (error) {
    next(error);
  }
}

export async function updateTemplate(req, res, next) {
  try {
    const template = await prisma.promptTemplate.update({
      where: { id: req.params.id },
      data: {
        title: req.body?.title,
        content: req.body?.content,
        category: req.body?.category,
        isActive: typeof req.body?.isActive === "boolean" ? req.body.isActive : undefined,
      },
    });
    return res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
}

export async function deleteTemplate(req, res, next) {
  try {
    await prisma.promptTemplate.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Template deleted" });
  } catch (error) {
    next(error);
  }
}
