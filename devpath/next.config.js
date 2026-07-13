/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 静态导出（M6 部署时设 NEXT_PUBLIC_STATIC_EXPORT=true）
  // M1-M2 开发期保持 undefined 以支持 API routes（output: 'export' 与 API routes 不兼容）
  output: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "export" : undefined,
};
module.exports = nextConfig;
