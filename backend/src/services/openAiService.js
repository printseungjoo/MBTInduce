import axios from "axios";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function getApiKey() {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key || null;
}

function getModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

/**
 * @param {Array<{ role: string; content: string }>} messages OpenAI chat messages (system/user/assistant)
 * @returns {Promise<string>} assistant text
 */
export async function getChatCompletion(messages) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = getModel();
  const temperature = Number(process.env.OPENAI_TEMPERATURE);
  const maxTokensRaw = process.env.OPENAI_MAX_TOKENS;

  const { data } = await axios.post(
    OPENAI_URL,
    {
      model,
      messages,
      temperature: Number.isFinite(temperature) ? temperature : 0.7,
      ...(maxTokensRaw ? { max_tokens: Number(maxTokensRaw) } : { max_tokens: 1024 }),
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("OpenAI returned empty content");
  }
  return text.trim();
}

/**
 * Chat Completions with JSON object output (for structured parsing).
 * @param {Array<{ role: string; content: string }>} messages
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getChatCompletionJson(messages) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = getModel();
  const temperature = Number(process.env.OPENAI_TEMPERATURE);
  const maxTokensRaw = process.env.OPENAI_MAX_TOKENS;

  const { data } = await axios.post(
    OPENAI_URL,
    {
      model,
      messages,
      temperature: Number.isFinite(temperature) ? temperature : 0.5,
      ...(maxTokensRaw ? { max_tokens: Number(maxTokensRaw) } : { max_tokens: 1024 }),
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("OpenAI returned empty content");
  }
  try {
    return JSON.parse(text.trim());
  } catch {
    throw new Error("OpenAI returned non-JSON content");
  }
}

/**
 * Legacy helper: one concatenated prompt string (e.g. from buildPrompt).
 * @param {{ message: string; traits?: unknown }} param0
 */
export async function getAiResponse({ message }) {
  if (!message || typeof message !== "string") {
    throw new Error("message is required");
  }
  return getChatCompletion([{ role: "user", content: message }]);
}

export async function compareMessages({ messageA, messageB, traits }) {
  const traitsNote = Array.isArray(traits) && traits.length ? JSON.stringify(traits) : "none";
  const [replyA, replyB] = await Promise.all([
    getChatCompletion([
      {
        role: "system",
        content: "Answer briefly from the requested perspective. Traits context may be provided as JSON.",
      },
      { role: "user", content: `Traits: ${traitsNote}\n\nRespond to: ${messageA}` },
    ]),
    getChatCompletion([
      {
        role: "system",
        content: "Answer briefly from the requested perspective. Traits context may be provided as JSON.",
      },
      { role: "user", content: `Traits: ${traitsNote}\n\nRespond to: ${messageB}` },
    ]),
  ]);

  return {
    summary: "Two perspective replies generated via GPT-4o mini.",
    replyA,
    replyB,
    traits,
  };
}
