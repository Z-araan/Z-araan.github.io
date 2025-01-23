 document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timer-display");
    const startButton = document.getElementById("start-btn");
    const resetButton = document.getElementById("reset-btn");
    const statusText = document.getElementById("status");
    const workTimeInput = document.getElementById("work-time");
    const breakTimeInput = document.getElementById("break-time");
    const currentTimeDisplay = document.getElementById("current-time");
    const alarmSound = document.getElementById("alarm-sound");

    let workTime = workTimeInput.value * 60; // 工作时间（秒）
    let breakTime = breakTimeInput.value * 60; // 休息时间（秒）
    let timeLeft = workTime; // 当前剩余时间
    let timerInterval = null;
    let isWorkTime = true; // 是否是工作时间

    // 更新时间显示
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    // 更新当前时间
    function updateCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        currentTimeDisplay.textContent = `当前时间：${hours}:${minutes}:${seconds}`;
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
                alarmSound.play(); // 播放音效
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
        workTime = workTimeInput.value * 60;
        breakTime = breakTimeInput.value * 60;
        timeLeft = workTime;
        isWorkTime = true;
        statusText.textContent = "工作时间";
        updateTimerDisplay();
    }

    // 初始化显示
    updateTimerDisplay();
    setInterval(updateCurrentTime, 1000); // 每秒更新当前时间

    // 绑定按钮事件
    startButton.addEventListener("click", startTimer);
    resetButton.addEventListener("click", resetTimer);
});