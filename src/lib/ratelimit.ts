import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting via Upstash Redis. Fail-open: if the UPSTASH_* env vars are not
 * configured, the limiters are null and `enforceRateLimit` allows the request
 * (with a one-time warning). Add the env vars to switch protection on — no code
 * change needed.
 */
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let warned = false;
function warnOnce() {
  if (!warned) {
    warned = true;
    console.warn(
      "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting is disabled."
    );
  }
}

const redis = hasUpstash ? Redis.fromEnv() : null;

export const orderRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "ratelimit:orders",
    })
  : null;

export const contactRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "ratelimit:contact",
    })
  : null;

export const uploadRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "ratelimit:uploads",
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
}

/**
 * Enforce a limiter for a given identifier (e.g. IP). Returns success=true when
 * rate limiting is disabled so the app keeps working without Upstash.
 */
export async function enforceRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  if (!limiter) {
    warnOnce();
    return { success: true, limit: 0, remaining: 0 };
  }
  const { success, limit, remaining } = await limiter.limit(identifier);
  return { success, limit, remaining };
}
