# Z-araan.github.io

我的个人主页与一些小工具，纯静态、零依赖，直接由 GitHub Pages 托管。

- 主页：<https://z-araan.github.io/>
- 技术栈：原生 HTML / CSS / JavaScript（无框架、无 CDN、无构建步骤）

## 目录结构

```
index.html            主页（深色科技风，支持深浅主题切换）
styles/main.css       全站样式（CSS 变量 + 响应式 + 双主题）
scripts/main.js       主页脚本（时钟、问候语、主题、菜单、回到顶部）
images/favicon.ico    站点图标
Down/                 子页面与小工具
├── index.html        局域网聊天
├── ggg.html          技术文章（WebAssembly）
├── tomato.html       番茄计时器
├── numbers.html      猜数字游戏
├── wish.html         生日祝福页
└── z-araan.apk       安卓应用安装包
sitemap.xml           站点地图
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

## 说明

- 主页默认深色主题，右上角可切换浅色，选择会记在浏览器本地；首次访问跟随系统偏好。
- 页面不加载任何第三方脚本或字体，所有图标均为内联 SVG。
