/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
  DEPENDENCIES
 */
import { precacheAndRoute } from 'workbox-precaching'
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {CacheFirst} from 'workbox-strategies';


/*
CONFIG
*/
precacheAndRoute(self.__WB_MANIFEST);

/*
CACHING STRATEGIES
*/
registerRoute(
  ({url}) => 
    url.host.startsWith('fonts.go') ,
  new CacheFirst()
);

registerRoute(
  ({url}) => 
    url.href.startsWith('http'),
    new StaleWhileRevalidate()
);

