const User = require('../models/User')
const Profile = require('../models/Profile')
const Preferences = require('../models/Preferences')
const Project = require('../models/Project')
const Experience = require('../models/Experience')
const GitHub = require('../models/GitHub')
const LeetCode = require('../models/LeetCode')
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

// POST /api/users/profile-picture
const uploadProfilePicture = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: { profilePicture: req.file.path } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User not found' })

    logger.info(`Profile picture updated for user: ${user.username}`)
    return res.status(200).json({ 
      message: 'Profile picture updated', 
      profilePicture: user.profilePicture 
    })
  } catch (err) {
    logger.error(`uploadProfilePicture error: ${err.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/users/u/:username
// Public route to fetch all data for a user's public profile
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ username: username.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const userId = user._id

    // Fetch all related data in parallel
    const [
      profile,
      preferences,
      projects,
      experience,
      github,
      leetcode
    ] = await Promise.all([
      Profile.findOne({ userId }),
      Preferences.findOne({ userId }),
      Project.find({ userId }).sort({ createdAt: -1 }),
      Experience.find({ userId }).sort({ startDate: -1 }),
      GitHub.findOne({ userId }),
      LeetCode.findOne({ userId })
    ])

    // Build the consolidated response
    return res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      },
      profile,
      preferences,
      projects,
      experience,
      github,
      leetcode
    })

  } catch (err) {
    logger.error(`getPublicProfile error: ${err.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/users/explore
// Search for developers based on query parameter
const searchUsers = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.toLowerCase() : ''
    const limit = parseInt(req.query.limit, 10) || 50

    // Fetch all needed data
    // Consider performance for large tables, but this works well for scaling up to a few thousand profiles.
    const [users, profiles, experiences, projects, githubs, leetcodes] = await Promise.all([
      User.find().lean(),
      Profile.find().lean(),
      Experience.find().lean(),
      Project.find().lean(),
      GitHub.find().lean(),
      LeetCode.find().lean(),
    ])

    // Map by userId for quick lookup
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]))
    const expMap = new Map()
    experiences.forEach(e => {
      const uid = e.userId.toString()
      if (!expMap.has(uid)) expMap.set(uid, [])
      expMap.get(uid).push(e)
    })
    const projMap = new Map()
    projects.forEach(p => {
      const uid = p.userId.toString()
      if (!projMap.has(uid)) projMap.set(uid, [])
      projMap.get(uid).push(p)
    })
    const githubMap = new Map(githubs.map(g => [g.userId.toString(), g]))
    const leetcodeMap = new Map(leetcodes.map(l => [l.userId.toString(), l]))

    const colors = ['bg-violet-500', 'bg-cyan-500', 'bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500']

    let results = []

    for (const user of users) {
      const uid = user._id.toString()
      const profile = profileMap.get(uid) || {}
      const userProjects = projMap.get(uid) || []
      const userExp = expMap.get(uid) || []
      const gh = githubMap.get(uid) || {}
      const lc = leetcodeMap.get(uid) || {}

      // Compute skills from projects tags + basic profile title/etc
      const skillSet = new Set()
      userProjects.forEach(p => p.tags && p.tags.forEach(t => skillSet.add(t)))
      
      const skillsArray = Array.from(skillSet).slice(0, 4) // cap to 4 skills for UI
      
      const name = profile.name || user.username
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      const colorIndex = parseInt(uid.substring(uid.length - 1), 16) % colors.length // deterministic random color

      const dev = {
        username: user.username,
        name: name,
        title: profile.title || 'Developer',
        initials: initials,
        avatarColor: colors[colorIndex],
        profilePicture: user.profilePicture, // Actual photo if it exists
        skills: skillsArray, // No fallback, show empty if they don't have one
        repos: gh.repos ? gh.repos.length : 0,
        leetcode: lc.totalSolved || 0,
      }

      // Filter by 'q'
      if (q) {
        const matchesName = dev.name.toLowerCase().includes(q)
        const matchesUsername = dev.username.toLowerCase().includes(q)
        const matchesSkill = dev.skills.some(s => s.toLowerCase() === q) // Exact match for filter chips
        if (!matchesName && !matchesUsername && !matchesSkill) {
          continue // skip this user
        }
      }

      results.push(dev)
    }

    res.status(200).json(results.slice(0, limit))
  } catch (err) {
    logger.error(`searchUsers error: ${err.message}`)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { syncUser, updateProfile, getPublicProfile, searchUsers, uploadProfilePicture }
