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

## Docker 部署

### 使用 Docker Compose（推荐）

1. 创建必要的目录并设置权限（首次部署必需）：

```bash
# 创建数据目录和上传目录
mkdir -p data uploads

# 设置目录权限（允许容器用户写入）
chmod 755 data uploads
```

2. 创建 `.env` 文件（可选，用于配置环境变量）：

```bash
# 注意：容器部署时会忽略 DATABASE_URL，固定使用 file:/app/data/prod.db
# DATABASE_URL 仅用于本地开发环境
NEXT_PUBLIC_SOCIAL_GITHUB=https://github.com/yourusername
NEXT_PUBLIC_SOCIAL_EMAIL=your.email@example.com
NEXT_PUBLIC_SOCIAL_TELEGRAM=your_telegram_username
```

3. 构建并启动容器：

```bash
docker-compose up -d
```

4. 访问应用：
- 前台: http://localhost:3000
- 后台: http://localhost:3000/admin

**注意**：如果容器启动失败并提示权限错误，请确保 `data` 和 `uploads` 目录对容器用户可写。容器使用 UID 1001 运行，您可以使用以下命令设置正确的权限：

```bash
# 方法 1: 使用宽松权限（开发环境）
chmod 777 data uploads

# 方法 2: 设置正确的所有者（推荐）
sudo chown -R 1001:1001 data uploads
chmod 755 data uploads
```

### 使用 Docker 命令

1. 构建镜像：

```bash
docker build \
  --build-arg NEXT_PUBLIC_SOCIAL_GITHUB=https://github.com/yourusername \
  --build-arg NEXT_PUBLIC_SOCIAL_EMAIL=your.email@example.com \
  --build-arg NEXT_PUBLIC_SOCIAL_TELEGRAM=your_telegram_username \
  -t devport:latest .
```

2. 运行容器：

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/public/uploads \
  -e DATABASE_URL=file:/app/data/prod.db \
  --name devport \
  devport:latest
```

**注意**：容器运行时数据库路径固定为 `file:/app/data/prod.db`，即使不指定 `-e DATABASE_URL` 也会使用此路径。

### 数据持久化

- 数据库文件会保存在 `./data/prod.db`
- 上传的图片会保存在 `./uploads` 目录

**重要说明**：
- 容器部署时，数据库路径固定为 `/app/data/prod.db`（对应宿主机 `./data/prod.db`）
- `.env` 文件中的 `DATABASE_URL` 配置在容器部署时会被忽略，仅用于本地开发

### 更新部署

**数据安全说明：**

✅ **数据不会丢失**：数据库文件通过 volume 挂载在宿主机，重新构建镜像不会影响数据。

**更新流程：**

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建并启动
docker-compose up -d --build
```

**Schema 变更处理：**

- 如果数据库 schema 有**非破坏性变更**（如添加字段、表），容器启动时会自动应用
- 如果 schema 有**破坏性变更**（如删除字段、修改字段类型），需要手动处理：

```bash
# 进入容器
docker-compose exec devport sh

# 手动应用迁移（会丢失数据，谨慎操作）
prisma db push --accept-data-loss
```

### 停止和清理

```bash
# 停止容器
docker-compose down

# 停止并删除数据卷（谨慎操作，会删除所有数据）
docker-compose down -v
```

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

