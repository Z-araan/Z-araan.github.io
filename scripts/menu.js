document.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // 阻止默认右键菜单
            const menu = document.getElementById('right-menu');
            menu.style.display = 'block'; // 显示右拉菜单
            menu.style.top = e.clientY + 'px'; // 菜单位置
        });

        document.addEventListener('click', function() {
            const menu = document.getElementById('right-menu');
            menu.style.display = 'none'; // 点击其他地方隐藏右拉菜单
        });

        // 显示和隐藏子菜单
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                const submenu = this.querySelector('.submenu');
                if (submenu) {
                    submenu.style.display = 'block'; // 鼠标悬停时显示子菜单
                }
            });

            item.addEventListener('mouseleave', function() {
                const submenu = this.querySelector('.submenu');
                if (submenu) {
                    submenu.style.display = 'none'; // 鼠标移出时隐藏子菜单
                }
            });
        });