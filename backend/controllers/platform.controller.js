const axios = require('axios')
const User = require('../models/User')
const Profile = require('../models/Profile')
const GitHub = require('../models/GitHub')
const LeetCode = require('../models/LeetCode')
const logger = require('../utils/logger')

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// POST /api/platform/connect/github
const connectGitHub = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { githubUsername } = req.body
    if (!githubUsername || !githubUsername.trim()) {
      return res.status(400).json({ message: 'GitHub username is required' })
    }

    const trimmedUsername = githubUsername.trim()

    // Save username to profile
    await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: { githubUsername: trimmedUsername } },
      { upsert: true }
    )

    // Fetch user profile from GitHub
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
    }

    const [profileRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${trimmedUsername}`, { headers }),
      axios.get(`https://api.github.com/users/${trimmedUsername}/repos?per_page=100&sort=updated`, { headers }),
    ])

    const bio = profileRes.data.bio || ''

    // Extract repos
    const repos = reposRes.data.map(repo => ({
      name: repo.name,
      description: repo.description || '',
      language: repo.language || '',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      url: repo.html_url,
    }))

    // Extract unique languages
    const languages = [...new Set(
      reposRes.data
        .map(repo => repo.language)
        .filter(Boolean)
    )]

    // Upsert GitHub document
    const githubDoc = await GitHub.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          githubUsername: trimmedUsername,
          repos,
          languages,
          bio,
          lastSynced: new Date(),
        },
      },
      { new: true, upsert: true }
    )

    logger.info(`GitHub connected for user: ${user.username} (${trimmedUsername})`)
    return res.status(200).json({ message: 'GitHub connected', github: githubDoc })
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' })
    }
    logger.error(`connectGitHub error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to connect GitHub' })
  }
}

// POST /api/platform/connect/leetcode
const connectLeetCode = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { leetcodeUsername } = req.body
    if (!leetcodeUsername || !leetcodeUsername.trim()) {
      return res.status(400).json({ message: 'LeetCode username is required' })
    }

    const trimmedUsername = leetcodeUsername.trim()

    // Save username to profile
    await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: { leetcodeUsername: trimmedUsername } },
      { upsert: true }
    )

    // Fetch directly from LeetCode's GraphQL endpoint
    const graphqlQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username: trimmedUsername },
    }

    const response = await axios.post('https://leetcode.com/graphql/', graphqlQuery, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      timeout: 15000,
    })

    const matchedUser = response.data?.data?.matchedUser
    if (!matchedUser) {
      return res.status(404).json({ message: 'LeetCode user not found' })
    }

    const acStats = matchedUser.submitStatsGlobal.acSubmissionNum
    const getCount = (difficulty) => {
      const entry = acStats.find(s => s.difficulty === difficulty)
      return entry ? entry.count : 0
    }

    // Upsert LeetCode document
    const leetcodeDoc = await LeetCode.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          leetcodeUsername: trimmedUsername,
          totalSolved: getCount('All'),
          easySolved: getCount('Easy'),
          mediumSolved: getCount('Medium'),
          hardSolved: getCount('Hard'),
          lastSynced: new Date(),
        },
      },
      { new: true, upsert: true }
    )

    logger.info(`LeetCode connected for user: ${user.username} (${trimmedUsername})`)
    return res.status(200).json({ message: 'LeetCode connected', leetcode: leetcodeDoc })
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'LeetCode user not found' })
    }
    logger.error(`connectLeetCode error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to connect LeetCode' })
  }
}

// GET /api/platform/stats
const getStats = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const [profile, github, leetcode] = await Promise.all([
      Profile.findOne({ userId: user._id }),
      GitHub.findOne({ userId: user._id }),
      LeetCode.findOne({ userId: user._id }),
    ])

    return res.status(200).json({
      githubUsername: profile?.githubUsername || '',
      leetcodeUsername: profile?.leetcodeUsername || '',
      github: github || null,
      leetcode: leetcode || null,
    })
  } catch (err) {
    logger.error(`getStats error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to fetch stats' })
  }
}

module.exports = { connectGitHub, connectLeetCode, getStats }
