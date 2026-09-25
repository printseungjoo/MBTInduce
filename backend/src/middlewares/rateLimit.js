const buckets = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.start > 60 * 60 * 1000) {
      buckets.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

export function rateLimit({ windowMs, max, keyPrefix }) {
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || now - bucket.start >= windowMs) {
      bucket = { start: now, count: 0 };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      return res.status(429).json({ message: "Too many requests" });
    }
    return next();
  };
}

export const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: "auth" });
export const chatRateLimit = rateLimit({ windowMs: 60 * 1000, max: 40, keyPrefix: "chat" });
export const aiRateLimit = rateLimit({ windowMs: 60 * 1000, max: 10, keyPrefix: "ai" });
