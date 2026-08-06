import { TENANT_DOCUMENT_CSS, TENANT_DOCUMENT_SCRIPT } from '../builder/generator/document-styles';
import type { PublicationPackage, PublicationPackageFile } from '../../types/publication';
import { hashContent } from '../publish/hash';

function mimeForPath(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

/** Extract shared CSS/JS to assets/ and update HTML to use external files. */
export function finalizeProductionHtmlFiles(files: PublicationPackageFile[]): PublicationPackageFile[] {
  const cssContent = TENANT_DOCUMENT_CSS;
  const jsContent = TENANT_DOCUMENT_SCRIPT.trim();

  const assetFiles: PublicationPackageFile[] = [
    {
      path: 'assets/site.css',
      content: cssContent,
      contentHash: hashContent(cssContent),
      mimeType: 'text/css; charset=utf-8',
    },
    {
      path: 'assets/site.js',
      content: jsContent,
      contentHash: hashContent(jsContent),
      mimeType: 'application/javascript; charset=utf-8',
    },
  ];

  const htmlFiles = files
    .filter((f) => f.path.endsWith('.html'))
    .map((f) => {
      const transformed = transformHtmlForProduction(f.content);
      return {
        ...f,
        content: transformed,
        contentHash: hashContent(transformed),
      };
    });

  const otherFiles = files.filter((f) => !f.path.endsWith('.html') && !f.path.startsWith('assets/'));

  return [...htmlFiles, ...otherFiles, ...assetFiles];
}

function transformHtmlForProduction(html: string): string {
  let result = html;

  result = result.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/assets/site.css" />');
  result = result.replace(/<script>[\s\S]*?<\/script>\s*(<\/body>)/, '<script src="/assets/site.js" defer></script>\n$1');

  result = result.replace(/href="\/favicon\.svg"/g, 'href="/favicon.svg"');
  result = result.replace(/href="\/manifest\.webmanifest"/g, 'href="/manifest.webmanifest"');

  return result;
}

/** Inject noindex for production preview serving. */
export function injectPreviewNoindex(html: string): string {
  if (html.includes('name="robots"')) {
    return html.replace(/content="[^"]*"/, 'content="noindex, nofollow"');
  }
  return html.replace(/<head>/, '<head>\n  <meta name="robots" content="noindex, nofollow" />');
}

export function packageFilesToRecord(files: PublicationPackageFile[]): Record<string, string> {
  return Object.fromEntries(files.map((f) => [f.path, f.content]));
}

export { mimeForPath };
