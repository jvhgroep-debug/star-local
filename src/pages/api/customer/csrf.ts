import type { APIRoute } from 'astro';
import { generateCsrfToken, csrfCookieHeader } from '../../../lib/customer-portal/csrf';
import { isSecureRequest } from '../../../lib/auth/server';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const token = generateCsrfToken();
  const secure = isSecureRequest(request);
  return new Response(JSON.stringify({ ok: true, token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': csrfCookieHeader(token, secure),
    },
  });
};
