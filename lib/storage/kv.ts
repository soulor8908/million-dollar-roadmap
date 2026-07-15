// lib/storage/kv.ts
// Cloudflare KV 封装（公开主页数据）
// 运行时：Cloudflare Pages Functions 通过 env.KV binding 注入
// 本地开发/测试：无 env.KV 时降级为内存 Map（mock）

import type { PublicProfile, UserBackup } from "../types";

export interface PublicStats {
  username: string;
  streakDays: number;
  totalMinutes: number;
  currentTopic?: string;
  radarData?: Array<{ node: string; value: number }>;
  heatmapData?: Array<{ date: string; count: number }>;
  updatedAt: string;
}

export interface KVStore {
  getProfile(username: string): Promise<PublicProfile | null>;
  setProfile(profile: PublicProfile): Promise<void>;
  getStats(username: string): Promise<PublicStats | null>;
  updateStats(username: string, stats: Partial<PublicStats>): Promise<void>;
  getUserBackup(userId: string): Promise<UserBackup | null>;
  setUserBackup(userId: string, data: UserBackup): Promise<void>;
}

interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

/**
 * 创建 KV 存储实例
 * @param envKV Cloudflare env.KV binding（边缘运行时注入）
 * 无传入时降级为内存 Map（仅本地开发/测试）
 */
export function createKVStore(envKV?: KVLike): KVStore {
  const kv: KVLike = envKV ?? createMockKV();

  return {
    async getProfile(username: string) {
      const raw = await kv.get(`profile:${username}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as PublicProfile;
      } catch {
        return null;
      }
    },
    async setProfile(profile: PublicProfile) {
      await kv.put(`profile:${profile.username}`, JSON.stringify(profile));
    },
    async getStats(username: string) {
      const raw = await kv.get(`stats:${username}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as PublicStats;
      } catch {
        return null;
      }
    },
    async updateStats(username: string, stats: Partial<PublicStats>) {
      const existing = await this.getStats(username);
      const merged: PublicStats = {
        username,
        streakDays: stats.streakDays ?? existing?.streakDays ?? 0,
        totalMinutes: stats.totalMinutes ?? existing?.totalMinutes ?? 0,
        currentTopic: stats.currentTopic ?? existing?.currentTopic,
        radarData: stats.radarData ?? existing?.radarData,
        heatmapData: stats.heatmapData ?? existing?.heatmapData,
        updatedAt: new Date().toISOString(),
      };
      await kv.put(`stats:${username}`, JSON.stringify(merged));
    },
    async getUserBackup(userId: string) {
      const raw = await kv.get(`user:${userId}:backup`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as UserBackup;
      } catch {
        return null;
      }
    },
    async setUserBackup(userId: string, data: UserBackup) {
      await kv.put(`user:${userId}:backup`, JSON.stringify(data));
    },
  };
}

function createMockKV(): KVLike {
  const map = new Map<string, string>();
  return {
    async get(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    async put(key: string, value: string) {
      map.set(key, value);
    },
  };
}
