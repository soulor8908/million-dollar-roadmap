"use client";

// app/algorithm/page.tsx
// LeetCode 刷题进度（从主站 AlgorithmList 迁移）
// 存储改为 IndexedDB（algo:leetcode_checklist_md + algo:leetcode_checklist）

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getItem, setItem } from "@/lib/storage/db";
import { KEY_PREFIXES, type LeetCodeProblem } from "@/lib/types";
import {
  parseLeetCodeChecklist,
  toggleProblem,
  getAlgorithmStats,
} from "@/lib/algorithm";
import { chinaDateNow } from "@/lib/time";

function difficultyEmoji(d: LeetCodeProblem["difficulty"]): string {
  if (d === "简单") return "🟢";
  if (d === "中等") return "🟡";
  return "🔴";
}

export default function AlgorithmPage() {
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUnchecked, setFilterUnchecked] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeProblem, setActiveProblem] = useState<LeetCodeProblem | null>(null);
  const [hasData, setHasData] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const md = await getItem<string>(`${KEY_PREFIXES.ALGORITHM}leetcode_checklist_md`);
      if (md) {
        setMarkdown(md);
        const parsed = parseLeetCodeChecklist(md);
        setProblems(parsed);
        setHasData(true);
        // 默认展开 Phase 1
        const initExpanded = new Set<string>();
        for (const p of parsed) {
          if (p.phase === 1) initExpanded.add(`${p.phase}-${p.category}`);
        }
        setExpanded(initExpanded);
      } else {
        setHasData(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function persist(newMarkdown: string) {
    setMarkdown(newMarkdown);
    const parsed = parseLeetCodeChecklist(newMarkdown);
    setProblems(parsed);
    await setItem(`${KEY_PREFIXES.ALGORITHM}leetcode_checklist_md`, newMarkdown);
    await setItem(`${KEY_PREFIXES.ALGORITHM}leetcode_checklist`, parsed);
  }

  async function handleToggle(problem: LeetCodeProblem) {
    try {
      if (problem.completed) {
        // 取消完成
        const newMarkdown = toggleProblem(markdown, problem.id, false);
        await persist(newMarkdown);
      } else {
        // 标记完成（用默认值）
        const newMarkdown = toggleProblem(markdown, problem.id, true, {
          date: chinaDateNow(),
          independent: "✅",
          cost: "",
          note: "",
        });
        await persist(newMarkdown);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="mx-auto max-w-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">算法进度</h1>
          <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
            ← 返回
          </Link>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">暂无算法数据</p>
          <p className="text-sm text-gray-400 mb-4">
            需要先从 GitHub 导入 algorithm/leetcode-checklist.md
          </p>
          <Link
            href="/import"
            className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-white text-sm hover:bg-blue-600"
          >
            去导入 →
          </Link>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;
  if (problems.length === 0) return <p className="text-gray-400 text-sm p-4">暂无题目</p>;

  const stats = getAlgorithmStats(problems);

  // 分组
  const fullPhaseMap = new Map<number, Map<string, LeetCodeProblem[]>>();
  for (const p of problems) {
    if (!fullPhaseMap.has(p.phase)) fullPhaseMap.set(p.phase, new Map());
    const catMap = fullPhaseMap.get(p.phase)!;
    if (!catMap.has(p.category)) catMap.set(p.category, []);
    catMap.get(p.category)!.push(p);
  }

  const visible = filterUnchecked ? problems.filter((p) => !p.completed) : problems;
  const visiblePhaseMap = new Map<number, Map<string, LeetCodeProblem[]>>();
  for (const p of visible) {
    if (!visiblePhaseMap.has(p.phase)) visiblePhaseMap.set(p.phase, new Map());
    const catMap = visiblePhaseMap.get(p.phase)!;
    if (!catMap.has(p.category)) catMap.set(p.category, []);
    catMap.get(p.category)!.push(p);
  }

  const phases = Array.from(fullPhaseMap.keys()).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">算法进度</h1>
        <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
          ← 返回
        </Link>
      </div>

      {/* 进度卡片 */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {stats.done}/{stats.total}
            </p>
            <p className="text-xs text-gray-500">已完成</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{stats.todayCount}</p>
            <p className="text-xs text-gray-500">今日</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{stats.independentCount}</p>
            <p className="text-xs text-gray-500">独立</p>
          </div>
        </div>
      </div>

      {/* 只看未完成 */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
        <span className="text-sm text-gray-700 dark:text-gray-300">只看未完成</span>
        <button
          onClick={() => setFilterUnchecked((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            filterUnchecked ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
          }`}
          aria-label="只看未完成"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              filterUnchecked ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* 专题折叠 */}
      {phases.map((phase) => {
        const visibleCatMap = visiblePhaseMap.get(phase);
        const fullCatMap = fullPhaseMap.get(phase)!;
        return (
          <div key={phase} className="space-y-2">
            <p className="text-xs text-gray-400 px-1">Phase {phase}</p>
            {Array.from(fullCatMap.entries()).map(([category, fullItems]) => {
              const items = visibleCatMap?.get(category) || [];
              if (items.length === 0) return null;
              const key = `${phase}-${category}`;
              const isOpen = expanded.has(key);
              const doneCount = fullItems.filter((p) => p.completed).length;
              return (
                <div
                  key={category}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(key)}
                    className="w-full flex items-center justify-between p-3"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {category}
                      <span className="text-xs text-gray-400 ml-1">
                        （{fullItems.length}题，已完成 {doneCount}）
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-2 divide-y divide-gray-50 dark:divide-gray-700">
                      {items.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 py-1.5">
                          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                            <span className="text-gray-400 text-xs w-6 shrink-0">#{p.id}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs w-8 shrink-0">{p.number}</span>
                            <span className="truncate text-gray-700 dark:text-gray-300">{p.title}</span>
                            <span className="shrink-0">{difficultyEmoji(p.difficulty)}</span>
                          </div>
                          <button
                            onClick={() => handleToggle(p)}
                            className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-lg ${
                              p.completed ? "text-green-500" : "text-gray-300 dark:text-gray-500"
                            }`}
                            aria-label={p.completed ? "取消已完成" : "标记完成"}
                          >
                            {p.completed ? "✓" : "○"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
