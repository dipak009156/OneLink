const User = require('../models/User')
const Experience = require('../models/Experience')
const logger = require('../utils/logger')

// GET /api/experience
const getExperience = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const experience = await Experience.findOne({ userId: user._id })
    return res.status(200).json({ experience: experience || null })
  } catch (err) {
    logger.error(`getExperience error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to fetch experience' })
  }
}

// POST /api/experience
const saveExperience = async (req, res) => {
  try {
    const clerkId = req.auth().userId
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { 
      currentRole, 
      company, 
      yearsOfExp, 
      degree, 
      college, 
      graduationYear, 
      status, 
      headline,
      cgpa,
      startDate,
      endDate,
      currentlyWorking,
      experienceType
    } = req.body

    const experience = await Experience.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          currentRole: currentRole?.trim() || '',
          company: company?.trim() || '',
          yearsOfExp: yearsOfExp?.trim() || '',
          degree: degree?.trim() || '',
          college: college?.trim() || '',
          graduationYear: graduationYear?.trim() || '',
          status: status || 'fresher',
          headline: headline?.trim() || '',
          cgpa: cgpa?.trim() || '',
          startDate: startDate?.trim() || '',
          endDate: endDate?.trim() || '',
          currentlyWorking: !!currentlyWorking,
          experienceType: experienceType?.trim() || '',
        },
      },
      { new: true, upsert: true }
    )

    logger.info(`Experience saved for user: ${user.username}`)
    return res.status(200).json({ message: 'Experience saved', experience })
  } catch (err) {
    logger.error(`saveExperience error: ${err.message}`)
    return res.status(500).json({ message: 'Failed to save experience' })
  }
}

module.exports = { getExperience, saveExperience }
