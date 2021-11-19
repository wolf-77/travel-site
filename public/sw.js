const staticCacheName = "App-test-v1.1.24";

// cache files array
// cache .css, .html, .js, .png, links files for performance upgrade
const assets = [
  "/html/offline.html",
  "/manifest.json",
  "/css/contact.css",
  "/css/calendar.css",
  "/css/mob_main_style.css",
  "/utilities_style.css",
  "/img/full_logo_1.png",
  "/img/Path3.png",
  "/img/favicon-32x32.png",
  "/img/favicon-16x16.png",
  "/img/apple-touch-icon.png",
  "/img/android-chrome-512x512.png",
  "/img/android-chrome-192x192.png",
  "/js/calendar.js",
  "/js/mobile_calendar.js",
  "/js/desktop_calendar.js",
  "/js/mob_trip.js",
  "/js/service.js",
  "/js/trip-main.js",
  "/js/Trips.js",
  "https://source.unsplash.com/rpopW8c1yqo/488x252",
  "https://source.unsplash.com/Pb-0TawZ9qU/488x252",
  "https://source.unsplash.com/ZlcMun4LpCA/488x252",
  "https://source.unsplash.com/qi3UpY6uFAQ/488x252",
  "https://source.unsplash.com/utxoRRvZOkI/488x252",
  "https://source.unsplash.com/B64B6-kAWlw/488x252",
];

// install service worker
self.addEventListener("install", (evt) => {
  console.log("service worker has been installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate service worker
self.addEventListener("activate", (evt) => {
  // console.log("service worker has been activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// // fetch event
// self.addEventListener("fetch", (evt) => {
//   // console.log("fetch event", evt);
//   evt.respondWith(
//     caches
//       .match(evt.request)
//       .then((cacheRes) => {
//         return cacheRes || fetch(evt.request);
//       })
//       .catch(() => caches.match("/html/offline.html"))
//   );
// });
