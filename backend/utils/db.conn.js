const mongoose = require('mongoose')
const logger = require('./logger')

mongoose.connect(process.env.DB_URL)
.then(()=>{
    logger.info('Database connected successfully')
}).catch((err)=>{
    logger.error(`Database connection failed : ${err}`)
})

