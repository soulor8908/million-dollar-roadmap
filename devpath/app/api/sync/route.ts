// app/api/sync/route.ts
// 用户数据云端同步 API（Cloudflare KV）
// - GET  ?userId=xxx：读取 user:${userId}:backup，返回完整备份数据
// - POST body=UserBackup：写入 user:${userId}:backup
// 鉴权：复用 lib/auth.ts 的 requireAuth（共享 API_TOKEN）
// 运行时：edge。通过 getCloudflareKV() 拿到 Cloudflare KV binding，
//         无 binding 时降级为内存 mock（仅本地开发）。

import { NextRequest, NextResponse } from "next/server";
import { initCloudflareEnv, getCloudflareKV } from "@/lib/ai/cloudflare-env";
import { requireAuth } from "@/lib/auth";
import { createKVStore } from "@/lib/storage/kv";
import type { UserBackup } from "@/lib/types";

export const runtime = "edge";

const BACKUP_VERSION = 1;

export async function GET(req: NextRequest) {
  await initCloudflareEnv();
  const authError = requireAuth(req);
  if (authError) return authError;

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "缺少 userId 参数" }, { status: 400 });
  }

  const store = createKVStore(getCloudflareKV());
  const backup = await store.getUserBackup(userId);
  if (!backup) {
    return NextResponse.json({ error: "云端无数据" }, { status: 404 });
  }
  return NextResponse.json({ backup });
}

export async function POST(req: NextRequest) {
  await initCloudflareEnv();
  const authError = requireAuth(req);
  if (authError) return authError;

  let body: Partial<UserBackup> & { userId?: string };
  try {
    body = (await req.json()) as Partial<UserBackup> & { userId?: string };
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }

  const userId = body.userId;
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
  }
  if (!body.data || typeof body.data !== "object") {
    return NextResponse.json({ error: "缺少 data 字段" }, { status: 400 });
  }

  const backup: UserBackup = {
    userId,
    updatedAt: typeof body.updatedAt === "string" ? body.updatedAt : new Date().toISOString(),
    version: typeof body.version === "number" ? body.version : BACKUP_VERSION,
    data: body.data,
  };

  const store = createKVStore(getCloudflareKV());
  await store.setUserBackup(userId, backup);
  return NextResponse.json({ ok: true, updatedAt: backup.updatedAt });
}
