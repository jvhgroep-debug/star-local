import { defineMiddleware } from 'astro:middleware';
const removed = /^\/(?:gratis-website|dashboard|admin|auth|login|logout|check-email|sites)(?:\/|$)/;
export const onRequest = defineMiddleware(async (context, next) => {
 const path = new URL(context.request.url).pathname;
 if (removed.test(path) || (path.startsWith('/api/') && path !== '/api/contact' && path !== '/api/contact/')) {
  return new Response('Deze websitebouwer is niet meer beschikbaar. Neem contact op via https://www.starlocal.nl/contact/', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
 }
 return next();
});
