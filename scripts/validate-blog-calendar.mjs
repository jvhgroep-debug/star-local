import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const calendar = JSON.parse(readFileSync('editorial/starlocal-blogplanning-2026.json','utf8'));
assert.equal(new Set(calendar.slots.map(s=>s.key)).size,calendar.slots.length,'unique original identities');
const code = await build({entryPoints:['src/data/blog/publication-selection.ts'],bundle:true,platform:'node',format:'esm',write:false});
const selection=await import('data:text/javascript;base64,'+Buffer.from(code.outputFiles[0].text).toString('base64'));
for(const slot of calendar.slots.filter(s=>!s.published)) {
 if(!slot.scheduledAt || (slot.scheduledAt.slice(0,10)>='2026-11-08' && slot.batchSlot!==1)) assert.equal(slot.status,'cancelled-by-schedule-change');
 if(['cancelled-by-schedule-change','skipped-quality'].includes(slot.status)) assert(!selection.isActivePublicationSlot(slot));
}
for(const name of readdirSync('src/data/blog').filter(n=>/^municipal-.*\.json$/.test(n))) {
 for(const post of JSON.parse(readFileSync('src/data/blog/'+name,'utf8'))) {
  if(post.slotKey) assert(calendar.slots.some(s=>s.key===post.slotKey && s.slug===post.slug),'unknown article slot '+post.slug);
 }
}
console.log('PASS original identities, reduced calendar, terminal states and article-slot mapping');
