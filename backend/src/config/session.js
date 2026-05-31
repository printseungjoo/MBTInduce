import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

export function createSessionMiddleware() {
  const isProd = process.env.NODE_ENV === "production";
  const sessionOptions = {
    name: "mbtinduce.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
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
