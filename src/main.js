import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import PromClient from 'prom-client'

// metrics collection and storage solution
const register = new PromClient.Registry()

register.setDefaultLabels({
  app: 'my-express',
})
const httpRequestCounter = new PromClient.Counter({
  name: 'http_request_count',
  help: 'Count of HTTP requests made to my app',
  labelNames: ['method', 'route', 'statusCode'],
})

const httpRequestDurationMilliseconds = new PromClient.Histogram({
  name: 'myapp_http_request_duration_milliseconds',
  help: 'Duration of HTTP requests in milliseconds.',
  labelNames: ['method', 'route', 'code'],
  buckets: [1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000],
})

register.registerMetric(httpRequestDurationMilliseconds)
register.registerMetric(httpRequestCounter)
PromClient.collectDefaultMetrics({ register })

const PORT = process.env.PORT || 9876
const app = express({ origin: `http://localhost:${PORT}` })

app.use(function (req, res, next) {
  httpRequestCounter
    .labels({
      method: req.method,
      route: req.originalUrl,
      statusCode: req.statusCode,
    })
    .inc()
  next()
})
app.use(function (req, res, next) {
  // Start a timer for every request made
  res.locals.startEpoch = Date.now()

  next()
})
app.use(compression())
//  helps secure Express apps by setting HTTP response headers.
app.use(helmet())
// express middleware for enable cross resource sharing
app.use(cors())
app.options('*', cors())

app.use(express.json())

app.get('/', function (req, res) {
  res.send('hello world!')
})

app.get('/metrics', function (req, res) {
  res.setHeader('Content-Type', register.contentType)
  register.metrics().then(data => res.status(200).send(data))
})
app.listen(PORT, function () {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on the http://localhost:${PORT}`)
})
