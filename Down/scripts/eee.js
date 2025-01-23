document.addEventListener("DOMContentLoaded", () => {
    const guessInput = document.getElementById("guess");
    const submitButton = document.getElementById("submit-guess");
    const message = document.getElementById("message");
    const resetButton = document.getElementById("reset-game");

    let targetNumber = Math.floor(Math.random() * 100) + 1; // 生成1到100的随机数
    let attempts = 0;

    // 提交按钮的点击事件
    submitButton.addEventListener("click", () => {
        const guess = parseInt(guessInput.value);
        attempts++;

        if (isNaN(guess) || guess < 1 || guess > 100) {
            message.textContent = "请输入一个1到100之间的数字！";
        } else if (guess === targetNumber) {
            message.textContent = `恭喜你！你在${attempts}次尝试后猜对了数字！`;
            submitButton.disabled = true;
            resetButton.style.display = "inline-block";
        } else if (guess < targetNumber) {
            message.textContent = "太低了！再试一次。";
        } else {
            message.textContent = "太高了！再试一次。";
        }

        // 清空输入框
        guessInput.value = "";
    });

    // 监听输入框的键盘事件，实现回车键提交
    guessInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            submitButton.click(); // 模拟点击提交按钮
        }
    });

    // 重置按钮的点击事件
    resetButton.addEventListener("click", () => {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        message.textContent = "";
        guessInput.value = "";
        submitButton.disabled = false;
        resetButton.style.display = "none";
    });
});
    