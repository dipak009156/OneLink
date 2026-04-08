const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    cgpa: {
      type: String,
      trim: true,
    },
    startDate: {
      type: String,
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    experienceType: {
      type: String, // e.g., 'Full-time', 'Internship', 'Contract'
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Experience', experienceSchema)
