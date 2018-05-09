import './service-worker.static'

export const canUseServiceWorker = () =>
  'serviceWorker' in navigator

export const install = () => navigator.serviceWorker
  .register(`${process.env.ROOT_PATH}/service-worker.static.js`)
  .then(() => navigator.serviceWorker.ready)
