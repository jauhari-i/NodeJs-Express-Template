import * as bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import winston from 'winston'
import express from 'express'
import path from 'path'
import { router as indexRoute } from '../routes'

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

  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
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
