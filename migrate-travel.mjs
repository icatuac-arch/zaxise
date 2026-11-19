import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const SRC_APP = '/Users/branade/worldtourly/src/app';
const DST_APP = '/Users/branade/zaxise/src/app/travel';

// All internal travel route segments that need /travel prefix
const TRAVEL_ROUTES = [
  'accessibility-guide', 'adventure-guide', 'africa-guide', 'americas-guide',
  'asia-guide', 'bucket-list', 'compare', 'country', 'destinations', 'did-you-know',
  'dont-miss', 'download-maps', 'etiquette-guide', 'europe-guide', 'family-guide',
  'festivals', 'food-guide', 'guides', 'hidden-gems', 'language-guide',
  'language-toolkit', 'local-deals', 'maps', 'oceania-guide', 'offline-tools',
  'packing-list', 'photography-guide', 'plan', 'responsible-travel', 'safety',
  'shopping-guide', 'smart-tips', 'train-journeys', 'travel-by-type', 'travel-cost',
  'travel-personality', 'travel-quiz', 'trip-prep', 'visa-guide', 'weather-guide',
  'oceans-guide'
];

function transformContent(content) {
  let out = content;

  // 1. Remove Navbar/Footer imports entirely
  out = out.replace(/^import\s+Navbar\s+from\s+['"]@\/components\/Navbar['"].*\n/gm, '');
  out = out.replace(/^import\s+Footer\s+from\s+['"]@\/components\/Footer['"].*\n/gm, '');
  // Also remove any usage of <Navbar /> and <Footer /> tags
  out = out.replace(/<Navbar\s*\/>/g, '');
  out = out.replace(/<Footer\s*\/>/g, '');
  out = out.replace(/<Navbar>/g, '');
  out = out.replace(/<\/Navbar>/g, '');
  out = out.replace(/<Footer>/g, '');
  out = out.replace(/<\/Footer>/g, '');

  // 2. Fix @/data/* imports → @/data/travel/*
  out = out.replace(/@\/data\/destinations/g, '@/data/travel/destinations');
  out = out.replace(/@\/data\/country-images/g, '@/data/travel/country-images');
  out = out.replace(/@\/data\/smart-tips/g, '@/data/travel/smart-tips');
  out = out.replace(/@\/data\/advisories/g, '@/data/travel/advisories');
  out = out.replace(/@\/data\/types/g, '@/data/travel/types');
  out = out.replace(/@\/data\/countries\//g, '@/data/travel/countries/');
  // Generic fallback for any remaining @/data/ that isn't already prefixed
  out = out.replace(/@\/data\/(?!travel\/)/g, '@/data/travel/');

  // 3. Fix @/components/* imports → @/components/travel/*
  out = out.replace(/@\/components\/TravelAdvisoryBanner/g, '@/components/travel/TravelAdvisoryBanner');
  out = out.replace(/@\/components\/NearYou/g, '@/components/travel/NearYou');
  out = out.replace(/@\/components\/SearchBox/g, '@/components/travel/SearchBox');
  out = out.replace(/@\/components\/SeasonalHero/g, '@/components/travel/SeasonalHero');
  out = out.replace(/@\/components\/LocationBar/g, '@/components/travel/LocationBar');

  // 4. Remove @/lib/supabase imports
  out = out.replace(/^import\s+.*from\s+['"]@\/lib\/supabase.*['"].*\n/gm, '');

  // 5. Fix internal href links to have /travel prefix
  // Match href="/ROUTE where ROUTE is one of our travel routes
  // Pattern: href="/route" or href={`/route...`} or href="/route/something"
  for (const route of TRAVEL_ROUTES) {
    // href="/route" → href="/travel/route"
    out = out.replace(new RegExp(`href="/${route}(["/#?])`, 'g'), `href="/travel/${route}$1`);
    out = out.replace(new RegExp(`href="/${route}"`, 'g'), `href="/travel/${route}"`);
    // Template literals: href={`/route...`}
    out = out.replace(new RegExp('href=\\{`/' + route + '/', 'g'), 'href={`/travel/' + route + '/');
    out = out.replace(new RegExp("href=\\{`/" + route + "`\\}", 'g'), 'href={`/travel/' + route + '`}');
  }

  // Also handle the root "/" which should stay as "/" (homepage of zaxise, not travel)
  // But /country/ paths in template literals
  out = out.replace(/href=\{`\/country\//g, 'href={`/travel/country/');

  return out;
}

// Files to process
const FILES = [
  // Homepage
  { src: 'page.tsx', dst: 'page.tsx' },

  // Routes
  'accessibility-guide/layout.tsx', 'accessibility-guide/page.tsx',
  'adventure-guide/layout.tsx', 'adventure-guide/page.tsx',
  'africa-guide/layout.tsx', 'africa-guide/page.tsx',
  'americas-guide/layout.tsx', 'americas-guide/page.tsx',
  'asia-guide/layout.tsx', 'asia-guide/page.tsx',
  'bucket-list/layout.tsx', 'bucket-list/page.tsx',
  'compare/layout.tsx', 'compare/page.tsx',
  'country/[slug]/layout.tsx', 'country/[slug]/page.tsx',
  'country/[slug]/[stateId]/layout.tsx', 'country/[slug]/[stateId]/page.tsx',
  'country/[slug]/[stateId]/[cityId]/layout.tsx', 'country/[slug]/[stateId]/[cityId]/page.tsx',
  'destinations/layout.tsx', 'destinations/page.tsx',
  'did-you-know/layout.tsx', 'did-you-know/page.tsx',
  'dont-miss/layout.tsx', 'dont-miss/page.tsx',
  'download-maps/layout.tsx', 'download-maps/page.tsx',
  'etiquette-guide/layout.tsx', 'etiquette-guide/page.tsx',
  'europe-guide/layout.tsx', 'europe-guide/page.tsx',
  'family-guide/layout.tsx', 'family-guide/page.tsx',
  'festivals/layout.tsx', 'festivals/page.tsx',
  'food-guide/layout.tsx', 'food-guide/page.tsx',
  'guides/layout.tsx', 'guides/page.tsx',
  'hidden-gems/layout.tsx', 'hidden-gems/page.tsx',
  'language-guide/layout.tsx', 'language-guide/page.tsx',
  'language-toolkit/layout.tsx', 'language-toolkit/page.tsx',
  'local-deals/layout.tsx', 'local-deals/page.tsx',
  'maps/layout.tsx', 'maps/page.tsx',
  'oceania-guide/layout.tsx', 'oceania-guide/page.tsx',
  'offline-tools/layout.tsx', 'offline-tools/page.tsx',
  'packing-list/layout.tsx', 'packing-list/page.tsx',
  'photography-guide/layout.tsx', 'photography-guide/page.tsx',
  'plan/layout.tsx', 'plan/page.tsx',
  'responsible-travel/layout.tsx', 'responsible-travel/page.tsx',
  'safety/layout.tsx', 'safety/page.tsx',
  'shopping-guide/layout.tsx', 'shopping-guide/page.tsx',
  'smart-tips/layout.tsx', 'smart-tips/page.tsx',
  'train-journeys/layout.tsx', 'train-journeys/page.tsx',
  'travel-by-type/layout.tsx', 'travel-by-type/page.tsx',
  'travel-cost/layout.tsx', 'travel-cost/page.tsx',
  'travel-personality/layout.tsx', 'travel-personality/page.tsx',
  'travel-quiz/layout.tsx', 'travel-quiz/page.tsx',
  'trip-prep/layout.tsx', 'trip-prep/page.tsx',
  'visa-guide/layout.tsx', 'visa-guide/page.tsx',
  'weather-guide/layout.tsx', 'weather-guide/page.tsx',
];

const SRC_COMPONENTS = '/Users/branade/worldtourly/src/components';
const DST_COMPONENTS = '/Users/branade/zaxise/src/components/travel';

const COMPONENT_FILES = [
  'LocationBar.tsx',
  'NearYou.tsx',
  'SearchBox.tsx',
  'SeasonalHero.tsx',
  'TravelAdvisoryBanner.tsx',
];

// --- CLEANUP PASS: Fix double travel/travel introduced by running script twice ---
import { readdirSync } from 'fs';

function fixDoubleTravelInDir(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      fixDoubleTravelInDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = readFileSync(fullPath, 'utf8');
      if (content.includes('@/data/travel/travel/') || content.includes('@/components/travel/travel/')) {
        const fixed = content
          .replace(/@\/data\/travel\/travel\//g, '@/data/travel/')
          .replace(/@\/components\/travel\/travel\//g, '@/components/travel/');
        writeFileSync(fullPath, fixed, 'utf8');
        console.log(`FIXED double-travel: ${fullPath}`);
      }
    }
  }
}

fixDoubleTravelInDir('/Users/branade/zaxise/src/app/travel');
fixDoubleTravelInDir('/Users/branade/zaxise/src/components/travel');

let copied = 0;
let errors = 0;

// Process components first
for (const file of COMPONENT_FILES) {
  const srcPath = join(SRC_COMPONENTS, file);
  const dstPath = join(DST_COMPONENTS, file);
  try {
    const content = readFileSync(srcPath, 'utf8');
    const transformed = transformContent(content);
    const dir = dirname(dstPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(dstPath, transformed, 'utf8');
    copied++;
    console.log(`OK component: ${file}`);
  } catch (e) {
    errors++;
    console.error(`ERR component: ${srcPath} → ${e.message}`);
  }
}

for (const file of FILES) {
  const srcPath = typeof file === 'string'
    ? join(SRC_APP, file)
    : join(SRC_APP, file.src);
  const dstPath = typeof file === 'string'
    ? join(DST_APP, file)
    : join(DST_APP, file.dst);

  try {
    const content = readFileSync(srcPath, 'utf8');
    const transformed = transformContent(content);
    const dir = dirname(dstPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(dstPath, transformed, 'utf8');
    copied++;
    console.log(`OK: ${typeof file === 'string' ? file : file.src}`);
  } catch (e) {
    errors++;
    console.error(`ERR: ${srcPath} → ${e.message}`);
  }
}

console.log(`\nDone: ${copied} copied, ${errors} errors`);
