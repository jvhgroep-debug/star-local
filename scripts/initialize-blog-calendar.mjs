// One-time calendar preparation. Never overwrite an existing publication ledger.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
const file = 'editorial/starlocal-blogplanning-2026.json';
if (existsSync(file)) throw new Error('Existing calendar must be resumed, not overwritten');
const cities = ['Oisterwijk','Etten-Leur','Breda','Dongen','Woerden','Tilburg','Zundert','Houten','Eindhoven','Druten','Harderwijk','Utrecht','Bunnik','Roermond','Rotterdam','Montfoort','Voerendaal','Meerssen','Heemstede','Opmeer'];
const first = [
 ['oisterwijk-eigen-website-naast-sociale-media','Ondernemen in Oisterwijk: wat voegt een eigen website toe naast sociale media?','Eigen website en sociale media taakverdeling','/images/projects/project-captain-crabbys.webp'],
 ['etten-leur-offerteformulier-betere-aanvragen','Een offerteformulier dat helpt: welke informatie vraagt u aan klanten in Etten-Leur?','Intakevragen voor een bruikbare offerteaanvraag','/images/projects/project-aurora-salon.webp'],
 ['breda-website-vernieuwen-bestaande-links-behouden','Website vernieuwen in Breda: behoud de links waar klanten al op klikken','Websitevernieuwing en overdracht bestaande klantroutes','/images/projects/project-dutch-food-dubai.webp'],
];
const slots=[];
for(let d=new Date('2026-10-19T00:00:00Z'); d<=new Date('2026-12-30T00:00:00Z'); d.setUTCDate(d.getUTCDate()+1)) {
 if(![1,3,5].includes(d.getUTCDay())) continue;
 for(let n=0;n<3;n++) {
  const i=slots.length, city=cities[i%20], planned=d.toISOString().slice(0,10)+'T15:00:00+04:00';
  slots.push({slot:i+1,key:`starlocal.nl|${city}|${planned}`,website:'starlocal.nl',municipality:city,originalPlannedAt:planned,
   topic:first[i]?.[2]??null,title:first[i]?.[1]??null,slug:first[i]?.[0]??null,
   imageSource:first[i]?'https://www.starlocal.nl'+first[i][3]:null,
   photoType:first[i]?'Existing portfolio website capture containing photography; not a local case':null,
   status:i<3?'draft_validating':'planned',published:false,sourceCommitted:false,deploymentConfirmed:false,liveChecked:false,whatsappChecked:false});
 }
}
if(slots.length!==96) throw new Error('Unexpected calendar length');
mkdirSync('editorial',{recursive:true});
writeFileSync(file,JSON.stringify({website:'starlocal.nl',cadence:'MO/WE/FR: 3 total',endDate:'2026-12-30',rotation:cities,slots},null,2)+'\n');
console.log('Prepared 96 slots; no future content generated.');
