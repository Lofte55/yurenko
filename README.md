# YURENKO

Сайт компании YURENKO — ритейл-дизайн торговых центров.
Статический многостраничник: HTML, CSS, ванильный JS. Без фреймворков и базы данных.

**Полное описание проекта, правила редактирования и деплой — в [PROJECT.md](PROJECT.md).**

## Быстрый старт

```bash
npm run build
npx serve -l 3140 .
```

## Главное правило

Текст правим **только** в `pages/`. Файлы `index.html` в корне и в папках маршрутов
генерируются скриптом `tools/build.mjs` и перезаписываются при каждой сборке.

## Структура

```
pages/          исходники страниц (META + <main>) — редактируем здесь
partials/       общие шапка, подвал, head
assets/css/     дизайн-система и стили генератора
assets/js/      поведение сайта и логика генератора ТЗ
assets/fonts/   самохостинг Manrope
assets/img/     изображения
api/submit.js   приём заявок: Telegram + Resend
tools/build.mjs сборщик
```

## Перед запуском на проде

Задайте переменные окружения в Vercel, иначе заявки никуда не придут:
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`,
`ALLOWED_ORIGIN`. Подробности — в [PROJECT.md](PROJECT.md#6-приём-заявок).
