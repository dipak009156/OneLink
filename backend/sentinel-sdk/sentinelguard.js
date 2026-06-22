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
      // OneLink uses Clerk — get userId from the verified JWT
      const userId = req.auth?.().userId || 'anonymous'

      // 1. Fast blacklist check (enforced even in shadow mode)
      if (sessionId && sessionBlacklist.has(sessionId)) {
        return res.status(403).json({ success: false, sentinelVerdict: 'TERMINATE_SESSION' })
      }

      // 2. Verdict cache check
      const cacheKey = `${userId}:${actionType}`
      let verdict = getCachedVerdict(cacheKey)

      if (!verdict) {
        const { sentinelTelemetry } = req.body || {}
        const response = await axios.post(
          `${process.env.SENTINEL_API_URL}/evaluate`,
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
        setCachedVerdict(cacheKey, verdict)
      }

      // 3. Shadow mode — data sent to Sentinel for baseline building,
      //    but NEVER block. Always pass through.
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
      logger.error('[Sentinel] Guard error:', err.message)
      next()
    }
  }
}

module.exports = sentinelGuard
