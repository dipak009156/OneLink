const express = require('express')
const router = express.Router()
const { syncUser, updateProfile } = require('../controllers/user.controller')
const { requireAuth } = require('@clerk/express')

router.post('/sync', requireAuth(), syncUser)
router.post('/profile', requireAuth(), updateProfile)

module.exports = router
