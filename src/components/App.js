import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Container, Row, Col, InputGroup, InputGroupAddon, Input, Button, Card, CardBody, CardImg, CardTitle } from 'reactstrap'
import { download } from '../network'
import { requestFs, readDir, writeFile } from '../fs'

class App extends React.Component {
  state = {
    linkInput: '',
    entries: []
  }

  componentDidMount = async () => {
    this.fs = await requestFs()
    let entries = await readDir(this.fs)
    this.setState({ entries })
  }

  handleInput = (event) => {
    this.setState({ linkInput: event.target.value })
  }

  handleSave = async () => {
    let input = this.state.linkInput
    let mp4 = await download(input)
    await writeFile(this.fs, `${input}.mp4`, mp4)
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
                  <Button color='primary' block>Play</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    )
  }
}

export default App
