#!/usr/bin/env node
/* Static assembler: pages/*.html + partials -> public/
   Each page starts with a META block:
   <!--META
   route: /services/
   title: ...
   description: ...
   jsonld: {...}          (optional, single line)
   scripts: /assets/js/generator.js   (optional, comma separated)
   -->                                                                */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public');
const read = (p) => readFileSync(join(root, p), 'utf8');

// Чистая пересборка: public целиком принадлежит скрипту.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });

const head = read('partials/head.html');
const header = read('partials/header.html');
const footer = read('partials/footer.html');
const SITE = 'https://yurenko.ru';

const parseMeta = (src) => {
  const m = src.match(/^<!--META\s*([\s\S]*?)-->/);
  if (!m) throw new Error('missing META block');
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: src.slice(m[0].length).trim() };
};

const routes = [];
for (const file of readdirSync(join(root, 'pages')).sort()) {
  if (!file.endsWith('.html')) continue;
  const { meta, body } = parseMeta(read(`pages/${file}`));
  const route = meta.route || '/';
  const extra = (meta.scripts || '').split(',').map((s) => s.trim()).filter(Boolean)
    .map((s) => `<script src="${s}" defer></script>`).join('\n');

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${SITE}${route}">
<meta property="og:title" content="${meta.ogtitle || meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="${SITE}${route}">
${head}
${meta.jsonld ? `<script type="application/ld+json">${meta.jsonld}</script>` : ''}
</head>
<body>

${header}

${body}

${footer}

<button class="totop" aria-label="Наверх"><svg viewBox="0 0 16 16" fill="none"><path d="M8 13V3M3 8l5-5 5 5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<div class="toast" role="status" aria-live="polite"></div>
<script src="/assets/js/app.js" defer></script>
${extra}
</body>
</html>
`;

  const dir = join(out, route === '/' ? '.' : route.replace(/^\/|\/$/g, ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  routes.push({ route, priority: route === '/' ? '1.0' : route.split('/').length > 3 ? '0.7' : '0.8' });
  console.log('built', route);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${SITE}${r.route}</loc><lastmod>${today}</lastmod><priority>${r.priority}</priority></url>`).join('\n') +
  `\n</urlset>\n`);

writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('sitemap + robots written -> public/');
