import fs from 'node:fs';
import path from 'node:path';

const slugs = ['amsterdam', 'breda'];

for (const slug of slugs) {
  const htmlPath = path.join('dist/gemeentes', slug, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const missingPublic = imgs.filter(
    (src) => src.startsWith('/') && !fs.existsSync(path.join('public', src.replace(/^\//, ''))),
  );

  console.log(
    JSON.stringify(
      {
        slug,
        title: html.match(/<title>([^<]*)<\/title>/)?.[1],
        canonical: html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1],
        metaDescription: html.match(/name="description"\s+content="([^"]*)"/)?.[1],
        h1: [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) => m[1].trim()),
        og: html.includes('property="og:title"') && html.includes('property="og:image"'),
        schema: {
          faq: html.includes('FAQPage'),
          breadcrumb: html.includes('BreadcrumbList'),
          organization: html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"'),
        },
        aiSeoImage: html.includes('/images/services/service-ai-seo.png'),
        serviceImages: imgs.filter((s) => s.includes('/images/services/')),
        brokenImages: missingPublic,
        wrongCityMention:
          slug === 'breda' ? /amsterdam/i.test(body) : slug === 'amsterdam' ? /breda/i.test(body) : false,
        ctaContact: (html.match(/href="\/contact\/"/g) || []).length,
        faqCount: (html.match(/<details/g) || []).length,
      },
      null,
      2,
    ),
  );
}
