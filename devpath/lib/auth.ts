// lib/auth.ts
// 简单 token 校验：检查 Authorization: Bearer <token> 头
// 未配置 API_TOKEN 时放行（开发模式），生产环境通过
// `wrangler pages secret put API_TOKEN --project-name=devpath` 设置

import { NextResponse } from "next/server";

function getApiToken(): string | undefined {
  // 开发环境：process.env
  const pe = process.env.API_TOKEN;
  if (pe) return pe;
  // Cloudflare Pages 运行时（由 initCloudflareEnv 注入到 globalThis.__cloudflareEnv）
  const cf = (
    globalThis as Record<string, unknown>
  ).__cloudflareEnv as Record<string, string> | undefined;
  return cf?.API_TOKEN;
}

/**
 * 校验请求是否携带有效 token。
 * @returns null 表示通过；NextResponse(401) 表示拒绝
 */
export function requireAuth(req: Request): NextResponse | null {
  const expected = getApiToken();
  if (!expected) return null; // 未配置 token，开发模式放行

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${expected}`) return null;

  return NextResponse.json({ error: "未授权" }, { status: 401 });
}
