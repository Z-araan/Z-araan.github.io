document.getElementById('search-input').addEventListener('keypress', function(event) {
        if (event.keyCode === 13)
        if (event.key === 'Enter')
         { // 回车键的键码是13

            document.querySelector('form').submit(); // 触发表单提交
        }
    });