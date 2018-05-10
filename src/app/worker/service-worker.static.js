const CACHE_NAME = 'downvid-cache-v1'
const log = (...args) => console.log('[ServiceWorker]:', ...args)

const cacheUrls = [
  '/',
  '/main.build.js',
  '/service-worker.static.js'
]

self.addEventListener('install', (event) => {
  log('Installed service worker')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      log(`Added urls to "${CACHE_NAME}"`)
      return cache.addAll(cacheUrls)
    })
  )
})

self.addEventListener('fetch', (event) => {
  log(`Fetch event for url "${event.request.url}"`)
  event.respondWith(
    (/i\.ytimg\.com/).test(event.request.url) ? (
      caches.match(event.request).then((response) => {
        if (response) {
          log(`Matched response for "${event.request.url}"`)
          return response
        }

        return fetch(event.request.clone()).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          caches.open(CACHE_NAME).then((cache) => {
            log(`Wrote response to cache "${CACHE_NAME}" for "${event.request.url}"`)
            cache.put(event.request, response.clone())
          })

          return response
        })
      })
    ) : (
      fetch(event.request)
    )
  )
})
