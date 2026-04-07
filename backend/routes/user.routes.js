const express = require('express')
const router = express.Router()
const { syncUser, updateProfile, getPublicProfile, searchUsers } = require('../controllers/user.controller')
const { requireAuth } = require('@clerk/express')

router.get('/explore', searchUsers)
router.get('/u/:username', getPublicProfile)

router.post('/sync', requireAuth(), syncUser)
router.post('/profile', requireAuth(), updateProfile)

module.exports = router
