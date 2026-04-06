const mongoose = require('mongoose')

const preferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    showRepos: {
      type: Boolean,
      default: true,
    },
    showLeetCode: {
      type: Boolean,
      default: true,
    },
    showSkills: {
      type: Boolean,
      default: true,
    },
    showProjects: {
      type: Boolean,
      default: true,
    },
    showExperience: {
      type: Boolean,
      default: true,
    },
    showContact: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Preferences', preferencesSchema)
