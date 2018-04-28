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
  res.header('Access-Control-Expose-Headers', 'Content-Length')

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
  let stream = ytdl(createYtUrl(req.query.vid))

  let writeContentLengthHeader = (chunkLength, progress, total) => {
    res.header('Content-Length', total)
    stream.pipe(res)
  }

  stream.once('progress', writeContentLengthHeader)
})

app.listen(PORT, () => {
  console.log(`downvid server listening on ${PORT}`)
})
