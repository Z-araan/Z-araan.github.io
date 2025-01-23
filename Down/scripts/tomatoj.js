document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timer-display");
    const startButton = document.getElementById("start-btn");
    const pauseButton = document.getElementById("pause-btn");
    const resetButton = document.getElementById("reset-btn");
    const statusText = document.getElementById("status");
    const workTimeInput = document.getElementById("work-time");
    const breakTimeInput = document.getElementById("break-time");
    const alarmSoundSelect = document.getElementById("alarm-sound");
    const themeColorSelect = document.getElementById("theme-color");
    const currentTimeDisplay = document.getElementById("current-time");
    const alarmAudio = document.getElementById("alarm-audio");

    let workTime = workTimeInput.value * 60; // 工作时间（秒）
    let breakTime = breakTimeInput.value * 60; // 休息时间（秒）
    let timeLeft = workTime; // 当前剩余时间
    let timerInterval = null;
    let isWorkTime = true; // 是否是工作时间
    let isPaused = false; // 是否暂停

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
            if (!isPaused && timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else if (!isPaused && timeLeft === 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alarmAudio.src = alarmSoundSelect.value; // 设置音效
                alarmAudio.play(); // 播放音效
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

    // 暂停计时
    function pauseTimer() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? "继续" : "暂停";
    }

    // 重置计时器
    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        workTime = workTimeInput.value * 60;
        breakTime = breakTimeInput.value * 60;
        timeLeft = workTime;
        isWorkTime = true;
        isPaused = false;
        statusText.textContent = "工作时间";
        pauseButton.textContent = "暂停";
        updateTimerDisplay();
    }

    // 更新主题颜色
    function updateThemeColor() {
        const themeColor = themeColorSelect.value;
        document.body.style.backgroundColor = themeColor;
        startButton.style.backgroundColor = themeColor;
        pauseButton.style.backgroundColor = themeColor;
        resetButton.style.backgroundColor = themeColor;
    }

    // 初始化显示
    updateTimerDisplay();
    setInterval(updateCurrentTime, 1000); // 每秒更新当前时间
    updateThemeColor(); // 初始化主题颜色

    // 绑定按钮事件
    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);
    themeColorSelect.addEventListener("change", updateThemeColor);
});