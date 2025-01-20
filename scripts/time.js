//时间
function showTime() {
            const now = new Date(); // 获取当前时间
            const hours = now.getHours().toString().padStart(2, '0'); // 获取小时并补零
            const minutes = now.getMinutes().toString().padStart(2, '0'); // 获取分钟并补零
            const seconds = now.getSeconds().toString().padStart(2, '0'); // 获取秒并补零
            const timeString = `${hours}:${minutes}:${seconds}`; // 构建时间字符串

            document.getElementById('realtime-clock').textContent = timeString; // 更新页面元素内容
        }
//下面是搜索。
        setInterval(showTime, 1000); // 每隔1秒调用一次showTime函数
        showTime(); // 页面加载时立即显示时间
        
        document.getElementById('search-input').addEventListener('keypress', function(event) {
        if (event.keyCode === 13)
        if (event.key === 'Enter')
         { // 回车键的键码是13
        
            document.querySelector('form').submit(); // 触发表单提交
        }
    });

        // 获取按钮元素
        document.getElementById('downloadButton').addEventListener('click', function() {
            // 创建一个临时的<a>标签
            var link = document.createElement('a');

            // 设置链接的href属性为安装包的路径
            link.href = 'https://z-araan.github.io/Down/z-araan.apk'; // 替换为实际的安装包路径

            // 设置download属性，指定下载文件的名称
            link.download = 'z-araan.apk'; // 下载后保存的文件名

            // 将临时链接添加到页面中
            document.body.appendChild(link);

            // 触发点击事件，开始下载
            link.click();

            // 下载完成后移除临时链接
            document.body.removeChild(link);
        });
    