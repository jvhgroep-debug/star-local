import { rmSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
const retired = ['gratis-website','dashboard','admin','auth','login','logout','check-email','sites'];
for (const path of retired) rmSync('dist/' + path, { recursive: true, force: true });
for (const file of readdirSync('dist').filter(f => /^sitemap.*\.xml$/.test(f))) {
 const p = 'dist/' + file;
 const xml = readFileSync(p,'utf8').replace(/<url>[\s\S]*?<\/url>/g, block => {
  const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  return loc && retired.includes(new URL(loc).pathname.split('/')[1]) ? '' : block;
 });
 writeFileSync(p,xml);
}
console.log('Retired website builder pages removed from public output.');
