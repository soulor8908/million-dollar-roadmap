"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getItem, setItem } from "@/lib/storage/db";
import { apiFetch } from "@/lib/api-client";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan, Question, ScheduleItem } from "@/lib/types";
import { KnowledgeTree } from "@/components/KnowledgeTree";
import { QuestionCard } from "@/components/QuestionCard";
import { toggleQuestionInPlan, createFavoriteDeck, listFavoriteDecks, deleteFavoriteDeck } from "@/lib/favorite";
import { nowISO } from "@/lib/time";

export default function PlanDetailClient() {
  const params = useParams<{ planId: string }>();
  const planId = params?.planId ?? "";
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [deckFavorited, setDeckFavorited] = useState(false);
  const [deckId, setDeckId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    (async () => {
      const p = await getItem<LearningPlan>(KEY_PREFIXES.PLAN + planId);
      if (!p) {
        router.push("/learn");
        return;
      }
      setPlan(p);
      setLoading(false);
      // 检查是否已收藏为 deck
      const decks = await listFavoriteDecks();
      const found = decks.find((d) => d.planId === p.id);
      if (found) {
        setDeckFavorited(true);
        setDeckId(found.id);
      }
    })();
  }, [planId, router]);

  async function handleQuestionFavorite(questionId: string) {
    if (!plan) return;
    const updated = toggleQuestionInPlan(plan, questionId);
    setPlan(updated);
    await setItem(KEY_PREFIXES.PLAN + plan.id, updated);
  }

  async function handleDeckFavorite() {
    if (!plan) return;
    if (deckFavorited && deckId) {
      // 已收藏 → 取消收藏（二次确认）
      if (!confirm("确定取消收藏这份试题集吗？")) return;
      await deleteFavoriteDeck(deckId);
      setDeckFavorited(false);
      setDeckId(null);
      return;
    }
    // 未收藏 → 收藏（真正写入 IndexedDB）
    try {
      const deck = await createFavoriteDeck(plan);
      setDeckFavorited(true);
      setDeckId(deck.id);
    } catch {
      // 静默失败
    }
  }

  // 点击 schedule 项 → 标记完成/取消完成，写回 plan
  async function handleScheduleClick(scheduleIndex: number) {
    if (!plan) return;
    const updated: LearningPlan = {
      ...plan,
      updatedAt: nowISO(),
      schedule: plan.schedule.map((item, idx) => {
        if (idx === scheduleIndex) {
          return {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? nowISO() : undefined,
          };
        }
        return item;
      }),
    };
    setPlan(updated);
    await setItem(KEY_PREFIXES.PLAN + plan.id, updated);
  }

  // 跳转到对应知识点的第一道题
  function handleScheduleScroll(nodeId: string) {
    if (!plan) return;
    const q = plan.questions.find((x) => x.nodeId === nodeId);
    if (q && questionRefs.current[q.id]) {
      questionRefs.current[q.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // 重新生成单道题
  async function handleRegenerate(questionId: string) {
    if (!plan) return;
    const oldQ = plan.questions.find((q) => q.id === questionId);
    if (!oldQ) return;
    const node = plan.knowledgeTree.find((n) => n.id === oldQ.nodeId);
    if (!node) return;
    setRegeneratingId(questionId);
    try {
      const res = await apiFetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node }),
      });
      if (!res.ok) throw new Error(`请求失败 (${res.status})`);
      const { question } = (await res.json()) as { question: Question };
      // 保留原 id 和 favorited 状态，替换内容
      const newQuestion: Question = {
        ...question,
        id: oldQ.id,
        favorited: oldQ.favorited,
        favoritedAt: oldQ.favoritedAt,
      };
      const updated: LearningPlan = {
        ...plan,
        updatedAt: nowISO(),
        questions: plan.questions.map((q) => (q.id === questionId ? newQuestion : q)),
      };
      setPlan(updated);
      await setItem(KEY_PREFIXES.PLAN + plan.id, updated);
    } catch (e) {
      alert(`重新生成失败：${e instanceof Error ? e.message : "未知错误"}`);
    } finally {
      setRegeneratingId(null);
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

  const scheduleByDay: Record<number, { item: ScheduleItem; index: number }[]> = {};
  plan.schedule.forEach((item, index) => {
    if (!scheduleByDay[item.day]) scheduleByDay[item.day] = [];
    scheduleByDay[item.day].push({ item, index });
  });
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
          className="mt-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
        >
          {deckFavorited ? "⭐ 已收藏（点击取消）" : "☆ 收藏这份试题"}
        </button>
      </div>

      <div className="mb-6">
        <KnowledgeTree nodes={plan.knowledgeTree} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">面试题（{plan.questions.length}）</h2>
        <p className="text-xs text-gray-400 mb-2">点击题目展开答案，可单题收藏或重新生成</p>
        <div className="space-y-2">
          {plan.questions.map((q) => (
            <div key={q.id} ref={(el) => { questionRefs.current[q.id] = el; }}>
              <QuestionCard
                question={q}
                onFavoriteToggle={handleQuestionFavorite}
                onRegenerate={handleRegenerate}
                regenerating={regeneratingId === q.id}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">学习计划</h2>
        <p className="text-xs text-gray-400 mb-2">点击任务标记完成/取消，点击标题跳转到对应题目</p>
        <div className="space-y-2">
          {days.map((day) => {
            const dayItems = scheduleByDay[day];
            const completedCount = dayItems.filter((d) => d.item.completed).length;
            return (
              <div key={day} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">第 {day} 天</p>
                  <span className="text-xs text-gray-400">{completedCount}/{dayItems.length} 完成</span>
                </div>
                <div className="space-y-1">
                  {dayItems.map(({ item, index }) => {
                    const nodeTitle = plan.knowledgeTree.find((n) => n.id === item.nodeId)?.title || item.nodeId;
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-xs p-1.5 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                          item.completed ? "opacity-50" : ""
                        }`}
                        onClick={() => handleScheduleClick(index)}
                      >
                        <span
                          className={`px-2 py-0.5 rounded select-none ${
                            item.type === "learn"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.type === "learn" ? "学" : "复"}
                        </span>
                        <span
                          className="text-gray-600 flex-1 hover:text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScheduleScroll(item.nodeId);
                          }}
                        >
                          {nodeTitle}
                        </span>
                        {item.completed && <span className="text-green-500">✓</span>}
                        <span className="text-gray-400">{item.estimatedMinutes}min</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
