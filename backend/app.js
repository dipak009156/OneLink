const express = require('express')
const { clerkMiddleware } = require('@clerk/express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')

// ── Trust proxy (required on Render / any reverse-proxy host) ─────────────────
// Allows express-rate-limit to read the real client IP from X-Forwarded-For
app.set('trust proxy', 1)

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// ── HTTP request logger (morgan → winston) ───────────────────────────────────
app.use(morgan(':method :url :status :res[content-length] bytes - :response-time ms', {
  stream: { write: (msg) => logger.http(msg.trim()) }
}))

app.use(clerkMiddleware())

// ── Sentinel webhook ─────────────────────────────────────────────────────────
app.use('/webhooks/sentinel', require('./routes/sentinelWebhookRoute'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Rate limiters ─────────────────────────────────────────────────────────────

// General API limiter — 100 req / 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
})

// Strict limiter for expensive/public endpoints — 10 req / min per IP
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Rate limit exceeded. Please slow down.' }
})

const userRoutes = require('./routes/user.routes')
const platformRoutes = require('./routes/platform.routes')
const projectRoutes = require('./routes/project.routes')
const experienceRoutes = require('./routes/experience.routes')
const settingsRoutes = require('./routes/settings.routes')
const resumeRoutes = require('./routes/resume.routes')

app.get('/', (req, res) => {
  res.send('OneLink Backend is running')
})

// Apply general limiter to all API routes
app.use('/api', apiLimiter)

// Apply strict limiter to expensive public endpoints
app.use('/api/users/explore', strictLimiter)
app.use('/api/resume', strictLimiter)

app.use('/api/users', userRoutes)
app.use('/api/platform', platformRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/resume', resumeRoutes)

// Global error handler (catches Clerk requireAuth errors)
app.use((err, req, res, next) => {
  const errorMsg = err.message || err.toString() || 'Unknown Error'
  logger.error(`Express Error: ${errorMsg}`)
  if (err.stack) logger.error(err.stack)

  res.status(err.status || 500).json({
    message: errorMsg || 'An unexpected error occurred'
  })
})

module.exports = app
