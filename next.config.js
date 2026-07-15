/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 静态导出（部署时设 NEXT_PUBLIC_STATIC_EXPORT=true）
  // 开发/预览模式保持 undefined 以支持 API routes（output: 'export' 与 API routes 不兼容）
  // 静态导出前需将 app/api/ 迁移到 functions/api/（Cloudflare Pages Functions）
  output: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
