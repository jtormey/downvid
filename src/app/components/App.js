import React from 'react'
import FileService from './FileService'
import LibraryService from './LibraryService'
import Dashboard from './Dashboard'

const App = () => (
  <FileService>
    {({ fs }) => (
      <LibraryService fs={fs}>
        <Dashboard />
      </LibraryService>
    )}
  </FileService>
)

export default App
