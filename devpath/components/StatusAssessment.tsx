"use client";

// components/StatusAssessment.tsx
// 三种形态：完整版（3 问）/ 极简版（1 click）/ 自动推断
// 调用 /api/status 返回后通过 onAdjusted 回调更新首页今日学习列表

import { useState, useEffect } from "react";
import type { ScheduleItem, DailyStatus } from "@/lib/types";

type Form = "full" | "minimal" | "auto";

interface Props {
  date: string;
  basePlan: ScheduleItem[];
  onAdjusted: (plan: ScheduleItem[], suggestions: string[]) => void;
  /** 自动推断：传入最近 3 天 energy，若全 5 则跳过评估 */
  recentEnergies?: number[];
  /** 是否检测到晚睡（如当前时间 >= 23:30） */
  detectedLateSleep?: boolean;
}

export function StatusAssessment({ date, basePlan, onAdjusted, recentEnergies = [], detectedLateSleep = false }: Props) {
  const [form, setForm] = useState<Form>("minimal");
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [mood, setMood] = useState<"good" | "neutral" | "bad">("neutral");
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 自动推断：连续 3 天 energy=5 跳过评估
  useEffect(() => {
    if (recentEnergies.length >= 3 && recentEnergies.slice(-3).every((e) => e === 5)) {
      setForm("auto");
    }
  }, [recentEnergies]);

  async function submit(e: Partial<{ energy: number; mood: "good" | "neutral" | "bad"; availableMinutes: number }>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          energy: e.energy ?? energy,
          mood: e.mood ?? mood,
          availableMinutes: e.availableMinutes ?? availableMinutes,
          basePlan,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { adjustedPlan: ScheduleItem[]; suggestions: string[] };
      onAdjusted(data.adjustedPlan, data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "评估失败");
    } finally {
      setLoading(false);
    }
  }

  // 自动推断：默认 energy=3，晚睡自动减量
  useEffect(() => {
    if (form === "auto") {
      const inferred = detectedLateSleep ? 2 : 5;
      const inferredMood = detectedLateSleep ? "bad" : "good";
      submit({ energy: inferred, mood: inferredMood, availableMinutes: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  if (form === "auto") {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
        {detectedLateSleep ? "😴 检测到晚睡，已自动减量" : "😎 近期状态不错，已自动按正常量排程"}
      </div>
    );
  }

  if (form === "minimal") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">今天感觉怎么样？</p>
        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={() => submit({ energy: 1, mood: "bad", availableMinutes: 15 })}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            😴 不太好
          </button>
          <button
            disabled={loading}
            onClick={() => submit({ energy: 3, mood: "neutral", availableMinutes: 30 })}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            😐 一般
          </button>
          <button
            disabled={loading}
            onClick={() => submit({ energy: 5, mood: "good", availableMinutes: 60 })}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            😎 不错
          </button>
        </div>
        <button onClick={() => setForm("full")} className="text-xs text-blue-600 underline">
          完整评估
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // 完整版
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">精力（1-5）</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setEnergy(n as 1 | 2 | 3 | 4 | 5)}
              className={`rounded px-3 py-1 ${energy === n ? "bg-blue-600 text-white" : "border"}`}
            >
              {"⭐".repeat(n)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">心情</label>
        <div className="flex gap-2">
          {([
            { v: "good", e: "😊 好" },
            { v: "neutral", e: "😐 中" },
            { v: "bad", e: "😞 差" },
          ] as const).map((m) => (
            <button
              key={m.v}
              onClick={() => setMood(m.v)}
              className={`rounded border px-3 py-1 ${mood === m.v ? "bg-blue-600 text-white" : ""}`}
            >
              {m.e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">今日可用时间（分钟）</label>
        <input
          type="number"
          min={5}
          max={240}
          value={availableMinutes}
          onChange={(e) => setAvailableMinutes(Number(e.target.value))}
          className="mt-1 w-32 rounded border px-2 py-1"
        />
      </div>
      <button
        disabled={loading}
        onClick={() => submit({})}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "评估中..." : "生成今日计划"}
      </button>
      <button onClick={() => setForm("minimal")} className="ml-2 text-xs text-blue-600 underline">
        极简版
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
