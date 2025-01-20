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
            link.href = "/Down/z-araan.akp"; // 替换为实际文件路径
            link.download = "z-araan.akp"; // 设置下载文件的名称

            // 将 <a> 标签添加到页面中
            document.body.appendChild(link);

            // 模拟点击
            link.click();

            // 移除 <a> 标签
            document.body.removeChild(link);
        });

