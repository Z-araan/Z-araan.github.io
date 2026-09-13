/* 猜数字游戏 · 重写版（保持原有元素 id，增加提示分类与尝试次数）
   id 契约：guess / submit-guess / message / reset-game（可选：attempts） */
document.addEventListener('DOMContentLoaded', function () {
  var guessInput = document.getElementById('guess');
  var submitButton = document.getElementById('submit-guess');
  var message = document.getElementById('message');
  var resetButton = document.getElementById('reset-game');
  var attemptsEl = document.getElementById('attempts');

  var target = 0;
  var attempts = 0;

  function updateAttempts() {
    if (attemptsEl) attemptsEl.textContent = attempts ? '已尝试 ' + attempts + ' 次' : '';
  }

  function newGame() {
    target = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guessInput.value = '';
    guessInput.disabled = false;
    submitButton.disabled = false;
    message.textContent = '';
    message.className = '';
    updateAttempts();
    guessInput.focus();
  }

  function submit() {
    var guess = parseInt(guessInput.value, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      message.className = '';
      message.textContent = '请输入 1 到 100 之间的数字！';
      guessInput.select();
      return;
    }
    attempts += 1;
    updateAttempts();

    if (guess === target) {
      message.className = 'win';
      message.textContent = '🎉 恭喜！你用了 ' + attempts + ' 次猜中了答案 ' + target + '。';
      submitButton.disabled = true;
      guessInput.disabled = true;
      resetButton.focus();
    } else {
      message.className = guess < target ? 'low' : 'high';
      message.textContent = (guess < target ? '太低了 ↑' : '太高了 ↓') + '，再试一次。';
      guessInput.focus();
    }
    guessInput.value = '';
  }

  submitButton.addEventListener('click', submit);
  resetButton.addEventListener('click', newGame);
  guessInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  });

  newGame();
});
