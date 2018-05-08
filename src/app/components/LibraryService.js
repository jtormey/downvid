import React from 'react'
import { fetchMeta, download } from '../network'
import { readFile, rmFile, createFileWriter, fileExists } from '../fs'
const LS_KEY = 'downvid-library'

const { Provider, Consumer } = React.createContext()

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

class LibraryService extends React.Component {
  state = {
    library: []
  }

  componentDidMount = async () => {
    let library = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    this.map(() => library)
  }

  addVideo = async (vid) => {
    let meta = await fetchMeta(vid)
    if (this.state.library.find((entry) => entry.vid === vid) != null) return
    this.map((library) => [meta, ...this.state.library])
  }

  removeVideo = async (vid) => {
    this.map((library) => library.filter((entry) => entry.vid !== vid))
    await rmFile(this.props.fs, `${vid}.mp4`)
  }

  getVideoSrc = async (vid) => {
    let file = await readFile(this.props.fs, `${vid}.mp4`)
    return URL.createObjectURL(file)
  }

  doesVideoExist = async (vid) => {
    let exists = await fileExists(this.props.fs, `${vid}.mp4`)
    return exists
  }

  downloadVideo = async (vid, { onProgress }) => {
    let res = await download(vid)
    let writer = await createFileWriter(this.props.fs, `${vid}.mp4`)
    let totalLength = parseInt(res.headers.get('Content-Length'))
    return pipe(res.body.getReader(), writer, totalLength, onProgress)
  }

  map = (f) => {
    let library = f(this.state.library)
    this.setState({ library })
    localStorage.setItem(LS_KEY, JSON.stringify(library))
  }

  render () {
    const value = {
      library: this.state.library,
      addVideo: this.addVideo,
      removeVideo: this.removeVideo,
      getVideoSrc: this.getVideoSrc,
      doesVideoExist: this.doesVideoExist,
      downloadVideo: this.downloadVideo
    }

    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    )
  }
}

export const Library = ({ children }) => (
  <Consumer>
    {({ library, addVideo, removeVideo }) => (
      children({ library, addVideo, removeVideo })
    )}
  </Consumer>
)

class VideoSrcLoader extends React.Component {
  componentDidMount = async () => {
    let { load, vid, onLoad } = this.props
    let videoSrc = await load(vid)
    onLoad({ videoSrc })
  }

  render () {
    return null
  }
}

export const LoadVideoSrc = (props) => (
  <Consumer>
    {({ getVideoSrc }) => (
      <VideoSrcLoader {...props} load={getVideoSrc} />
    )}
  </Consumer>
)

export class VideoDownloader extends React.Component {
  state = {
    progress: 0,
    downloaded: false
  }

  componentDidMount = async () => {
    let { vid, exists } = this.props
    let downloaded = await exists(vid)
    this.setState({ downloaded })
    if (!downloaded) this.streamVideo(vid)
  }

  lockWindow () {
    window.onbeforeunload = () => true
  }

  unlockWindow () {
    window.onbeforeunload = () => null
  }

  streamVideo = async (vid) => {
    this.lockWindow()
    let onProgress = (progress) => this.setState({ progress })
    await this.props.download(vid, { onProgress })
    setTimeout(() => this.setState({ downloaded: true }), 500)
    this.unlockWindow()
  }

  render () {
    let { progress, downloaded } = this.state
    if (downloaded) {
      return this.props.renderComplete()
    } else {
      return this.props.renderProgress({ progress })
    }
  }
}

export const DownloadVideo = (props) => (
  <Consumer>
    {({ downloadVideo, doesVideoExist }) => (
      <VideoDownloader {...props} download={downloadVideo} exists={doesVideoExist} />
    )}
  </Consumer>
)

export default LibraryService
