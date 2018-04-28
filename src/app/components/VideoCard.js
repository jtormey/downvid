import React from 'react'
import { Button, Progress, Card, CardBody, CardImg, CardTitle, CardSubtitle } from 'reactstrap'
import { download } from '../network'
import { createFileWriter, fileExists } from '../fs'

const renderTime = (sec) => `${Math.floor(sec / 60)}:${sec % 60}`

const lockWindow = () => { window.onbeforeunload = () => true }
const unlockWindow = () => { window.onbeforeunload = () => null }

const pipe = (r, w, totalLength, progress) => {
  let pipeInner = (accLength) => {
    progress(accLength / totalLength)
    return r.read().then(({ done, value }) => {
      if (done) {
        progress(1)
        return Promise.resolve()
      } else {
        return w.write(new Blob([value])).then(() => (
          pipeInner(accLength + value.length)
        ))
      }
    })
  }

  return pipeInner(0)
}

const vidTimeTag = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  margin: 4,
  padding: '0px 4px',
  opacity: 0.8,
  color: 'hsl(0, 0%, 100%)',
  background: 'hsl(0, 0%, 6.7%)'
}

class VideoCard extends React.Component {
  state = {
    progress: 0,
    downloaded: null
  }

  componentDidMount = async () => {
    let { video } = this.props
    let downloaded = await fileExists(this.props.fs, `${video.vid}.mp4`)
    this.setState({ downloaded })
    if (!downloaded) this.streamVideo(video.vid)
  }

  streamVideo = async (vid) => {
    lockWindow()
    let res = await download(vid)
    let writer = await createFileWriter(this.props.fs, `${vid}.mp4`)
    let totalLength = parseInt(res.headers.get('Content-Length'))
    let onProgress = (progress) => this.setState({ progress })
    await pipe(res.body.getReader(), writer, totalLength, onProgress)
    setTimeout(() => this.setState({ downloaded: true }), 500)
    unlockWindow()
  }

  renderFooter () {
    let { downloaded } = this.state
    let { video, onPlay, onDelete } = this.props
    if (downloaded === true) {
      return (
        <React.Fragment>
          <Button color='primary' block onClick={() => onPlay(video.vid)}>Play</Button>
          <Button color='secondary' block onClick={() => onDelete(video.vid)}>Delete</Button>
        </React.Fragment>
      )
    }
    if (downloaded === false) {
      return (
        <Progress value={Math.round(this.state.progress * 100)} />
      )
    }
    return null
  }

  render () {
    let { video } = this.props
    return (
      <Card>
        <div style={{ position: 'relative' }}>
          <CardImg top src={video.thumbnail.url} width={video.thumbnail.width} height={video.thumbnail.height} />
          <div style={vidTimeTag}>
            <span>{renderTime(video.length)}</span>
          </div>
        </div>
        <CardBody>
          <CardTitle>{video.title}</CardTitle>
          <CardSubtitle>{video.author.name}</CardSubtitle>
          <div style={{ marginTop: 16 }}>
            {this.renderFooter()}
          </div>
        </CardBody>
      </Card>
    )
  }
}

export default VideoCard
