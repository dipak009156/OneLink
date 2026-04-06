const express = require('express')
const { clerkMiddleware } = require('@clerk/express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(clerkMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next)=>{
    logger.info(`${req.method} ${req.url}`)
    next()
})

const userRoutes = require('./routes/user.routes')
const platformRoutes = require('./routes/platform.routes')
const projectRoutes = require('./routes/project.routes')
const experienceRoutes = require('./routes/experience.routes')
const settingsRoutes = require('./routes/settings.routes')

app.use('/api/users', userRoutes)
app.use('/api/platform', platformRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/settings', settingsRoutes)

// Global error handler (catches Clerk requireAuth errors)
app.use((err, req, res, next) => {
  logger.error(`Express Error: ${err.message}`)
  res.status(err.status || 500).json({ 
    message: err.message || 'An unexpected error occurred'
  })
})

module.exports = app
