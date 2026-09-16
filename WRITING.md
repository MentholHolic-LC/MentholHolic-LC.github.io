# 发布一篇 Markdown 文章

## 文件放哪里？

放入 `_posts`，例如 `2026-09-16-first-note.md`。文件名必须以完整日期开头。

## 可以直接复制的格式

```markdown
---
layout: post
title: "我的第一篇安全笔记"
date: 2026-09-16 20:00:00 +0800
categories: [安全笔记]
tags: [Web, 学习记录]
description: "这次理解了什么，以及还有哪些问题。"
---

## 背景

这里写正文。

## 过程

这里可以放代码、截图、表格。

## 总结

记录结论与下一步。
```

- `title`：文章标题。
- `date`：实际发布时间；未来日期默认不发布。建议用当前或过去日期。
- `categories`：建议每篇选一个，如安全笔记、建站记录、随笔；可自行增加分类。
- `tags`：可以有多个，自动出现在首页标签区。
- `description`：首页摘要。
- `layout`：固定为 post，也可省略（站点默认已配置）。

## 图片

将图片上传到 `assets/images`。当前根域名网站可以写：

```markdown
![截图说明](/assets/images/example.png)
```

如以后改成仓库子路径站点，使用 Jekyll 的 `relative_url` 过滤器适配 baseurl：

```liquid
![截图说明]({{ '/assets/images/example.png' | relative_url }})
```

## 上传到 GitHub

1. 打开仓库，进入 `_posts`。
2. 点击 **Add file → Upload files**。
3. 上传 `.md` 并提交到 `main` 或 `master` 中实际部署的分支。
4. 查看仓库 **Actions**，等待 `Deploy Jekyll portfolio to GitHub Pages` 成功。
5. 刷新线上博客。

新文章、分类、标签、归档和 RSS 都自动更新。只改 Markdown，不需要改 `index.html`。

## 草稿

草稿放 `_drafts`，例如 `next-note.md`。可复制现成的 `_drafts/article-template.md`。准备发表时将其移到 `_posts` 并补全日期文件名。

## 预览说明

双击根目录的 `index.html` 可以看本次设计的快照。新增文章不会更新这份离线快照；请查看部署后的网站，或使用 `bundle exec jekyll serve` 本地构建。离线快照里的 RSS 是当前文章的示例；线上 RSS 会由 Jekyll 自动生成。

官方规则：https://jekyllrb.com/docs/posts/


## 新增普通页面也继承主题

例如新建 `links.md`，填入下面的头信息，再写 Markdown 正文：

```yaml
---
layout: default
title: "我的收藏"
permalink: /links.html
---
```

固定导航、原版 Logo、人物背景、极光以及右下角动画控制都来自公共布局，无需每页重新添加。文章继续使用 `layout: post`，它也继承这套主题。这里的继承发生在 Jekyll 部署时，离线快照仍需重新生成。
