const express = require('express')
const crypto  = require('crypto')
const logger  = require('../utils/logger')
const router  = express.Router()

router.post(
  '/',
  express.raw({ type: 'application/json' }),   // raw buffer — do NOT use express.json()
  async (req, res) => {
    try {
      const signature = req.headers['x-sentinel-signature']
      if (!signature) return res.status(401).send('Signature missing')

      const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', process.env.SENTINEL_WEBHOOK_SECRET)
        .update(req.body)      // req.body is raw Buffer here
        .digest('hex')

      if (signature !== expectedSignature) {
        logger.warn('[Sentinel Webhook] Signature mismatch — rejected')
        return res.status(403).send('Signature match failed')
      }

      const payload = JSON.parse(req.body.toString())
      const { session_id, risk_level, recommended_action } = payload

      if (recommended_action === 'TERMINATE_SESSION' || risk_level === 'CRITICAL') {
        const sessionBlacklist = require('../utils/sessionBlacklist')
        if (session_id) {
          sessionBlacklist.add(session_id)
          logger.warn(`[Sentinel Webhook] Session evicted: ${session_id}`)
        }
      }

      return res.status(200).send('Alert processed')
    } catch (err) {
      logger.error('[Sentinel Webhook] Error:', err.message)
      return res.status(500).send('Internal server error')
    }
  }
)

module.exports = router
