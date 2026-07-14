// lib/sync.ts
// 用户数据云端同步引擎（Cloudflare KV + 用户自生成 userId）
//
// 设计：
// - userId 首次访问自动生成（nanoid），存 IndexedDB key="auth:user_id"
// - 云端数据以 userId 为前缀存入 KV：user:${userId}:backup
// - 客户端先写 IndexedDB（离线可用），再异步同步到 KV
// - 拉取时先读 IndexedDB，跨设备时调云端合并

import { nanoid } from "nanoid";
import { getItem, setItem, listKeys } from "@/lib/storage/db";
import { apiFetch } from "@/lib/api-client";
import type { UserBackup } from "./types";
import { KEY_PREFIXES } from "./types";

// IndexedDB key：用户唯一标识
const USER_ID_KEY = "auth:user_id";
// IndexedDB key：上次成功同步时间（ISO 字符串）
const LAST_SYNC_KEY = "sync:last_synced_at";

// 需要同步的数据 key 前缀（所有用户业务数据）
const SYNC_PREFIXES = [
  KEY_PREFIXES.PLAN,
  KEY_PREFIXES.CARD,
  KEY_PREFIXES.STATUS,
  KEY_PREFIXES.REVIEW_LOG,
  KEY_PREFIXES.LEARN_LOG,
  KEY_PREFIXES.EMOTION,
  KEY_PREFIXES.ROUTINE,
] as const;

// 备份数据结构版本号
const BACKUP_VERSION = 1;

/** 获取或生成 userId（首次访问自动生成并持久化） */
export async function getUserId(): Promise<string> {
  const existing = await getItem<string>(USER_ID_KEY);
  if (existing) return existing;
  const id = nanoid();
  await setItem(USER_ID_KEY, id);
  return id;
}

/** 读取上次成功同步时间，未同步过返回 null */
export async function getLastSyncedAt(): Promise<string | null> {
  const v = await getItem<string>(LAST_SYNC_KEY);
  return v ?? null;
}

/**
 * 合并策略：以 updatedAt 较新者为准。
 * - key 仅在某一方存在 → 取存在的一方
 * - 两方都有 updatedAt → 取较新者
 * - 无法比较 updatedAt → 以云端为准（last-write-wins）
 * @param local 本地数据（key → value）
 * @param remote 云端数据（key → value）
 */
export function mergeData(
  local: Record<string, unknown>,
  remote: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...local };
  for (const [key, remoteVal] of Object.entries(remote)) {
    const localVal = merged[key];
    if (localVal === undefined) {
      merged[key] = remoteVal;
      continue;
    }
    const localTs = getUpdatedAt(localVal);
    const remoteTs = getUpdatedAt(remoteVal);
    if (localTs && remoteTs) {
      merged[key] = remoteTs > localTs ? remoteVal : localVal;
    } else {
      // 无法比较时间戳 → 以云端为准
      merged[key] = remoteVal;
    }
  }
  return merged;
}

function getUpdatedAt(v: unknown): string | undefined {
  if (v && typeof v === "object" && "updatedAt" in v) {
    const ts = (v as { updatedAt?: unknown }).updatedAt;
    return typeof ts === "string" ? ts : undefined;
  }
  return undefined;
}

/** 上传所有本地数据到 KV（全量备份） */
export async function uploadAll(): Promise<void> {
  const userId = await getUserId();
  const data: Record<string, unknown> = {};
  for (const prefix of SYNC_PREFIXES) {
    const keys = await listKeys(prefix);
    for (const k of keys) {
      const v = await getItem<unknown>(k);
      if (v !== undefined) data[k] = v;
    }
  }
  const backup: UserBackup = {
    userId,
    updatedAt: new Date().toISOString(),
    version: BACKUP_VERSION,
    data,
  };
  const res = await apiFetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backup),
  });
  if (!res.ok) {
    const msg = await safeErrText(res);
    throw new Error(`上传失败: ${res.status}${msg ? ` ${msg}` : ""}`);
  }
  await setItem(LAST_SYNC_KEY, backup.updatedAt);
}

/**
 * 从云端下载并合并到本地。
 * @returns true=云端有数据已合并；false=云端无数据
 */
export async function downloadAll(): Promise<boolean> {
  const userId = await getUserId();
  const res = await apiFetch(
    `/api/sync?userId=${encodeURIComponent(userId)}`,
    { method: "GET" },
  );
  if (res.status === 404) return false;
  if (!res.ok) {
    const msg = await safeErrText(res);
    throw new Error(`下载失败: ${res.status}${msg ? ` ${msg}` : ""}`);
  }
  const payload = (await res.json()) as { backup?: UserBackup };
  const remote = payload?.backup;
  if (!remote || !remote.data) return false;

  // 读取本地对应 key 的值用于合并
  const local: Record<string, unknown> = {};
  for (const key of Object.keys(remote.data)) {
    const v = await getItem<unknown>(key);
    if (v !== undefined) local[key] = v;
  }
  const merged = mergeData(local, remote.data);
  for (const [k, v] of Object.entries(merged)) {
    await setItem(k, v);
  }
  await setItem(LAST_SYNC_KEY, new Date().toISOString());
  return true;
}

async function safeErrText(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: unknown };
    return typeof j.error === "string" ? j.error : "";
  } catch {
    return "";
  }
}
