import app from './app'
import db from '@config/db'
import getConfig from '@config/get-config'

const config = getConfig()
const port = config.PORT
const dbConnectionString = config.CONNECTION_STRING!

;(async function () {
  await db(dbConnectionString)

  app.listen(port, () =>
    console.log(`⚡️ Server is listening on port ${port}...`)
  )
})()
