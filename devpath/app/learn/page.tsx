"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "idb-keyval";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/learn", {
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
      await set(KEY_PREFIXES.PLAN + planId, plan);
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
    </div>
  );
}
