export const fetchMeta = (vid) => (
  fetch(`/meta?vid=${vid}`).then(res => res.json())
)

export const download = (vid) => (
  fetch(`/download?vid=${vid}`)
)

export const downloadImg = (url) => (
  fetch(url).then(res => res.blob())
)
