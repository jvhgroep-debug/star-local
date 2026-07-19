import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
}

function slugify(naam) {
  return naam
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[().']/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const partybusPath = 'C:/Users/DELL/Downloads/Partybus_Nederland_Ontbrekende_Gemeenten_Import_v2.0.csv';
const gemeentenPath = 'C:/Users/DELL/Downloads/Gemeenten_Nederland.csv';

const partybusLines = fs.readFileSync(partybusPath, 'utf8').split(/\r?\n/).filter(Boolean);
const partybusHeader = parseCsvLine(partybusLines[0]);
const stadIdx = partybusHeader.indexOf('stad');
const provincieIdx = partybusHeader.indexOf('provincie');
const slugIdx = partybusHeader.indexOf('seo_slug');

const byNaam = new Map();
for (const line of partybusLines.slice(1)) {
  const cols = parseCsvLine(line);
  const naam = cols[stadIdx];
  byNaam.set(naam, {
    naam,
    slug: cols[slugIdx],
    provincie: cols[provincieIdx],
  });
}

const gemeentenLines = fs.readFileSync(gemeentenPath, 'utf8').split(/\r?\n/).filter(Boolean);
for (const line of gemeentenLines.slice(1)) {
  const naam = line.trim();
  if (!naam || byNaam.has(naam)) continue;
  byNaam.set(naam, { naam, slug: slugify(naam), provincie: 'Nederland' });
}

const gemeentes = [...byNaam.values()].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));

const outPath = path.join(root, 'src', 'data', 'gemeentes.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(gemeentes, null, 2), 'utf8');

const logPath = path.join(root, 'scripts', 'generate-log.txt');
fs.writeFileSync(logPath, `Generated ${gemeentes.length} gemeentes\n`, 'utf8');
