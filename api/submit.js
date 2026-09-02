/* Приём заявок с сайта: Telegram + e-mail (Resend).
   Переменные окружения Vercel:
     TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
     RESEND_API_KEY, MAIL_FROM, MAIL_TO
     ALLOWED_ORIGIN (например https://yurenko.ru)
   Любая пара может отсутствовать — канал просто не используется. */

const LABELS = {
  hero: 'Заявка из шапки',
  'home-cta': 'Заявка с главной',
  contacts: 'Форма контактов',
  'mall-standards': 'Запрос КП: дизайн-стандарты ТЦ',
  'retail-design': 'Запрос расчёта: проект магазина',
  consulting: 'Заявка на консультацию',
  training: 'Запрос программы обучения',
  'revizor-subscribe': 'Подписка на «Ревизорро по ТЦ»',
  'tz-generator': 'Техническое задание из генератора'
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req, res) {
  const allowed = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { type = 'unknown', page = '', utm = '', fields = {}, document: doc = '' } = body;

  if (fields._gotcha) return res.status(200).json({ ok: true });

  const title = LABELS[type] || `Заявка: ${type}`;
  const lines = Object.entries(fields)
    .filter(([k, v]) => k !== '_gotcha' && String(v || '').trim())
    .map(([k, v]) => `${k}: ${v}`);

  const plain = [
    title,
    '',
    ...lines,
    '',
    `Страница: ${page}${utm}`,
    doc ? '\n———\n' + doc : ''
  ].join('\n').trim();

  const tasks = [];

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    // Telegram ограничивает сообщение 4096 символами — длинное ТЗ отправляем файлом.
    if (plain.length <= 3800) {
      tasks.push(fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text: plain, disable_web_page_preview: true })
      }));
    } else {
      const form = new FormData();
      form.append('chat_id', tgChat);
      form.append('caption', [title, ...lines, `Страница: ${page}${utm}`].join('\n').slice(0, 1000));
      form.append('document', new Blob([plain], { type: 'text/markdown' }), 'tz.md');
      tasks.push(fetch(`https://api.telegram.org/bot${tgToken}/sendDocument`, { method: 'POST', body: form }));
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.MAIL_FROM;
  const mailTo = process.env.MAIL_TO;
  if (resendKey && mailFrom && mailTo) {
    const html = `<h2>${esc(title)}</h2><ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` +
      `<p>Страница: ${esc(page + utm)}</p>` +
      (doc ? `<hr><pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${esc(doc)}</pre>` : '');

    const send = (to, subject, content) => fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: mailFrom, to, subject, html: content })
    });

    tasks.push(send(mailTo.split(',').map((s) => s.trim()), title, html));

    // Копия клиенту с готовым ТЗ.
    const clientEmail = String(fields.email || '').trim();
    if (doc && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail)) {
      tasks.push(send([clientEmail], 'Ваше техническое задание — YURENKO',
        `<p>Здравствуйте${fields.name ? ', ' + esc(fields.name) : ''}!</p>` +
        `<p>Ниже — техническое задание, которое вы собрали на yurenko.ru. Мы получили копию и вернёмся с оценкой сроков и бюджета в течение рабочего дня.</p>` +
        `<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${esc(doc)}</pre>` +
        `<p>Команда YURENKO · +7 993 339-34-07</p>`));
    }
  }

  if (!tasks.length) {
    console.warn('submit: no delivery channel configured', title);
    return res.status(200).json({ ok: true, delivered: false });
  }

  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value && r.value.ok);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('submit delivery failed', r.reason);
  });

  return res.status(delivered ? 200 : 502).json({ ok: delivered });
}
