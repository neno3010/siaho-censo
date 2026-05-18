self.addEventListener('fetch', event => {
  // CORRECCIÓN CRÍTICA: Si la petición va dirigida a la API de Google Apps Script,
  // se procesa directamente por internet sin que el Service Worker interfiera.
  if (event.request.url.includes('script.google.com')) {
    return; // No hace nada, deja que la petición siga su curso normal por red
  }

  // Tu lógica actual de caché para archivos locales (HTML, CSS, JS, etc.)
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // En caso de estar offline y pedir una página que no esté en caché
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html'); 
        }
      });
    })
  );
});
