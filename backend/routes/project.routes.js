const express = require('express')
const router = express.Router()
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/project.controller')
const { requireAuth } = require('@clerk/express')

router.get('/', requireAuth(), getProjects)
router.post('/', requireAuth(), createProject)
router.put('/:id', requireAuth(), updateProject)
router.delete('/:id', requireAuth(), deleteProject)

module.exports = router
