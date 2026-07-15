"use client";

// app/backend/page.tsx
// 后端学习路线（从主站 BackendRoadmap 迁移）
// 存储改为 IndexedDB（backend:roadmap_md + backend:roadmap）

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getItem, setItem } from "@/lib/storage/db";
import { KEY_PREFIXES, type BackendWeek } from "@/lib/types";
import { parseBackendRoadmap, toggleWeek, getBackendStats } from "@/lib/backend";

export default function BackendPage() {
  const [weeks, setWeeks] = useState<BackendWeek[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const md = await getItem<string>(`${KEY_PREFIXES.BACKEND}roadmap_md`);
      if (md) {
        setMarkdown(md);
        const parsed = parseBackendRoadmap(md);
        setWeeks(parsed);
        setHasData(true);
        // 默认展开第一个月
        if (parsed.length > 0) {
          setExpandedMonths(new Set([parsed[0].month]));
        }
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

  function toggleMonth(month: number) {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }

  async function handleToggleWeek(week: BackendWeek) {
    try {
      const newMarkdown = toggleWeek(markdown, week.weekIndex, !week.completed);
      setMarkdown(newMarkdown);
      const parsed = parseBackendRoadmap(newMarkdown);
      setWeeks(parsed);
      await setItem(`${KEY_PREFIXES.BACKEND}roadmap_md`, newMarkdown);
      await setItem(`${KEY_PREFIXES.BACKEND}roadmap`, parsed);
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
          <h1 className="text-2xl font-bold">后端学习路线</h1>
          <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
            ← 返回
          </Link>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">暂无后端路线数据</p>
          <p className="text-sm text-gray-400 mb-4">
            需要先从 GitHub 导入 backend/roadmap.md
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
  if (weeks.length === 0) return <p className="text-gray-400 text-sm p-4">暂无路线数据</p>;

  const stats = getBackendStats(weeks);
  const months = Array.from(new Set(weeks.map((w) => w.month))).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">后端学习路线</h1>
        <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
          ← 返回
        </Link>
      </div>

      {/* 进度卡片 */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {stats.done}/{stats.total}
        </p>
        <p className="text-xs text-gray-500">已完成周数</p>
      </div>

      {/* 按月分组 */}
      {months.map((month) => {
        const monthWeeks = weeks.filter((w) => w.month === month);
        const isOpen = expandedMonths.has(month);
        const monthDone = monthWeeks.filter((w) => w.completed).length;
        return (
          <div key={month} className="space-y-2">
            <button
              onClick={() => toggleMonth(month)}
              className="w-full flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Month {month}
                <span className="text-xs text-gray-400 ml-2">
                  （{monthDone}/{monthWeeks.length} 周）
                </span>
              </span>
              <span className="text-xs text-gray-400">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className="space-y-2 pl-2">
                {monthWeeks.map((week) => (
                  <div
                    key={week.weekIndex}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => handleToggleWeek(week)}
                        className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${
                          week.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        aria-label={week.completed ? "取消已完成" : "标记完成"}
                      >
                        {week.completed && "✓"}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${week.completed ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
                          Week {week.weekIndex}：{week.title}
                        </p>
                        {week.days.length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {week.days.map((day, i) => (
                              <li key={i}>• {day}</li>
                            ))}
                          </ul>
                        )}
                        {week.resources.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {week.resources.map((res, i) => (
                              <a
                                key={i}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                              >
                                📎 {res.label}
                              </a>
                            ))}
                          </div>
                        )}
                        {week.output && (
                          <p className="mt-1 text-xs text-gray-400">产出：{week.output}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
