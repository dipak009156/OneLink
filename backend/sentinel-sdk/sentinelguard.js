const axios = require('axios')
const logger = require('../utils/logger')
const sessionBlacklist = require('../utils/sessionBlacklist')

const verdictCache = new Map()
const CACHE_TTL_MS = 2000

function getCachedVerdict(key) {
  const entry = verdictCache.get(key)
  if (entry && (Date.now() - entry.ts) < CACHE_TTL_MS) return entry.verdict
  return null
}
function setCachedVerdict(key, verdict) {
  verdictCache.set(key, { verdict, ts: Date.now() })
}

const sentinelGuard = (actionType = 'generic_action') => {
  return async (req, res, next) => {
    try {
      const rawSession = req.headers['x-session-id'] || req.headers.authorization || ''
      const sessionId  = rawSession.length > 128 ? rawSession.slice(-128) : rawSession
      const userId = req.auth?.().userId || 'anonymous'

      logger.info(`[Sentinel] action=${actionType} userId=${userId} session=${sessionId.slice(0, 20)}...`)

      // 1. Fast blacklist check (enforced even in shadow mode)
      if (sessionId && sessionBlacklist.has(sessionId)) {
        return res.status(403).json({ success: false, sentinelVerdict: 'TERMINATE_SESSION' })
      }

      // 2. Verdict cache check
      const cacheKey = `${userId}:${actionType}`
      let verdict = getCachedVerdict(cacheKey)

      if (!verdict) {
        const { sentinelTelemetry } = req.body || {}
        const evaluateUrl = `${process.env.SENTINEL_API_URL}/evaluate`

        logger.info(`[Sentinel] Calling → ${evaluateUrl} | key set: ${!!process.env.SENTINEL_SECRET_KEY}`)

        const response = await axios.post(
          evaluateUrl,
          {
            user_id:    String(userId),
            session_id: String(sessionId),
            action:     { type: actionType },
            network: {
              ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || '127.0.0.1',
              user_agent: req.headers['user-agent'] || 'unknown',
            },
            device:     sentinelTelemetry?.device || {},
            behavioral: sentinelTelemetry?.behavioral || { typing_speed: 0, mouse_velocity: 0, time_on_page: 0 }
          },
          {
            headers: {
              'X-Sentinel-Key': process.env.SENTINEL_SECRET_KEY,
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        )

        verdict = response.data?.recommended_action ?? 'ALLOW'
        logger.info(`[Sentinel] Verdict=${verdict} for userId=${userId}`)
        setCachedVerdict(cacheKey, verdict)
      } else {
        logger.info(`[Sentinel] Cache hit — verdict=${verdict}`)
      }

      // 3. Shadow mode — data sent for baseline, never block
      if (process.env.SENTINEL_SHADOW_MODE === 'true') return next()

      // 4. Enforce verdict (only when shadow mode is off)
      if (verdict === 'TERMINATE_SESSION' || verdict === 'ALERT') {
        sessionBlacklist.add(sessionId)
        return res.status(403).json({ success: false, sentinelVerdict: 'TERMINATE_SESSION' })
      }
      if (verdict === 'BLOCK') {
        return res.status(403).json({ success: false, sentinelVerdict: 'BLOCK' })
      }
      if (verdict === 'STEP_UP_AUTH' || verdict === 'REQUIRE_MFA') {
        return res.status(200).json({ success: false, sentinelVerdict: 'STEP_UP_AUTH', stepUpRequired: true })
      }

      next()
    } catch (err) {
      // Fail-open — never block users because Sentinel is down
      const status = err.response?.status
      const body   = JSON.stringify(err.response?.data)
      logger.error(`[Sentinel] ERROR — ${err.message} | HTTP ${status} | response: ${body}`)
      next()
    }
  }
}

module.exports = sentinelGuard
