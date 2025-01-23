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
document.getElementById("downloadButton").addEventListener("click", function() {
            // 创建一个虚拟的 <a> 标签
            const link = document.createElement("a");

            // 设置文件路径
            link.href = "https://z-araan.github.io/Down/z-araan.akp"; // 替换为实际文件路径
            link.download = "z-araan.akp"; // 设置下载文件的名称

            // 将 <a> 标签添加到页面中
            document.body.appendChild(link);

            // 模拟点击
            link.click();

            // 移除 <a> 标签
            document.body.removeChild(link);
        });

function triggerDownload(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'default-file-name';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}, 100); // 延迟100毫秒移除
document.getElementById("downloadButton").addEventListener("click", function(event) {
            console.log("点击触发下载");
            event.preventDefault(); // 阻止默认行为
            window.location.href = this.href; // 触发下载
        });
document.getElementById("downloadButton").addEventListener("click", function() {
            const link = document.createElement("a");
            link.href = "https://z-araan.github.io/Down/z-araan.apk"; // 文件链接
            link.download = "z-araan.apk"; // 设置下载文件的名称
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
// 切换菜单的显示和隐藏
function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// 初始化页面时隐藏菜单
document.addEventListener('DOMContentLoaded', function() {
    var menu = document.getElementById('menu');
    menu.style.display = 'none';
});