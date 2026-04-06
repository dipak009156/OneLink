const express = require('express')
const router = express.Router()
const { connectGitHub, connectLeetCode, getStats } = require('../controllers/platform.controller')
const { requireAuth } = require('@clerk/express')

router.post('/connect/github', requireAuth(), connectGitHub)
router.post('/connect/leetcode', requireAuth(), connectLeetCode)
router.get('/stats', requireAuth(), getStats)

module.exports = router
