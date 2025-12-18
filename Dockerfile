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

# 设置环境变量（构建时使用临时路径，避免创建数据库文件）
# 运行时环境变量会覆盖此值，固定为 file:/app/data/prod.db
ENV DATABASE_URL=file:/tmp/build.db

# 生成 Prisma Client
RUN pnpm db:generate

# 初始化临时数据库（用于构建时的静态生成）
RUN pnpm db:push --accept-data-loss || true

# 构建应用
RUN pnpm build

# 确保 public 目录被复制到 standalone 输出中（standalone 模式可能不会自动包含）
RUN if [ -d "public" ]; then cp -r public .next/standalone/ || true; fi

# 生产阶段
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 安装 OpenSSL 和必要的依赖（Prisma 需要）
RUN apk add --no-cache openssl libc6-compat

# 安装 Prisma CLI（用于数据库迁移）并清理缓存
RUN npm install -g prisma@^5.19.1 --omit=optional && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.cache

# 从构建阶段复制必要文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# 复制入口脚本并设置权限，创建必要的目录
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh && \
    mkdir -p data public/uploads config

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 使用入口脚本启动应用
ENTRYPOINT ["./docker-entrypoint.sh"]
