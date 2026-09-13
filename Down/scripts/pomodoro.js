/* 番茄计时器 · 重写版（保持原有元素 id，行为更稳、样式不再覆盖主题）
   id 契约：timer-display / status / start-btn / pause-btn / reset-btn
            work-time / break-time / alarm-sound / theme-color / current-time / alarm-audio */
document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };
  var display = $('timer-display');
  var status = $('status');
  var startBtn = $('start-btn');
  var pauseBtn = $('pause-btn');
  var resetBtn = $('reset-btn');
  var workInput = $('work-time');
  var breakInput = $('break-time');
  var alarmSelect = $('alarm-sound');
  var colorSelect = $('theme-color');
  var clock = $('current-time');
  var alarm = $('alarm-audio');

  var workSec = clamp(workInput.value, 1, 180) * 60;
  var breakSec = clamp(breakInput.value, 1, 60) * 60;
  var left = workSec;
  var isWork = true;
  var paused = false;
  var timer = null;
  var originalTitle = document.title;

  function clamp(v, min, max) {
    v = parseInt(v, 10);
    if (isNaN(v)) return min;
    return Math.min(max, Math.max(min, v));
  }

  function fmt(sec) {
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }

  function render() {
    display.textContent = fmt(left);
    document.title = fmt(left) + ' · ' + (isWork ? '专注中' : '休息中') + ' · Z-araan';
  }

  function tick() {
    if (paused) return;
    left -= 1;
    if (left > 0) { render(); return; }
    // 阶段结束
    left = 0;
    render();
    beep();
    isWork = !isWork;
    left = isWork ? workSec : breakSec;
    status.textContent = isWork ? '工作时间' : '休息时间';
    render();
  }

  function beep() {
    try {
      alarm.src = alarmSelect.value;
      alarm.currentTime = 0;
      var p = alarm.play();
      if (p && p.catch) p.catch(function () { /* 未交互时浏览器会拦截，忽略 */ });
    } catch (e) { /* 忽略 */ }
  }

  function start() {
    if (timer) return;
    paused = false;
    pauseBtn.textContent = '暂停';
    timer = setInterval(tick, 1000);
    startBtn.disabled = true;
  }

  function pause() {
    paused = !paused;
    pauseBtn.textContent = paused ? '继续' : '暂停';
  }

  function reset() {
    clearInterval(timer);
    timer = null;
    workSec = clamp(workInput.value, 1, 180) * 60;
    breakSec = clamp(breakInput.value, 1, 60) * 60;
    left = workSec;
    isWork = true;
    paused = false;
    startBtn.disabled = false;
    pauseBtn.textContent = '暂停';
    status.textContent = '工作时间';
    document.title = originalTitle;
    render();
  }

  function applyAccent() {
    var c = colorSelect.value;
    document.documentElement.style.setProperty('--accent', c);
    document.documentElement.style.setProperty('--accent-2', c);
  }

  function updateClock() {
    var now = new Date();
    clock.textContent = '当前时间：' + [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  // 初始化
  render();
  updateClock();
  setInterval(updateClock, 1000);
  applyAccent();

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);
  colorSelect.addEventListener('change', applyAccent);
  [workInput, breakInput].forEach(function (el) {
    el.addEventListener('change', function () { if (!timer) reset(); });
  });
});
