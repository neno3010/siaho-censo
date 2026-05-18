const CACHE_NAME = 'siaho-v1';
const ASSETS = [
  './',
  './index.html'
];

// Instalar el Service Worker y almacenar en caché la estructura básica
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Forzar a que reemplace al Service Worker viejo de inmediato
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control de la página inmediatamente
});

// Interceptor de peticiones (Estrategia de Red con exclusión absoluta de Google)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // REGLA DE ESCAPE DE SINCRONIZACIÓN: Si la URL es de Google (API o Redirección), 
  // salimos por completo del Service Worker y lo dejamos en manos de la red pura.
  if (url.includes('google') || url.includes('googleusercontent')) {
    return; // Detiene la ejecución aquí para esta petición externa
  }

  // Para el resto de los recursos locales (Bootstrap, FontAwesome, HTML, etc.)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
