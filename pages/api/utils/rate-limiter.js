// pages/api/utils/rate-limiter.js

import rateLimit from 'express-rate-limit';

// Rate limit by IP
export const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900_000, // 15 min (in ms)
  max: parseInt(process.env.RATE_LIMIT_MAX) || 5,
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Optional: General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests from this IP.' },
});
