const mongoose = require('mongoose')

const leetcodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    leetcodeUsername: {
      type: String,
      trim: true,
      required: true,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
    },
    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('LeetCode', leetcodeSchema)
