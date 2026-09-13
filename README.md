# Z-araan.github.io

我的个人主页与一堆小工具，纯静态、零依赖，由 GitHub Pages 托管。

- 主页：<https://z-araan.github.io/>
- 博客：<https://zaraan.zh.kg/> · RSS：<https://zaraan.zh.kg/rss.xml>
- 技术栈：原生 HTML / CSS / JavaScript（无框架、无 CDN、无构建步骤、无第三方追踪）

## 目录结构

```
index.html              主页（深色科技风、深浅主题切换、RSS 最新文章）
styles/main.css         全站样式：设计变量 / 双主题 / 组件 / 响应式
styles/sub.css          子页面样式：文章排版、聊天布局、表单、弹窗、工具面板
scripts/main.js         主题记忆、时钟问候、移动菜单、回到顶部、RSS 实时刷新
images/favicon.ico      站点图标
Down/                   子页面与小工具
├── index.html          局域网聊天（WebRTC 传输）
├── image.html          图片工具箱：去 EXIF/GPS、压缩、转 WebP（纯前端）
├── json.html           JSON 格式化 / 压缩 / 校验（报错给出行列）
├── utils.html          时间戳 / Base64 / 随机密码 / UUID / 颜色转换
├── tomato.html         番茄计时器（内置提示音，不依赖网络）
├── numbers.html        猜数字游戏
├── ggg.html            WebAssembly 技术文章（含目录、朗读、评论）
├── wish.html           生日祝福信（背景音乐 + 彩蛋 + 评论）
└── z-araan.apk         安卓应用安装包
sitemap.xml             站点地图
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

## 说明

- 主题默认深色，右上角可切换浅色，选择记在浏览器本地，首次访问跟随系统偏好。
- 所有工具都在浏览器本地运行，不上传任何数据；页面不加载第三方脚本或字体（聊天页与文章页的评论使用 Giscus，属可选组件）。
- 主页「最新文章」优先尝试从前述 RSS 实时拉取，若浏览器因跨域限制无法读取，则回退到构建时写入的静态快照。
