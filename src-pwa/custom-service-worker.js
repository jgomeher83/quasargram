/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
  DEPENDENCIES
 */
import { precacheAndRoute } from 'workbox-precaching'

/*
  CONFIG
 */
precacheAndRoute(self.__WB_MANIFEST);