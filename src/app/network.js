export const fetchMeta = (vid) => (
  fetch(`${process.env.ROOT_URL}/meta?vid=${vid}`).then(res => res.json())
)

export const download = (vid) => (
  fetch(`${process.env.ROOT_URL}/download?vid=${vid}`)
)

export const downloadImg = (url) => (
  fetch(url).then(res => res.blob())
)
