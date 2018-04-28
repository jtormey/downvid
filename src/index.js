const express = require('express')
const ytdl = require('ytdl-core')

const PORT = 8081
const app = express()

const last = (xs) => xs[xs.length - 1]
const createYtUrl = (vid) => `https://www.youtube.com/watch?v=${vid}`

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

app.get('/meta', (req, res) => {
  ytdl.getInfo(createYtUrl(req.query.vid)).then((meta) => {
    res.status(200).json({
      vid: meta.vid,
      url: meta.video_url,
      title: meta.title,
      length: meta.length_seconds,
      author: {
        url: meta.author.user_url,
        name: meta.author.name,
        user: meta.author.user
      },
      thumbnail: last(meta.player_response.videoDetails.thumbnail.thumbnails)
    })
  })
})

app.get('/download', (req, res) => {
  ytdl(createYtUrl(req.query.vid)).pipe(res)
})

app.listen(PORT, () => {
  console.log(`downvid server listening on ${PORT}`)
})
