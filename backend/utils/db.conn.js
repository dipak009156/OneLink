const mongoose = require('mongoose')
const logger = require('./logger')

const STATE = process.env.NODE_ENV || 'developement'
const DBURL = STATE === 'developement' ? process.env.LOCAL_DB_URL : process.env.ATLAS_DB_URL

mongoose.connect(DBURL)
.then(()=>{
    logger.info('Database connected successfully')
}).catch((err)=>{
    logger.error(`Database connection failed : ${err}`)
})

