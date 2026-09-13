# Z-araan.github.io

我的个人主页与一堆小工具，纯静态、零依赖，由 GitHub Pages 托管。

- 主页：<https://z-araan.github.io/>
- 博客：<https://zaraan.zh.kg/> ｜ 文章 RSS：<https://zaraan.zh.kg/rss.xml> ｜ 动态 RSS：<https://zaraan.zh.kg/feed/moments/rss.xml>
- 技术栈：原生 HTML / CSS / JavaScript（无框架、无构建、无第三方统计；只有 Giscus 已移除）

## 页面结构

```
index.html              主页
  ├─ 最新文章            文章 RSS 快照 + 滚动到附近时实时刷新
  ├─ 动态                动态 RSS 快照 + 滚动到附近时实时刷新
  ├─ 项目                GitHub 仓库卡片（api.github.com 实时拉取，带快照兜底）
  ├─ 小工具              6 个纯前端工具入口
  ├─ Ctrl/⌘+K 面板       快速跳转 / 切主题 / 打开音乐 / 复制链接
  └─ 音乐播放器          右下角悬浮卡，可折叠为可拖动圆球
styles/main.css         全站样式：变量 / 双主题 / 组件 / 动态背景 / 命令面板 / 页脚
styles/music.css        音乐播放器样式
styles/sub.css          子页面样式：文章排版、聊天布局、表单、工具面板
scripts/main.js         主题、时钟、菜单、背景画布、RSS/项目懒加载、⌘K 面板
scripts/music.js        播放器：歌单（Meting）+ 歌词 + 进度 + 音量记忆 + 媒体键
images/favicon.ico      站点图标（取自博客 zaraan.zh.kg）
tools/                  子页面目录
├── image.html          图片工具箱：去 EXIF/GPS、压缩、转 WebP（纯前端）
├── json.html           JSON 格式化 / 压缩 / 校验（报错给出行列）
├── utils.html          时间戳 / Base64 / 随机密码 / UUID / 颜色转换
├── chat.html           局域网聊天（WebRTC 传输）
├── pomodoro.html       番茄计时器（内置提示音，离线可用）
├── guess.html          猜数字游戏
└── scripts/            各页面逻辑脚本
sitemap.xml             站点地图
.nojekyll               跳过 Jekyll 处理，纯静态直接发布
```

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

## 特性说明

- **主题**：默认跟随系统（`prefers-color-scheme`），系统切换时页面实时跟随；手动点右上角图标可固定为深色/浅色，`Ctrl/⌘+K` 里可一键恢复"跟随系统"。
- **性能**：RSS 与 GitHub 数据都是**滚动到附近才请求**；背景是 Canvas 绘制、切到后台自动暂停；站内只有图标与脚本两类小文件，无音频、无 APK、无第三方 iframe。
- **隐私**：所有工具在浏览器本地运行；音乐播放器**首次点击播放才联网**；不加载任何统计脚本。
- **动态背景**：三团缓慢流动的光晕 + 漂移星点，深浅两套配色，尊重系统"减少动效"设置。
