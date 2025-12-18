# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 OpenSSL 和必要的依赖（Prisma 需要）
RUN apk add --no-cache openssl libc6-compat

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 接收构建参数（环境变量）
ARG DATABASE_URL
ARG NEXT_PUBLIC_SOCIAL_GITHUB
ARG NEXT_PUBLIC_SOCIAL_EMAIL
ARG NEXT_PUBLIC_SOCIAL_TELEGRAM

# 设置环境变量（构建时使用临时路径，避免创建数据库文件）
ENV DATABASE_URL=${DATABASE_URL:-file:/tmp/build.db}
ENV NEXT_PUBLIC_SOCIAL_GITHUB=${NEXT_PUBLIC_SOCIAL_GITHUB}
ENV NEXT_PUBLIC_SOCIAL_EMAIL=${NEXT_PUBLIC_SOCIAL_EMAIL}
ENV NEXT_PUBLIC_SOCIAL_TELEGRAM=${NEXT_PUBLIC_SOCIAL_TELEGRAM}

# 生成 Prisma Client
RUN pnpm db:generate

# 初始化临时数据库（用于构建时的静态生成）
RUN pnpm db:push --accept-data-loss || true

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 安装 OpenSSL 和必要的依赖（Prisma 需要）
RUN apk add --no-cache openssl libc6-compat

# 安装 Prisma CLI（用于数据库迁移）
RUN npm install -g prisma@^5.19.1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 从构建阶段复制必要文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# 显式复制 public 目录（standalone 模式应该已经包含，但确保存在）
# 如果 standalone 中已有 public，这个复制会合并内容
COPY --from=builder /app/public ./public

# 复制入口脚本并设置权限
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# 创建数据目录和上传目录
# volume 映射会覆盖 public/uploads，所以这里只是确保结构存在
RUN mkdir -p data public/uploads && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 使用入口脚本启动应用
ENTRYPOINT ["./docker-entrypoint.sh"]
