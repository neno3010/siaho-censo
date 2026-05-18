const CACHE_NAME = 'siaho-v1';
const ASSETS = [
  './',
  './index.html' // Si estás usando "principal.txt" mapeado a la raíz, esto es correcto
];

// Instalar el Service Worker y almacenar en caché la estructura básica
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
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
});

// Estrategia de red inteligente optimizada para SIAHO
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // REGLA DE ESCAPE 1: Si la petición es para Google Apps Script, NO usar la caché local
  if (url.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).catch((err) => {
        console.error("SW: Error de red real en API Google:", err);
        // En lugar de devolver 'undefined', devolvemos una respuesta JSON estructurada de error
        return new Response(
          JSON.stringify({ 
            error: "NetworkError", 
            mensaje: "No hay conexión con el servidor de SIAHO." 
          }), 
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return; // Finaliza el evento para esta petición
  }

  // REGLA 2: Para los recursos estáticos del sistema (HTML, CSS, JS, Fuentes, Iconos)
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Si la respuesta de la red es válida, la devolvemos directamente
        if (response && response.status === 200) {
          return response;
        }
        return response;
      })
      .catch(() => {
        // Si la red falla por completo (Modo Offline), buscamos en la caché local
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si tampoco está en caché, devolvemos una respuesta genérica de texto en vez de undefined
          return new Response("Recurso no disponible sin conexión.");
        });
      })
  );
});
