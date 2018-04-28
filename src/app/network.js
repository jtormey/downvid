export const fetchMeta = (vid) => (
  fetch(`http://localhost:8081/meta?vid=${vid}`).then(res => res.json())
)

export const download = (vid) => (
  fetch(`http://localhost:8081/download?vid=${vid}`)
)

export const downloadImg = (url) => (
  fetch(url).then(res => res.blob())
)
