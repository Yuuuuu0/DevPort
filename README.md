# DevPort - 接单程序员作品展示网站

一个基于 Next.js 的全栈作品展示平台，包含前台展示和后台管理功能。支持多语言、Markdown 内容编辑和现代化 UI 设计。

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS
- **Markdown 编辑器**: @uiw/react-md-editor
- **Markdown 渲染**: react-markdown + remark-gfm
- **动画库**: framer-motion
- **数据库**: SQLite + Prisma
- **图片存储**: 本地静态资源 (public/uploads)

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 初始化数据库

```bash
pnpm db:push
```

### 启动开发服务器

```bash
pnpm dev
```

访问：
- 前台: http://localhost:3000
- 后台: http://localhost:3000/admin

## 功能特性

### 前台
- ✅ 多语言支持（简体中文 / English）
- ✅ 项目列表展示（响应式 Grid 布局）
- ✅ 项目详情页（Markdown 内容渲染 + 演示链接）
- ✅ 现代化 UI 设计（渐变、动画、悬停效果）
- ✅ 自动隐藏 hidden=true 的项目
- ✅ 语言切换（右上角，持久化存储）

### 后台
- ✅ 项目 CRUD 操作
- ✅ Markdown 编辑器（支持中文/英文分别编辑）
- ✅ 多图片上传
- ✅ 图片管理（设置封面、删除、复制 Markdown 链接）
- ✅ 演示链接配置
- ✅ 项目隐藏/显示控制
- ✅ 删除项目时自动清理关联图片文件

## 数据模型

### Project
- `id`: 唯一标识 (String, cuid)
- `name`: 项目名称 (String)
- `contentZh`: 中文内容 - Markdown 格式 (String?, 可选)
- `contentEn`: 英文内容 - Markdown 格式 (String?, 可选)
- `images`: 图片路径数组 - JSON 字符串 (String)
- `coverImage`: 封面图 - 必须来自 images (String)
- `demoUrl`: 演示链接 (String?, 可选)
- `hidden`: 是否隐藏 (Boolean, 默认 false)
- `createdAt`: 创建时间 (DateTime)
- `updatedAt`: 更新时间 (DateTime)

## 开发说明

### 数据访问
所有数据访问必须通过 Repository/Service 层，禁止页面直接操作 ORM。

### 多语言支持
- 前台支持简体中文和英语两种语言
- 项目内容使用独立字段存储（`contentZh` / `contentEn`）
- 语言选择保存在 localStorage，刷新后保持
- 详情见 [多语言支持指南](./docs/i18n-guide.md)

### 图片管理
- 图片存储在 `public/uploads` 目录
- 删除项目时自动删除关联的图片文件
- 更新项目时自动清理不再使用的图片
- 支持复制图片为 Markdown 格式链接

### Markdown 编辑
- 后台使用 @uiw/react-md-editor 编辑器
- 支持实时预览
- 前台使用 react-markdown 渲染
- 支持 GitHub Flavored Markdown (GFM)

### 扩展建议
- 添加用户认证（NextAuth.js）
- 添加 SEO 优化（metadata）
- 替换图片存储为远程服务（OSS、S3 等）
- 添加项目分类/标签功能
- 添加搜索功能
- 添加项目排序功能

## 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

### 贡献

欢迎提交 Issue 和 Pull Request！

### 作者

**Yuuuuu0**

- GitHub: [@Yuuuuu0](https://github.com/Yuuuuu0)
- 项目地址: [https://github.com/Yuuuuu0/DevPort](https://github.com/Yuuuuu0/DevPort)

---

Made with ❤️ by [Yuuuuu0](https://github.com/Yuuuuu0)

