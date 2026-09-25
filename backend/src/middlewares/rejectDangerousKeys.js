const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function hasBlockedKey(value, depth) {
  if (!value || typeof value !== "object" || depth > 6) {
    return false;
  }
  for (const key of Object.keys(value)) {
    if (BLOCKED_KEYS.has(key)) {
      return true;
    }
    if (hasBlockedKey(value[key], depth + 1)) {
      return true;
    }
  }
  return false;
}

export function rejectDangerousKeys(req, res, next) {
  if (hasBlockedKey(req.body, 0) || hasBlockedKey(req.query, 0)) {
    return res.status(400).json({ message: "Invalid request" });
  }
  return next();
}
