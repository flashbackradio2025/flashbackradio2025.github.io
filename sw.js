// sw.js — Service Worker mínimo para PWA
// Versión: 1.1 — 16/09/2026
// Propósito: habilitar instalabilidad SIN cachear contenido.
// La radio es un stream en vivo: NO debe cachearse.
// Al no cachear HTML, el oyente siempre ve la última versión de la web.

self.addEventListener('install', function (event) {
  // Si algún día actualizamos este SW, el nuevo entra inmediato
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // El SW nuevo toma el control sin esperar recargas
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // Intencionalmente vacío: todo se pide a la red (contenido siempre fresco)
});