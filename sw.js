// Service Worker for Unit Converter PWA
const CACHE_NAME = 'unit-converter-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Network request failed, try to get from cache
        return caches.match(event.request);
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // This could be used to sync data when back online
  console.log('Background sync triggered');
  
  // You could implement logic here to sync conversion history
  // or other data when the app comes back online
}

// Push notifications (if you want to add them later)
self.addEventListener('push', (event) => {
  const options = {
    body: 'Unit Converter is ready to use!',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Unit Converter', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

// Periodic background sync (if available)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-conversion-rates') {
      event.waitUntil(updateConversionRates());
    }
  });
}

async function updateConversionRates() {
  // This could be used to update conversion factors
  // or other data periodically
  console.log('Periodic sync triggered');
}

// Utility function to cache new resources dynamically
async function cacheResource(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(url);
    
    if (response.ok) {
      await cache.put(url, response);
      console.log(`Cached: ${url}`);
    }
  } catch (error) {
    console.error(`Failed to cache: ${url}`, error);
  }
}

// Listen for app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_NEW_RESOURCES') {
    event.waitUntil(
      Promise.all(event.data.urls.map(url => cacheResource(url)))
    );
  }
});