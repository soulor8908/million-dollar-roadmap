"use client";

import { useEffect, useState } from "react";
import { CurrentTask } from "@/components/CurrentTask";
import { EnergyMeter } from "@/components/EnergyMeter";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

export default function Home() {
  const [routine, setRoutine] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) return;
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const file = await client.readFile("schedule/routine.md");
        if (file) setRoutine(file.content);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      }
    })();
  }, []);

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">🎯 今日指挥中心</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {routine ? <CurrentTask routineMarkdown={routine} /> : (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-400 text-sm">加载时间表...</p>
        </div>
      )}

      <EnergyMeter />

      <div className="grid grid-cols-3 gap-2">
        <a href="/emotion" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">📖</p>
          <p className="text-xs mt-1">记情绪</p>
        </a>
        <a href="/rest" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">😴</p>
          <p className="text-xs mt-1">去休息</p>
        </a>
        <a href="/daily" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">📝</p>
          <p className="text-xs mt-1">写日志</p>
        </a>
      </div>
    </main>
  );
}
