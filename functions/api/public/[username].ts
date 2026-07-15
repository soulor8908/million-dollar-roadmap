// functions/api/public/[username].ts
// Cloudflare Pages Function（边缘运行时）
// GET：读 KV → 返回 PublicProfile + PublicStats
// PUT：验证身份（简单 token）→ 更新 KV

import { createKVStore } from "../../../lib/storage/kv";
import type { PublicProfile } from "../../../lib/types";
import type { PublicStats } from "../../../lib/storage/kv";

// 最小类型定义（无 @cloudflare/workers-types 时使用）
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface PagesEnv {
  KV: KVNamespace;
  PUBLIC_AUTH_TOKEN: string;
}

interface PagesContext {
  request: Request;
  env: PagesEnv;
  params: { username: string };
}

type PagesFunction<T = PagesEnv> = (context: PagesContext & { env: T }) => Promise<Response> | Response;

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const username = context.params.username as string;
  const kv = createKVStore(context.env.KV as unknown as { get: (k: string) => Promise<string | null>; put: (k: string, v: string) => Promise<void> });

  const profile = await kv.getProfile(username);
  if (!profile) {
    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stats = await kv.getStats(username);
  return new Response(JSON.stringify({ profile, stats }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300", // 5 分钟边缘缓存
    },
  });
};

export const onRequestPut: PagesFunction<PagesEnv> = async (context) => {
  const username = context.params.username as string;
  const authHeader = context.request.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token || token !== context.env.PUBLIC_AUTH_TOKEN) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const kv = createKVStore(context.env.KV as unknown as { get: (k: string) => Promise<string | null>; put: (k: string, v: string) => Promise<void> });

  const body = (await context.request.json()) as { profile?: Partial<PublicProfile>; stats?: Partial<PublicStats> };

  if (body.profile) {
    const existing = (await kv.getProfile(username)) ?? {
      username,
      displayName: username,
      avatar: undefined,
      bio: "",
      visibility: { radar: true, heatmap: true, currentTopic: true, notes: false },
      followerCount: 0,
      followingCount: 0,
      updatedAt: new Date().toISOString(),
    };
    const merged: PublicProfile = {
      ...existing,
      ...body.profile,
      username, // 防止篡改 username
      updatedAt: new Date().toISOString(),
    };
    await kv.setProfile(merged);
  }

  if (body.stats) {
    await kv.updateStats(username, body.stats);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
