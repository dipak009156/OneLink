const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    currentRole: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    yearsOfExp: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['student', 'fresher', 'experience'],
      default: 'student',
    },
    headline: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Experience', experienceSchema)
