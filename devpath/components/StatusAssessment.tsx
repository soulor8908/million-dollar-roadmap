"use client";

// components/StatusAssessment.tsx
// 四种形态：极简版（1 click）/ 完整版（3 问）/ 觉察版（情绪觉察）/ 自动推断
// 极简版用于忙碌时快速评估；觉察版展开后显示触发事件、情绪标签、多巴胺干扰
// 觉察数据存 IndexedDB（key 前缀 emotion:），同时调 /api/status 返回调量后计划

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { set as idbSet } from "idb-keyval";
import type { ScheduleItem, EmotionTag, DopamineTrigger } from "@/lib/types";
import { KEY_PREFIXES } from "@/lib/types";
import { chinaDateNow, chinaTimeNow } from "@/lib/time";

type Form = "full" | "minimal" | "auto" | "awareness";

interface Props {
  date: string;
  basePlan: ScheduleItem[];
  onAdjusted: (plan: ScheduleItem[], suggestions: string[]) => void;
  /** 自动推断：传入最近 3 天 energy，若全 5 则跳过评估 */
  recentEnergies?: number[];
  /** 是否检测到晚睡（如当前时间 >= 23:30） */
  detectedLateSleep?: boolean;
}

const EMOTION_TAGS: { tag: EmotionTag; emoji: string }[] = [
  { tag: "焦虑", emoji: "😰" },
  { tag: "兴奋", emoji: "🤩" },
  { tag: "疲惫", emoji: "😴" },
  { tag: "烦躁", emoji: "😤" },
  { tag: "满足", emoji: "😊" },
  { tag: "冲动", emoji: "🔥" },
  { tag: "平静", emoji: "😌" },
  { tag: "沮丧", emoji: "😞" },
];

const DOPAMINE_OPTIONS: DopamineTrigger[] = ["无", "刷手机", "游戏", "短视频", "甜食", "其他"];

export function StatusAssessment({ date, basePlan, onAdjusted, recentEnergies = [], detectedLateSleep = false }: Props) {
  const [form, setForm] = useState<Form>("minimal");
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [mood, setMood] = useState<"good" | "neutral" | "bad">("neutral");
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 觉察版专属字段
  const [emotionTag, setEmotionTag] = useState<EmotionTag | null>(null);
  const [trigger, setTrigger] = useState("");
  const [impact, setImpact] = useState("");
  const [coping, setCoping] = useState("");
  const [dopamine, setDopamine] = useState<DopamineTrigger>("无");

  // 自动推断：连续 3 天 energy=5 跳过评估
  useEffect(() => {
    if (recentEnergies.length >= 3 && recentEnergies.slice(-3).every((e) => e === 5)) {
      setForm("auto");
    }
  }, [recentEnergies]);

  async function submit(e: Partial<{ energy: number; mood: "good" | "neutral" | "bad"; availableMinutes: number; dopamineTrigger: DopamineTrigger }>) {
    setLoading(true);
    setError(null);
    try {
      const finalDopamine = e.dopamineTrigger ?? (form === "awareness" ? dopamine : undefined);
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          energy: e.energy ?? energy,
          mood: e.mood ?? mood,
          availableMinutes: e.availableMinutes ?? availableMinutes,
          dopamineTrigger: finalDopamine,
          basePlan,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { adjustedPlan: ScheduleItem[]; suggestions: string[] };

      // 觉察版：同步保存 EmotionEntry 到 IndexedDB（key 前缀 emotion:）
      if (form === "awareness" && emotionTag && trigger.trim()) {
        const entry = {
          id: nanoid(),
          date: chinaDateNow(),
          time: chinaTimeNow(),
          tag: emotionTag,
          emoji: EMOTION_TAGS.find((t) => t.tag === emotionTag)?.emoji ?? "❓",
          trigger: trigger.trim(),
          impact: impact.trim() || "—",
          coping: coping.trim() || "—",
          dopamine,
        };
        await idbSet(`${KEY_PREFIXES.EMOTION}${entry.date}_${entry.id}`, entry);
      }

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
        <div className="flex gap-3 text-xs">
          <button onClick={() => setForm("awareness")} className="text-purple-600 underline">
            🧠 情绪觉察版
          </button>
          <button onClick={() => setForm("full")} className="text-blue-600 underline">
            完整评估
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (form === "awareness") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-purple-700">🧠 情绪觉察版</p>
          <button onClick={() => setForm("minimal")} className="text-xs text-blue-600 underline">
            极简版
          </button>
        </div>

        {/* 触发事件 */}
        <div>
          <label className="block text-sm font-medium">触发事件 *</label>
          <input
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="什么事引发了现在的状态"
            className="mt-1 w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        {/* 情绪标签 */}
        <div>
          <label className="block text-sm font-medium">情绪</label>
          <div className="mt-1 flex flex-wrap gap-1">
            {EMOTION_TAGS.map(({ tag, emoji }) => (
              <button
                key={tag}
                onClick={() => setEmotionTag(tag)}
                className={`rounded-full px-2 py-1 text-xs ${
                  emotionTag === tag ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {emoji} {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 多巴胺干扰（嵌入情绪觉察流程） */}
        <div>
          <label className="block text-sm font-medium">多巴胺干扰</label>
          <div className="mt-1 flex flex-wrap gap-1">
            {DOPAMINE_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDopamine(d)}
                className={`rounded-full px-2 py-1 text-xs ${
                  dopamine === d ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400">追踪什么在分散你的注意力</p>
        </div>

        {/* 精力 */}
        <div>
          <label className="block text-sm font-medium">精力（1-5）</label>
          <div className="mt-1 flex gap-1">
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

        {/* 今日可用时间 */}
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

        {/* 影响与应对（可选） */}
        <div className="grid grid-cols-2 gap-2">
          <input
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            placeholder="对学习/休息的影响"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            value={coping}
            onChange={(e) => setCoping(e.target.value)}
            placeholder="采取的应对"
            className="rounded border px-2 py-1 text-sm"
          />
        </div>

        <button
          disabled={loading || !emotionTag || !trigger.trim()}
          onClick={() => submit({})}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "评估中..." : "记录情绪 + 生成今日计划"}
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
      <div className="flex gap-3 text-xs">
        <button onClick={() => setForm("minimal")} className="text-blue-600 underline">
          极简版
        </button>
        <button onClick={() => setForm("awareness")} className="text-purple-600 underline">
          情绪觉察版
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
