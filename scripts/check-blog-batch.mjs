import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { transform } from 'esbuild';
const ledger=JSON.parse(readFileSync('editorial/starlocal-blogplanning-2026.json','utf8'));
assert.equal(ledger.slots.length,96);
assert.equal(new Set(ledger.slots.map(s=>s.key)).size,96);
const index=readFileSync('dist/blog/index.html','utf8');
const sitemap=readFileSync('dist/sitemap-0.xml','utf8');
const titles=new Set();
for(const slot of ledger.slots.slice(0,3)){
 const route='/blog/'+slot.slug+'/';
 const html=readFileSync('dist'+route+'index.html','utf8');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,route+' H1');
 const canonical=html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
 assert.equal(canonical,'https://www.starlocal.nl'+route);
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1]; assert(title); assert(!titles.has(title));titles.add(title);
 assert.match(html,/<meta name="description" content="[^"]+"/);
 assert.match(html,/"@type":"BlogPosting"/);
 assert.match(html,/2026-10-19T/);
 assert.equal((html.match(/<dialog /g)||[]).length,1);
 assert.equal((html.match(/class="whatsapp-float"/g)||[]).length,1);
 assert.equal((html.match(/<a[^>]*\sdata-wa-open[\s>]/g)||[]).length,2);
 assert.match(html,/data-number="31684002350"/);
 assert.match(html,/name="municipality"/);
 assert.match(html,/name="goal"/);
 assert.match(html,/vrijblijvende offerte/);
 assert(index.includes(route)); assert(sitemap.includes(route));
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
  const link=match[1];if(!link||link==='/')continue;
  assert(existsSync('dist'+link)||existsSync('dist'+link+'index.html')||existsSync('dist'+link+'/index.html'),route+' missing '+link);
 }
 const city=slot.municipality.toLowerCase();
 const cityFile='dist/website-laten-maken/'+city+'/index.html';
 assert(existsSync(cityFile));assert(readFileSync(cityFile,'utf8').includes(route));
 console.log('PASS HTML/SEO/assets/links/WhatsApp/index/sitemap: '+slot.municipality);
}
assert(existsSync('dist/blog/autoverhuur-website-met-boekingssysteem-en-app/index.html'));
for(const slot of ledger.slots.slice(3)){assert.equal(slot.published,false);assert.equal(slot.status,'planned');}

// Exercise actual component code with in-memory DOM events. No browser/network send.
const raw=readFileSync('src/components/WhatsAppButton.astro','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const js=(await transform(raw,{loader:'ts',target:'es2022'})).code;
function target(dataset={}){return {dataset,listeners:{},addEventListener(k,f){this.listeners[k]=f},focus(){this.focused=true}};}
const float=target(),inline=target({waMunicipality:'Oisterwijk'}),close=target();
const municipality={value:''};
const dialog=Object.assign(target(),{opens:0,showModal(){this.opens++},close(){this.listeners.close?.()},querySelector(){return close}});
const form=Object.assign(target({number:'31684002350',copy:JSON.stringify({greeting:'Hallo Star Local',interest:'Interesse',name:'Bedrijf',question:'Vraag',page:'Pagina'})}),{elements:{namedItem(){return municipality}},reportValidity(){return true}});
const values={topic:'Website laten maken',company:'A & B',website:'',municipality:'Oisterwijk',goal:'Een nieuwe website',question:'Offerte & SEO?'};
const assignments=[];
const doc={querySelectorAll(){return [float,inline]},querySelector(s){if(s==='[data-wa-dialog]')return dialog;if(s==='[data-wa-form]')return form;if(s==='article h1')return {textContent:'Website & sociale media'};},addEventListener(){}};
const location={pathname:'/blog/oisterwijk-eigen-website-naast-sociale-media/'};
vm.runInNewContext(js,{document:doc,location,window:{location:{assign(v){assignments.push(v)}}},FormData:class{get(k){return values[k]}},encodeURIComponent,JSON});
inline.listeners.click({preventDefault(){}});assert.equal(dialog.opens,1);assert.equal(municipality.value,'Oisterwijk');assert.equal(assignments.length,0);
form.listeners.submit({preventDefault(){}});assert.equal(assignments.length,1);
const parsed=new URL(assignments[0]);assert.equal(parsed.origin+parsed.pathname,'https://wa.me/31684002350');
for(const value of ['A & B','Gemeente: Oisterwijk','Websitewens: Een nieuwe website','Artikel: Website & sociale media','Herkomst: via StarLocal.nl','https://www.starlocal.nl'+location.pathname])assert(parsed.searchParams.get('text').includes(value));
assert(!assignments[0].includes('A & B'));
console.log('PASS popup trigger, no automatic send, number, source, article, municipality, URL encoding');
