const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const env = require('node-env-file')
const configureRoutes = require('./configure-routes')

env('.env')

const {
  NODE_ENV,
  PORT,
  CERT_PATH,
  KEY_PATH
} = process.env

let ssl = null
if (CERT_PATH && KEY_PATH) {
  ssl = {}
  ssl.cert = fs.readFileSync(CERT_PATH)
  ssl.key = fs.readFileSync(KEY_PATH)
}

const app = express()
const server = ssl ? https.createServer(ssl, app) : http.createServer(app)

if (NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../build')))
}

configureRoutes(app)

server.listen(PORT, () => {
  console.log(`downvid ${ssl ? 'secure ' : ''}server listening on ${PORT} in ${NODE_ENV} mode`)
})
