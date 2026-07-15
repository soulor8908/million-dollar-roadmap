// lib/api-client.ts
// 客户端 API 调用封装：自动从 IndexedDB 读取 token 并附加 Authorization 头
// token 由用户在 profile 页面配置（存 IndexedDB key="auth:api_token"）

import { getItem, setItem } from "@/lib/storage/db";

const TOKEN_KEY = "auth:api_token";

export async function getApiToken(): Promise<string | null> {
  return (await getItem<string>(TOKEN_KEY)) ?? null;
}

export async function setApiToken(token: string): Promise<void> {
  await setItem(TOKEN_KEY, token);
}

/** 带 token 的 fetch 封装 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getApiToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}
