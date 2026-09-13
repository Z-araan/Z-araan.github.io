/* ==========================================================================
   Z-araan · 音乐播放器
   基于站点原有播放器代码改写：
     · 首次点击播放才联网取歌单（默认不打扰、不提前暴露访客 IP）
     · 歌单来自 Meting API（网易云），失败时回退到仓库内的本地音轨
     · 歌词 LRC 解析、进度点击跳转、音量记忆、折叠为可拖动圆球、系统媒体键
   ========================================================================== */
(function () {
  'use strict';

  var audio = document.getElementById('customAudioPlayer');
  if (!audio) return;

  var $ = function (id) { return document.getElementById(id); };
  var songNameEl = $('songName'), songArtistEl = $('songArtist'), songCoverEl = $('songCover');
  var songLyricEl = $('songLyric'), musicCover = $('musicCover'), playIcon = $('playIcon');
  var prevBtn = $('prevBtn'), playBtn = $('playBtn'), nextBtn = $('nextBtn');
  var progress = $('progress'), progressBar = $('progressBar');
  var currentTimeEl = $('currentTime'), totalTimeEl = $('totalTime');
  var volumeSlider = $('volumeSlider'), volumeBtn = $('volumeBtn'), volumeSliderWrap = $('volumeSliderWrap');
  var musicWidget = $('musicWidget'), musicFab = $('musicFab'), fabCover = $('fabCover');
  var fabPlayIcon = $('fabPlayIcon'), collapseBtn = $('collapseBtn'), hintBtn = $('music-hint');

  var API_BASE = 'https://meting.mikus.ink/api?server=netease';
  var PLAYLIST_ID = '14153893169';
  var ICON_PLAY = 'M8 5v14l11-7z';
  var ICON_PAUSE = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';

  var songList = [], listIndex = 0, lyricData = [], loaded = false, loading = false;
  var isFabDragging = false, fabOffsetX = 0, fabOffsetY = 0, fabStartX = 0, fabStartY = 0, fabHasMoved = false;

  /* ---------- 工具函数 ---------- */
  function clean(text) {
    return String(text == null ? '' : text)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u200B-\u200D\uFEFF\u2028\u2029]/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  function fmt(sec) {
    if (!isFinite(sec)) return '00:00';
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function setIcon(playing) {
    playIcon.innerHTML = '<path d="' + (playing ? ICON_PAUSE : ICON_PLAY) + '"/>';
    fabPlayIcon.innerHTML = '<path d="' + (playing ? ICON_PAUSE : ICON_PLAY) + '"/>';
    musicCover.classList.toggle('playing', playing);
    musicFab.classList.toggle('playing', playing);
    playBtn.title = playing ? '暂停' : '播放';
    playBtn.setAttribute('aria-label', playing ? '暂停' : '播放');
  }
  function say(text) { songLyricEl.textContent = text; }

  /* ---------- 歌词 ---------- */
  function parseLRC(text) {
    var out = [], reg = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
    String(text).split('\n').forEach(function (line) {
      var body = clean(line.replace(reg, ''));
      reg.lastIndex = 0;
      var m;
      while ((m = reg.exec(line)) !== null) {
        var ms = m[3] ? parseInt(m[3], 10) : 0;
        if (m[3] && m[3].length === 2) ms *= 10;
        if (body) out.push({ time: parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + ms / 1000, text: body });
      }
    });
    return out.sort(function (a, b) { return a.time - b.time; });
  }
  function loadLyric(url) {
    lyricData = [];
    if (!url) { say('暂无歌词'); return; }
    say('歌词加载中…');
    fetch(url, { mode: 'cors' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (text) {
      var parsed = parseLRC(text);
      if (parsed.length) { lyricData = parsed; say(''); }
      else say('暂无歌词');
    }).catch(function () { say('暂无歌词'); });
  }
  function currentLyric(t) {
    var cur = '';
    for (var i = 0; i < lyricData.length; i++) {
      if (t >= lyricData[i].time) cur = lyricData[i].text; else break;
    }
    return cur;
  }

  /* ---------- 歌单 ---------- */
  function playIndex(idx) {
    if (!songList.length) return;
    listIndex = ((idx % songList.length) + songList.length) % songList.length;
    var item = songList[listIndex] || {};
    var title = clean(item.title) || '未知歌曲';
    var artist = clean(item.author) || '未知歌手';
    var pic = item.pic || '/images/favicon.ico';

    songNameEl.textContent = title;
    songArtistEl.textContent = artist;
    songCoverEl.src = pic;
    fabCover.src = pic;
    audio.src = item.url || '';
    audio.load();
    loadLyric(item.lrc);
    progress.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', '0');
    currentTimeEl.textContent = '00:00';
    mediaSession(title, artist, pic);
  }

  function mediaSession(title, artist, pic) {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title: title, artist: artist, artwork: [{ src: pic }] });
    } catch (e) { /* 忽略 */ }
  }

  function loadPlaylist(andPlay) {
    if (loaded || loading) { if (loaded && andPlay) togglePlay(); return; }
    loading = true;
    say('正在获取歌单…');
    var timer = setTimeout(function () { loading = false; }, 12000);
    fetch(API_BASE + '&type=playlist&id=' + PLAYLIST_ID)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        clearTimeout(timer);
        if (!data || !data.length) throw new Error('empty');
        songList = data.filter(function (s) { return s && s.url; });
        if (!songList.length) throw new Error('empty');
        loaded = true; loading = false;
        playIndex(Math.floor(Math.random() * songList.length));
        if (andPlay) togglePlay();
      })
      .catch(function () {
        clearTimeout(timer);
        loading = false;
        loaded = false;                    // 允许再次点击重试
        songNameEl.textContent = '歌单加载失败';
        songArtistEl.textContent = '点击播放按钮重试';
        say('网络或接口暂时不可用');
      });
  }

  /* ---------- 播放控制 ---------- */
  function togglePlay() {
    if (!loaded) { loadPlaylist(true); return; }
    if (!audio.src) { playIndex(listIndex); }
    if (audio.paused) {
      audio.play().then(function () { setIcon(true); }).catch(function () {
        say('浏览器拦截了播放，请再点一次');
      });
    } else {
      audio.pause();
      setIcon(false);
    }
  }

  function rememberCollapsed(collapsed) {
    try { localStorage.setItem('music-collapsed', collapsed ? '1' : '0'); } catch (e) {}
  }
  function collapse() {
    musicWidget.classList.add('hidden');
    musicFab.hidden = false;
    musicFab.style.left = 'auto'; musicFab.style.top = 'auto';
    musicFab.style.right = '24px'; musicFab.style.bottom = '24px';
    rememberCollapsed(true);
  }
  function expand() {
    musicWidget.classList.remove('hidden');
    musicFab.hidden = true;
    rememberCollapsed(false);
  }

  /* ---------- 事件绑定 ---------- */
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', function () {
    if (!loaded) { loadPlaylist(true); return; }
    playIndex(listIndex - 1);
    if (audio.paused) audio.play().then(function () { setIcon(true); }).catch(function () {});
  });
  nextBtn.addEventListener('click', function () {
    if (!loaded) { loadPlaylist(true); return; }
    playIndex(listIndex + 1);
    if (audio.paused) audio.play().then(function () { setIcon(true); }).catch(function () {});
  });
  collapseBtn.addEventListener('click', collapse);
  musicFab.addEventListener('click', function () {
    if (fabHasMoved) { fabHasMoved = false; return; }
    expand();
  });
  if (hintBtn) hintBtn.addEventListener('click', function () { expand(); playBtn.focus(); });

  /* 悬浮球拖动 */
  musicFab.addEventListener('pointerdown', function (e) {
    isFabDragging = true; fabHasMoved = false;
    var rect = musicFab.getBoundingClientRect();
    fabOffsetX = e.clientX - rect.left; fabOffsetY = e.clientY - rect.top;
    fabStartX = e.clientX; fabStartY = e.clientY;
    try { musicFab.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  musicFab.addEventListener('pointermove', function (e) {
    if (!isFabDragging) return;
    if (Math.abs(e.clientX - fabStartX) > 5 || Math.abs(e.clientY - fabStartY) > 5) fabHasMoved = true;
    if (!fabHasMoved) return;
    musicFab.style.left = Math.max(0, Math.min(window.innerWidth - 58, e.clientX - fabOffsetX)) + 'px';
    musicFab.style.top = Math.max(0, Math.min(window.innerHeight - 58, e.clientY - fabOffsetY)) + 'px';
    musicFab.style.right = 'auto'; musicFab.style.bottom = 'auto';
    e.preventDefault();
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) {
    musicFab.addEventListener(ev, function (e) {
      isFabDragging = false;
      try { musicFab.releasePointerCapture(e.pointerId); } catch (err) {}
    });
  });

  /* 音量（记忆上次设置） */
  var savedVolume = 0.7;
  try {
    var v = parseFloat(localStorage.getItem('music-volume'));
    if (!isNaN(v) && v >= 0 && v <= 1) savedVolume = v;
  } catch (e) {}
  audio.volume = savedVolume;
  volumeSlider.value = String(Math.round(savedVolume * 100));
  volumeSlider.addEventListener('input', function () {
    audio.volume = this.value / 100;
    try { localStorage.setItem('music-volume', String(audio.volume)); } catch (e) {}
  });
  volumeBtn.addEventListener('click', function () { volumeSliderWrap.classList.toggle('show'); });
  document.addEventListener('click', function (e) {
    if (!volumeSliderWrap.contains(e.target) && !volumeBtn.contains(e.target)) {
      volumeSliderWrap.classList.remove('show');
    }
  });

  /* 进度：点击 + 键盘 */
  function seek(clientX) {
    if (!audio.duration) return;
    var rect = progressBar.getBoundingClientRect();
    var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  }
  progressBar.addEventListener('click', function (e) { seek(e.clientX); });
  progressBar.addEventListener('keydown', function (e) {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
  });

  /* 播放器事件 */
  audio.addEventListener('timeupdate', function () {
    if (!audio.duration) return;
    var pct = audio.currentTime / audio.duration * 100;
    progress.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', String(Math.round(pct)));
    currentTimeEl.textContent = fmt(audio.currentTime);
    if (lyricData.length) {
      var lyr = currentLyric(audio.currentTime);
      if (lyr && songLyricEl.textContent !== lyr) say(lyr);
    }
  });
  audio.addEventListener('loadedmetadata', function () { totalTimeEl.textContent = fmt(audio.duration); });
  audio.addEventListener('ended', function () { playIndex(listIndex + 1); audio.play().catch(function () {}); });
  audio.addEventListener('play', function () { setIcon(true); });
  audio.addEventListener('pause', function () { setIcon(false); });
  audio.addEventListener('error', function () {
    if (audio.src && loaded) say('这首播不了，自动换下一首…');
  });

  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', function () { audio.play(); });
      navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
      navigator.mediaSession.setActionHandler('nexttrack', function () { playIndex(listIndex + 1); audio.play().catch(function () {}); });
      navigator.mediaSession.setActionHandler('previoustrack', function () { playIndex(listIndex - 1); audio.play().catch(function () {}); });
    } catch (e) { /* 忽略 */ }
  }

  /* 初始状态：小屏或上次折叠过 → 收成圆球 */
  var collapsed = false;
  try { collapsed = localStorage.getItem('music-collapsed') === '1'; } catch (e) {}
  if (collapsed || window.innerWidth < 768) collapse();
})();
