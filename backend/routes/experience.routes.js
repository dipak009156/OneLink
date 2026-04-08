const express = require('express')
const router = express.Router()
const { getExperience, saveExperience } = require('../controllers/experience.controller')
const { requireAuth } = require('@clerk/express')

router.get('/', requireAuth(), getExperience)
router.post('/', requireAuth(), saveExperience)

module.exports = router
