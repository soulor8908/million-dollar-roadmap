// lib/auth.ts
// 简单 token 校验：检查 Authorization: Bearer <token> 头
// 未配置 API_TOKEN 时放行（开发模式），生产环境通过
// `wrangler pages secret put API_TOKEN --project-name=devpath` 设置
//
// AI Native 鉴权策略：
//   - 用户自带 modelConfig（含 apiKey）→ 始终放行（用户用自己的额度，不需要服务端 token）
//   - 使用服务端默认模型 → 需要匹配 API_TOKEN（防止匿名用户消耗服务端 AI 额度）
//   - 未配置 API_TOKEN → 开发模式放行（但会在 console 警告生产环境风险）

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

/** 判断是否运行在生产环境 */
function isProduction(): boolean {
  // Cloudflare Pages 会设置 CF_PAGES 环境变量
  const cf = (
    globalThis as Record<string, unknown>
  ).__cloudflareEnv as Record<string, string> | undefined;
  if (cf?.CF_PAGES) return true;
  return process.env.CF_PAGES === "1" || process.env.NODE_ENV === "production";
}

/**
 * 校验请求是否携带有效 token。
 * @param req 请求对象
 * @param options.useServerModel 是否使用服务端默认模型（true 时需要 token 校验）
 * @returns null 表示通过；NextResponse(401) 表示拒绝
 */
export function requireAuth(
  req: Request,
  options?: { useServerModel?: boolean }
): NextResponse | null {
  const expected = getApiToken();
  const useServerModel = options?.useServerModel ?? true;

  // 用户自带 modelConfig（含 apiKey）→ 始终放行
  if (!useServerModel) return null;

  // 使用服务端默认模型 → 需要 token 校验
  if (!expected) {
    // 未配置 token
    if (isProduction()) {
      // 生产环境未配置 token 却有人用默认模型 → 拒绝并提示
      console.error(
        "[auth] 生产环境未配置 API_TOKEN，拒绝使用服务端默认模型的请求"
      );
      return NextResponse.json(
        {
          error:
            "未选择 AI 模型。请在「我的 → 设置 → AI 模型配置」中添加你自己的模型（需填写 API Key），或在聊天页底部模型选择器中选中已配置的模型。",
        },
        { status: 503 }
      );
    }
    // 开发模式放行
    return null;
  }

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${expected}`) return null;

  return NextResponse.json({ error: "未授权" }, { status: 401 });
}
