"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { get, set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan } from "@/lib/types";
import { KnowledgeTree } from "@/components/KnowledgeTree";
import { QuestionCard } from "@/components/QuestionCard";
import { toggleQuestionInPlan } from "@/lib/favorite";

export default function PlanDetailClient() {
  const params = useParams<{ planId: string }>();
  const planId = params?.planId ?? "";
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [deckFavorited, setDeckFavorited] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await get<LearningPlan>(KEY_PREFIXES.PLAN + planId);
      if (!p) {
        router.push("/learn");
        return;
      }
      setPlan(p);
      setLoading(false);
    })();
  }, [planId, router]);

  async function handleQuestionFavorite(questionId: string) {
    if (!plan) return;
    const updated = toggleQuestionInPlan(plan, questionId);
    setPlan(updated);
    await set(KEY_PREFIXES.PLAN + plan.id, updated);
  }

  async function handleDeckFavorite() {
    if (!plan) return;
    try {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_deck", plan }),
      });
      if (res.ok) {
        setDeckFavorited(true);
      }
    } catch {
      // 静默失败
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!plan) return null;

  const scheduleByDay: Record<number, typeof plan.schedule> = {};
  for (const item of plan.schedule) {
    if (!scheduleByDay[item.day]) scheduleByDay[item.day] = [];
    scheduleByDay[item.day].push(item);
  }
  const days = Object.keys(scheduleByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto pb-20">
      <div className="mb-6">
        <button
          onClick={() => router.push("/learn")}
          className="text-sm text-gray-400 mb-2"
        >
          ← 返回
        </button>
        <h1 className="text-xl font-bold">{plan.topic}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {plan.knowledgeTree.length} 个知识点 · {plan.questions.length} 道题 ·{" "}
          {days.length} 天计划
        </p>
        <button
          onClick={handleDeckFavorite}
          disabled={deckFavorited}
          className="mt-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 disabled:opacity-50"
        >
          {deckFavorited ? "⭐ 已收藏" : "☆ 收藏这份试题"}
        </button>
      </div>

      <div className="mb-6">
        <KnowledgeTree nodes={plan.knowledgeTree} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">面试题（{plan.questions.length}）</h2>
        <div className="space-y-2">
          {plan.questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onFavoriteToggle={handleQuestionFavorite}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">学习计划</h2>
        <div className="space-y-2">
          {days.map((day) => (
            <div key={day} className="border rounded-lg p-3">
              <p className="text-sm font-medium mb-1">第 {day} 天</p>
              <div className="space-y-1">
                {scheduleByDay[day].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        item.type === "learn"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type === "learn" ? "学" : "复"}
                    </span>
                    <span className="text-gray-600">
                      {plan.knowledgeTree.find((n) => n.id === item.nodeId)?.title || item.nodeId}
                    </span>
                    <span className="text-gray-400 ml-auto">{item.estimatedMinutes}min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
