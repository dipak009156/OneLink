const User = require('../models/User')
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

module.exports = { syncUser }
