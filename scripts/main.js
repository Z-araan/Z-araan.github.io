/* ==========================================================================
   Z-araan · 主页脚本
   主题（跟随系统 / 手动）· 时钟问候 · 移动菜单 · 回到顶部 · 动态背景
   RSS 文章 / RSS 动态 / GitHub 项目 懒加载 · Ctrl/⌘+K 快速跳转
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 主题：auto（跟随系统）/ light / dark ---------- */
  var themeBtn = $('#theme-toggle');
  var systemLight = window.matchMedia('(prefers-color-scheme: light)');

  function readPref() {
    try { return localStorage.getItem('theme') || 'auto'; } catch (e) { return 'auto'; }
  }
  function applyTheme(pref) {
    var theme = pref === 'auto' ? (systemLight.matches ? 'light' : 'dark') : pref;
    root.dataset.theme = theme;
    root.dataset.themePref = pref;
    if (themeBtn) {
      themeBtn.title = pref === 'auto'
        ? '主题：跟随系统（点击切换为' + (theme === 'light' ? '深色' : '浅色') + '）'
        : '主题：固定' + (theme === 'light' ? '浅色' : '深色') + '（Ctrl/⌘+K 可恢复跟随系统）';
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f7fc' : '#070b14');
  }
  applyTheme(readPref());

  // 系统主题变化时，若处于 auto 则实时跟随
  var onSystemChange = function () { if (readPref() === 'auto') applyTheme('auto'); };
  if (systemLight.addEventListener) systemLight.addEventListener('change', onSystemChange);
  else if (systemLight.addListener) systemLight.addListener(onSystemChange);

  function setPref(pref) {
    try { localStorage.setItem('theme', pref); } catch (e) {}
    applyTheme(pref);
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      setPref(root.dataset.theme === 'light' ? 'dark' : 'light');   // 手动切换即固定
    });
  }

  /* ---------- 时钟 / 日期 / 问候 ---------- */
  var clockEl = $('#clock'), dateEl = $('#today'), greetEl = $('#greeting');
  var WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  function pad(n) { return String(n).padStart(2, '0'); }
  function greetingFor(h) {
    if (h < 5) return '夜深了';
    if (h < 9) return '早上好';
    if (h < 12) return '上午好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    if (h < 23) return '晚上好';
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
  var burger = $('#nav-burger'), links = $('#nav-links');
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
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') && !links.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* ---------- 回到顶部 / 年份 ---------- */
  var toTop = $('#to-top');
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle('show', window.scrollY > 420); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 滚动进场 ---------- */
  var revealTargets = document.querySelectorAll('.section-head');
  if (!reduceMotion && 'IntersectionObserver' in window && revealTargets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    revealTargets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---------- 动态背景：光晕 + 星点（比之前更明显） ---------- */
  var canvas = $('#bg-canvas');
  var rafId = null, dots = [], bgT = 0;

  function bgColors() {
    return root.dataset.theme === 'light'
      ? { blob1: '31,111,235', blob2: '111,75,255', a1: .30, a2: .24, dot: '20,40,80', dotA: .45 }
      : { blob1: '78,161,255', blob2: '124,92,255', a1: .42, a2: .34, dot: '196,214,255', dotA: .75 };
  }

  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      var count = Math.round(Math.min(150, (window.innerWidth * window.innerHeight) / 12000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (Math.random() * 1.6 + 0.6) * dpr,
          vx: (Math.random() - 0.5) * 0.16 * dpr,
          vy: (Math.random() - 0.5) * 0.16 * dpr,
          a: Math.random() * 0.6 + 0.35
        });
      }
    }

    function draw() {
      var c = bgColors();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bgT += 0.0026;

      [{ x: .28 + .06 * Math.sin(bgT), y: .22 + .05 * Math.cos(bgT * 1.3), r: .36, col: c.blob1, a: c.a1 },
       { x: .74 + .06 * Math.cos(bgT * .8), y: .72 + .05 * Math.sin(bgT), r: .32, col: c.blob2, a: c.a2 },
       { x: .50 + .05 * Math.sin(bgT * .6), y: .50 + .04 * Math.cos(bgT * .9), r: .28, col: c.blob1, a: c.a1 * .6 }
      ].forEach(function (b) {
        var cx = canvas.width * b.x, cy = canvas.height * b.y, rr = canvas.width * b.r;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        g.addColorStop(0, 'rgba(' + b.col + ',' + b.a + ')');
        g.addColorStop(1, 'rgba(' + b.col + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.fill();
      });

      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width; else if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height; else if (d.y > canvas.height) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + c.dot + ',' + (d.a * c.dotA) + ')';
        ctx.fill();
      });

      rafId = window.requestAnimationFrame(draw);
    }
    function startBg() { if (rafId === null) draw(); }
    function stopBg() { if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; } }

    resize(); startBg();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () { document.hidden ? stopBg() : startBg(); });
  }

  /* ---------- 懒加载：滚动到附近才发请求 ---------- */
  function whenVisible(el, cb) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io2.unobserve(en.target); cb(); }
      });
    }, { rootMargin: '250px 0px' });
    io2.observe(el);
  }
  function text(el, tag) {
    var n = el ? el.querySelector(tag) : null;
    return n ? n.textContent.trim() : '';
  }
  function rssDate(raw) {
    var M = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
              Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
    var m = /(\d{1,2}) (\w{3}) (\d{4})/.exec(raw || '');
    return m ? m[3] + '-' + (M[m[2]] || '01') + '-' + String(m[1]).padStart(2, '0') : (raw || '').slice(0, 16);
  }
  function cleanText(s, max) {
    var t = String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return t.length > max ? t.slice(0, max).trim() + '…' : t;
  }
  function fetchXml(url, ms) {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 6000);
    return fetch(url, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (t) { clearTimeout(timer); return t; },
            function (e) { clearTimeout(timer); throw e; });
  }

  /* 文章（RSS） */
  var rssList = $('#rss-list');
  if (rssList) {
    whenVisible(rssList, function () {
      fetchXml('https://zaraan.zh.kg/rss.xml').then(function (xml) {
        var doc = new DOMParser().parseFromString(xml, 'application/xml');
        var items = Array.prototype.slice.call(doc.querySelectorAll('item')).slice(0, 6);
        if (!items.length) throw new Error('empty');
        var frag = document.createDocumentFragment();
        items.forEach(function (it) {
          var title = text(it, 'title'), link = text(it, 'link');
          if (!title || !link) return;
          var a = document.createElement('a');
          a.className = 'post'; a.href = link; a.target = '_blank'; a.rel = 'noopener';
          a.innerHTML = '<div class="post-main"><div class="post-meta"><span class="tag">博客</span>' +
            '<time></time></div><h3></h3><p></p></div><span class="post-go" aria-hidden="true">→</span>';
          a.querySelector('time').textContent = rssDate(text(it, 'pubDate'));
          a.querySelector('h3').textContent = title;
          a.querySelector('p').textContent = cleanText(text(it, 'description'), 96);
          frag.appendChild(a);
        });
        if (frag.childNodes.length) {
          rssList.innerHTML = ''; rssList.appendChild(frag);
          var note = $('#rss-note');
          if (note) note.textContent = '已从 RSS 实时更新，共 ' + frag.childNodes.length + ' 篇。';
        }
      }).catch(function () { /* 跨域或网络失败：保留静态快照 */ });
    });
  }

  /* 动态（moments RSS） */
  var momentsList = $('#moments-list');
  if (momentsList) {
    whenVisible(momentsList, function () {
      fetchXml('https://zaraan.zh.kg/feed/moments/rss.xml').then(function (xml) {
        var doc = new DOMParser().parseFromString(xml, 'application/xml');
        var items = Array.prototype.slice.call(doc.querySelectorAll('item')).slice(0, 6);
        if (!items.length) throw new Error('empty');
        var frag = document.createDocumentFragment();
        items.forEach(function (it) {
          var link = text(it, 'link');
          var body = cleanText(text(it, 'description'), 150);
          if (!body) return;
          var li = document.createElement('li');
          li.className = 'moment';
          var t = document.createElement('time');
          t.className = 'moment-date';
          t.textContent = rssDate(text(it, 'pubDate'));
          var p = document.createElement('p');
          p.className = 'moment-text';
          p.textContent = body;
          li.appendChild(t); li.appendChild(p);
          if (link) {
            var a = document.createElement('a');
            a.className = 'moment-link'; a.href = link; a.target = '_blank'; a.rel = 'noopener';
            a.textContent = '查看动态 →';
            li.appendChild(a);
          }
          frag.appendChild(li);
        });
        if (frag.childNodes.length) {
          momentsList.innerHTML = ''; momentsList.appendChild(frag);
          var note = $('#moments-note');
          if (note) note.textContent = '已从动态 RSS 实时更新，共 ' + frag.childNodes.length + ' 条。';
        }
      }).catch(function () { /* 保留快照 */ });
    });
  }

  /* GitHub 项目 */
  var repoList = $('#repo-list');
  if (repoList) {
    whenVisible(repoList, function () {
      fetch('https://api.github.com/users/Z-araan/repos?per_page=100&sort=pushed', {
        headers: { Accept: 'application/vnd.github+json' }
      }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (repos) {
          repos = (repos || []).filter(function (r) { return !r.fork && !r.archived; });
          repos.sort(function (a, b) {
            return (b.stargazers_count - a.stargazers_count) ||
                   String(b.pushed_at).localeCompare(String(a.pushed_at));
          });
          if (!repos.length) throw new Error('empty');
          var LANG = { Python: '#3572A5', HTML: '#e34c26', JavaScript: '#f1e05a', CSS: '#563d7c',
                       TypeScript: '#3178c6', Shell: '#89e051', Vue: '#41b883', Java: '#b07219' };
          repoList.innerHTML = '';
          repos.slice(0, 12).forEach(function (r) {
            var color = LANG[r.language] || 'var(--muted)';
            var a = document.createElement('a');
            a.className = 'card repo-card';
            a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
            a.innerHTML = '<div class="repo-head"><svg viewBox="0 0 24 24" aria-hidden="true">' +
              '<path d="M4 4h16v6H4zM4 14h16v6H4z"/><path d="M8 7h.01M8 17h.01"/></svg>' +
              '<h3></h3><span class="repo-stat" title="最近更新"></span></div><p></p><div class="card-foot">' +
              '<span class="tag"><span class="dot"></span><span class="lang"></span></span>' +
              '<span class="repo-stats"></span></div>';
            a.querySelector('h3').textContent = r.name;
            a.querySelector('.repo-stat').textContent = (r.pushed_at || '').slice(0, 10);
            a.querySelector('p').textContent = r.description || '（暂无描述）';
            a.querySelector('.dot').style.background = color;
            var langSpan = a.querySelector('.lang');
            langSpan.textContent = r.language || 'Text';
            langSpan.parentElement.style.color = color;
            var stats = a.querySelector('.repo-stats');
            if (r.stargazers_count) {
              var s1 = document.createElement('span');
              s1.className = 'repo-stat'; s1.textContent = '★ ' + r.stargazers_count;
              stats.appendChild(s1);
            }
            if (r.forks_count) {
              var s2 = document.createElement('span');
              s2.className = 'repo-stat'; s2.textContent = '⑂ ' + r.forks_count;
              stats.appendChild(s2);
            }
            repoList.appendChild(a);
          });
          var note = $('#repo-note');
          if (note) note.textContent = '已从 GitHub 同步 ' + Math.min(repos.length, 12) + ' 个项目。';
        })
        .catch(function () { /* 保留快照 */ });
    });
  }

  /* ---------- Ctrl/⌘ + K 快速跳转 ---------- */
  var palette = $('#palette'), paletteInput = $('#palette-input'), paletteList = $('#palette-list');

  if (palette && paletteInput && paletteList) {
    var DESTINATIONS = [
      { icon: '🏠', name: '首页', hint: '回到顶部', href: '#top', kind: '页面' },
      { icon: '📄', name: '最新文章', hint: '博客 RSS', href: '#posts', kind: '页面' },
      { icon: '💭', name: '动态', hint: '短文与随手记录', href: '#moments', kind: '页面' },
      { icon: '🐙', name: '项目', hint: '与 GitHub 同步', href: '#projects', kind: '页面' },
      { icon: '🧰', name: '小工具', hint: '全部工具入口', href: '#tools', kind: '页面' },
      { icon: '🙋', name: '关于我', hint: '联系方式', href: '#about', kind: '页面' },
      { icon: '🖼️', name: '图片工具箱', hint: '去 EXIF / 压缩 / 转 WebP', href: '/tools/image.html', kind: '工具' },
      { icon: '🧾', name: 'JSON 工具', hint: '格式化 / 压缩 / 校验', href: '/tools/json.html', kind: '工具' },
      { icon: '🔧', name: '实用小工具', hint: '时间戳 / Base64 / 密码 / UUID', href: '/tools/utils.html', kind: '工具' },
      { icon: '💬', name: '局域网聊天', hint: '同网段传输消息与文件', href: '/tools/chat.html', kind: '工具' },
      { icon: '⏱️', name: '番茄计时器', hint: '专注 25 分钟', href: '/tools/pomodoro.html', kind: '工具' },
      { icon: '🎲', name: '猜数字游戏', hint: '摸鱼小游戏', href: '/tools/guess.html', kind: '工具' },
      { icon: '📄', name: '文章 RSS', hint: 'zaraan.zh.kg/rss.xml', href: 'https://zaraan.zh.kg/rss.xml', kind: '订阅' },
      { icon: '💭', name: '动态 RSS', hint: 'zaraan.zh.kg/feed/moments', href: 'https://zaraan.zh.kg/feed/moments/rss.xml', kind: '订阅' },
      { icon: '🐙', name: 'GitHub 主页', hint: 'github.com/z-araan', href: 'https://github.com/z-araan', kind: '外部' },
      { icon: '✉️', name: '给我发邮件', hint: 'zhang0407peng@vip.qq.com', href: 'mailto:zhang0407peng@vip.qq.com', kind: '外部' },
      { icon: '🌗', name: '切换深色 / 浅色', hint: '手动固定主题', action: 'theme', kind: '操作' },
      { icon: '🖥️', name: '主题跟随系统', hint: '恢复自动模式', action: 'theme-auto', kind: '操作' },
      { icon: '🎵', name: '打开音乐播放器', hint: '随机来一首', action: 'music', kind: '操作' },
      { icon: '📋', name: '复制本页链接', hint: '分享给朋友', action: 'copy', kind: '操作' }
    ];
    var filtered = DESTINATIONS.slice(), activeIndex = 0;

    function render() {
      paletteList.innerHTML = '';
      if (!filtered.length) {
        var li = document.createElement('li');
        li.className = 'empty'; li.textContent = '没有匹配的结果';
        paletteList.appendChild(li);
        return;
      }
      filtered.forEach(function (item, i) {
        var li = document.createElement('li');
        li.className = i === activeIndex ? 'active' : '';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === activeIndex));
        li.innerHTML = '<span aria-hidden="true"></span><span class="p-name"></span><span class="p-kind"></span>';
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
      if (item.action === 'theme') { if (themeBtn) themeBtn.click(); return; }
      if (item.action === 'theme-auto') { setPref('auto'); return; }
      if (item.action === 'music') { var h = $('#music-hint'); if (h) h.click(); return; }
      if (item.action === 'copy') { if (navigator.clipboard) navigator.clipboard.writeText(location.href); return; }
      if (item.href.charAt(0) === '#') {
        var target = document.querySelector(item.href);
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      } else {
        window.open(item.href, item.href.charAt(0) === '/' ? '_self' : '_blank', 'noopener');
      }
    }
    function openPalette() {
      palette.hidden = false; paletteInput.value = '';
      filtered = DESTINATIONS.slice(); activeIndex = 0;
      render(); paletteInput.focus();
    }
    function closePalette() { palette.hidden = true; }

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); palette.hidden ? openPalette() : closePalette(); return;
      }
      if (palette.hidden) return;
      if (e.key === 'Escape') closePalette();
      else if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) run(filtered[activeIndex]); }
    });
    paletteInput.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      filtered = DESTINATIONS.filter(function (d) {
        return !q || (d.name + d.hint + d.kind).toLowerCase().indexOf(q) !== -1;
      });
      activeIndex = 0; render();
    });
    palette.addEventListener('click', function (e) { if (e.target === palette) closePalette(); });
    var openBtn = $('#palette-open');
    if (openBtn) openBtn.addEventListener('click', openPalette);
  }
})();
