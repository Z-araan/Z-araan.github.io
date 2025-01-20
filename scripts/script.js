// JavaScript代码
// 示例：动态改变标题
function changeTitle() {
    document.title = "Z-araan的博客";
}

// 示例：添加点击事件
document.getElementById("toggle-menu").addEventListener("click", function() {
    var menu = document.getElementById("menu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});

// 页面加载完成后执行
window.onload = function() {
    changeTitle();
    // 可以在这里添加更多页面加载完成后的操作
};
function downloadFile() {
    const link = document.createElement("a");
    link.href = "https://z-araan.github.com/z-araan.akp"; // 文件路径
    link.download = "好东西"; // 设置下载后的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
