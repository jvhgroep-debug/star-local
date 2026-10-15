import type { LocalServicePageContent } from './local-services/types';
import type { IndustryLocalServicePageContent } from './local-industries/types';

export interface PrioritySection {
  title: string;
  paragraphs: string[];
  checklist: string[];
  links: { href: string; label: string }[];
}
const profiles: Record<string, { title: string; description: string; intro: string; section: PrioritySection }> = {
  zeist: {
    title: 'Google Bedrijfsprofiel Zeist optimaliseren | Star Local',
    description: 'Beter zichtbaar in Google Maps in Zeist? Star Local helpt met categorieën, bedrijfsgegevens, foto’s en je website. Vraag een profielanalyse aan.',
    intro: 'Een klant die in Zeist naar jouw dienst zoekt, wil snel zien wat je doet, waar je werkt en hoe hij contact opneemt. We controleren je Google Bedrijfsprofiel en de aansluiting op je website, zodat die informatie klopt.',
    section: {
      title: 'Een duidelijk profiel voor klanten in Zeist',
      paragraphs: ['Heb je een bezoekadres, ontvang je uitsluitend op afspraak of werk je bij klanten op locatie? Die situatie bepaalt welke adres- en servicegebiedgegevens passend zijn. We bespreken dit voordat we je profiel aanpassen.', 'Daarna vergelijken we de bedrijfsnaam, contactgegevens, openingstijden en diensten met je website. Een extra plaatsnaam in je bedrijfsnaam is geen oplossing: het profiel moet je werkelijke bedrijf beschrijven.'],
      checklist: ['Passende hoofd- en aanvullende categorieën kiezen op basis van je echte diensten.', 'Reguliere openingstijden, afwijkende openingstijden en contactroutes nalopen.', 'Eigen bedrijfsfoto’s en een duidelijke beschrijving van je diensten toevoegen.', 'De profielverwijzing laten aansluiten op een relevante pagina van je website.'],
      links: [{href:'/diensten/google-bedrijfsprofiel/',label:'Wat Google Bedrijfsprofiel-optimalisatie inhoudt'},{href:'/zeist/lokale-seo/',label:'Lokale SEO voor je website in Zeist'},{href:'/contact/',label:'Vraag een profielanalyse voor Zeist aan'}]
    }
  },
  nijmegen: {
    title: 'Google Bedrijfsprofiel Nijmegen verbeteren | Star Local',
    description: 'Google Bedrijfsprofiel in Nijmegen verbeteren? Laat je categorieën, openingstijden, diensten en website controleren. Vraag Star Local om advies.',
    intro: 'Ziet een potentiële klant in Nijmegen meteen de juiste diensten, openingstijden en contactgegevens? Star Local helpt je Google Bedrijfsprofiel en je website op elkaar af te stemmen, met een concrete lijst verbeterpunten.',
    section: {
      title: 'Van een zoekopdracht in Nijmegen naar een aanvraag',
      paragraphs: ['We beginnen met de informatie die klanten nodig hebben om te beslissen: wat bied je aan, kun je hen op hun locatie helpen en hoe nemen ze contact op? Voor een bedrijf met een bezoekadres zijn andere profielgegevens relevant dan voor een dienstverlener die bij klanten komt.', 'Je profiel en website vormen samen de contactroute. Een klik naar een algemene homepage kan minder duidelijk zijn dan een pagina die de gevraagde dienst uitlegt. We controleren daarom ook de bestemmingspagina, mobiele contactknoppen en de juistheid van je contactgegevens.'],
      checklist: ['Controleren of de gekozen categorie past bij de belangrijkste bedrijfsactiviteit.', 'Diensten en informatie op het profiel vergelijken met de website.', 'Foto’s, openingstijden en de route naar bellen of aanvragen nalopen.', 'Afspreken welke profielinteracties en websiteaanvragen je gaat volgen.'],
      links: [{href:'/nijmegen/lokale-seo/',label:'Website en lokale SEO in Nijmegen'},{href:'/diensten/google-bedrijfsprofiel/',label:'Onze aanpak voor Google Bedrijfsprofielen'},{href:'/contact/',label:'Bespreek je profiel in Nijmegen'}]
    }
  }
};
const helmond: PrioritySection = {
 title:'Waar verliezen bezoekers op je website de weg?',
 paragraphs:['Conversie-optimalisatie begint bij één concreet doel: meer relevante aanvragen, reserveringen of bestellingen uit de bezoekers die je al krijgt. Voor je bedrijf in Helmond brengen we eerst de route van een belangrijke landingspagina naar dat doel in kaart.', 'We bekijken de mobiele weergave, begrijpelijkheid van je aanbod, zichtbaarheid van contactknoppen en de lengte van formulieren. Heb je betrouwbare meetgegevens, dan gebruiken we die om verbeteringen te prioriteren. Zonder die gegevens beginnen we met een controle en een meetplan; we beloven geen vooraf vastgesteld groeipercentage.'],
 checklist:['Kies welke actie telt: offerte, telefoongesprek, WhatsApp-aanvraag of bestelling.', 'Controleer of de belangrijkste vragen vóór de contactknop worden beantwoord.', 'Haal overbodige stappen en velden uit de aanvraagroute.', 'Vergelijk de resultaten na aanpassing en houd rekening met veranderingen in verkeer.'],
 links:[{href:'/diensten/conversie-optimalisatie/',label:'Hoe we conversie-optimalisatie aanpakken'},{href:'/helmond/website-laten-maken/',label:'Een duidelijke website voor je bedrijf in Helmond'},{href:'/projecten/',label:'Bekijk bestaande Star Local-projecten'},{href:'/contact/',label:'Vraag een websiteanalyse voor Helmond aan'}]
};
const horeca: PrioritySection = {
 title:'Een horecawebsite waarop gasten direct kunnen kiezen',
 paragraphs:['Voor een restaurant, lunchroom of café in Doetinchem moet een website meer doen dan de sfeer tonen. Gasten willen je menukaart lezen op hun telefoon, openingstijden controleren en zonder zoeken kunnen reserveren of bestellen.', 'We bespreken eerst hoe je zaak werkt: tafelreserveringen, afhalen, bezorgen of aanvragen voor groepen. Daarna bouwen we de website rond die routes. Een bestaande reserverings- of bestelservice kan als duidelijke vervolgstap worden gekoppeld; de mogelijkheden en eventuele kosten bespreken we vooraf.'],
 checklist:['Een leesbare menukaart als webpagina, met actuele gerechten en prijzen.', 'Eigen foto’s, bereikbaarheid en duidelijke contact- en openingstijden.', 'Reserveren of bestellen bereikbaar vanaf de belangrijkste pagina’s.', 'Aparte informatie voor groepen, arrangementen of zaalverhuur wanneer je die aanbiedt.'],
 links:[{href:'/portfolio/captain-crabbys/',label:'Bekijk het restaurantproject Captain Crabby’s'},{href:'/portfolio/kothu-labs-breda/',label:'Bekijk het horecaproject Kothu Labs Breda'},{href:'/doetinchem/website-laten-maken/',label:'Website laten maken in Doetinchem'},{href:'/contact/',label:'Bespreek jouw horecawebsite'}]
};
export function getPrioritySection(path: string): PrioritySection | undefined {
 if(path==='/helmond/conversie-optimalisatie/') return helmond;
 if(path==='/doetinchem/website-laten-maken/restaurants/') return horeca;
 for(const [city,profile] of Object.entries(profiles)) if(path===`/${city}/google-bedrijfsprofiel/`) return profile.section;
}
export function improveLocalService(content: LocalServicePageContent): LocalServicePageContent {
 const profile=content.serviceSlug==='google-bedrijfsprofiel' ? profiles[content.citySlug] : undefined;
 if(profile) return {...content,seo:{title:profile.title,description:profile.description},hero:{...content.hero,h1:`Google Bedrijfsprofiel ${content.city} optimaliseren`,intro:profile.intro},faqs:[{question:'Welke informatie hebben jullie nodig voor een profielanalyse?',answer:'Stuur de link naar je Google Bedrijfsprofiel, je website en een korte beschrijving van je diensten. Voor daadwerkelijke aanpassingen is passende beheerderstoegang nodig; deel je wachtwoord niet.'},{question:'Kunnen jullie een eerste positie in Google Maps garanderen?',answer:'Nee. Lokale resultaten hangen onder meer samen met relevantie, afstand en bekendheid. We verbeteren de informatie en contactroutes die je kunt beïnvloeden en bespreken hoe je veranderingen volgt.'},...content.faqs]};
 if(content.citySlug==='helmond' && content.serviceSlug==='conversie-optimalisatie') return {...content,seo:{title:'Conversie optimalisatie Helmond | Meer aanvragen | Star Local',description:'Meer aanvragen uit je website in Helmond? Star Local analyseert mobiele pagina’s, formulieren en contactroutes. Vraag een concrete websiteanalyse aan.'},hero:{...content.hero,h1:'Conversie optimalisatie in Helmond',intro:'Krijg je bezoekers, maar weinig aanvragen? We onderzoeken waar de contactroute onduidelijk of omslachtig wordt en maken een praktisch verbeterplan voor je website.'},faqs:[{question:'Moet ik veel bezoekers hebben om te kunnen starten?',answer:'Nee. Ook bij weinig verkeer kun je onduidelijke teksten, mobiele obstakels en lange formulieren verbeteren. Voor een betrouwbare A/B-test is voldoende verkeer nodig; bij kleine aantallen gebruiken we eerst een controle en een meetplan.'},{question:'Hoe meten we of een aanpassing werkt?',answer:'We spreken vooraf af welke actie telt en hoe we die registreren. Daarna vergelijken we aanvragen en verkeer over een passende periode, met aandacht voor seizoenen en veranderingen in bezoekersbronnen.'},...content.faqs]};
 return content;
}
export function improveIndustryService(content: IndustryLocalServicePageContent): IndustryLocalServicePageContent {
 if(content.citySlug!=='doetinchem' || content.industrySlug!=='restaurants') return content;
 return {...content,seo:{title:'Horeca website laten maken in Doetinchem | Star Local',description:'Horeca website laten maken in Doetinchem? Voor restaurants en cafés: een mobiele menukaart, duidelijke reserveringsroute en lokale vindbaarheid.'},hero:{...content.hero,h1:'Horeca website laten maken in Doetinchem',intro:'Laat gasten je menukaart ontdekken, openingstijden vinden en direct reserveren of bestellen. Star Local bouwt een duidelijke website voor je restaurant, lunchroom of café in Doetinchem.'},faqs:[{question:'Kunnen jullie onze huidige bestel- of reserveringsservice behouden?',answer:'We bekijken welke service je gebruikt en welke koppeling mogelijk is. Vaak kan een duidelijke knop naar je bestaande boekings- of bestelomgeving verwijzen. Voor aanvullende integraties bespreken we vooraf de mogelijkheden en kosten.'},{question:'Wat hebben jullie nodig om onze horecawebsite te maken?',answer:'Je actuele menukaart, openingstijden, contactgegevens, eigen foto’s en de gewenste reserverings- of bestelroute. We bespreken ook eventuele groepsarrangementen en wie de informatie na oplevering bijhoudt.'},...content.faqs]};
}
