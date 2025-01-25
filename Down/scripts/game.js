document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");

    // 设置弹窗显示的时间（30秒）
    const timeout = 10000; // 30秒

    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.pointerEvents = "auto";
    }, timeout);

    yesButton.addEventListener("click", () => {
        // 点击“是”，跳转到游戏链接
        window.location.href = "https://z-araan.github.io/Down/numbers.html"; // 替换为你的游戏链接
    });

    noButton.addEventListener("click", () => {
        // 点击“否”，关闭弹窗
        popup.style.opacity = "0";
        popup.style.pointerEvents = "none";
    });
});