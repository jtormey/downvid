const PUBLIC_PATH = process.env.PUBLIC_PATH

export const fetchMeta = (vid) => (
  fetch(`${PUBLIC_PATH}/meta?vid=${vid}`).then(res => res.json())
)

export const download = (vid) => (
  fetch(`${PUBLIC_PATH}/download?vid=${vid}`)
)

export const downloadImg = (url) => (
  fetch(url).then(res => res.blob())
)
