"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { parseBackendRoadmap, toggleWeek, getBackendStats } from "@/lib/backend";
import type { BackendWeek } from "@/lib/types";

export function BackendRoadmap() {
  const [weeks, setWeeks] = useState<BackendWeek[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);

  function toggleExpand(weekIndex: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(weekIndex)) next.delete(weekIndex);
      else next.add(weekIndex);
      return next;
    });
  }

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const file = await client.readFile("backend/roadmap.md");
        const md = file?.content || "";
        setMarkdown(md);
        setSha(file?.sha);
        setWeeks(parseBackendRoadmap(md));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleToggle(week: BackendWeek, completed: boolean) {
    const token = await loadToken();
    if (!token) return;
    const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
    const newMd = toggleWeek(markdown, week.weekIndex, completed);
    setMarkdown(newMd);
    setWeeks(parseBackendRoadmap(newMd));
    setSaving(week.weekIndex);
    try {
      const newSha = await client.writeFile(
        "backend/roadmap.md",
        newMd,
        `update: backend week ${week.weekIndex} ${completed ? "done" : "undo"}`,
        sha
      );
      setSha(newSha);
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <p className="text-gray-400 text-sm">加载中...</p>;

  const stats = getBackendStats(weeks);
  const percent =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const monthMap = new Map<number, BackendWeek[]>();
  for (const w of weeks) {
    const arr = monthMap.get(w.month) || [];
    arr.push(w);
    monthMap.set(w.month, arr);
  }
  const months = Array.from(monthMap.keys()).sort((a, b) => a - b);

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">后端学习路线</p>
          <p className="text-xs text-gray-500">
            {stats.done}/{stats.total} 周
          </p>
        </div>
        <div className="bg-gray-100 rounded h-2">
          <div
            className="bg-black h-2 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {weeks.length === 0 ? (
        <p className="text-gray-400 text-sm">暂无路线数据</p>
      ) : (
        months.map((month) => (
          <div key={month}>
            <h2 className="text-base font-semibold mt-4 mb-2">Month {month}</h2>
            <div className="space-y-2">
              {(monthMap.get(month) || []).map((week) => {
                const isOpen = expanded.has(week.weekIndex);
                const isSaving = saving === week.weekIndex;
                return (
                  <div
                    key={week.weekIndex}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div
                      onClick={() => toggleExpand(week.weekIndex)}
                      className="flex items-center cursor-pointer"
                    >
                      <span className="text-sm font-medium">
                        Week {week.weekIndex}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {week.title}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {isOpen
                          ? "收起 ▲"
                          : week.completed
                          ? "✓"
                          : "○"}
                      </span>
                    </div>
                    {isOpen && (
                      <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                        {week.days.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">学什么</p>
                            {week.days.map((day, i) => (
                              <p
                                key={i}
                                className="text-xs text-gray-600"
                              >
                                - {day}
                              </p>
                            ))}
                          </div>
                        )}
                        {week.resources.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">资料</p>
                            {week.resources.map((res, i) => (
                              <a
                                key={i}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs block"
                              >
                                🌐 {res.label}
                              </a>
                            ))}
                          </div>
                        )}
                        {week.output && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">产出</p>
                            <p className="text-xs text-gray-600">
                              {week.output}
                            </p>
                          </div>
                        )}
                        <div>
                          {week.completed ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(week, false);
                              }}
                              disabled={isSaving}
                              className="border border-gray-200 rounded-lg py-1.5 px-3 text-xs"
                            >
                              {isSaving ? "..." : "取消"}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(week, true);
                              }}
                              disabled={isSaving}
                              className="bg-black text-white rounded-lg py-1.5 px-3 text-xs"
                            >
                              {isSaving ? "..." : "标记完成"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
