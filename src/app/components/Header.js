import React from 'react'
import { Col, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap'

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
    return (
      <React.Fragment>
        <Col md={6}>
          <h1>Downvid</h1>
        </Col>
        <Col md={6} style={{ display: 'flex', alignItems: 'center' }}>
          <InputGroup>
            <InputGroupAddon addonType='prepend'>
              https://youtube.com/watch?v=
            </InputGroupAddon>
            <Input value={this.state.query} onChange={this.handleInput} />
            <InputGroupAddon addonType='append'>
              <Button color='primary' onClick={this.handleSubmit}>Save Vid</Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </React.Fragment>
    )
  }
}

export default Header
