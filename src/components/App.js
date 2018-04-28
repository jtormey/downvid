import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { Container, Row, Col } from 'reactstrap'

class App extends React.Component {
  render () {
    return (
      <Container>
        <Row>
          <Col md={12}>
            <h1>Downvid</h1>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
