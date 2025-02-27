import React from 'react'
import * as swManager from '../worker/manager'

class WorkerService extends React.Component {
  state = {
    installed: false
  }

  componentDidMount () {
    if (navigator.online !== false && swManager.canUseServiceWorker()) {
      swManager.install()
        .then(() => this.setState({ installed: true }))
        .catch((error) => console.error(error))
    } else {
      this.setState({ installed: true })
    }
  }

  render () {
    return this.state.installed
      ? this.props.children
      : null
  }
}

export default WorkerService
