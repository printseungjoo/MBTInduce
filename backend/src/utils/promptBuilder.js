const TRAIT_BEHAVIORS = {
  F: "Use an empathetic, emotionally aware tone.",
  T: "Use a logical, analytical tone.",
  N: "Focus on big-picture ideas and possibilities.",
  S: "Focus on practical, concrete details and examples.",
  J: "Respond with a structured, planned style.",
  P: "Respond with a flexible, spontaneous style.",
};

export function buildPrompt(message, traits = []) {
  const traitDescriptions = traits
    .map((t) => {
      const key = t?.dimension;
      const behavior = key && TRAIT_BEHAVIORS[key];
      if (!behavior) return null;

      const weight = typeof t.weight === "number" ? t.weight : null;
      const weightSuffix = weight != null ? ` (weight: ${weight})` : "";

      return `- ${key}${weightSuffix}: ${behavior}`;
    })
    .filter(Boolean)
    .join("\n");

  const personalityBlock = traitDescriptions
    ? `Adapt your response to the following personality traits:\n${traitDescriptions}\n\n`
    : "";

  return `${personalityBlock}User message:\n${message}`;
}

