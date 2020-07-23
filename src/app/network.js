export const fetchMeta = (vid) => (
  fetch(`/meta?vid=${vid}`)
    .then(res => res.status === 200 ? res.json() : res.json().then((e) => Promise.reject(e)))
)

export const download = (vid) => (
  fetch(`/download?vid=${vid}`)
    .then(res => res.status === 200 ? res : res.json().then((e) => Promise.reject(e)))
)

export const downloadImg = (url) => (
  fetch(url).then(res => res.blob())
)
