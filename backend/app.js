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

// ── Sentinel debug probe (remove after confirming sessions appear) ────────────
app.get('/api/sentinel-test', async (req, res) => {
  const axios = require('axios')
  const url   = `${process.env.SENTINEL_API_URL}/evaluate`
  const key   = process.env.SENTINEL_API_KEY
  logger.info(`[SentinelTest] URL=${url} | key prefix=${key ? key.slice(0,8) : 'MISSING'}`)

  const payload = {
    user_id:    'test-user-debug',
    session_id: 'sess_debugtest123',
    action:     { type: 'debug_probe' },
    network:    { ip_address: '1.2.3.4', user_agent: 'DebugProbe/1.0' },
    device:     {},
    behavioral: { typing_speed: 0, mouse_velocity: 0, time_on_page: 0 }
  }

  // Try all common auth header formats
  const attempts = [
    { label: 'Authorization: Bearer', headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' } },
    { label: 'X-API-Key',             headers: { 'X-API-Key': key,                  'Content-Type': 'application/json' } },
    { label: 'X-Sentinel-Key',        headers: { 'X-Sentinel-Key': key,             'Content-Type': 'application/json' } },
    { label: 'Authorization: ApiKey', headers: { 'Authorization': `ApiKey ${key}`,  'Content-Type': 'application/json' } },
  ]

  const results = []
  for (const attempt of attempts) {
    try {
      const resp = await axios.post(url, payload, { headers: attempt.headers, timeout: 8000 })
      logger.info(`[SentinelTest] ✅ ${attempt.label} → status=${resp.status} body=${JSON.stringify(resp.data)}`)
      results.push({ header: attempt.label, status: resp.status, ok: true, data: resp.data })
    } catch (err) {
      const info = { status: err.response?.status, body: err.response?.data }
      logger.info(`[SentinelTest] ❌ ${attempt.label} → ${info.status} ${JSON.stringify(info.body)}`)
      results.push({ header: attempt.label, ok: false, ...info })
    }
  }

  res.json(results)
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
