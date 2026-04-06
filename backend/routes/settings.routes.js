const express = require('express')
const router = express.Router()
const { getPreferences, savePreferences, updateUsername } = require('../controllers/settings.controller')
const { requireAuth } = require('@clerk/express')

router.get('/preferences', requireAuth(), getPreferences)
router.post('/preferences', requireAuth(), savePreferences)
router.put('/username', requireAuth(), updateUsername)

module.exports = router
