import React from 'react'

class App extends React.Component {
  requestFs = () => {
    window.webkitRequestFileSystem(
      window.PERSISTENT,
      1024 * 1024 /* size bytes */,
      this.onFileSystemInit,
      this.onFileSystemError
    )
  }

  onFileSystemInit = (fs) => {
    console.log('Success!', fs)
  }

  onFileSystemError = (error) => {
    console.log('Error:', error)
  }

  render () {
    return (
      <div>
        App
        <button onClick={this.requestFs}>request fs</button>
      </div>
    )
  }
}

export default App
