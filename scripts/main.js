/* ==========================================================================
   Z-araan · 个人主页脚本
   零依赖：原生 JS，无框架、无 CDN
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 主题切换（记忆 + 跟随系统） ---------- */
  var root = document.documentElement;
  var themeBtn = $('#theme-toggle');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'light'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f7fc' : '#070b14');
  }

  applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* 隐私模式 */ }
    });
  }

  /* ---------- 时钟、日期与问候语 ---------- */
  var clockEl = $('#clock');
  var dateEl = $('#today');
  var greetEl = $('#greeting');
  var WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function greetingFor(hour) {
    if (hour < 5) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 23) return '晚上好';
    return '夜深了';
  }

  function tick() {
    var now = new Date();
    if (clockEl) clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    if (dateEl) dateEl.textContent = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + WEEK[now.getDay()];
    if (greetEl) greetEl.textContent = greetingFor(now.getHours());
  }

  tick();
  setInterval(tick, 1000);

  /* ---------- 移动端菜单 ---------- */
  var burger = $('#nav-burger');
  var links = $('#nav-links');

  function closeMenu() {
    if (!links || !burger) return;
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', '打开菜单');
  }

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') && !links.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* ---------- 回到顶部 ---------- */
  var toTop = $('#to-top');

  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('show', window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 页脚年份 ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 滚动进场动画 ---------- */
  var revealTargets = document.querySelectorAll('.card, .post, .about, .section-head');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 搜索：空内容不跳转 ---------- */
  var form = $('.search');
  var input = $('#q');

  if (form && input) {
    form.addEventListener('submit', function (e) {
      if (!input.value.trim()) {
        e.preventDefault();
        input.focus();
        return;
      }
      input.value = input.value.trim();
    });
  }

  /* ---------- RSS 实时刷新（失败则保留页面里的静态快照） ---------- */
  var rssList = document.getElementById('rss-list');

  if (rssList && window.fetch && window.DOMParser) {
    var MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                   Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

    function rssDate(raw) {
      var m = /(\d{1,2}) (\w{3}) (\d{4})/.exec(raw || '');
      if (!m) return (raw || '').slice(0, 16);
      return m[3] + '-' + (MONTHS[m[2]] || '01') + '-' + String(m[1]).padStart(2, '0');
    }

    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 6000);

    fetch('https://zaraan.zh.kg/rss.xml', {
      cache: 'no-store',
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    }).then(function (xml) {
      var doc = new DOMParser().parseFromString(xml, 'application/xml');
      var items = Array.prototype.slice.call(doc.querySelectorAll('item')).slice(0, 6);
      if (!items.length) throw new Error('empty feed');

      var frag = document.createDocumentFragment();
      items.forEach(function (item) {
        var get = function (tag) {
          var el = item.querySelector(tag);
          return el ? el.textContent.trim() : '';
        };
        var title = get('title');
        var link = get('link');
        if (!title || !link) return;

        var desc = get('description').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (desc.length > 96) desc = desc.slice(0, 96).trim() + '…';

        var a = document.createElement('a');
        a.className = 'post';
        a.href = link;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<div class="post-main"><div class="post-meta">' +
          '<span class="tag">博客</span><time></time></div><h3></h3><p></p></div>' +
          '<span class="post-go" aria-hidden="true">→</span>';
        a.querySelector('time').textContent = rssDate(get('pubDate'));
        a.querySelector('h3').textContent = title;
        a.querySelector('p').textContent = desc;
        frag.appendChild(a);
      });

      if (frag.childNodes.length) {
        rssList.innerHTML = '';
        rssList.appendChild(frag);
        var note = document.getElementById('rss-note');
        if (note) note.textContent = '已从 zaraan.zh.kg 实时更新，共 ' + frag.childNodes.length + ' 篇。';
      }
    }).catch(function () {
      /* CORS 或网络不可用：保留静态快照，不打扰用户 */
    }).then(function () {
      clearTimeout(timer);
    });
  }
})();
