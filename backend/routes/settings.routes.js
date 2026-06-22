const express = require('express')
const router = express.Router()
const { getPreferences, savePreferences, updateUsername } = require('../controllers/settings.controller')
const { requireAuth } = require('@clerk/express')
const sentinelGuard = require('../sentinel-sdk/sentinelguard')

router.get('/preferences', requireAuth(), getPreferences)
router.post('/preferences', requireAuth(), sentinelGuard('settings_preferences'), savePreferences)
router.put('/username',    requireAuth(), sentinelGuard('username_change'),       updateUsername)

module.exports = router
