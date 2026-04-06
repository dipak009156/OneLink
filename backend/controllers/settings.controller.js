const User = require('../models/User')
const Preferences = require('../models/Preferences')
const logger = require('../utils/logger')

// GET /api/settings/preferences
const getPreferences = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    let prefs = await Preferences.findOne({ userId: user._id })
    if (!prefs) {
      // Return defaults if not yet created
      prefs = {
        showRepos: true,
        showLeetCode: true,
        showSkills: true,
        showProjects: true,
        showExperience: true,
        showContact: false,
      }
    }

    return res.status(200).json({
      preferences: prefs,
      username: user.username,
      email: user.email,
    })
  } catch (err) {
    logger.error(`getPreferences error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to fetch preferences' })
  }
}

// POST /api/settings/preferences
const savePreferences = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { showRepos, showLeetCode, showSkills, showProjects, showExperience, showContact } = req.body

    const prefs = await Preferences.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          showRepos: showRepos ?? true,
          showLeetCode: showLeetCode ?? true,
          showSkills: showSkills ?? true,
          showProjects: showProjects ?? true,
          showExperience: showExperience ?? true,
          showContact: showContact ?? false,
        },
      },
      { new: true, upsert: true }
    )

    logger.info(`Preferences saved for user: ${user.username}`)
    return res.status(200).json({ message: 'Preferences saved', preferences: prefs })
  } catch (err) {
    logger.error(`savePreferences error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to save preferences' })
  }
}

// PUT /api/settings/username
const updateUsername = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const { username } = req.body
    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required' })
    }

    const trimmed = username.trim().toLowerCase()

    // Check if taken by another user
    const existing = await User.findOne({ username: trimmed, clerkId: { $ne: clerkId } })
    if (existing) {
      return res.status(409).json({ message: 'Username already taken' })
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: { username: trimmed } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User not found' })

    logger.info(`Username updated to: ${trimmed}`)
    return res.status(200).json({ message: 'Username updated', username: user.username })
  } catch (err) {
    logger.error(`updateUsername error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to update username' })
  }
}

module.exports = { getPreferences, savePreferences, updateUsername }
