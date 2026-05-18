// Estrategia de red inteligente para SIAHO
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // REGLA DE ESCAPE ABSOLUTA: Si es CUALQUIER servidor de Google Scripts, 
  // sal del Service Worker de inmediato y ve directo por internet (Network Only)
  if (url.includes('script.google.com') || url.includes('script.googleusercontent.com')) {
    return; // Detiene la interceptación por completo
  }

  // Recursos estáticos locales del sistema (HTML, CSS, JS locales)
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché lo devuelve, si no, lo busca en internet
      return response || fetch(event.request).catch(() => {
        // Fallback en caso de estar totalmente offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
