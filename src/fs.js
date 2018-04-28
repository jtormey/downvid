const toArray = (list) => Array.prototype.slice.call(list || [], 0)

export const mB = (n) => n * 1024
export const gB = (n) => n * mB(1024)

export const requestFs = (size) => new Promise((resolve, reject) => {
  webkitRequestFileSystem(window.TEMPORARY, size, resolve, reject)
})

export const readDir = (fs) => new Promise((resolve, reject) => {
  let dirReader = fs.root.createReader()

  let readEntries = (entries) => {
    dirReader.readEntries((results) => {
      if (!results.length) {
        resolve(entries.sort())
      } else {
        readEntries(entries.concat(toArray(results)))
      }
    }, reject)
  }

  readEntries([])
})

export const writeFile = (fs, name, data) => new Promise((resolve, reject) => {
  fs.root.getFile(name, { create: true, exclusive: true }, (fileEntry) => {
    fileEntry.createWriter((fileWriter) => {
      fileWriter.onwriteend = () => resolve()
      fileWriter.onerror = (error) => reject(error)
      fileWriter.write(data)
    }, reject)
  }, reject)
})

export const readFile = (fs, name) => new Promise((resolve, reject) => {
  fs.root.getFile(name, {}, (fileEntry) => {
    fileEntry.file((file) => {
      let reader = new FileReader()
      reader.onloadend = function () { resolve(this.result) }
      reader.readAsDataURL(file)
    }, reject)
  }, reject)
})
