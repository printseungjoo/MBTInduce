import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

const WEAK_SESSION_SECRETS = new Set([
  "",
  "dev-session-secret",
  "replace_this_with_random_secret"
]);

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/"
  };
}

export function createSessionMiddleware() {
  const isProd = process.env.NODE_ENV === "production";
  const secret = process.env.SESSION_SECRET || "";

  if (isProd && WEAK_SESSION_SECRETS.has(secret)) {
    throw new Error("SESSION_SECRET must be a strong value in production");
  }

  const sessionOptions = {
    name: "mbtinduce.sid",
    secret: secret || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      ...sessionCookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  };

  if (!process.env.DATABASE_URL) {
    return session(sessionOptions);
  }

  return session({
    ...sessionOptions,
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
  });
}
