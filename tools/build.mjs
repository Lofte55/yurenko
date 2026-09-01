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
const BRAND = 'YURENKO';
const METRIKA_ID = '112141491';

/* Яндекс.Метрика. Не грузится на localhost, чтобы не пачкать статистику. */
const metrika = `<script>
(function(m,e,t,r,i,k,a){if(location.hostname==='localhost'||location.hostname==='127.0.0.1')return;
m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,'script','https://mc.webvisor.org/metrika/tag_ww.js?id=${METRIKA_ID}','ym');
window.ym&&ym(${METRIKA_ID},'init',{ssr:true,webvisor:true,trackHash:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${METRIKA_ID}" style="position:absolute;left:-9999px" alt=""></div></noscript>`;

/* Хлебные крошки для поисковиков собираются из маршрута и заголовков страниц. */
const CRUMB_NAMES = {
  '/services/': 'Услуги',
  '/services/mall-standards/': 'Дизайн-стандарты для ТЦ',
  '/services/retail-design/': 'Проектирование магазина',
  '/services/consulting/': 'Консультация и аудит',
  '/services/training/': 'Обучение арендаторов',
  '/revizor/': 'Ревизорро по ТЦ',
  '/generator/': 'Генератор ТЗ',
  '/about/': 'О нас',
  '/cases/': 'Кейсы и отзывы',
  '/contacts/': 'Контакты',
  '/policy/': 'Политика конфиденциальности'
};

const breadcrumbs = (route) => {
  if (route === '/') return null;
  const items = [{ name: 'Главная', url: SITE + '/' }];
  const parts = route.split('/').filter(Boolean);
  let acc = '';
  for (const part of parts) {
    acc += '/' + part;
    const url = acc + '/';
    items.push({ name: CRUMB_NAMES[url] || part, url: SITE + url });
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: it.url
    }))
  });
};

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

  const ogImage = `${SITE}/assets/img/og/${meta.og || 'home'}.png`;
  const crumbs = breadcrumbs(route);
  const noindex = meta.noindex === 'true';

  /* FAQPage: даёт расширенный сниппет в выдаче. */
  let faq = null;
  if (meta.faq) {
    faq = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: JSON.parse(meta.faq).map((i) => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a }
      }))
    });
  }

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${SITE}${route}">
<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="theme-color" content="#ffffff">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${meta.ogtitle || meta.title}">
<meta property="og:description" content="${meta.ogdescription || meta.description}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="${SITE}${route}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="${meta.ogtitle || meta.title}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.ogtitle || meta.title}">
<meta name="twitter:description" content="${meta.ogdescription || meta.description}">
<meta name="twitter:image" content="${ogImage}">
${head}
${meta.jsonld ? `<script type="application/ld+json">${meta.jsonld}</script>` : ''}
${crumbs ? `<script type="application/ld+json">${crumbs}</script>` : ''}
${faq ? `<script type="application/ld+json">${faq}</script>` : ''}
${metrika}
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

  if (route === '/404/') {
    // Vercel отдаёт 404.html из корня выходной папки для несуществующих адресов.
    writeFileSync(join(out, '404.html'), html);
  } else {
    const dir = join(out, route === '/' ? '.' : route.replace(/^\/|\/$/g, ''));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
  }
  if (!noindex) {
    routes.push({
      route,
      priority: route === '/' ? '1.0' : route.split('/').length > 3 ? '0.7' : '0.8',
      changefreq: route === '/' ? 'weekly' : 'monthly'
    });
  }
  console.log('built', route);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url>\n    <loc>${SITE}${r.route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`).join('\n') +
  `\n</urlset>\n`);

writeFileSync(join(out, 'robots.txt'), [
  'User-agent: *',
  'Allow: /',
  'Disallow: /_og/',
  'Disallow: /api/',
  '',
  'User-agent: Yandex',
  'Allow: /',
  'Disallow: /_og/',
  'Disallow: /api/',
  `Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid`,
  '',
  `Sitemap: ${SITE}/sitemap.xml`,
  ''
].join('\n'));
console.log('sitemap + robots written -> public/');
