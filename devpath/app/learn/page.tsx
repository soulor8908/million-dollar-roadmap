"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setItem, listKeys, getItem } from "@/lib/storage/db";
import { apiFetch } from "@/lib/api-client";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan } from "@/lib/types";

const EXAMPLES = [
  "前端性能优化",
  "React 源码原理",
  "TypeScript 进阶",
  "系统设计基础",
];

export default function LearnPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [maxNewPerDay, setMaxNewPerDay] = useState(1);
  const [history, setHistory] = useState<LearningPlan[]>([]);

  // 加载历史计划
  useEffect(() => {
    (async () => {
      const allKeys = await listKeys();
      const planKeys = allKeys.filter(
        (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.PLAN)
      );
      const plans = await Promise.all(
        planKeys.map((k) => getItem<LearningPlan>(k))
      );
      const valid = plans
        .filter((p): p is LearningPlan => p !== undefined)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(valid);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          dailyMinutes,
          maxNewPerDay,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `请求失败 (${res.status})`);
      }
      const { planId, plan } = (await res.json()) as { planId: string; plan: LearningPlan };
      await setItem(KEY_PREFIXES.PLAN + planId, plan);
      router.push(`/learn/${planId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-5xl mb-6 animate-pulse">🤖</div>
        <p className="text-xl font-bold mb-2">AI 正在拆解知识树...</p>
        <p className="text-sm text-gray-500 mb-1">主题：{topic}</p>
        <p className="text-xs text-gray-400 mt-4">预计 30-90 秒，请稍候</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AI 学习教练</h1>
      <p className="text-gray-500 mb-6">
        告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="你想学什么？"
          className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setTopic(ex)}
              className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <label className="flex-1">
            <span className="text-sm text-gray-600">每日学习时间（分钟）</span>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              min={15}
              max={120}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
          <label className="flex-1">
            <span className="text-sm text-gray-600">每日新内容数</span>
            <input
              type="number"
              value={maxNewPerDay}
              onChange={(e) => setMaxNewPerDay(Number(e.target.value))}
              min={1}
              max={5}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          开始学习
        </button>
      </form>

      {/* 历史计划 */}
      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">历史计划（{history.length}）</h2>
          <div className="space-y-2">
            {history.map((p) => (
              <Link
                key={p.id}
                href={`/learn/${p.id}`}
                className="block border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.topic}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {p.knowledgeTree.length} 知识点 · {p.questions.length} 题 ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">查看 →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
