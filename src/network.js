export const download = (vid) => (
  fetch(`http://localhost:8081/download?vid=${vid}`).then(res => res.blob())
)
