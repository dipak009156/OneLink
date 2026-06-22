const express = require('express')
const { clerkMiddleware } = require('@clerk/express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(clerkMiddleware())

// ── Sentinel webhook ─────────────────────────────────────────────────────────
app.use('/webhooks/sentinel', require('./routes/sentinelWebhookRoute'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

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
