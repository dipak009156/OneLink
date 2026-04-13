require('dotenv').config()
const http = require('http');
const app = require('./app')
const logger = require('./utils/logger')
require('./utils/db.conn')

const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 3000

server.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`)
})

