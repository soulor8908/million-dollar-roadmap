// lib/ai/cloudflare-env.ts
// 在 Cloudflare Pages 运行时获取环境变量并注入到 provider
//
// 原理：@cloudflare/next-on-pages 在运行时会把请求上下文挂到
//   globalThis[Symbol.for("__cloudflare-request-context__")]
// 该对象形如 { env, cf, ctx }，env 即 Cloudflare Pages 环境变量。
// 直接读取该 symbol 可避免导入 @cloudflare/next-on-pages（其内部 require("server-only")
// 会在 next build 阶段触发模块求值导致构建失败）。
//
// 开发环境（next dev）下 process.env 已可用，此函数为 no-op。

import { setCloudflareEnv } from "./provider";

const CF_CTX_SYMBOL = Symbol.for("__cloudflare-request-context__");

let initialized = false;

export async function initCloudflareEnv(): Promise<void> {
  if (initialized) return;
  initialized = true;

  // 开发环境：process.env 已可用，无需注入
  if (
    process.env.AI_PROVIDER ||
    process.env.AI_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.GLM_API_KEY
  ) {
    return;
  }

  // Cloudflare Pages 运行时：直接从 globalThis 读取请求上下文
  try {
    const ctx = (globalThis as Record<symbol, { env?: Record<string, unknown> } | undefined>)[CF_CTX_SYMBOL];
    if (ctx?.env) {
      setCloudflareEnv(ctx.env);
    }
  } catch {
    // 非 Cloudflare 环境，忽略
  }
}
