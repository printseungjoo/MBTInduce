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
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
      secure: process.env.NODE_ENV === 'production', // production일 때 true (HTTPS 필수)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 크로스 도메인 간 쿠키 전송 허용
      ...(isProd ? { domain: ".mbtinduce.com" } : {})
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
