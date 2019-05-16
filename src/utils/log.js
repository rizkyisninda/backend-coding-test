'use strict'

const { createLogger, format, transports } = require('winston')

const Log = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'backend-xendit-test' },
    transports: [
        new transports.File({ filename: 'error-log.log', level: 'error' }),
        new transports.File({ filename: 'cmobine-log.log' })
    ]
})

Log.stream = {
    write: function (message, encoding) {
        Log.info(message)
    }
}

module.exports = Log