#!/bin/sh
set -e

# 获取数据库路径（从 DATABASE_URL 环境变量中提取）
# 容器部署时固定使用 /app/data/prod.db
DB_PATH="${DATABASE_URL#file:}"
if [ -z "$DB_PATH" ] || [ "$DB_PATH" = "$DATABASE_URL" ]; then
  # 如果 DATABASE_URL 不是 file: 格式，使用默认路径
  DB_PATH="/app/data/prod.db"
fi

# 确保数据库目录存在
DB_DIR=$(dirname "$DB_PATH")
mkdir -p "$DB_DIR"

# 如果数据库文件不存在，初始化数据库
# 使用 --skip-generate 因为 Prisma Client 已经在构建时生成
if [ ! -f "$DB_PATH" ]; then
  echo "数据库文件不存在，正在初始化..."
  prisma db push --accept-data-loss --skip-generate
else
  echo "数据库文件已存在，检查 schema 更新..."
  # 使用 db push 更新 schema，但不接受数据丢失
  # 如果 schema 有破坏性变更，这个命令会失败，需要手动处理
  prisma db push --skip-generate || {
    echo "警告: 数据库 schema 更新失败，可能是由于破坏性变更"
    echo "如果需要应用破坏性变更，请手动运行: prisma db push --accept-data-loss --skip-generate"
    echo "建议: 在生产环境使用 Prisma Migrate 进行更安全的迁移"
  }
fi

# 启动应用
exec node server.js
