const LOCAL_DEV_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

export function allowedClientOrigins() {
  const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    for (const localOrigin of LOCAL_DEV_ORIGINS) {
      if (!origins.includes(localOrigin)) {
        origins.push(localOrigin);
      }
    }
  }

  return origins;
}

export function parseAllowedClientOrigin(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) {
    return null;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }
  if (url.username || url.password) {
    return null;
  }
  if (!allowedClientOrigins().includes(url.origin)) {
    return null;
  }

  return url.origin;
}

export function fallbackClientOrigin() {
  const candidates = [
    process.env.AUTH_SUCCESS_REDIRECT,
    process.env.CLIENT_ORIGIN
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const first = candidate.split(",")[0].trim();
    const parsed = parseAllowedClientOrigin(first);
    if (parsed) {
      return parsed;
    }
  }

  const allowed = allowedClientOrigins();
  if (allowed[0]) {
    return allowed[0];
  }

  return "http://localhost:5173";
}
