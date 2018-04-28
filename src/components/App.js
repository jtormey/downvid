import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Modal, Container, Row, Col, InputGroup, InputGroupAddon, Input, Button, Card, CardBody, CardImg, CardTitle, CardSubtitle } from 'reactstrap'
import { download, fetchMeta } from '../network'
import { requestFs, readFile, rmFile, createFileWriter } from '../fs'

const LS_KEY = 'downvid-library'

const renderTime = (sec) => `${Math.floor(sec / 60)}:${sec % 60}`

const vidWrapperStyle = {
  position: 'absolute',
  zIndex: 100000000,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
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

class App extends React.Component {
  state = {
    linkInput: '',
    library: [],
    playing: false,
    vidsrc: null,
    downloading: false,
    progress: 0
  }

  componentDidMount = async () => {
    this.fs = await requestFs()
    let library = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    this.setState({ library })
    window.onbeforeunload = () => this.state.downloading || null
  }

  componentWillUnmount = () => {
    window.onbeforeunload = () => null
  }

  handleInput = (event) => {
    this.setState({ linkInput: event.target.value })
  }

  handleSave = async () => {
    let vid = this.state.linkInput
    this.setState({ linkInput: '', downloading: true })
    let meta = await fetchMeta(vid)
    this.mapLib((library) => [meta, ...this.state.library])

    let res = await download(vid)
    let writer = await createFileWriter(this.fs, `${vid}.mp4`)

    let pipe = (r, w, totalLength, progress) => {
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

    await pipe(
      res.body.getReader(),
      writer,
      parseInt(res.headers.get('Content-Length')),
      (progress) => this.setState({ progress })
    )

    this.setState({ downloading: false })
  }

  playVideo = async (vid) => {
    let file = await readFile(this.fs, `${vid}.mp4`)
    let vidsrc = URL.createObjectURL(file)
    this.setState({ playing: true, vidsrc })
  }

  deleteVideo = async (vid) => {
    this.mapLib((library) => library.filter((entry) => entry.vid !== vid))
    await rmFile(this.fs, `${vid}.mp4`)
  }

  closePlayer = () => {
    this.setState({ playing: false })
  }

  mapLib = (f) => {
    let library = f(this.state.library)
    this.setState({ library })
    localStorage.setItem(LS_KEY, JSON.stringify(library))
  }

  render () {
    return (
      <Container>
        <Row style={{ marginTop: 16 }}>
          <Col md={6}>
            <h1>Downvid</h1>
          </Col>
          <Col md={6} style={{ display: 'flex', alignItems: 'center' }}>
            <InputGroup>
              <InputGroupAddon addonType='prepend'>
                https://youtube.com/watch?v=
              </InputGroupAddon>
              <Input value={this.state.linkInput} onChange={this.handleInput} />
              <InputGroupAddon addonType='append'>
                <Button color='primary' onClick={this.handleSave}>Save Vid</Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: 32 }}>
          {this.state.library.map((entry) => (
            <Col key={entry.vid} md={4} sm={12} style={{ marginBottom: 32 }}>
              <Card>
                <div style={{ position: 'relative' }}>
                  <CardImg top src={entry.thumbnail.url} width={entry.thumbnail.width} height={entry.thumbnail.height} />
                  <div style={vidTimeTag}><span>{renderTime(entry.length)}</span></div>
                </div>
                <CardBody>
                  <CardTitle>{entry.title}</CardTitle>
                  <CardSubtitle>{entry.author.name}</CardSubtitle>
                  <h3>Progress: {Math.round(this.state.progress * 100)}%</h3>
                  <div style={{ marginTop: 16 }}>
                    <Button color='primary' block onClick={() => this.playVideo(entry.vid)}>Play</Button>
                    <Button color='secondary' block onClick={() => this.deleteVideo(entry.vid)}>Delete</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal isOpen={this.state.playing} toggle={this.closePlayer} />
        {this.state.playing && (
          <div style={vidWrapperStyle} onClick={this.closePlayer}>
            <video controls style={{ height: '90%' }}>
              <source src={this.state.vidsrc} type='video/mp4' />
            </video>
          </div>
        )}
      </Container>
    )
  }
}

export default App
