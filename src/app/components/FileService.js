import React from 'react'
import { requestFs } from '../fs'

class FileService extends React.Component {
  state = {
    fs: null
  }

  componentDidMount = async () => {
    let fs = await requestFs()
    this.setState({ fs })
  }

  render () {
    return this.state.fs
      ? this.props.children({ fs: this.state.fs })
      : null
  }
}

export default FileService
