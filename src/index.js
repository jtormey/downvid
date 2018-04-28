const express = require('express')
const ytdl = require('ytdl-core')

const PORT = 8081
const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Method', '*')
  res.header('Access-Control-Allow-Header', '*')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.get('/download', (req, res) => {
  ytdl(`https://www.youtube.com/watch?v=${req.query.vid}`).pipe(res)
})

app.listen(PORT, () => {
  console.log(`downvid server listening on ${PORT}`)
})
