import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Modal, Container, Row, Col, InputGroup, InputGroupAddon, Input, Button, Card, CardBody, CardImg, CardTitle } from 'reactstrap'
import { download } from '../network'
import { requestFs, readDir, writeFile, readFile, rmFile } from '../fs'

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
    entries: [],
    playing: false,
    vidsrc: null
  }

  componentDidMount = async () => {
    this.fs = await requestFs()
    await this.listEntries()
  }

  handleInput = (event) => {
    this.setState({ linkInput: event.target.value })
  }

  handleSave = async () => {
    let input = this.state.linkInput
    this.setState({ linkInput: '' })
    let mp4 = await download(input)
    await writeFile(this.fs, `${input}.mp4`, mp4)
    await this.listEntries()
  }

  listEntries = async () => {
    let entries = await readDir(this.fs)
    this.setState({ entries })
  }

  playVideo = async (name) => {
    let vidsrc = await readFile(this.fs, name)
    this.setState({ playing: true, vidsrc })
  }

  deleteVideo = async (name) => {
    await rmFile(this.fs, name)
    await this.listEntries()
  }

  closePlayer = () => {
    this.setState({ playing: false })
  }

  render () {
    return (
      <Container>
        <Row>
          <Col md={12}>
            <h1>Downvid</h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <InputGroup>
              <Input value={this.state.linkInput} onChange={this.handleInput} />
              <InputGroupAddon addonType='append'>
                <Button color='primary' onClick={this.handleSave}>Save Vid</Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: 32 }}>
          {this.state.entries.map((entry) => (
            <Col key={entry.fullPath} md={3} style={{ marginBottom: 32 }}>
              <Card>
                <CardImg top width='100%' src='https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180' alt='Card image cap' />
                <CardBody>
                  <CardTitle>{entry.name}</CardTitle>
                  <Button color='primary' block onClick={() => this.playVideo(entry.name)}>Play</Button>
                  <Button color='secondary' block onClick={() => this.deleteVideo(entry.name)}>Delete</Button>
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
