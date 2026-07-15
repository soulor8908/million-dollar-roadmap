"use client";

// components/DailyNudge.tsx
// 每日 AI 主动提醒卡片
// AI Native 升级：让 AI 在用户没问时主动开口
// 流程：
//   1. 组件挂载 → 构建上下文快照（lib/ai/chat-context.ts）
//   2. 检查 IndexedDB 当天缓存，命中直接渲染
//   3. 未命中 → 调 /api/daily-nudge → 缓存 → 渲染
//   4. 用户可点刷新按钮强制重新生成（更新缓存）

import { useState, useEffect, useCallback } from "react";
import { getItem, setItem } from "@/lib/storage/db";
import { KEY_PREFIXES } from "@/lib/types";
import { chinaDateNow } from "@/lib/time";
import { buildChatContext } from "@/lib/ai/chat-context";
import { getApiToken } from "@/lib/api-client";

interface NudgePayload {
  nudge: string;
  source: "ai" | "rule";
  generatedAt: string;
}

interface CachedNudge extends NudgePayload {
  date: string;
}

export function DailyNudge() {
  const [nudge, setNudge] = useState<NudgePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = chinaDateNow();
  const cacheKey = KEY_PREFIXES.DAILY_NUDGE + today;

  const fetchNudge = useCallback(
    async (forceRefresh: boolean): Promise<void> => {
      setLoading(true);
      setError(null);

      // 1. 命中当天缓存（非强制刷新）直接用
      if (!forceRefresh) {
        try {
          const cached = await getItem<CachedNudge>(cacheKey);
          if (cached && cached.date === today && cached.nudge) {
            setNudge({
              nudge: cached.nudge,
              source: cached.source,
              generatedAt: cached.generatedAt,
            });
            setLoading(false);
            return;
          }
        } catch {
          /* 缓存读取失败，继续走 AI */
        }
      }

      // 2. 构建上下文快照
      let contextSnapshot = "";
      try {
        contextSnapshot = await buildChatContext();
      } catch {
        contextSnapshot = "";
      }

      // 3. 调 API
      try {
        const token = await getApiToken();
        const res = await fetch("/api/daily-nudge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ contextSnapshot }),
        });

        if (!res.ok) {
          throw new Error(`请求失败 (${res.status})`);
        }

        const data = (await res.json()) as NudgePayload;
        setNudge(data);

        // 4. 写入缓存
        try {
          const cached: CachedNudge = { ...data, date: today };
          await setItem(cacheKey, cached);
        } catch {
          /* 缓存写入失败忽略 */
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, today]
  );

  useEffect(() => {
    void fetchNudge(false);
  }, [fetchNudge]);

  if (loading) {
    return (
      <div
        className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950"
        aria-busy="true"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🤖</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            AI 正在为你准备今日建议...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-400 truncate">
            ⚠️ AI 提醒加载失败：{error}
          </span>
          <button
            type="button"
            onClick={() => void fetchNudge(true)}
            className="text-xs text-blue-500 hover:underline shrink-0"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!nudge) return null;

  return (
    <div className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950">
      <div className="flex items-start gap-2">
        <span className="text-base shrink-0" aria-hidden>🤖</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {nudge.nudge}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
            <span>
              {nudge.source === "ai" ? "AI 生成" : "规则生成"} ·{" "}
              {new Date(nudge.generatedAt).toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              type="button"
              onClick={() => void fetchNudge(true)}
              className="text-blue-500 hover:underline"
              aria-label="重新生成今日建议"
            >
              换一个 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
