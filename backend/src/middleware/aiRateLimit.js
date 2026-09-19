import rateLimit from 'express-rate-limit'

const windowMs = Number(process.env.GEMINI_AI_RATE_WINDOW_MS || 15 * 60 * 1000)
const max = Number(process.env.GEMINI_AI_RATE_LIMIT || 10)

export const aiRateLimit = rateLimit({
  windowMs,
  max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: req => req.user?.id || req.ip,
  handler: (_req, res) => {
    res.status(429).json({ error: 'AI request limit reached. Please try again later.' })
  }
})
