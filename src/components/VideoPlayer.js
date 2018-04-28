import React from 'react'
import { Modal } from 'reactstrap'

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
  render () {
    let { src, onClose } = this.props
    return (
      <React.Fragment>
        <Modal isOpen={src != null} toggle={onClose} />
        {src != null && (
          <div style={vidWrapperStyle} onClick={onClose}>
            <video controls style={{ height: '90%' }}>
              <source src={src} type='video/mp4' />
            </video>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default VideoPlayer
