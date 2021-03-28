import cors from 'cors'
import morgan from 'morgan'
import winston from 'winston'
import express from 'express'
import path from 'path'
import { router as indexRoute } from '../routes'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

export default function ConfigureApp(app) {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    exitOnError: false,
    transports: [new winston.transports.Console()],
  })

  logger.stream = {
    write: function(message) {
      logger.info(message.replace(/\n$/, ''))
    },
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })

  app.use(limiter)
  app.use(helmet())
  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(
    express.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 500000,
    })
  )
  app.use(
    morgan('combined', {
      stream: logger.stream,
    })
  )

  app.use(express.static(path.join(__dirname, '../public')))

  app.use('/', indexRoute)

  app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    res.status(404).json({
      message: req.method + ' ' + req.url + ' not found',
      error: 'NoEndpointExist',
      code: 404,
    })
    next()
  })
}
