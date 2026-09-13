# Z-araan.github.io

我的个人主页与一堆小工具，纯静态、零依赖，由 GitHub Pages 托管。

- 主页：<https://z-araan.github.io/>
- 博客：<https://zaraan.zh.kg/> · RSS：<https://zaraan.zh.kg/rss.xml>
- 技术栈：原生 HTML / CSS / JavaScript（无框架、无 CDN、无构建；唯一外部依赖是评论区 Giscus 与音乐播放器的第三方歌单 API）

## 目录结构

```
index.html              主页：动态背景、RSS 最新文章、项目与工具、Ctrl/⌘+K 快速跳转、音乐播放器
styles/main.css         全站样式：设计变量 / 双主题 / 组件 / 背景画布 / 命令面板 / 页脚
styles/sub.css          子页面样式：文章排版、聊天布局、表单、弹窗、工具面板
styles/music.css        音乐播放器样式（可折叠悬浮球）
scripts/main.js         主题记忆、时钟问候、移动菜单、回到顶部、动态背景、RSS 刷新、⌘K 面板
scripts/music.js        音乐播放器：Meting 歌单 + 本地回退音轨、歌词、进度、音量记忆
images/favicon.ico      站点图标
Audio/                  音频：fallback.mp3（播放器回退）、ttsmaker.mp3（文章朗读回退）
Down/                   子页面与小工具
├── image.html          图片工具箱：去 EXIF/GPS、压缩、转 WebP（纯前端）
├── json.html           JSON 格式化 / 压缩 / 校验（报错给出行列）
├── utils.html          时间戳 / Base64 / 随机密码 / UUID / 颜色转换
├── chat.html           局域网聊天（WebRTC 传输）
├── pomodoro.html       番茄计时器（内置提示音，离线可用）
├── guess.html          猜数字游戏
├── wasm.html           WebAssembly 技术文章（目录、朗读、评论）
├── scripts/            各页面逻辑脚本
└── z-araan.apk         安卓应用安装包
sitemap.xml             站点地图
.nojekyll               跳过 Jekyll 处理，纯静态直接发布
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

## 说明

- 主题默认深色，右上角可切换浅色，选择记在浏览器本地，首次访问跟随系统偏好。
- 工具全部在浏览器本地运行，不上传数据；主页背景是 Canvas 动态绘制（尊重"减少动效"系统设置）。
- 音乐播放器**首次点击播放才联网**获取歌单（Meting API），失败会自动回退到仓库内的本地音轨；音量与折叠状态会记忆。
- 主页「最新文章」优先从 RSS 实时拉取，跨域受限时回退到构建时写入的静态快照。
