"use client";

// app/import/page.tsx
// 一次性数据导入工具：从 GitHub Markdown 导入到 DevPath IndexedDB
// 用户流程：输入 Token → 选择类型 → 预览 → 确认导入 → 完成

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  importFromGitHub,
  type ImportType,
  type ImportResult,
} from "@/lib/github-import";

const TYPE_LABELS: Record<ImportType, string> = {
  emotion: "情绪笔记",
  daily: "每日日志",
};

export default function ImportPage() {
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("soulor8908");
  const [repo, setRepo] = useState("million-dollar-roadmap");
  const [selectedTypes, setSelectedTypes] = useState<Set<ImportType>>(
    new Set(["emotion", "daily"])
  );
  const [progress, setProgress] = useState<string[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleType = (type: ImportType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleImport = useCallback(async () => {
    if (!token.trim()) {
      alert("请输入 GitHub Token");
      return;
    }
    if (selectedTypes.size === 0) {
      alert("请至少选择一种数据类型");
      return;
    }

    setLoading(true);
    setProgress([]);
    setResult(null);

    const res = await importFromGitHub({
      token: token.trim(),
      owner: owner.trim() || "soulor8908",
      repo: repo.trim() || "million-dollar-roadmap",
      types: Array.from(selectedTypes),
      onProgress: (msg) => {
        setProgress((prev) => [...prev, msg]);
      },
    });

    setResult(res);
    setLoading(false);
  }, [token, owner, repo, selectedTypes]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">数据导入</h1>
        <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
          ← 返回
        </Link>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">从 GitHub 导入历史数据</p>
        <p className="text-blue-600">
          将主站存储在 GitHub Markdown 中的情绪笔记、每日日志一次性导入 DevPath。
          导入后数据存储在本地 IndexedDB，与 GitHub 数据互不影响。
        </p>
      </div>

      {/* Token 输入 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">GitHub 配置</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GitHub Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxx 或 ghp_..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            在 GitHub Settings → Developer settings → Personal access tokens 创建，需要 repo 权限
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Owner
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repo
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* 数据类型选择 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">选择导入类型</h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(TYPE_LABELS) as ImportType[]).map((type) => (
            <label
              key={type}
              className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                selectedTypes.has(type)
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTypes.has(type)}
                onChange={() => toggleType(type)}
                className="rounded"
              />
              <span className="text-sm font-medium">{TYPE_LABELS[type]}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 导入按钮 */}
      <button
        onClick={handleImport}
        disabled={loading || !token.trim() || selectedTypes.size === 0}
        className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "导入中..." : "开始导入"}
      </button>

      {/* 进度日志 */}
      {progress.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-2">导入进度</h2>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 max-h-48 overflow-y-auto">
            {progress.map((msg, i) => (
              <p key={i} className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {msg}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 导入结果 */}
      {result && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">导入结果</h2>
          <div
            className={`rounded-lg border p-4 ${
              result.success
                ? "border-green-200 bg-green-50 dark:bg-green-950/30"
                : "border-amber-200 bg-amber-50 dark:bg-amber-950/30"
            }`}
          >
            {result.success ? (
              <p className="text-green-700 dark:text-green-400 font-medium">
                ✓ 导入成功
              </p>
            ) : (
              <p className="text-amber-700 dark:text-amber-400 font-medium">
                ⚠ 导入完成（部分失败）
              </p>
            )}
            <div className="mt-2 space-y-1 text-sm">
              {result.stats.emotion.entries > 0 && (
                <p>情绪笔记：{result.stats.emotion.files} 个文件，{result.stats.emotion.entries} 条记录</p>
              )}
              {result.stats.daily.files > 0 && (
                <p>每日日志：{result.stats.daily.files} 个文件</p>
              )}
            </div>
            {result.errors.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">
                  错误详情 ({result.errors.length})
                </summary>
                <ul className="mt-1 space-y-1 text-xs text-red-500">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
          {result.success && (
            <div className="flex gap-2">
              <Link
                href="/daily"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                查看日志 →
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
