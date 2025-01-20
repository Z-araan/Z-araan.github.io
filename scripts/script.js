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
<button onclick="downloadApp()">下载APP</button>

<script>
    function downloadApp() {
        const link = document.createElement("a");
        link.href = "https://z-araan.github.io/Download/z-araan.apk";
        link.download = "好东西"; // 设置下载后的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
</script>
