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

  /* ---------- 动态背景：星点 + 缓慢流动的光晕 ---------- */
  var canvas = document.getElementById('bg-canvas');

  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dots = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rafId = null;
    var t = 0;

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      var count = Math.round(Math.min(120, (window.innerWidth * window.innerHeight) / 16000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (Math.random() * 1.4 + 0.5) * dpr,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          vy: (Math.random() - 0.5) * 0.12 * dpr,
          a: Math.random() * 0.5 + 0.25
        });
      }
    }

    function isDark() { return root.dataset.theme !== 'light'; }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dark = isDark();

      // 缓慢流动的光晕
      t += 0.0022;
      var blobs = [
        { x: canvas.width * (0.28 + 0.05 * Math.sin(t)), y: canvas.height * (0.22 + 0.04 * Math.cos(t * 1.3)), r: canvas.width * 0.34, c: dark ? '78,161,255' : '31,111,235' },
        { x: canvas.width * (0.74 + 0.05 * Math.cos(t * 0.8)), y: canvas.height * (0.72 + 0.05 * Math.sin(t)), r: canvas.width * 0.30, c: dark ? '124,92,255' : '111,75,255' }
      ];
      blobs.forEach(function (b) {
        var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(' + b.c + ',' + (dark ? 0.16 : 0.12) + ')');
        g.addColorStop(1, 'rgba(' + b.c + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 星点
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = dark ? 'rgba(196,214,255,' + d.a + ')' : 'rgba(20,40,80,' + (d.a * 0.5) + ')';
        ctx.fill();
      });

      rafId = window.requestAnimationFrame(draw);
    }

    function startBg() { if (rafId === null) draw(); }
    function stopBg() { if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; } }

    resize();
    startBg();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopBg(); else startBg();
    });
  }

  /* ---------- Ctrl/⌘ + K 快速跳转 ---------- */
  var palette = document.getElementById('palette');
  var paletteInput = document.getElementById('palette-input');
  var paletteList = document.getElementById('palette-list');

  if (palette && paletteInput && paletteList) {
    var DESTINATIONS = [
      { icon: '🏠', name: '首页', hint: '回到顶部', href: '#top', kind: '页面' },
      { icon: '📄', name: '最新文章', hint: '博客 RSS 同步', href: '#posts', kind: '页面' },
      { icon: '🧰', name: '项目与工具', hint: '全部小工具入口', href: '#projects', kind: '页面' },
      { icon: '🙋', name: '关于我', hint: '联系方式', href: '#about', kind: '页面' },
      { icon: '🖼️', name: '图片工具箱', hint: '去 EXIF / 压缩 / 转 WebP', href: '/Down/image.html', kind: '工具' },
      { icon: '🧾', name: 'JSON 工具', hint: '格式化 / 压缩 / 校验', href: '/Down/json.html', kind: '工具' },
      { icon: '🔧', name: '实用小工具', hint: '时间戳 / Base64 / 密码 / UUID', href: '/Down/utils.html', kind: '工具' },
      { icon: '💬', name: '局域网聊天', hint: '同网段传输消息与文件', href: '/Down/chat.html', kind: '工具' },
      { icon: '⏱️', name: '番茄计时器', hint: '专注 25 分钟', href: '/Down/pomodoro.html', kind: '工具' },
      { icon: '🎲', name: '猜数字游戏', hint: '摸鱼小游戏', href: '/Down/guess.html', kind: '工具' },
      { icon: '📘', name: 'WebAssembly 文章', hint: '技术笔记', href: '/Down/wasm.html', kind: '文章' },
      { icon: '📦', name: '下载安卓应用', hint: 'z-araan.apk', href: '/Down/z-araan.apk', kind: '下载' },
      { icon: '📡', name: 'RSS 订阅', hint: 'zaraan.zh.kg/rss.xml', href: 'https://zaraan.zh.kg/rss.xml', kind: '外部' },
      { icon: '✍️', name: '博客首页', hint: 'zaraan.zh.kg', href: 'https://zaraan.zh.kg/', kind: '外部' },
      { icon: '🐙', name: 'GitHub', hint: 'github.com/z-araan', href: 'https://github.com/z-araan', kind: '外部' },
      { icon: '🌗', name: '切换深色 / 浅色主题', hint: '立即生效', action: 'theme', kind: '操作' },
      { icon: '🎵', name: '打开音乐播放器', hint: '随机来一首', action: 'music', kind: '操作' },
      { icon: '📋', name: '复制本页链接', hint: '分享给朋友', action: 'copy', kind: '操作' }
    ];
    var filtered = DESTINATIONS.slice();
    var activeIndex = 0;

    function render() {
      paletteList.innerHTML = '';
      if (!filtered.length) {
        var li = document.createElement('li');
        li.className = 'empty';
        li.textContent = '没有匹配的结果';
        paletteList.appendChild(li);
        return;
      }
      filtered.forEach(function (item, i) {
        var li = document.createElement('li');
        li.className = i === activeIndex ? 'active' : '';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === activeIndex));
        li.innerHTML = '<span aria-hidden="true"></span><span class="p-name"></span>' +
                       '<span class="p-kind"></span>';
        li.firstChild.textContent = item.icon;
        li.querySelector('.p-name').textContent = item.name + ' · ' + item.hint;
        li.querySelector('.p-kind').textContent = item.kind;
        li.addEventListener('click', function () { run(item); });
        li.addEventListener('mousemove', function () { activeIndex = i; render(); });
        paletteList.appendChild(li);
      });
    }

    function run(item) {
      closePalette();
      if (item.action === 'theme') {
        if (themeBtn) themeBtn.click();
        return;
      }
      if (item.action === 'music') {
        var hint = document.getElementById('music-hint');
        if (hint) hint.click();
        return;
      }
      if (item.action === 'copy') {
        if (navigator.clipboard) navigator.clipboard.writeText(location.href);
        return;
      }
      if (item.href.charAt(0) === '#') {
        var target = document.querySelector(item.href);
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      } else {
        window.open(item.href, item.href.charAt(0) === '/' ? '_self' : '_blank', 'noopener');
      }
    }

    function openPalette() {
      palette.hidden = false;
      paletteInput.value = '';
      filtered = DESTINATIONS.slice();
      activeIndex = 0;
      render();
      paletteInput.focus();
    }
    function closePalette() { palette.hidden = true; }

    document.addEventListener('keydown', function (e) {
      var isK = e.key === 'k' || e.key === 'K';
      if ((e.ctrlKey || e.metaKey) && isK) { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); return; }
      if (palette.hidden) return;
      if (e.key === 'Escape') { closePalette(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) run(filtered[activeIndex]); }
    });

    paletteInput.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      filtered = DESTINATIONS.filter(function (d) {
        return !q || (d.name + d.hint + d.kind).toLowerCase().indexOf(q) !== -1;
      });
      activeIndex = 0;
      render();
    });
    palette.addEventListener('click', function (e) { if (e.target === palette) closePalette(); });

    var openBtn = document.getElementById('palette-open');
    if (openBtn) openBtn.addEventListener('click', openPalette);
  }
})();
