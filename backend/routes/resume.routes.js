const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { getResumeData } = require('../services/resumeData')
const { renderResume } = require('../services/resumeRenderer')
const { generatePdf } = require('../services/pdfGenerator')
const logger = require('../utils/logger')

// GET /api/resume/download/:username
router.get('/download/:username', asyncHandler(async (req, res) => {
  const { username } = req.params
  logger.info(`Resume download requested for: ${username}`)

  try {
    // 1. Aggregate Data
    const data = await getResumeData(username)

    // 2. Render HTML (Adaptive Bento Logic)
    const html = renderResume(data)

    // 3. Generate PDF Buffer via Puppeteer
    const pdfBuffer = await generatePdf(html)

    // 4. Stream PDF back to browser
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=${username}_resume.pdf`)
    res.send(pdfBuffer)

    logger.info(`Resume generated and sent for: ${username}`)
  } catch (err) {
    logger.error(`Resume Error for ${username}: ${err.message}`)
    res.status(500).json({ message: err.message || 'Error generating resume' })
  }
}))

module.exports = router
