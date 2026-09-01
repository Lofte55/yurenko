/* YURENKO — генератор технического задания.
   Пошаговый визард: сфера -> объект -> цели -> состав -> ограничения -> материалы -> контакты.
   Ответы собираются в структурированный документ и уходят в /api/submit. */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = $('#gen');
  if (!root) return;

  /* ---------- Справочник сфер ---------- */
  var SCOPES = {
    mall: {
      title: 'Дизайн-стандарты для торгового центра',
      lead: 'Регламент для арендаторов: входные группы, витрины, вывески, свет и материалы.',
      price: 'от 300 000 ₽',
      unit: 'объект',
      objectLabel: 'Параметры торгового центра',
      areaLabel: 'Общая площадь объекта, м²',
      areaHint: 'GLA или общая — как считаете вы',
      works: [
        'Аудит текущей галереи и категорий арендаторов',
        'Классификация форматов и типов помещений',
        'Дизайн-код: цвет, витрина, история, свет, фокус, рельеф, воздух, декор',
        'Альбом типовых решений по форматам площадей',
        'Чек-лист согласования эскизов арендатора',
        'Презентация стандарта команде ТЦ и арендаторам',
        'Сопровождение первых согласований',
        'Ревизия и обновление действующего регламента'
      ],
      goals: [
        'Сократить срок согласования эскиза арендатора',
        'Поднять визуальный класс галереи',
        'Убрать разнобой вывесок и витрин',
        'Ускорить открытие новых арендаторов',
        'Повысить трафик и время пребывания',
        'Подготовить объект к реконцепции'
      ]
    },
    store: {
      title: 'Дизайн-проект магазина в ТЦ',
      lead: 'Концепция и рабочий проект торговой точки в галерее торгового центра.',
      price: 'от 2 000 ₽ / м²',
      unit: 'м²',
      objectLabel: 'Параметры помещения',
      areaLabel: 'Площадь помещения, м²',
      areaHint: 'Торговый зал плюс подсобные помещения',
      works: [
        'Аналитика категории и конкурентов на этаже',
        'Концепция и зонирование торгового зала',
        'Сценарий пути покупателя',
        'Витрина и входная группа под регламент ТЦ',
        'Планограмма и схема выкладки',
        'Световой сценарий',
        'Спецификация отделки и торгового оборудования',
        'Рабочая документация для подрядчика',
        'Авторский надзор на монтаже',
        '3D-визуализация ключевых ракурсов'
      ],
      goals: [
        'Увеличить конверсию входа в галерее',
        'Сделать новую коллекцию заметной с прохода',
        'Увеличить глубину захода в зал',
        'Поднять средний чек через выкладку',
        'Привести точку к стандарту сети',
        'Пройти согласование в торговом центре'
      ]
    },
    island: {
      title: 'Проект острова, киоска или поп-ап формата',
      lead: 'Малый формат в галерее: круговой обзор, жёсткие ограничения, быстрый монтаж.',
      price: 'от 2 000 ₽ / м²',
      unit: 'м²',
      objectLabel: 'Параметры точки',
      areaLabel: 'Площадь пятна, м²',
      areaHint: 'Габариты острова или киоска',
      works: [
        'Концепция и конструктив малого формата',
        'Проработка кругового обзора и 360° витрины',
        'Схема хранения и рабочего места продавца',
        'Брендирование и навигация',
        'Световое решение',
        'Спецификация конструкций и материалов',
        'Рабочая документация для производства',
        'Сопровождение изготовления и монтажа'
      ],
      goals: [
        'Остановить поток в проходе галереи',
        'Проверить гипотезу до долгой аренды',
        'Уместить ассортимент и хранение в габарит',
        'Пройти согласование по высоте и материалам',
        'Собрать формат, тиражируемый в другие ТЦ'
      ]
    },
    food: {
      title: 'Проект точки фуд-корта или ресторанной зоны',
      lead: 'Общепит в торговом центре: витрина, меню-борд, поток гостей и технология.',
      price: 'по запросу',
      unit: 'м²',
      objectLabel: 'Параметры точки',
      areaLabel: 'Площадь, м²',
      areaHint: 'Зал плюс производственная зона',
      works: [
        'Концепция и позиционирование точки',
        'Зонирование: линия раздачи, касса, посадка',
        'Фасад, меню-борд и навигация по меню',
        'Витрина и презентация продукта',
        'Световое решение зоны',
        'Согласование с технологической схемой',
        'Спецификация отделки и оборудования',
        'Рабочая документация'
      ],
      goals: [
        'Ускорить очередь и увеличить пропускную способность',
        'Сделать меню читаемым за 5 секунд',
        'Выделиться в общей линии фуд-корта',
        'Поднять средний чек через презентацию блюд',
        'Пройти согласование с эксплуатацией ТЦ'
      ]
    },
    windows: {
      title: 'Витрины и входная группа',
      lead: 'Отдельная работа с фасадом магазина: витрина, портал, вывеска, сезонное оформление.',
      price: 'по запросу',
      unit: 'м²',
      objectLabel: 'Параметры фасада',
      areaLabel: 'Ширина фасада, м',
      areaHint: 'Длина витринной линии по галерее',
      works: [
        'Аудит текущей витрины и входной зоны',
        'Концепция витрины и главного фокуса',
        'Дизайн вывески и портала',
        'Календарь сезонных витрин на год',
        'Схема освещения витрины',
        'Инструкция для персонала по смене экспозиции',
        'Согласование с регламентом торгового центра'
      ],
      goals: [
        'Развернуть поток из галереи внутрь',
        'Сделать сообщение считываемым за 3 секунды',
        'Освободить входную зону',
        'Настроить сезонную ротацию без дизайнера',
        'Привести фасад к требованиям ТЦ'
      ]
    },
    training: {
      title: 'Обучение арендаторов и персонала',
      lead: 'Тренинг по визуальным продажам и дизайн-коду под конкретный торговый центр.',
      price: 'от 50 000 ₽ / тренинг-день',
      unit: 'день',
      objectLabel: 'Параметры группы',
      areaLabel: 'Количество участников',
      areaHint: 'Примерное число арендаторов или сотрудников',
      works: [
        'Разработка программы под требования ТЦ',
        'Вёрстка презентации с примерами из вашей галереи',
        'Проведение тренинг-дня офлайн',
        'Проведение сессии онлайн',
        'Практика и разбор магазинов участников',
        'Раздаточные материалы и чек-листы',
        'Пост-разбор и план действий по категориям',
        'Повторная сессия через сезон'
      ],
      goals: [
        'Добиться исполнения дизайн-стандарта арендаторами',
        'Поднять продажи арендаторов на 10–30%',
        'Обучить персонал зала визуальным продажам',
        'Собрать арендаторов и наладить коммуникацию',
        'Подготовить объект к сезону распродаж'
      ]
    }
  };


  /* Пиктограммы сфер — та же линия, что и .svc-icon на страницах услуг. */
  var SCOPE_ICONS = {
    mall: '<svg viewBox="0 0 24 24"><path d="M3 21h18M4 21V9l8-5 8 5v12"/><path d="M9 21v-7h6v7"/><path d="M3 9h18"/></svg>',
    store: '<svg viewBox="0 0 24 24"><path d="M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M3 9l1.6-4.4A1 1 0 0 1 5.5 4h13a1 1 0 0 1 .9.6L21 9"/><path d="M9 21v-6h6v6"/></svg>',
    island: '<svg viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    food: '<svg viewBox="0 0 24 24"><path d="M7 3v6a3 3 0 0 0 3 3v9"/><path d="M7 3v6M11 3v6"/><path d="M17 3c-2 0-3 2-3 5s1 4 3 4v9"/></svg>',
    windows: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18M12 4v16"/></svg>',
    training: '<svg viewBox="0 0 24 24"><path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/></svg>'
  };

  var STEPS = ['scope', 'object', 'goals', 'works', 'limits', 'materials', 'contacts'];
  var STEP_TITLES = ['Сфера', 'Объект', 'Цели', 'Состав', 'Условия', 'Материалы', 'Контакты'];

  var state = {
    step: 0,
    scope: '',
    object: {},
    goals: [],
    goalOther: '',
    works: [],
    limits: {},
    materials: [],
    materialsNote: '',
    contacts: {}
  };

  var STORAGE = 'yurenko_tz_v1';
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    if (saved && saved.scope) state = Object.assign(state, saved, { step: 0 });
  } catch (e) { /* storage unavailable */ }

  var persist = function () {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (e) { /* noop */ }
  };

  /* ---------- Разметка шагов ---------- */
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  var checkList = function (name, options, selected) {
    return '<div class="opt-grid">' + options.map(function (o, i) {
      var on = selected.indexOf(o) >= 0;
      return '<label class="opt' + (on ? ' on' : '') + '">' +
        '<input type="checkbox" name="' + name + '" value="' + esc(o) + '"' + (on ? ' checked' : '') + '>' +
        '<span>' + esc(o) + '</span></label>';
    }).join('') + '</div>';
  };

  var renderers = {
    scope: function () {
      var cards = Object.keys(SCOPES).map(function (k, i) {
        var s = SCOPES[k];
        return '<button type="button" class="scope' + (state.scope === k ? ' on' : '') + '" data-scope="' + k + '" style="--i:' + i + '">' +
          '<span class="scope-icon">' + SCOPE_ICONS[k] + '</span>' +
          '<span class="scope-t">' + esc(s.title) + '</span>' +
          '<span class="scope-d">' + esc(s.lead) + '</span>' +
          '<span class="scope-p">' + esc(s.price) + '</span></button>';
      }).join('');
      return '<h2 class="gen-title">Что нужно спроектировать?</h2>' +
        '<p class="lead mt-8">От выбора зависят следующие вопросы и структура документа.</p>' +
        '<div class="scope-grid mt-32">' + cards + '</div>';
    },

    object: function () {
      var s = SCOPES[state.scope], o = state.object;
      return '<h2 class="gen-title">' + esc(s.objectLabel) + '</h2>' +
        '<p class="small mt-8">Чем точнее вводные, тем ближе к реальности будет оценка.</p>' +
        '<div class="f-grid mt-24">' +
        field('object.name', 'Название объекта или бренда', o.name, 'Например: Trend Island') +
        field('object.city', 'Город', o.city, 'Москва') +
        field('object.mall', 'Торговый центр', o.mall, 'Название ТЦ или «пока выбираем»') +
        field('object.area', s.areaLabel, o.area, s.areaHint, 'number') +
        select('object.category', 'Категория', o.category, ['Fashion и обувь', 'Аксессуары и ювелирные изделия', 'Красота и здоровье', 'Товары для дома', 'Детские товары', 'Электроника', 'Услуги', 'Еда и напитки', 'Другое']) +
        select('object.stage', 'Стадия проекта', o.stage, ['Только идея', 'Помещение выбрано, идёт согласование', 'Идёт проектирование', 'Действующий объект — переделка', 'Реконцепция целого объекта']) +
        '</div>';
    },

    goals: function () {
      var s = SCOPES[state.scope];
      return '<h2 class="gen-title">Каких целей нужно достичь?</h2>' +
        '<p class="small mt-8">Выберите всё подходящее — цели попадут в раздел «Требования и метрики».</p>' +
        checkList('goals', s.goals, state.goals) +
        '<div class="field mt-24"><label for="goalOther">Своя формулировка</label>' +
        '<textarea class="textarea" id="goalOther" name="goalOther" placeholder="Если главная цель не в списке — опишите своими словами">' + esc(state.goalOther) + '</textarea></div>';
    },

    works: function () {
      var s = SCOPES[state.scope];
      return '<h2 class="gen-title">Что должно войти в объём работ?</h2>' +
        '<p class="small mt-8">Не уверены — отметьте то, что точно нужно. Остальное предложим сами при оценке.</p>' +
        checkList('works', s.works, state.works);
    },

    limits: function () {
      var l = state.limits;
      return '<h2 class="gen-title">Сроки, бюджет и ограничения</h2>' +
        '<p class="small mt-8">Эти данные не публикуются и нужны только для оценки реалистичности.</p>' +
        '<div class="f-grid mt-24">' +
        select('limits.deadline', 'Желаемый срок', l.deadline, ['Срочно, до 2 недель', '1 месяц', '2–3 месяца', 'Более 3 месяцев', 'Пока не определён']) +
        select('limits.budget', 'Ориентир по бюджету', l.budget, ['До 300 000 ₽', '300 000 – 1 000 000 ₽', '1 – 3 млн ₽', 'Более 3 млн ₽', 'Нужна оценка от вас']) +
        select('limits.regulation', 'Регламент торгового центра', l.regulation, ['Есть, пришлём документ', 'Есть, но текст не получали', 'Нет или объект вне ТЦ', 'Не знаю']) +
        select('limits.contractor', 'Подрядчик на реализацию', l.contractor, ['Уже есть', 'Ищем', 'Нужна помощь с подбором', 'Реализация не планируется']) +
        '</div>' +
        '<div class="field mt-24"><label for="limitsNote">Особые условия</label>' +
        '<textarea class="textarea" id="limitsNote" name="limits.note" placeholder="Например: открытие привязано к дате запуска ТЦ, работы только ночью, объект действующий">' + esc(l.note || '') + '</textarea></div>';
    },

    materials: function () {
      var opts = ['План помещения или обмер', 'Фото объекта и галереи', 'Видео обхода', 'Брендбук', 'Ассортиментная матрица', 'Регламент торгового центра', 'Действующий дизайн-проект', 'Данные по трафику и конверсии'];
      return '<h2 class="gen-title">Что вы можете предоставить?</h2>' +
        '<p class="small mt-8">Чем больше исходных данных, тем короче этап аналитики.</p>' +
        checkList('materials', opts, state.materials) +
        '<div class="field mt-24"><label for="materialsNote">Комментарий к материалам</label>' +
        '<textarea class="textarea" id="materialsNote" name="materialsNote" placeholder="Ссылка на облако, что уже готово, чего не хватает">' + esc(state.materialsNote) + '</textarea></div>';
    },

    contacts: function () {
      var c = state.contacts;
      return '<h2 class="gen-title">Куда прислать готовое ТЗ?</h2>' +
        '<p class="small mt-8">Документ уйдёт вам на почту, а мы бесплатно оценим сроки и бюджет по нему.</p>' +
        '<div class="f-grid mt-24">' +
        field('contacts.name', 'Имя', c.name, 'Как к вам обращаться') +
        field('contacts.company', 'Компания', c.company, 'Бренд или управляющая компания') +
        field('contacts.email', 'E-mail', c.email, 'you@company.ru', 'email') +
        field('contacts.phone', 'Телефон', c.phone, '+7 ___ ___-__-__', 'tel') +
        '</div>' +
        '<label class="opt mt-24" style="align-items:flex-start"><input type="checkbox" id="agree" checked>' +
        '<span class="small">Согласен на обработку персональных данных в соответствии с <a href="/policy/">политикой конфиденциальности</a></span></label>';
    }
  };

  function field(name, label, value, ph, type) {
    var id = name.replace('.', '-');
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label>' +
      '<input class="input" id="' + id + '" name="' + name + '" type="' + (type || 'text') + '" value="' + esc(value || '') + '" placeholder="' + esc(ph || '') + '"></div>';
  }

  function select(name, label, value, options) {
    var id = name.replace('.', '-');
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label>' +
      '<select class="select" id="' + id + '" name="' + name + '">' +
      '<option value="">Не выбрано</option>' +
      options.map(function (o) {
        return '<option' + (value === o ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('') + '</select></div>';
  }

  /* ---------- Отрисовка ---------- */
  var elSteps = $('#gen-steps');
  var elBody = $('#gen-body');
  var elBar = $('#gen-bar');
  var elBack = $('#gen-back');
  var elNext = $('#gen-next');
  var elCount = $('#gen-count');

  function renderProgress() {
    elSteps.innerHTML = STEP_TITLES.map(function (t, i) {
      var cls = i === state.step ? 'on' : (i < state.step ? 'done' : '');
      return '<button type="button" class="gstep ' + cls + '" data-goto="' + i + '"><b>' + (i + 1) + '</b>' + t + '</button>';
    }).join('');
    elBar.style.width = ((state.step) / (STEPS.length - 1) * 100) + '%';
    elCount.textContent = 'Шаг ' + (state.step + 1) + ' из ' + STEPS.length;
    elBack.style.visibility = state.step === 0 ? 'hidden' : 'visible';
    elNext.textContent = state.step === STEPS.length - 1 ? 'Собрать техническое задание' : 'Далее';
  }

  function render() {
    renderProgress();
    elBody.innerHTML = renderers[STEPS[state.step]]();
    elBody.classList.remove('fade');
    void elBody.offsetWidth;
    elBody.classList.add('fade');
    if (window.yuEnhanceSelects) window.yuEnhanceSelects(elBody);
    bind();
  }

  function bind() {
    $$('[data-scope]', elBody).forEach(function (b) {
      b.addEventListener('click', function () {
        var next = b.getAttribute('data-scope');
        if (state.scope !== next) { state.goals = []; state.works = []; }
        state.scope = next;
        persist();
        state.step = 1;
        render();
        scrollTop();
      });
    });
    $$('.opt input[type=checkbox]', elBody).forEach(function (cb) {
      cb.addEventListener('change', function () {
        cb.closest('.opt').classList.toggle('on', cb.checked);
      });
    });
  }

  function collect() {
    var key = STEPS[state.step];
    if (key === 'goals') {
      state.goals = $$('input[name=goals]:checked', elBody).map(function (i) { return i.value; });
      state.goalOther = ($('#goalOther', elBody) || {}).value || '';
    } else if (key === 'works') {
      state.works = $$('input[name=works]:checked', elBody).map(function (i) { return i.value; });
    } else if (key === 'materials') {
      state.materials = $$('input[name=materials]:checked', elBody).map(function (i) { return i.value; });
      state.materialsNote = ($('#materialsNote', elBody) || {}).value || '';
    } else {
      $$('input[name], select[name], textarea[name]', elBody).forEach(function (el) {
        var parts = el.getAttribute('name').split('.');
        if (parts.length === 2) state[parts[0]][parts[1]] = el.value;
      });
    }
    persist();
  }

  function validate() {
    var key = STEPS[state.step];
    if (key === 'scope' && !state.scope) { window.yuToast('Выберите сферу проекта'); return false; }
    if (key === 'contacts') {
      var email = state.contacts.email || '';
      var ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!state.contacts.name || !ok) {
        window.yuToast('Укажите имя и корректный e-mail — на него придёт документ');
        return false;
      }
      if (!$('#agree').checked) { window.yuToast('Нужно согласие на обработку данных'); return false; }
    }
    return true;
  }

  function scrollTop() {
    var top = root.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  elNext.addEventListener('click', function () {
    collect();
    if (!validate()) return;
    if (state.step === STEPS.length - 1) return finish();
    state.step++;
    render();
    scrollTop();
  });

  elBack.addEventListener('click', function () {
    collect();
    state.step--;
    render();
    scrollTop();
  });

  elSteps.addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto]');
    if (!b) return;
    var i = parseInt(b.getAttribute('data-goto'), 10);
    if (i > state.step) return;
    collect();
    state.step = i;
    render();
  });

  /* ---------- Сборка документа ---------- */
  function buildDoc() {
    var s = SCOPES[state.scope];
    var o = state.object, l = state.limits, c = state.contacts;
    var L = [];
    var pushList = function (title, arr, empty) {
      L.push('## ' + title);
      if (arr && arr.length) arr.forEach(function (x) { L.push('- ' + x); });
      else L.push('- ' + empty);
      L.push('');
    };

    L.push('# Техническое задание: ' + s.title);
    L.push('');
    L.push('Дата: ' + new Date().toLocaleDateString('ru-RU'));
    L.push('Заказчик: ' + (c.company || c.name || '—'));
    L.push('Контакт: ' + [c.name, c.email, c.phone].filter(Boolean).join(', '));
    L.push('');

    L.push('## 1. Резюме');
    L.push(s.lead);
    L.push('Объект: ' + (o.name || '—') + '. Город: ' + (o.city || '—') + '. Торговый центр: ' + (o.mall || '—') + '.');
    L.push('Категория: ' + (o.category || '—') + '. Стадия: ' + (o.stage || '—') + '.');
    L.push(SCOPES[state.scope].areaLabel + ': ' + (o.area || '—') + '.');
    L.push('');

    var goals = state.goals.slice();
    if (state.goalOther) goals.push(state.goalOther);
    pushList('2. Цели и ожидаемый результат', goals, 'Цели уточняются на первом созвоне');

    pushList('3. Объём работ', state.works, 'Состав работ формирует исполнитель по итогам аудита');

    L.push('## 4. Вне объёма');
    L.push('- Строительно-монтажные работы и закупка оборудования');
    L.push('- Согласование с органами государственного надзора');
    L.push('- Разработка фирменного стиля и брендбука, если не указано отдельно');
    L.push('');

    L.push('## 5. Условия и ограничения');
    L.push('- Срок: ' + (l.deadline || 'не определён'));
    L.push('- Бюджетный ориентир: ' + (l.budget || 'требуется оценка исполнителя'));
    L.push('- Регламент торгового центра: ' + (l.regulation || 'не уточнён'));
    L.push('- Подрядчик на реализацию: ' + (l.contractor || 'не определён'));
    if (l.note) L.push('- Особые условия: ' + l.note);
    L.push('');

    pushList('6. Исходные материалы от заказчика', state.materials, 'Материалы предоставляются по запросу исполнителя');
    if (state.materialsNote) { L.push('Комментарий: ' + state.materialsNote); L.push(''); }

    L.push('## 7. Этапы работ');
    L.push('1. Разбор задачи и фиксация вводных');
    L.push('2. Аудит объекта и аналитика');
    L.push('3. Концепция и согласование направления');
    L.push('4. Проектная проработка и документация');
    L.push('5. Передача результата, внедрение и надзор');
    L.push('');

    L.push('## 8. Критерии приёмки');
    L.push('- Комплект документации передан в согласованных форматах');
    L.push('- Решения соответствуют регламенту торгового центра');
    L.push('- Заявленные цели раздела 2 отражены в проектных решениях');
    L.push('- Проведена финальная презентация с ответами на вопросы заказчика');
    L.push('');

    L.push('## 9. Ориентир по стоимости');
    L.push('Базовая ставка направления: ' + s.price + '. Итоговая стоимость определяется после оценки объёма работ исполнителем.');
    L.push('');
    L.push('---');
    L.push('Документ собран в генераторе ТЗ на yurenko.ru');

    return L.join('\n');
  }

  function finish() {
    var doc = buildDoc();
    var s = SCOPES[state.scope];
    root.classList.add('done');
    $('#gen-result').innerHTML =
      '<div class="tag">Готово</div>' +
      '<h2 class="h2 mt-16">Ваше техническое задание <span class="hl">собрано</span></h2>' +
      '<p class="lead mt-16">' + esc(s.title) + '. Ниже — полный текст документа. Мы уже отправили его на ' + esc(state.contacts.email) + ' и вернёмся с оценкой сроков и бюджета в течение рабочего дня.</p>' +
      '<div class="row mt-24">' +
      '<button class="btn btn-accent" id="gen-copy">Скопировать текст</button>' +
      '<button class="btn btn-ghost" id="gen-download">Скачать .md</button>' +
      '<button class="btn btn-ghost" id="gen-print">Распечатать или в PDF</button>' +
      '<button class="btn btn-ghost" id="gen-restart">Начать заново</button>' +
      '</div>' +
      '<pre class="tz mt-32" id="gen-doc">' + esc(doc) + '</pre>';

    $('#gen-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(doc).then(function () { window.yuToast('Текст скопирован'); },
        function () { window.yuToast('Не удалось скопировать — выделите текст вручную'); });
    });
    $('#gen-download').addEventListener('click', function () {
      var blob = new Blob([doc], { type: 'text/markdown;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'TZ-' + (state.object.name || 'yurenko').replace(/\s+/g, '-') + '.md';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    $('#gen-print').addEventListener('click', function () { window.print(); });
    $('#gen-restart').addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE); } catch (e) { /* noop */ }
      location.reload();
    });

    window.yuSubmit({
      type: 'tz-generator',
      page: location.pathname,
      utm: location.search,
      fields: {
        scope: s.title,
        name: state.contacts.name,
        company: state.contacts.company,
        email: state.contacts.email,
        phone: state.contacts.phone
      },
      document: doc
    }).then(function () {
      window.yuToast('ТЗ отправлено на ' + state.contacts.email);
    }).catch(function () {
      window.yuToast('Документ готов, но письмо не ушло. Скачайте файл и пришлите на wndw.alyur@gmail.com');
    });

    scrollTop();
  }

  /* ---------- Старт ---------- */
  var preset = new URLSearchParams(location.search).get('scope');
  if (preset && SCOPES[preset]) { state.scope = preset; state.step = 1; }
  render();
})();
