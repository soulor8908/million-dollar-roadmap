"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { set as dbSet } from "@/lib/storage/db";

const EXAMPLE_TOPICS = [
  "前端性能优化高频面试题",
  "React 基础与进阶",
  "TypeScript 类型系统",
  "算法基础（数组/链表/树）",
  "系统设计入门",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [maxNewPerDay, setMaxNewPerDay] = useState(2);
  const [aiKey, setAiKey] = useState("");
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    try {
      await dbSet("my:onboarding", {
        topic,
        dailyMinutes,
        maxNewPerDay,
        fsrsMode: "standard",
        hasAIKey: aiKey.length > 0,
        completedAt: new Date().toISOString(),
      });
      router.push("/learn");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-2xl font-bold">欢迎使用 devpath</h1>
      <div className="flex gap-2 text-xs text-gray-500">
        <span className={step >= 1 ? "text-blue-600" : ""}>1. 主题</span>
        <span>→</span>
        <span className={step >= 2 ? "text-blue-600" : ""}>2. 学习量</span>
        <span>→</span>
        <span className={step >= 3 ? "text-blue-600" : ""}>3. AI key（可选）</span>
      </div>

      {step === 1 && (
        <section className="space-y-3">
          <label className="block font-medium">你想学什么？</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="如：前端性能优化高频面试题"
            className="w-full rounded border px-3 py-2"
          />
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
              >
                {t}
              </button>
            ))}
          </div>
          <button
            disabled={!topic.trim()}
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-blue-600 py-2 text-white disabled:opacity-50"
          >
            下一步
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <div>
            <label className="block font-medium">每日学习量：{dailyMinutes} 分钟</label>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>15min</span>
              <span>120min</span>
            </div>
          </div>
          <div>
            <label className="block font-medium">每日新内容数：{maxNewPerDay} 个</label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={maxNewPerDay}
              onChange={(e) => setMaxNewPerDay(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 个</span>
              <span>5 个</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-lg border px-4 py-2">
              上一步
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-white"
            >
              下一步
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <label className="block font-medium">AI API Key（可选）</label>
          <p className="text-sm text-gray-600">
            留空则使用预设模板（5 套常见主题），填入可解锁 AI 拆知识树 + 面试题生成。
            支持 GLM / DeepSeek / MiMo。
          </p>
          <input
            value={aiKey}
            onChange={(e) => setAiKey(e.target.value)}
            placeholder="sk-..."
            type="password"
            className="w-full rounded border px-3 py-2"
          />
          <p className="text-xs text-gray-500">
            * 浏览器内不存储 key 明文，部署时请在 Cloudflare Pages 环境变量配置。
          </p>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="rounded-lg border px-4 py-2">
              上一步
            </button>
            <button
              onClick={finish}
              disabled={saving}
              className="flex-1 rounded-lg bg-green-600 py-2 text-white disabled:opacity-50"
            >
              {saving ? "保存中..." : "开始学习 →"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
