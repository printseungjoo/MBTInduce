const MAX_TITLE_LENGTH = 200;

function bad(message) {
  return { ok: false, message };
}

export function validateChatSessionPatchBody(body) {
  const raw = body || {};

  if (raw.title === undefined || raw.title === null) {
    return bad("title is required");
  }
  if (typeof raw.title !== "string") {
    return bad("title must be a string");
  }

  const title = raw.title.trim();
  if (!title) {
    return bad("title cannot be empty");
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return bad(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }

  return { ok: true, value: { title } };
}
