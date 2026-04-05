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

app.use('/api/users', userRoutes)

module.exports = app
