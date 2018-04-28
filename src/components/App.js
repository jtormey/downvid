import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Modal, Container, Row, Col, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap'
import { fetchMeta } from '../network'
import { requestFs, readFile, rmFile } from '../fs'
import VideoCard from './VideoCard'

const LS_KEY = 'downvid-library'

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

class App extends React.Component {
  state = {
    linkInput: '',
    library: [],
    playing: false,
    vidsrc: null
  }

  componentDidMount = async () => {
    this.fs = await requestFs()
    let library = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    this.setState({ library })
  }

  handleInput = (event) => {
    this.setState({ linkInput: event.target.value })
  }

  handleSave = async () => {
    let vid = this.state.linkInput
    this.setState({ linkInput: '' })
    let meta = await fetchMeta(vid)
    this.mapLib((library) => [meta, ...this.state.library])
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
              <VideoCard fs={this.fs} video={entry} onPlay={this.playVideo} onDelete={this.deleteVideo} />
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
