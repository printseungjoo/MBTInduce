import { buildPrompt } from "../utils/promptBuilder.js";
import { compareMessages, getAiResponse } from "../services/openAiService.js";

export async function postAiRespond(req, res, next) {
  try {
    const { message, traits } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Field 'message' is required" });
    }

    const traitsArray = Array.isArray(traits) ? traits : [];
    const prompt = buildPrompt(message, traitsArray);

    // Placeholder AI logic – returns structured dummy data for now.
    const aiResult = await getAiResponse({ message: prompt, traits: traitsArray });

    return res.status(200).json({
      reply: "This is a placeholder AI response influenced by MBTI traits.",
      debug: aiResult,
    });
  } catch (error) {
    next(error);
  }
}

export async function postAiCompare(req, res, next) {
  try {
    const { messageA, messageB, traits } = req.body || {};

    if (!messageA || !messageB) {
      return res.status(400).json({
        message: "Fields 'messageA' and 'messageB' are required",
      });
    }

    const traitsArray = Array.isArray(traits) ? traits : [];
    const comparison = await compareMessages({
      messageA,
      messageB,
      traits: traitsArray,
    });

    return res.status(200).json({
      result: comparison,
    });
  } catch (error) {
    next(error);
  }
}


