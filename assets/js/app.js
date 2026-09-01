/* YURENKO — shared behaviour: nav, reveal, counters, accordions, forms */
(function () {
  'use strict';

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---- Announcement bar ---- */
  var topbar = $('.topbar');
  if (topbar) {
    if (sessionStorage.getItem('yu_topbar') === 'off') topbar.remove();
    var close = $('.close', topbar);
    if (close) close.addEventListener('click', function () {
      sessionStorage.setItem('yu_topbar', 'off');
      topbar.remove();
    });
  }

  /* ---- Sticky nav shadow ---- */
  var nav = $('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Desktop dropdowns ---- */
  $$('.nav-links > li').forEach(function (li) {
    var trigger = $('.nav-link', li);
    if (!$('.dropdown', li) || !trigger) return;
    var open = function (v) { li.classList.toggle('open', v); trigger.setAttribute('aria-expanded', v ? 'true' : 'false'); };
    li.addEventListener('mouseenter', function () { open(true); });
    li.addEventListener('mouseleave', function () { open(false); });
    trigger.addEventListener('click', function (e) { e.preventDefault(); open(!li.classList.contains('open')); });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) open(false); });
  });

  /* ---- Mobile menu ---- */
  var burger = $('.burger');
  var mmenu = $('.mobile-menu');
  if (burger && mmenu) {
    burger.addEventListener('click', function () {
      var isOpen = mmenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      doc.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ---- Scroll reveal ---- */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (!('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          var delay = parseFloat(el.getAttribute('data-reveal')) || 0;
          setTimeout(function () { el.classList.add('in'); }, delay * 1000);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Hero word reveal ---- */
  $$('[data-words]').forEach(function (el) {
    var i = 0;
    var wrap = function (node) {
      var out = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) return out.appendChild(document.createTextNode(chunk));
        var s = document.createElement('span');
        s.className = 'w';
        s.textContent = chunk;
        s.style.animationDelay = (0.05 + i++ * 0.045).toFixed(3) + 's';
        out.appendChild(s);
      });
      return out;
    };
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        el.replaceChild(wrap(node), node);
      } else if (node.nodeType === 1) {
        // keep the accent element, animate its words inside it
        var frag = wrap(node);
        node.textContent = '';
        node.appendChild(frag);
        node.style.display = 'inline-block';
      }
    });
    el.classList.add('reveal-words');
  });

  /* ---- Count-up numbers ---- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var dur = 1100, t0 = performance.now();
        var step = function (now) {
          var p = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Accordion ---- */
  $$('.acc-head').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc-item');
      var isOpen = item.classList.contains('open');
      var group = btn.closest('.acc');
      if (group && group.hasAttribute('data-single')) {
        $$('.acc-item', group).forEach(function (i) { i.classList.remove('open'); });
      }
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  /* ---- Tab filters ---- */
  $$('[data-tabs]').forEach(function (group) {
    var targetSel = group.getAttribute('data-tabs');
    var items = $$(targetSel + ' [data-cat]');
    $$('.tab', group).forEach(function (tab) {
      tab.addEventListener('click', function () {
        $$('.tab', group).forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-filter');
        items.forEach(function (it) {
          var match = cat === 'all' || it.getAttribute('data-cat') === cat;
          it.style.display = match ? '' : 'none';
        });
      });
    });
  });

  /* ---- Back to top ---- */
  var totop = $('.totop');
  if (totop) {
    window.addEventListener('scroll', function () {
      totop.classList.toggle('show', window.scrollY > 900);
    }, { passive: true });
    totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---- Toast ---- */
  var toast = $('.toast');
  window.yuToast = function (msg) {
    if (!toast) return alert(msg);
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('show'); }, 4200);
  };

  /* ---- Lead forms ---- */
  window.yuSubmit = function (payload) {
    return fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status ' + r.status);
      return r.json();
    });
  };

  $$('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('button[type=submit]', form);
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (data._gotcha) return; // honeypot
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }
      window.yuSubmit({
        type: form.getAttribute('data-lead'),
        page: location.pathname,
        utm: location.search,
        fields: data
      }).then(function () {
        form.reset();
        window.yuToast('Заявка отправлена. Ответим в рабочее время, с 10:00 до 19:00.');
      }).catch(function () {
        window.yuToast('Не удалось отправить. Напишите нам: wndw.alyur@gmail.com');
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  });

  /* ---- Mark active nav link ---- */
  var path = location.pathname.replace(/index\.html$/, '');
  $$('.nav-link[href], .mobile-menu a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href === '/' || href.charAt(0) === '#') return;
    if (path.indexOf(href) === 0) a.classList.add('is-active');
  });
})();
