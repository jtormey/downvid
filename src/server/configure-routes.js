const morgan = require('morgan')
const ytdl = require('ytdl-core')
const { safeHandle } = require('./http-util')

// https://github.com/fent/node-ytdl-core/blob/cf2120e892d070a10a7d85595ffcc32643860351/lib/formats.js
const VIDEO_QUALITY = 18 // 360p

const last = (xs) => xs[xs.length - 1]
const createYtUrl = (vid) => `https://www.youtube.com/watch?v=${vid}`

module.exports = (app) => {
  app.use(morgan('tiny'))
  app.get('/meta', safeHandle(getMeta))
  app.get('/download', safeHandle(streamDownload))

  async function getMeta (req, res) {
    const meta = await ytdl.getInfo(createYtUrl(req.query.vid))

    res.status(200).json({
      vid: meta.video_url.split('watch?v=')[1],
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
  }

  async function streamDownload (req, res) {
    let stream = ytdl(createYtUrl(req.query.vid), { quality: VIDEO_QUALITY })

    let writeContentLengthHeader = (chunkLength, progress, total) => {
      res.header('Access-Control-Expose-Headers', 'Content-Length')
      res.header('Content-Length', total)
      stream.pipe(res)
    }

    stream.once('progress', writeContentLengthHeader)

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve())
      stream.on('error', (error) => reject(error))
    })
  }
}
