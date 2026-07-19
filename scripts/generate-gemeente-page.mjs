import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const gemeentes = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/gemeentes.json'), 'utf8')
);

const items = gemeentes
  .map((g) => `  { naam: ${JSON.stringify(g.naam)}, slug: ${JSON.stringify(g.slug)}, provincie: ${JSON.stringify(g.provincie)} }`)
  .join(',\n');

const content = `---
import BaseLayout from '../../layouts/BaseLayout.astro';

export function getStaticPaths() {
  const gemeentes = [
${items}
  ];

  return gemeentes.map((gemeente) => ({
    params: { gemeente: gemeente.slug },
    props: { gemeente },
  }));
}

const { gemeente } = Astro.props;

function hashSlug(slug: string): number {
  return [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

const variant = hashSlug(gemeente.slug) % 6;

const introTemplates = [
  \`Bent u op zoek naar een betrouwbare partner in \${gemeente.naam}? Star Local ondersteunt lokale ondernemers en bewoners in \${gemeente.provincie} met professionele dienstverlening, heldere communicatie en een persoonlijke aanpak. Wij begrijpen de lokale markt en helpen u snel verder.\`,
  \`Star Local is uw lokale specialist in \${gemeente.naam}. Van eerste contact tot afgeronde opdracht: wij combineren regionale kennis in \${gemeente.provincie} met een moderne, klantgerichte werkwijze. Vraag vandaag nog vrijblijvend informatie aan.\`,
  \`In \${gemeente.naam} verdient u een partner die meedenkt. Star Local levert maatwerk voor particulieren en ondernemers in \${gemeente.provincie}, met focus op kwaliteit, transparantie en snelle opvolging van elke aanvraag.\`,
  \`Welkom bij Star Local \${gemeente.naam}. Wij zijn actief in \${gemeente.provincie} en helpen u met betrouwbare lokale dienstverlening. Of het nu gaat om een eerste afspraak of een concreet project — wij staan klaar met deskundig advies.\`,
  \`Star Local maakt het verschil in \${gemeente.naam}. Dankzij onze aanwezigheid in \${gemeente.provincie} kunnen wij snel schakelen, duidelijke afspraken maken en u ontzorgen van begin tot eind.\`,
  \`Op zoek naar lokale expertise in \${gemeente.naam}? Star Local verbindt bewoners en bedrijven in \${gemeente.provincie} met professionele service, heldere prijsafspraken en een team dat bereikbaar is wanneer u ons nodig heeft.\`,
];

const bodyTemplates = [
  \`Als lokale speler in \${gemeente.naam} weten wij wat er speelt in \${gemeente.provincie}. Star Local biedt een compleet pakket aan diensten voor wie kwaliteit, betrouwbaarheid en persoonlijk contact belangrijk vindt. Wij werken transparant en houden u bij elke stap op de hoogte.\`,
  \`Star Local in \${gemeente.naam} staat bekend om een no-nonsense aanpak en resultaatgerichte service. Wij ondersteunen zowel particulieren als ondernemers in \${gemeente.provincie} met oplossingen die aansluiten bij uw situatie en budget.\`,
  \`Vanuit \${gemeente.naam} bedienen wij de volledige regio \${gemeente.provincie}. Star Local combineert lokale betrokkenheid met professionele processen, zodat u altijd weet waar u aan toe bent. Neem contact op voor een vrijblijvend gesprek.\`,
  \`In \${gemeente.naam} en omgeving kiest steeds meer klanten voor Star Local vanwege onze snelle reactietijd en duidelijke communicatie. Wij helpen u graag verder met advies, planning en uitvoering — volledig afgestemd op \${gemeente.provincie}.\`,
  \`Star Local is uw aanspreekpunt in \${gemeente.naam} voor betrouwbare lokale dienstverlening. Met kennis van \${gemeente.provincie} en oog voor detail leveren wij service waar u op kunt vertrouwen, keer op keer.\`,
  \`Wij zijn trots op onze aanwezigheid in \${gemeente.naam}. Star Local ondersteunt de lokale gemeenschap in \${gemeente.provincie} met professionele begeleiding, heldere afspraken en een team dat luistert naar uw wensen.\`,
];

const seoKeywords = [
  \`lokale dienstverlening \${gemeente.naam}\`,
  \`Star Local \${gemeente.naam}\`,
  \`professionele service \${gemeente.provincie}\`,
  \`betrouwbare partner \${gemeente.naam}\`,
];

const intro = introTemplates[variant];
const body = bodyTemplates[(variant + 2) % 6];
const pageTitle = \`Star Local \${gemeente.naam} | Lokale dienstverlening in \${gemeente.provincie}\`;
const pageDescription = \`Star Local in \${gemeente.naam}, \${gemeente.provincie}. Professionele lokale dienstverlening, snelle opvolging en persoonlijk contact. Vraag vrijblijvend een offerte aan.\`;
---

<BaseLayout locale="nl" title={pageTitle} description={pageDescription} canonical={\`/gemeentes/\${gemeente.slug}/\`}>
  <article class="gemeente-page" itemscope itemtype="https://schema.org/LocalBusiness">
    <meta itemprop="name" content={\`Star Local \${gemeente.naam}\`} />
    <meta itemprop="areaServed" content={gemeente.naam} />

    <header class="hero">
      <div class="hero-text">
        <p class="eyebrow">Star Local · {gemeente.provincie}</p>
        <h1 itemprop="headline">Star Local in {gemeente.naam}</h1>
        <p class="lead" itemprop="description">{intro}</p>
        <a href="/contact/" class="btn-cta">Gratis offerte aanvragen</a>
      </div>
      <figure class="hero-media">
        <img
          src="/images/hero-local-business.svg"
          alt={\`Lokale business en professionele service in \${gemeente.naam}\`}
          width="800"
          height="500"
          loading="eager"
          decoding="async"
        />
      </figure>
    </header>

    <section class="gallery" aria-label="Diensten en lokale expertise">
      <div class="gallery-grid">
        <figure class="gallery-card">
          <img
            src="/images/seo-growth.svg"
            alt={\`SEO en online vindbaarheid voor ondernemers in \${gemeente.naam}\`}
            width="600"
            height="400"
            loading="lazy"
            decoding="async"
          />
          <figcaption>SEO &amp; vindbaarheid in {gemeente.naam}</figcaption>
        </figure>
        <figure class="gallery-card">
          <img
            src="/images/personal-service.svg"
            alt={\`Persoonlijke service en contact in \${gemeente.provincie}\`}
            width="600"
            height="400"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Persoonlijk contact &amp; service</figcaption>
        </figure>
        <figure class="gallery-card">
          <img
            src="/images/regional-expertise.svg"
            alt={\`Regionale expertise van Star Local in \${gemeente.naam}\`}
            width="600"
            height="400"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Regionale expertise in {gemeente.provincie}</figcaption>
        </figure>
      </div>
    </section>

    <section class="content">
      <h2>Professionele lokale service in {gemeente.naam}</h2>
      <p>{body}</p>
      <ul class="benefits">
        <li>Lokale kennis van {gemeente.naam} en {gemeente.provincie}</li>
        <li>Snelle opvolging en transparante communicatie</li>
        <li>Persoonlijk advies afgestemd op uw situatie</li>
        <li>SEO-vriendelijke online aanwezigheid voor lokale groei</li>
      </ul>
      <p class="keywords" aria-label="Zoekwoorden">
        {seoKeywords.join(' · ')}
      </p>
    </section>

    <section class="cta-block">
      <h2>Klaar om te starten in {gemeente.naam}?</h2>
      <p>
        Neem vandaag nog contact op met Star Local. Wij reageren snel op aanvragen uit
        {gemeente.naam} en {gemeente.provincie} en denken graag met u mee.
      </p>
      <a href="/contact/" class="btn-cta btn-cta-large">Direct contact opnemen</a>
    </section>
  </article>
</BaseLayout>

<style>
  .gemeente-page {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .hero {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 2rem;
    align-items: center;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(197, 160, 89, 0.25);
  }

  .eyebrow {
    color: #c5a059;
    font-size: 0.82rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0 0 0.75rem;
    font-weight: 600;
  }

  h1 {
    color: #ffffff;
    font-size: clamp(1.9rem, 4vw, 2.6rem);
    margin: 0 0 1rem;
    line-height: 1.2;
  }

  h1::after {
    content: '';
    display: block;
    width: 64px;
    height: 3px;
    background: #c5a059;
    margin-top: 0.75rem;
    border-radius: 2px;
  }

  .lead {
    color: #c8d0dc;
    font-size: 1.05rem;
    line-height: 1.75;
    margin: 0 0 1.5rem;
  }

  .hero-media,
  .gallery-card {
    margin: 0;
  }

  .hero-media img,
  .gallery-card img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 14px;
    border: 1px solid rgba(197, 160, 89, 0.22);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    object-fit: cover;
    aspect-ratio: 16 / 10;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    align-items: stretch;
  }

  .gallery-card {
    background: rgba(197, 160, 89, 0.04);
    border: 1px solid rgba(197, 160, 89, 0.18);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .gallery-card figcaption {
    padding: 0.9rem 1rem 1.1rem;
    color: #c5a059;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
  }

  .content h2,
  .cta-block h2 {
    color: #c5a059;
    font-size: 1.5rem;
    margin: 0 0 1rem;
  }

  .content p,
  .cta-block p,
  .benefits li {
    color: #e2e8f0;
    line-height: 1.75;
  }

  .benefits {
    padding-left: 1.25rem;
    margin: 1.25rem 0;
  }

  .keywords {
    font-size: 0.82rem;
    color: #8fa0b8;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(197, 160, 89, 0.15);
  }

  .cta-block {
    background: linear-gradient(135deg, rgba(37, 211, 102, 0.08), rgba(197, 160, 89, 0.08));
    border: 1px solid rgba(197, 160, 89, 0.28);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
  }

  .btn-cta {
    display: inline-block;
    background: #25d366;
    color: #ffffff;
    padding: 0.9rem 1.6rem;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.02em;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 18px rgba(37, 211, 102, 0.25);
  }

  .btn-cta:hover {
    background: #1fb855;
    transform: translateY(-1px);
  }

  .btn-cta-large {
    padding: 1rem 2rem;
    font-size: 1.05rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .gallery-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .hero-text {
      order: 1;
    }

    .hero-media {
      order: 2;
    }
  }
</style>
`;

fs.writeFileSync(
  path.join(root, 'src/pages/gemeentes/[gemeente].astro'),
  content,
  'utf8'
);

fs.writeFileSync(
  path.join(root, 'scripts/generate-log.txt'),
  `Generated professional [gemeente].astro with ${gemeentes.length} gemeentes\n`,
  'utf8'
);

console.log(`Generated professional [gemeente].astro with ${gemeentes.length} gemeentes`);
