const User = require('../models/User')
const Profile = require('../models/Profile')
const logger = require('../utils/logger')

// POST /api/users/sync
// Called from frontend after login - creates user doc if first time
const syncUser = async (req, res) => {
  const { clerkId, username, email } = req.body

  if (!clerkId || !username || !email) {
    return res.status(400).json({ message: 'clerkId, username and email are required' })
  }

  try {
    let user = await User.findOne({ clerkId })

    if (!user) {
      user = await User.create({ clerkId, username, email })
      logger.info(`New user created: ${username}`)
      return res.status(201).json({ message: 'User created', user })
    }

    return res.status(200).json({ message: 'User already exists', user })
  } catch (err) {
    logger.error(`syncUser error: ${err.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/users/profile
// Protected by Clerk requireAuth() -> gives us req.auth().userId
const updateProfile = async (req, res) => {
  try {
    const clerkId = req.auth().userId

    if (!clerkId) {
      logger.warn('Unauthorized: No userId found in req.auth()')
      return res.status(401).json({ message: 'Unauthorized: No userId found' })
    }

    const { name, title, summary, location, isOpenToWork, theme, githubUsername, leetcodeUsername } = req.body

    // First find the internal _id of our User document
    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found in DB' })

    // Build the data object
    const profileData = {
      userId: user._id,
      name,
      title,
      summary,
      location,
      isOpenToWork,
      theme,
      githubUsername,
      leetcodeUsername
    }

    // Upsert: Create it if it doesn't exist, otherwise update it.
    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: profileData },
      { new: true, upsert: true }
    )

    logger.info(`Profile updated for user: ${user.username}`)
    return res.status(200).json({ message: 'Profile updated', profile })
  } catch (err) {
    logger.error(`updateProfile error: ${err.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { syncUser, updateProfile }
