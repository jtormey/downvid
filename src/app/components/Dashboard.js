import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Library } from './LibraryService'
import Header from './Header'
import VideoCard from './VideoCard'
import VideoPlayer from './VideoPlayer'

class App extends React.Component {
  state = {
    playing: null
  }

  openPlayer = async (vid) => {
    this.setState({ playing: vid })
  }

  closePlayer = () => {
    this.setState({ playing: null })
  }

  render () {
    return (
      <Library>
        {({ library, addVideo, removeVideo }) => (
          <Container>
            <Row style={{ marginTop: 16 }}>
              <Header onSubmit={addVideo} />
            </Row>
            <Row style={{ marginTop: 32 }}>
              {library.map((entry) => (
                <Col key={entry.vid} md={4} sm={12} style={{ marginBottom: 32 }}>
                  <VideoCard video={entry} onPlay={this.openPlayer} onDelete={removeVideo} />
                </Col>
              ))}
            </Row>
            {this.state.playing && (
              <VideoPlayer vid={this.state.playing} onClose={this.closePlayer} />
            )}
          </Container>
        )}
      </Library>
    )
  }
}

export default App
