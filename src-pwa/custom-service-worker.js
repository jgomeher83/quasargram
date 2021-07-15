/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
  DEPENDENCIES
 */
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { Queue } from 'workbox-background-sync';


/*
CONFIG
*/
precacheAndRoute(self.__WB_MANIFEST);

// disable workbox logs
self.__WB_DISABLE_DEV_LOGS = false

let backgroundSyncSupported = 'sync' in self.registration ? true : false
console.log('backgroundSyncSupported', backgroundSyncSupported);
/*
queue - createPost
*/

let createPostQueue = null
if (backgroundSyncSupported) {
  createPostQueue = new Queue('createPostQueue')
}

/*
CACHING STRATEGIES
*/
registerRoute(
  ({ url }) =>
    url.host.startsWith('fonts.g'),
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/posts'),
  new NetworkFirst()
)


registerRoute(
  ({ url }) =>
    url.href.startsWith('http'),
  new StaleWhileRevalidate()
);

/*
event - fetch
*/

if (backgroundSyncSupported) {
  self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/createPost')) {
      // Clone the request to ensure it's safe to read when
      // adding to the Queue.
      const promiseChain = fetch(event.request.clone())
      .catch((err) => {
        return createPostQueue.pushRequest({request: event.request});
      });
  
      event.waitUntil(promiseChain);
    }
  });
}