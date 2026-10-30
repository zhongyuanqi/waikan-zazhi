/* 外刊杂志仓库 · 前端渲染 */
(function () {
  'use strict';

  var C = window.CATALOG;
  if (!C) {
    document.getElementById('pubs').innerHTML =
      '<p style="padding:60px 32px;color:#78726A">数据未加载，请刷新页面。</p>';
    return;
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var PLAT = { baidu: '百度网盘', quark: '夸克网盘', ctfile: '城通网盘' };

  /* ── 工具 ───────────────────── */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function fmtSize(mb) {
    if (!mb) return '';
    return mb >= 1024 ? (mb / 1024).toFixed(2).replace(/0$/, '') + ' GB' : mb + ' MB';
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* ── 概览数字 ─────────────────── */
  (function stats() {
    var s = C.stats;
    var items = [
      [s.pubs, '', '种', '刊物'],
      [s.entries, '', '份', '年度合集'],
      [s.hiwFiles, '', '个', '已列 PDF'],
      ['2018—2026', '', '', '收录年份']
    ];
    var box = $('#stats');
    items.forEach(function (it) {
      var d = el('div', 'stat');
      var n = el('span', 'stat__n', it[0] + (it[2] ? '<small>' + it[2] + '</small>' : ''));
      d.appendChild(n);
      d.appendChild(el('span', 'stat__l', it[3]));
      box.appendChild(d);
    });
  })();

  /* ── 最新入库 ─────────────────── */
  (function latest() {
    var all = [];
    C.pubs.forEach(function (p) {
      p.entries.forEach(function (e) {
        if (e.year) all.push({ year: e.year, pub: p });
      });
    });
    all.sort(function (a, b) { return b.year - a.year; });

    var ul = $('#latest');
    all.slice(0, 3).forEach(function (it) {
      var li = el('li');
      var a = el('a');
      a.href = '#' + it.pub.key;
      a.appendChild(el('span', 'latest__y', String(it.year)));
      a.appendChild(el('span', 'latest__n', it.pub.name + ' ' + it.pub.zh));
      a.appendChild(el('span', 'latest__a', '↗'));
      li.appendChild(a);
      ul.appendChild(li);
    });
  })();

  /* ── 目录 ───────────────────── */
  (function toc() {
    var ol = $('#toc');
    C.pubs.forEach(function (p, i) {
      var li = el('li');
      var row = el('a', 'toc__row');
      row.href = '#' + p.key;
      row.appendChild(el('span', 'toc__i', pad(i + 1)));
      row.appendChild(el('span', 'toc__name', p.name + '<em>' + p.zh + '</em>'));
      row.appendChild(el('span', 'toc__lead'));
      row.appendChild(el('span', 'toc__meta', p.entries.length + ' 份 · ' + p.span));
      li.appendChild(row);
      ol.appendChild(li);
    });
  })();

  /* ── 筛选条 ───────────────────── */
  var FILTERS = [{ k: 'all', label: '全部' }];
  C.pubs.forEach(function (p) {
    if (!FILTERS.some(function (f) { return f.k === p.categoryLabel; })) {
      FILTERS.push({ k: p.categoryLabel, label: p.categoryLabel });
    }
  });
  var active = 'all';
  (function chips() {
    var box = $('#chips');
    FILTERS.forEach(function (f) {
      var b = el('button', 'chip', f.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', f.k === active ? 'true' : 'false');
      b.addEventListener('click', function () {
        active = f.k;
        Array.prototype.forEach.call(box.children, function (c) {
          c.setAttribute('aria-pressed', c === b ? 'true' : 'false');
        });
        apply();
      });
      box.appendChild(b);
    });
  })();

  /* ── 刊物区块 ─────────────────── */
  var cards = [];

  C.pubs.forEach(function (p, i) {
    var sec = el('section', 'pub');
    sec.id = p.key;
    sec.style.setProperty('--accent', p.accent);

    var maxYear = Math.max.apply(null, p.entries.map(function (e) { return e.year || 0; }));
    var hiwFiles = p.entries.reduce(function (a, e) { return a + (e.files || 0); }, 0);
    var hiwMB = p.entries.reduce(function (a, e) { return a + (e.sizeMB || 0); }, 0);

    var head = el('div', 'wrap');
    var inner = el('div', 'pub__head');
    inner.appendChild(el('div', 'pub__num', pad(i + 1)));

    var body = el('div');
    body.appendChild(el('div', 'pub__bar'));
    body.appendChild(el('h2', 'pub__name', p.name + '<em>' + p.zh + '</em>'));
    body.appendChild(el('p', 'pub__intro', p.intro));

    var meta = el('div', 'pub__meta');
    meta.appendChild(el('span', null, p.origin));
    meta.appendChild(el('span', null, p.span));
    meta.appendChild(el('span', null, p.entries.length + ' 份年度合集'));
    if (hiwFiles) {
      meta.appendChild(el('span', null, hiwFiles + ' 个 PDF · ' + fmtSize(hiwMB)));
    }
    body.appendChild(meta);

    inner.appendChild(body);
    head.appendChild(inner);
    sec.appendChild(head);

    var gw = el('div', 'wrap');
    var grid = el('div', 'grid' + (p.entries.length % 4 === 0 ? ' grid--4' : ''));

    p.entries.forEach(function (e) {
      var card = el('article', 'card');

      var top = el('div', 'card__top');
      top.appendChild(el('span', 'card__year', e.year ? String(e.year) : '—'));
      if (e.year === maxYear) top.appendChild(el('span', 'tag', '最新'));
      card.appendChild(top);

      card.appendChild(el('h3', 'card__title', e.title));

      var sub = '';
      if (e.files) sub = e.files + ' 期 · ' + fmtSize(e.sizeMB);
      else if (e.checked) sub = '链接检测 · ' + e.checked;
      if (sub) card.appendChild(el('p', 'card__sub', sub));

      var links = el('div', 'card__links');
      ['baidu', 'quark', 'ctfile'].forEach(function (k) {
        var d = e.links[k] || {};
        if (!d.url) return;
        var a = el('a', 'link-btn', '<i></i>' + PLAT[k]);
        a.href = d.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('data-p', k);
        links.appendChild(a);
      });
      card.appendChild(links);

      var foot = el('div', 'card__foot');
      [['baidu', e.links.baidu && e.links.baidu.code, '百度码'],
       ['ctfile', e.links.ctfile && e.links.ctfile.code, '城通码']].forEach(function (c) {
        if (!c[1]) return;
        var b = el('button', 'code',
          c[2] + ' ' + c[1] +
          '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><rect x="5.2" y="5.2" width="8" height="8" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M10.6 3.2H3.9c-.5 0-.9.4-.9.9v6.7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>');
        b.type = 'button';
        b.dataset.copy = c[1];
        foot.appendChild(b);
      });
      if (e.listUrl) {
        var m = el('a', 'card__more', '文件清单 ↗');
        m.href = e.listUrl;
        m.target = '_blank';
        m.rel = 'noopener noreferrer';
        foot.appendChild(m);
      }
      if (foot.children.length) card.appendChild(foot);

      card.dataset.q = [
        p.name, p.zh, p.categoryLabel, e.year || '', e.title, e.files || ''
      ].join(' ').toLowerCase();

      grid.appendChild(card);
      cards.push({
        node: card,
        cat: p.categoryLabel,
        sec: sec,
        text: card.dataset.q
      });
    });

    gw.appendChild(grid);
    sec.appendChild(gw);

    $('#pubs').appendChild(sec);
  });

  /* ── 计划 / 日志 ────────────────── */
  (function planned() {
    var box = $('#planned-grid');
    C.planned.forEach(function (p) {
      var d = el('div', 'plan');
      d.appendChild(el('p', 'plan__n', p.name));
      d.appendChild(el('p', 'plan__z', p.zh));
      d.appendChild(el('p', 'plan__s', p.note));
      box.appendChild(d);
    });
  })();

  (function log() {
    var ul = $('#log');
    C.log.forEach(function (l) {
      var li = el('li');
      li.appendChild(el('time', null, l.date));
      li.appendChild(el('span', null, l.text));
      ul.appendChild(li);
    });
  })();

  $('#yr').textContent = new Date().getFullYear();

  /* ── 搜索与筛选 ─────────────────── */
  var q = $('#q');
  var count = $('#count');
  var empty = $('#empty');
  var secs = C.pubs.map(function (p) { return document.getElementById(p.key); });

  function apply() {
    var terms = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;

    cards.forEach(function (c) {
      var okCat = active === 'all' || c.cat === active;
      var okText = terms.every(function (t) { return c.text.indexOf(t) > -1; });
      var on = okCat && okText;
      c.node.hidden = !on;
      if (on) shown++;
    });

    secs.forEach(function (s) {
      var any = s.querySelector('.card:not([hidden])');
      s.hidden = !any;
    });

    count.textContent = '共 ' + cards.length + ' 份 · 匹配 ' + shown + ' 份';
    empty.hidden = shown > 0;
  }

  q.addEventListener('input', apply);

  if (window.innerWidth < 620) q.placeholder = '搜索刊物 / 年份';

  document.addEventListener('keydown', function (ev) {
    if (ev.key === '/' && document.activeElement !== q) {
      ev.preventDefault();
      q.focus();
      q.select();
    }
    if (ev.key === 'Escape' && document.activeElement === q) {
      q.value = '';
      apply();
      q.blur();
    }
  });

  /* ── 复制提取码 ─────────────────── */
  var toast = $('#toast');
  var timer;

  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('is-on'); }, 1900);
  }

  function copy(text, btn) {
    var done = function () {
      if (btn) {
        btn.classList.add('is-done');
        setTimeout(function () { btn.classList.remove('is-done'); }, 1200);
      }
      say('已复制提取码 ' + text);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { say('复制失败，请手动选择 ' + text); }
      document.body.removeChild(ta);
    }
  }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-copy]');
    if (btn) copy(btn.dataset.copy, btn);
  });

  apply();
})();
