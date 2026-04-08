const User = require('../models/User')
const Profile = require('../models/Profile')
const Preferences = require('../models/Preferences')
const Project = require('../models/Project')
const Experience = require('../models/Experience')
const GitHub = require('../models/GitHub')
const LeetCode = require('../models/LeetCode')

/**
 * Aggregates all data needed for the resume generation.
 * @param {string} username 
 * @returns {Promise<Object>} The aggregated data object
 */
const getResumeData = async (username) => {
  const user = await User.findOne({ username: username.toLowerCase() }).lean()
  if (!user) {
    throw new Error('User not found')
  }

  const userId = user._id

  const [
    profile,
    preferences,
    projects,
    experience,
    github,
    leetcode
  ] = await Promise.all([
    Profile.findOne({ userId }).lean(),
    Preferences.findOne({ userId }).lean(),
    Project.find({ userId }).sort({ isFeatured: -1, createdAt: -1 }).lean(),
    Experience.find({ userId }).sort({ createdAt: -1 }).lean(), // Changed to most recent first
    GitHub.findOne({ userId }).lean(),
    LeetCode.findOne({ userId }).lean()
  ])

  return {
    user: {
      username: user.username,
      email: user.email
    },
    profile: profile || {},
    preferences: preferences || {},
    projects: projects || [],
    experience: experience || [],
    github: github || {},
    leetcode: leetcode || {}
  }
}

module.exports = { getResumeData }
