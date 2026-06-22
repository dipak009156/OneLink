const express = require('express')
const router = express.Router()
const { connectGitHub, connectLeetCode, getStats } = require('../controllers/platform.controller')
const { requireAuth } = require('@clerk/express')
const sentinelGuard = require('../sentinel-sdk/sentinelguard')

router.post('/connect/github',   requireAuth(), sentinelGuard('platform_connect_github'),   connectGitHub)
router.post('/connect/leetcode', requireAuth(), sentinelGuard('platform_connect_leetcode'), connectLeetCode)
router.get('/stats',             requireAuth(), getStats)

module.exports = router
