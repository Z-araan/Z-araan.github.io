document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timer-display");
    const startButton = document.getElementById("start-btn");
    const resetButton = document.getElementById("reset-btn");
    const statusText = document.getElementById("status");

    let workTime = 25 * 60; // 工作时间（25分钟）
    let breakTime = 5 * 60; // 休息时间（5分钟）
    let timeLeft = workTime; // 当前剩余时间
    let timerInterval = null;
    let isWorkTime = true; // 是否是工作时间

    // 更新时间显示
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    // 开始计时
    function startTimer() {
        if (timerInterval) return; // 如果计时器已运行，则不重复启动
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                if (isWorkTime) {
                    statusText.textContent = "休息时间";
                    timeLeft = breakTime;
                } else {
                    statusText.textContent = "工作时间";
                    timeLeft = workTime;
                }
                isWorkTime = !isWorkTime; // 切换工作/休息状态
                startTimer(); // 自动开始下一个阶段
            }
        }, 1000);
    }

    // 重置计时器
    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = workTime;
        isWorkTime = true;
        statusText.textContent = "工作时间";
        updateTimerDisplay();
    }

    // 初始化显示
    updateTimerDisplay();

    // 绑定按钮事件
    startButton.addEventListener("click", startTimer);
    resetButton.addEventListener("click", resetTimer);
});