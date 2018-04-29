import React from 'react'
import { Col, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap'

const URL_VID = /^(https?:\/\/www\.youtube\.com\/watch\?v=)?([a-zA-Z0-9\-_]{11})$/
const validVid = (s) => ((res) => res && res[2])(s.match(URL_VID))

class Header extends React.Component {
  state = {
    query: ''
  }

  handleInput = (event) => {
    this.setState({ query: event.target.value })
  }

  handleSubmit = () => {
    let { query } = this.state
    this.setState({ query: '' })
    this.props.onSubmit(query)
  }

  render () {
    let { query } = this.state
    return (
      <React.Fragment>
        <Col md={6}>
          <h1>Downvid</h1>
        </Col>
        <Col md={6} style={{ display: 'flex', alignItems: 'center' }}>
          <InputGroup>
            <Input value={query} onChange={this.handleInput} placeholder='https://youtube.com/watch?v=' />
            <InputGroupAddon addonType='append'>
              <Button color='primary' disabled={!validVid(query)} onClick={this.handleSubmit}>Save Vid</Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </React.Fragment>
    )
  }
}

export default Header
