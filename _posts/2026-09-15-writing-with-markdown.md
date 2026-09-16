---
title: "把 Markdown 变成博客：我的写作流程"
date: 2026-09-15 10:00:00 +0800
categories: [建站记录]
tags: [Jekyll, Markdown]
description: "不用手写网页。一个 Markdown 文件，加上几行文章信息，就能让新的记录出现在这里。"
---
这篇文章也是小站的使用说明。网站通过 Jekyll 把 Markdown 转成文章页，再自动整理成首页列表、归档与订阅源。

## 1. 新建文章文件

把文件放进仓库的 `_posts` 文件夹。文件名遵循这个格式：

```text
2026-09-17-my-first-note.md
```

日期后面是文章的英文短名。日期决定发布顺序，英文短名构成文章地址。默认不发布未来日期的文章，因此正式上传时应使用当天或过去的日期。

## 2. 填写文章信息

每个文件最上面都需要这段 YAML 信息，注意首尾的三条横线：

```yaml
---
layout: post
title: "我的第一篇安全笔记"
date: 2026-09-17 20:00:00 +0800
categories: [安全笔记]
tags: [Web, 学习记录]
description: "一句话介绍这篇文章写了什么。"
---
```

`title` 是标题，`categories` 是分类，`tags` 是标签，`description` 是首页摘要。正文直接写在第二行分隔线之后。

## 3. 写正文

正文支持标题、列表、引用、链接、图片和代码块。

```markdown
## 今天理解了什么

这里写正文，可以使用 **加粗** 和 `行内代码`。

- 一个观察
- 一个问题

> 一句值得留下的话。
```

图片可以放到 `assets/images` 下。GitHub Pages 根域名站点可在正文这样引用：

```markdown
![图片说明](/assets/images/my-screenshot.png)
```

## 4. 上传并发布

在 GitHub 仓库里打开 `_posts`，通过 **Add file → Upload files** 上传 `.md` 文件，随后提交到网站使用的分支。

也可以在本地创建文件，然后通过 Git 提交并推送。仓库中的 Jekyll Actions 工作流会自动构建，完成后刷新网站即可。第一次部署需要在仓库 **Settings → Pages** 将构建来源设为 **GitHub Actions**。

首页按日期倒序展示，分类、标签、归档和 RSS 都会自动更新，不需要改首页 HTML。

## 草稿与预览

暂时不发布的文章放在 `_drafts`，文件名不需要日期。本地有 Ruby 和 Bundler 时，可运行 `bundle exec jekyll serve --drafts` 查看草稿。

仓库根目录的 `index.html` 是当前版本的双击预览快照；正式网站使用 `home.html` 和模板生成首页。新增 Markdown 后，线上页面会随部署更新，离线快照不会自行变化。

详细规则可以查看 [Jekyll 官方文章文档](https://jekyllrb.com/docs/posts/)。
