#!/usr/bin/env node
/* Генерация OG-изображений 1200x630 для каждой страницы.
   Рендерит tools/og-template.html в headless-браузере gstack browse.

   Запуск:  npm run og
   Требует: локальный статик-сервер на :3140 (npm run dev) — шаблон открывается по http,
            чтобы корректно подтянулись шрифты и фото.                            */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets/img/og');
mkdirSync(outDir, { recursive: true });

const BROWSE = [
  join(root, '.claude/skills/gstack/browse/dist/browse'),
  join(process.env.HOME, '.claude/skills/gstack/browse/dist/browse'),
  join(root, '../.claude/skills/gstack/browse/dist/browse')
].find(existsSync);

if (!BROWSE) {
  console.error('Не найден бинарник gstack browse — генерация OG пропущена.');
  process.exit(1);
}

const BASE = process.env.OG_BASE || 'http://localhost:3140';

/* Каждая карточка: имя файла + содержимое. <em> красит слово акцентом. */
const CARDS = [
  { file: 'home', portrait: 1,
    eyebrow: 'Дизайн торговых пространств',
    title: 'Дизайн, который <em>продаёт</em> в торговом центре',
    desc: '', p1: '18 торговых центров', p2: '800+ брендов' },

  { file: 'services',
    eyebrow: 'Услуги',
    title: 'Четыре способа сделать пространство <em>заметным</em>',
    desc: 'Стандарты для ТЦ, проект магазина, аудит витрины, обучение арендаторов.',
    p1: 'от 15 000 ₽', p2: 'Россия и Казахстан' },

  { file: 'mall-standards',
    eyebrow: 'Для торговых центров',
    title: 'Дизайн-стандарты, по которым арендатор <em>откроется сам</em>',
    desc: 'Дизайн-код, альбом типовых решений, чек-лист согласования.',
    p1: 'от 300 000 ₽', p2: 'от 6 недель' },

  { file: 'retail-design',
    eyebrow: 'Для брендов и арендаторов',
    title: 'Проект магазина, который <em>разворачивает поток внутрь</em>',
    desc: 'Концепция, витрина под регламент ТЦ, планограмма, документация.',
    p1: 'от 2 000 ₽ / м²', p2: 'Концепция за 2–4 недели' },

  { file: 'consulting',
    eyebrow: 'Консультация и аудит',
    title: 'Разбор объекта, после которого <em>понятно, что делать</em>',
    desc: 'Витрина, вход, зонирование, навигация, свет — с планом изменений.',
    p1: 'от 15 000 ₽ / час', p2: 'Онлайн или на площадке' },

  { file: 'training',
    eyebrow: 'Обучение арендаторов',
    title: 'Тренинг, после которого зал меняется <em>в тот же день</em>',
    desc: 'Программа под требования вашего ТЦ, практика прямо в галерее.',
    p1: 'от 50 000 ₽ / день', p2: '578 магазинов за год' },

  { file: 'generator',
    eyebrow: 'Бесплатно · без регистрации',
    title: 'Соберите техническое задание <em>за 5 минут</em>',
    desc: 'Пошаговый визард превращает ответы в структурированное ТЗ с оценкой.',
    p1: '7 шагов', p2: 'ТЗ на почту' },

  { file: 'revizor',
    eyebrow: 'Проект Алёны Юренко',
    title: '«Ревизорро по ТЦ» — <em>71 выпуск</em> изнутри галерей',
    desc: 'Прямые эфиры из торговых центров России, Казахстана и США.',
    p1: '3 страны', p2: '20+ экспертов' },

  { file: 'about', portrait: 1,
    eyebrow: 'О нас',
    title: 'Интегрируем бренды в <em>экосистему торговых центров</em>',
    desc: '', p1: '9 лет в отрасли', p2: 'Алёна Юренко' },

  { file: 'cases',
    eyebrow: 'Кейсы и отзывы',
    title: 'Что меняется <em>после работы</em>',
    desc: 'Типовые задачи, отзывы управляющих компаний и инсайты участников.',
    p1: 'Рост продаж 10–30%', p2: '800+ открытий' },

  { file: 'contacts',
    eyebrow: 'Контакты',
    title: 'Ответит <em>живой человек</em>, а не бот',
    desc: 'Будни с 10:00 до 19:00. Телефон, почта, Telegram, встреча на 30 минут.',
    p1: '+7 965 319-34-07', p2: 'Москва' },

  { file: 'policy',
    eyebrow: 'Документы',
    title: 'Политика <em>конфиденциальности</em>',
    desc: 'Какие данные мы собираем через формы, зачем и как их удалить.',
    p1: 'ИП Юренко Елена', p2: 'Москва' }
];

const run = (args) => execFileSync(BROWSE, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

/* Карточки рендерятся как готовые страницы: статик-сервер режет query-строку,
   поэтому подставляем значения в шаблон заранее. */
const template = readFileSync(join(root, 'tools/og-template.html'), 'utf8');
const stage = join(root, 'public/_og');
mkdirSync(stage, { recursive: true });

run(['viewport', '1200x630']);

for (const c of CARDS) {
  const plain = c.title.replace(/<[^>]+>/g, '');
  const html = template
    .replace('__BODYCLASS__', c.portrait ? 'has-portrait' : '')
    .replace('__EYEBROW__', c.eyebrow)
    .replace('__TITLECLASS__', plain.length > 46 ? 'small' : '')
    .replace('__TITLE__', c.title)
    .replace('__DESC__', c.desc ? `<p class="desc">${c.desc}</p>` : '')
    .replace('__P1__', c.p1 ? `<span class="pill accent">${c.p1}</span>` : '')
    .replace('__P2__', c.p2 ? `<span class="pill">${c.p2}</span>` : '')
    .replace('__PORTRAIT__', c.portrait
      ? '<img class="portrait" src="/assets/img/aliona-portrait.jpg" alt="">' : '');

  writeFileSync(join(stage, `${c.file}.html`), html);
  run(['goto', `${BASE}/_og/${c.file}.html`]);
  run(['js', 'await document.fonts.ready; await new Promise(r=>setTimeout(r,350)); 1']);
  run(['screenshot', '--viewport', join(outDir, `${c.file}.png`)]);
  console.log('og:', c.file);
}

rmSync(stage, { recursive: true, force: true });
run(['viewport', '1440x900']);
console.log(`\nГотово: ${CARDS.length} карточек в assets/img/og/`);
