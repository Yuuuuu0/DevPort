# DevPort - 接单程序员作品展示网站

一个基于 Next.js 的全栈作品展示平台，包含前台展示和后台管理功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS
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

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── admin/             # 后台管理页面
│   ├── api/               # API 路由
│   ├── projects/          # 项目详情页
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── admin/            # 后台管理组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── project-card.tsx  # 项目卡片组件
│   └── image-gallery.tsx # 图片画廊组件
├── lib/                  # 工具库
│   ├── repositories/     # 数据访问层
│   ├── services/         # 业务逻辑层
│   └── utils/            # 工具函数
└── prisma/               # Prisma 配置
```

## 功能特性

### 前台
- 项目列表展示（Grid 布局）
- 项目详情页（图片画廊 + 演示链接）
- 自动隐藏 hidden=true 的项目

### 后台
- 项目 CRUD 操作
- 多图片上传
- 封面图选择
- 演示链接配置
- 项目隐藏/显示控制

## 数据模型

### Project
- `id`: 唯一标识
- `name`: 项目名称
- `description`: 项目描述（可选）
- `images`: 图片路径数组
- `coverImage`: 封面图（必须来自 images）
- `demoUrl`: 演示链接（可选）
- `hidden`: 是否隐藏（默认 false）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

## 开发说明

### 数据访问
所有数据访问必须通过 Repository/Service 层，禁止页面直接操作 ORM。

### 图片上传
图片存储在 `public/uploads` 目录，后续可替换为远程存储（OSS、S3 等）。

### 扩展建议
- 添加用户认证（NextAuth.js）
- 添加 SEO 优化（metadata）
- 替换图片存储为远程服务
- 添加项目分类/标签功能

