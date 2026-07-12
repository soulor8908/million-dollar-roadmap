"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { buildProgressInfo } from "@/lib/progress";
import type { ProgressInfo } from "@/lib/types";

export function ProgressDashboard() {
  const [info, setInfo] = useState<ProgressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setLoading(false); setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const [progressFile, dailyNames] = await Promise.all([
          client.readFile("algorithm/progress.md"),
          client.listFiles("daily"),
        ]);
        const progressMd = progressFile?.content || "";
        const recentNames = dailyNames
          .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
          .sort()
          .slice(-14);
        const dailyFiles = await Promise.all(
          recentNames.map(async (name) => {
            const f = await client.readFile(`daily/${name}`);
            return { name, content: f?.content || "" };
          })
        );
        setInfo(buildProgressInfo(progressMd, dailyFiles));
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">加载中...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!info) return null;

  const barWidth = 20;
  const filled = info.algorithmTotal > 0
    ? Math.round((info.algorithmDone / info.algorithmTotal) * barWidth)
    : 0;
  const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);

  const weekTarget = 23;
  const weekPercent = Math.min(100, Math.round((info.weekHours / weekTarget) * 100));

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">算法进度</p>
        <p className="text-2xl font-bold">
          {info.algorithmDone}
          <span className="text-base text-gray-400">/{info.algorithmTotal}</span>
        </p>
        <div className="font-mono text-sm text-gray-600 mt-1">{bar}</div>
        <p className="text-xs text-gray-400 mt-1">{info.algorithmPercent}%</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xs text-gray-500">连续打卡</p>
          <p className="text-xl font-bold">{info.streakDays}</p>
          <p className="text-xs text-gray-400">天</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xs text-gray-500">累计日志</p>
          <p className="text-xl font-bold">{info.totalLogs}</p>
          <p className="text-xs text-gray-400">篇</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">本周学习时长</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{info.weekHours}</p>
          <p className="text-sm text-gray-400">/ {weekTarget} h</p>
        </div>
        <div className="bg-gray-100 rounded h-2 mt-2 overflow-hidden">
          <div
            className="bg-black h-2 transition-all"
            style={{ width: `${weekPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{weekPercent}%</p>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm">
        <p className="text-xs text-gray-500">最近日志</p>
        <p className="text-sm font-medium">{info.latestLog}</p>
      </div>
    </div>
  );
}
