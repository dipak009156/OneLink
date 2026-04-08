const mongoose = require('mongoose')

const githubSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    githubUsername: {
      type: String,
      trim: true,
      required: true,
    },
    repos: [
      {
        name: String,
        description: String,
        language: String,
        stars: Number,
        forks: Number,
        url: String,
      },
    ],
    languages: [String],
    bio: {
      type: String,
      trim: true,
    },
    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('GitHub', githubSchema)
