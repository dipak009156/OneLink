const express = require('express')
const router = express.Router()
const { syncUser } = require('../controllers/user.controller')
const { requireAuth } = require('@clerk/express')

router.post('/sync', requireAuth(), syncUser)

module.exports = router
