const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    isOpenToWork: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'matrix'],
      default: 'light',
    },
    avatarUrl: {
      type: String,
    },
    githubUsername: {
      type: String,
      trim: true,
    },
    leetcodeUsername: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Profile', profileSchema)