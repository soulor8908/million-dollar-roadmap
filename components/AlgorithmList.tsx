"use client";

import { useEffect, useRef, useState } from "react";
import { useGitHubClient } from "@/lib/useGitHubClient";
import {
  parseLeetCodeChecklist,
  toggleProblem,
  getAlgorithmStats,
} from "@/lib/algorithm";
import type { LeetCodeProblem } from "@/lib/types";
import { ProblemSheet } from "./ProblemSheet";

const ALGORITHM_PATH = "algorithm/leetcode-checklist.md";

function difficultyEmoji(d: LeetCodeProblem["difficulty"]): string {
  if (d === "简单") return "🟢";
  if (d === "中等") return "🟡";
  return "🔴";
}

interface SaveFields {
  date: string;
  independent: "✅" | "⚠️" | "❌";
  cost: string;
  note: string;
}

export function AlgorithmList() {
  const { client, error: tokenError } = useGitHubClient();
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [filterUnchecked, setFilterUnchecked] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeProblem, setActiveProblem] = useState<LeetCodeProblem | null>(
    null
  );
  const savingRef = useRef(false);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    (async () => {
      try {
        const file = await client.readFile(ALGORITHM_PATH);
        const content = file?.content || "";
        if (cancelled) return;
        setMarkdown(content);
        setSha(file?.sha);
        const parsed = parseLeetCodeChecklist(content);
        setProblems(parsed);
        // 默认展开 Phase 1 的所有 category
        const initExpanded = new Set<string>();
        for (const p of parsed) {
          if (p.phase === 1) initExpanded.add(`${p.phase}-${p.category}`);
        }
        setExpanded(initExpanded);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client]);

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // 写入 GitHub 并同步本地 state
  async function persist(newMarkdown: string, message: string) {
    if (!client) throw new Error("未配置 token");
    const newSha = await client.writeFile(
      ALGORITHM_PATH,
      newMarkdown,
      message,
      sha
    );
    setMarkdown(newMarkdown);
    setSha(newSha);
    setProblems(parseLeetCodeChecklist(newMarkdown));
  }

  async function handleUncheck(problem: LeetCodeProblem) {
    if (savingRef.current) return;
    if (!window.confirm("取消标记为已完成？")) return;
    savingRef.current = true;
    setSaveError(null);
    try {
      const newMarkdown = toggleProblem(markdown, problem.id, false);
      await persist(newMarkdown, `algorithm: uncheck #${problem.id}`);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "保存失败");
    } finally {
      savingRef.current = false;
    }
  }

  async function handleSave(fields: SaveFields) {
    if (!activeProblem || savingRef.current) return;
    savingRef.current = true;
    setSaveError(null);
    try {
      const newMarkdown = toggleProblem(
        markdown,
        activeProblem.id,
        true,
        fields
      );
      await persist(newMarkdown, `algorithm: complete #${activeProblem.id}`);
      setActiveProblem(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "保存失败");
    } finally {
      savingRef.current = false;
    }
  }

  if (tokenError) return <p className="text-red-500 text-sm">{tokenError}</p>;
  if (loading) return <p className="text-gray-400 text-sm">加载中...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (problems.length === 0)
    return <p className="text-gray-400 text-sm">暂无题目</p>;

  const stats = getAlgorithmStats(problems);

  // 全量分组（用于标题统计）
  const fullPhaseMap = new Map<number, Map<string, LeetCodeProblem[]>>();
  for (const p of problems) {
    if (!fullPhaseMap.has(p.phase)) fullPhaseMap.set(p.phase, new Map());
    const catMap = fullPhaseMap.get(p.phase)!;
    if (!catMap.has(p.category)) catMap.set(p.category, []);
    catMap.get(p.category)!.push(p);
  }

  // 可见题目（filterUnchecked 时只保留未完成）
  const visible = filterUnchecked
    ? problems.filter((p) => !p.completed)
    : problems;
  const visiblePhaseMap = new Map<number, Map<string, LeetCodeProblem[]>>();
  for (const p of visible) {
    if (!visiblePhaseMap.has(p.phase)) visiblePhaseMap.set(p.phase, new Map());
    const catMap = visiblePhaseMap.get(p.phase)!;
    if (!catMap.has(p.category)) catMap.set(p.category, []);
    catMap.get(p.category)!.push(p);
  }

  const phases = Array.from(fullPhaseMap.keys()).sort((a, b) => a - b);

  return (
    <div className="space-y-3">
      {/* 顶部进度卡片 */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold">
              {stats.done}/{stats.total}
            </p>
            <p className="text-xs text-gray-500">已完成</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{stats.todayCount}</p>
            <p className="text-xs text-gray-500">今日</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{stats.independentCount}</p>
            <p className="text-xs text-gray-500">独立</p>
          </div>
        </div>
      </div>

      {/* 只看未完成开关 */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
        <span className="text-sm">只看未完成</span>
        <button
          onClick={() => setFilterUnchecked((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            filterUnchecked ? "bg-black" : "bg-gray-200"
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

      {saveError && (
        <p className="text-red-500 text-xs px-1">{saveError}</p>
      )}

      {/* 专题折叠分组 */}
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
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(key)}
                    className="w-full flex items-center justify-between p-3"
                  >
                    <span className="text-sm font-medium">
                      {category}
                      <span className="text-xs text-gray-400 ml-1">
                        （{fullItems.length}题，已完成 {doneCount}）
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-2 divide-y divide-gray-50">
                      {items.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 py-1.5"
                        >
                          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                            <span className="text-gray-400 text-xs w-6 shrink-0">
                              #{p.id}
                            </span>
                            <span className="text-gray-500 text-xs w-8 shrink-0">
                              {p.number}
                            </span>
                            <span className="truncate">{p.title}</span>
                            <span className="shrink-0">
                              {difficultyEmoji(p.difficulty)}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              p.completed
                                ? handleUncheck(p)
                                : setActiveProblem(p)
                            }
                            className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-lg ${
                              p.completed ? "text-green-500" : "text-gray-300"
                            }`}
                            aria-label={
                              p.completed ? "取消已完成" : "标记完成"
                            }
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

      <ProblemSheet
        problem={activeProblem}
        onClose={() => setActiveProblem(null)}
        onSave={handleSave}
      />
    </div>
  );
}
