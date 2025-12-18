/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  output: 'standalone',
  // 重写规则：将旧的 /uploads/* 路径重定向到 API 路由
  // 这样可以兼容数据库中已有的旧路径，同时新上传的文件使用 /api/uploads/* 路径
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig

