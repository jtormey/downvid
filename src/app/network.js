const ROOT_PATH = process.env.ROOT_PATH

export const fetchMeta = (vid) => (
  fetch(`${ROOT_PATH}/meta?vid=${vid}`).then(res => res.json())
)

export const download = (vid) => (
  fetch(`${ROOT_PATH}/download?vid=${vid}`)
)

export const downloadImg = (url) => (
  fetch(url).then(res => res.blob())
)
