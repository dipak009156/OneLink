const express = require('express')
const router = express.Router()
const { syncUser, updateProfile, getPublicProfile, searchUsers, uploadProfilePicture } = require('../controllers/user.controller')
const { requireAuth } = require('@clerk/express')
const { upload } = require('../utils/cloudinary.config')
const sentinelGuard = require('../sentinel-sdk/sentinelguard')

router.get('/explore', searchUsers)
router.get('/u/:username', getPublicProfile)

router.post('/sync',           requireAuth(), sentinelGuard('login'),                  syncUser)
router.post('/profile', requireAuth(), sentinelGuard('update_profile'), updateProfile)
router.post('/profile-picture', requireAuth(), sentinelGuard('profile_picture_upload'), upload.single('profilePicture'), uploadProfilePicture)

module.exports = router
