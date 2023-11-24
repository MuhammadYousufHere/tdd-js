'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
require('dotenv/config')
var _express = _interopRequireDefault(require('express'))
var _helmet = _interopRequireDefault(require('helmet'))
var _cors = _interopRequireDefault(require('cors'))
var _compression = _interopRequireDefault(require('compression'))
var _promClient = _interopRequireDefault(require('prom-client'))
// metrics collection and storage solution
var register = new _promClient['default'].Registry()
register.setDefaultLabels({
  app: 'my-express',
})
var http_request_counter = new _promClient['default'].Counter({
  name: 'http_request_count',
  help: 'Count of HTTP requests made to my app',
  labelNames: ['method', 'route', 'statusCode'],
})
var http_request_duration_milliseconds = new _promClient['default'].Histogram({
  name: 'myapp_http_request_duration_milliseconds',
  help: 'Duration of HTTP requests in milliseconds.',
  labelNames: ['method', 'route', 'code'],
  buckets: [1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000],
})
register.registerMetric(http_request_duration_milliseconds)
register.registerMetric(http_request_counter)
_promClient['default'].collectDefaultMetrics({
  register: register,
})
var PORT = process.env.PORT || 9876
var app = (0, _express['default'])({
  origin: 'http://localhost:'.concat(PORT),
})
app.use(function (req, res, next) {
  http_request_counter
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
app.use((0, _compression['default'])())
//  helps secure Express apps by setting HTTP response headers.
app.use((0, _helmet['default'])())
//express middleware for enable cross resource sharing
app.use((0, _cors['default'])())
app.options('*', (0, _cors['default'])())
app.use(_express['default'].json())
app.get('/', function (req, res) {
  res.send('hello world!')
})
app.get('/metrics', function (req, res) {
  res.setHeader('Content-Type', register.contentType)
  register.metrics().then(function (data) {
    return res.status(200).send(data)
  })
})
app.listen(PORT, function () {
  console.log('Server is listening on the http://localhost:'.concat(PORT))
})
