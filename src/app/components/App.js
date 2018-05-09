import React from 'react'
import WorkerService from './WorkerService'
import FileService from './FileService'
import LibraryService from './LibraryService'
import Dashboard from './Dashboard'

const App = () => (
  <WorkerService>
    <FileService>
      {({ fs }) => (
        <LibraryService fs={fs}>
          <Dashboard />
        </LibraryService>
      )}
    </FileService>
  </WorkerService>
)

export default App
