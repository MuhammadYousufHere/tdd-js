import express, { Express } from 'express'
import { start } from '@/server'
import { databaseConnection } from '@config/db'

// App entrypoint
;((): void => {
  const app: Express = express()
  databaseConnection()
  start(app)
})()
