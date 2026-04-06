const User = require('../models/User')
const Project = require('../models/Project')
const logger = require('../utils/logger')

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const projects = await Project.find({ userId: user._id }).sort({ order: 1, createdAt: -1 })
    return res.status(200).json({ projects })
  } catch (err) {
    logger.error(`getProjects error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to fetch projects' })
  }
}

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { name, description, liveLink, repoLink, tags, isFeatured } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' })
    }

    // Set order to be last
    const count = await Project.countDocuments({ userId: user._id })

    const project = await Project.create({
      userId: user._id,
      name: name.trim(),
      description: description?.trim() || '',
      liveLink: liveLink?.trim() || '',
      repoLink: repoLink?.trim() || '',
      tags: tags || [],
      order: count,
      isFeatured: isFeatured || false,
    })

    logger.info(`Project created: ${project.name} for user: ${user.username}`)
    return res.status(201).json({ message: 'Project created', project })
  } catch (err) {
    logger.error(`createProject error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to create project' })
  }
}

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const project = await Project.findOne({ _id: req.params.id, userId: user._id })
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const { name, description, liveLink, repoLink, tags, order, isFeatured } = req.body

    if (name !== undefined) project.name = name.trim()
    if (description !== undefined) project.description = description.trim()
    if (liveLink !== undefined) project.liveLink = liveLink.trim()
    if (repoLink !== undefined) project.repoLink = repoLink.trim()
    if (tags !== undefined) project.tags = tags
    if (order !== undefined) project.order = order
    if (isFeatured !== undefined) project.isFeatured = isFeatured

    await project.save()

    logger.info(`Project updated: ${project.name} for user: ${user.username}`)
    return res.status(200).json({ message: 'Project updated', project })
  } catch (err) {
    logger.error(`updateProject error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to update project' })
  }
}

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: user._id })
    if (!project) return res.status(404).json({ message: 'Project not found' })

    logger.info(`Project deleted: ${project.name} for user: ${user.username}`)
    return res.status(200).json({ message: 'Project deleted' })
  } catch (err) {
    logger.error(`deleteProject error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to delete project' })
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject }
