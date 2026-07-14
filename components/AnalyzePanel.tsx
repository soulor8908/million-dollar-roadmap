"use client";

import { useState } from "react";
import { useGitHubClient } from "@/lib/useGitHubClient";
import type { AIAnalysis } from "@/lib/types";

export function AnalyzePanel() {
  const { client } = useGitHubClient();
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    if (!client) { setError("未登录"); return; }
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      // 拉取最近 14 天情绪笔记
      const emotionNames = await client.listFiles("emotion");
      const recentEmotion = emotionNames
        .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
        .sort()
        .slice(-14);
      const emotionFiles = await Promise.all(
        recentEmotion.map(async (name) => {
          const f = await client.readFile(`emotion/${name}`);
          return f?.content || "";
        })
      );
      const emotionData = emotionFiles.join("\n\n---\n\n");

      // 拉取最近 14 天日志
      const dailyNames = await client.listFiles("daily");
      const recentDaily = dailyNames
        .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
        .sort()
        .slice(-14);
      const dailyFiles = await Promise.all(
        recentDaily.map(async (name) => {
          const f = await client.readFile(`daily/${name}`);
          return f?.content || "";
        })
      );
      const dailyData = dailyFiles.join("\n\n---\n\n");

      // 调用 AI 分析 API
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotionData, dailyData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `API ${res.status}`);
      }

      const result = await res.json();
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "分析失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="w-full bg-black text-white rounded py-3 text-sm font-medium disabled:opacity-40"
      >
        {loading ? "分析中...（约10-30秒）" : "🔍 分析最近14天数据"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {analysis && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">总体总结</p>
            <p className="text-sm">{analysis.summary}</p>
          </div>

          {analysis.patterns.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-2">识别到的模式</p>
              <ul className="space-y-1">
                {analysis.patterns.map((p, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-gray-400">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-100">
              <p className="text-xs text-gray-500 mb-2">调整建议</p>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-blue-500">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
