# MentholHolic · 薄荷与比特

一个基于 Jekyll 的个人博客。暗色青绿视觉、文章首页、搜索与分类筛选、标签、归档、文章目录和 RSS。没有 React 或 Vite 运行依赖。

## 我以后怎么上传 Markdown？

1. 在 `_posts` 中新增 `YYYY-MM-DD-英文短名.md`。
2. 写上 YAML 头信息，正文用 Markdown。参考 `WRITING.md` 或现有文章。
3. 在 GitHub `_posts` 目录点 **Add file → Upload files** 上传并提交，或本地 Git 提交后推送。
4. 等 GitHub Actions 部署完成。首页、分类、标签、归档、RSS 自动更新。

仓库 **Settings → Pages** 的来源需设为 **GitHub Actions**。没有上传界面、账号系统或后端，文章直接由 GitHub 仓库管理。

## 正式网站与双击预览

- `home.html`：正式首页入口，Jekyll 通过 permalink 输出为网站 `index.html`。
- `_includes/home-content.html`：首页内容模板，循环读取 `site.posts`。
- `_layouts/default.html`：公共页头、页脚。
- `_layouts/post.html`：Markdown 文章页面。
- `archive-page.html`、`about-page.html`：正式归档与关于页面。
- `_posts/`：要发布的文章；`_drafts/`：不发布的草稿。
- `assets/blog.css`、`assets/blog.js`：样式和原生 JavaScript。
- `assets/images/miku-reference.png`：用户提供的原图，未修改图片内容，保留署名。

根目录 `index.html`、`archives.html`、`about.html`、`notes/*.html`、`feed.xml` 是本次生成的**离线预览快照**，可直接双击首页查看。它们在 `_config.yml` 中排除，不参与线上构建；线上始终从 Markdown 与模板重新生成。添加新 Markdown 后，线上自动更新，离线快照不会自动更新。

本次快照使用 LiquidJS + Markdown-it 渲染同一套模板，仅用于预览，不代替 Jekyll 正式构建。辅助脚本在仓库外 `D:\PrivateWebsite\.blog-preview\render.cjs`。本机无 Ruby，尚未本地执行 Jekyll；正式工作流使用 GitHub 官方 Jekyll Pages action。

安装 Ruby / Bundler 后可本地查看实时文章：

```bash
bundle install
bundle exec jekyll serve
```

三篇初始文章是欢迎页、博客使用说明和笔记模板示例，不是虚构的专业经历。可自行编辑或移除。

旧作品集静态首页备份：`D:\PrivateWebsite\MentholHolic-LC-react-backup\portfolio-static.html`。

## 首屏极光封面

首屏使用超大 MENTHOL 字标、人物叠层和青绿 / 冰蓝 / 柔紫极光。

- `assets/hero.css`：首屏排版与极光基础样式，公共布局加载。
- `assets/aurora.js`：将用户提供的 React Bits Aurora GLSL 算法接入原生 WebGL2，保留原始顶点与片元着色器；不使用 React 或 OGL。
- 配色在 `palette` 中，振幅和融合程度由 `uAmplitude`、`uBlend` 控制。
- 提供全站暂停按钮；遵循系统减少动画偏好，切到后台后暂停；无 WebGL2 时使用 CSS 静态渐变。
- 首屏图片使用现有原图的 CSS 显示裁切，侧栏仍展示含署名的完整原图。

## 全站视觉与卡片交互

- `assets/theme.css` / `assets/theme.js`：固定导航、原版线条 Logo、半透明阅读面板和卡片交互。
- `_layouts/default.html`：统一加载固定人物背景与极光。文章、归档、关于页面共用背景；新的带 front matter 页面默认使用此布局。
- 首页新增三个真实页面入口。悬停或键盘聚焦时整卡变为薄荷绿，并展开错位标签。
- BorderGlow 基于用户提供的 React Bits 代码，保留边缘接近度和指针角度计算，改写为原生事件、CSS 渐变边框与外部辉光；不引入 React。
- 全站共用一个 canvas。右下角按钮控制极光，暂停偏好跨页保留；后台标签自动暂停；无 WebGL2 时退回静态渐变。滚动不再暂停极光，因为背景现在固定覆盖整个视口。
- 自我介绍围绕分析、拆解、理解原理和记录探索展开。
