const express = require('express')
const router = express.Router()
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/project.controller')
const { requireAuth } = require('@clerk/express')
const sentinelGuard = require('../sentinel-sdk/sentinelguard')

router.get('/',     requireAuth(), getProjects)
router.post('/',    requireAuth(), sentinelGuard('project_create'), createProject)
router.put('/:id',  requireAuth(), sentinelGuard('project_update'), updateProject)
router.delete('/:id', requireAuth(), sentinelGuard('project_delete'), deleteProject)

module.exports = router
