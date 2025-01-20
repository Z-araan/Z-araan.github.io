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

        