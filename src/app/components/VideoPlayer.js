import React from 'react'
import { Modal } from 'reactstrap'
import { LoadVideoSrc } from './LibraryService'

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

class VideoPlayer extends React.Component {
  state = {
    videoSrc: null
  }

  videoRef = React.createRef()

  componentDidUpdate () {
    if (this.state.videoSrc && this.videoRef.current && this.videoRef.current.paused) {
      this.videoRef.current.play()
    }
  }

  render () {
    let { vid, onClose } = this.props
    let { videoSrc } = this.state
    return (
      <React.Fragment>
        <LoadVideoSrc
          vid={vid}
          onLoad={({ videoSrc }) => this.setState({ videoSrc })}
        />
        <Modal isOpen={videoSrc != null} toggle={onClose} />
        {videoSrc != null && (
          <div style={vidWrapperStyle} onClick={onClose}>
            <video ref={this.videoRef} controls style={{ height: '90%' }}>
              <source src={videoSrc} type='video/mp4' />
            </video>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default VideoPlayer
