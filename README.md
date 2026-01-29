# DevPort - 作品展示网站

基于 Next.js 的全栈作品展示平台，采用精致工业风设计，包含前台展示和后台管理功能。

## 设计特色

- **精致工业风**: 方角设计、网格背景、角落括号装饰
- **电光蓝配色**: 科技感十足的青色 accent (#00D9FF)
- **终端风格 Hero**: 模拟命令行界面的打字效果介绍
- **流畅动画**: Framer Motion 驱动的交互动效
- **发光效果**: hover 时的 accent-glow 视觉反馈

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS
- **动画库**: Framer Motion
- **Markdown 编辑器**: @uiw/react-md-editor
- **数据库**: SQLite + Prisma
- **图片存储**: 本地静态资源

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 初始化数据库

```bash
pnpm db:push
```

### 配置后台账号密码

编辑 `config/.env` 文件（首次启动会自动创建模板）：

```env
# 后台管理账号密码配置（必须设置）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password

# 联系方式配置（可选）
SOCIAL_GITHUB=https://github.com/yourusername
SOCIAL_EMAIL=your.email@example.com
SOCIAL_TELEGRAM=your_telegram_username
```

### 启动开发服务器

```bash
pnpm dev
```

访问：
- 前台: http://localhost:3000
- 后台: http://localhost:3000/admin（需要登录）

## Docker 部署

### 使用 Docker Compose（推荐）

1. 启动容器：

```bash
docker-compose up -d
```

2. 配置后台账号密码：

编辑 `config/.env` 文件（首次启动会自动创建模板），设置 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD`。

**重要**：首次部署时必须设置 `ADMIN_PASSWORD`，否则无法登录后台。

3. 重启容器使配置生效：

```bash
docker-compose restart
```

4. 访问应用：
- 前台: http://localhost:3000
- 后台: http://localhost:3000/admin

### 使用 Docker 命令

```bash
# 构建镜像
docker build -t devport:latest .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/public/uploads \
  -v $(pwd)/config:/app/config \
  -e DATABASE_URL=file:/app/data/prod.db \
  --name devport \
  devport:latest
```

首次启动会在 `./config/.env` 自动创建配置文件模板，编辑后重启容器即可生效。

### 数据持久化

- 数据库文件保存在 `./data/prod.db`
- 上传的图片保存在 `./uploads` 目录
- 配置文件保存在 `./config/.env`

### 更新部署

```bash
# 重新构建并启动
docker-compose up -d --build
```

数据文件通过 volume 挂载在宿主机，重新构建镜像不会影响数据。

## 功能特性

### 前台
- 多语言支持（简体中文 / English）
- **终端风格 Hero 区域**（打字动画效果）
- 项目列表展示（响应式布局）
- 项目详情页（Markdown 渲染）
- 标题和内容支持中英文切换显示
- 卡片标题过长自动隐藏，悬停显示完整内容
- **交互动效**（hover 发光、缩放等）

### 后台
- 用户登录鉴权
- 项目 CRUD 操作
- 拖拽调整项目展示顺序
- 标题和内容支持中英文分别编辑
- Markdown 编辑器
- 图片上传和管理
- 清理未使用的已上传图片
- 项目隐藏/显示控制

## 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

Made with ❤️ by [Yuuuuu0](https://github.com/Yuuuuu0)
