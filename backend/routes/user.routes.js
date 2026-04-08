const express = require('express')
const router = express.Router()
const { syncUser, updateProfile, getPublicProfile, searchUsers, uploadProfilePicture } = require('../controllers/user.controller')
const { requireAuth } = require('@clerk/express')
const { upload } = require('../utils/cloudinary.config')

router.get('/explore', searchUsers)
router.get('/u/:username', getPublicProfile)

router.post('/sync', requireAuth(), syncUser)
router.post('/profile', requireAuth(), updateProfile)
router.post('/profile-picture', requireAuth(), upload.single('profilePicture'), uploadProfilePicture)

module.exports = router
