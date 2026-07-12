"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { parseEmotionFile } from "@/lib/emotion";
import type { EmotionFile } from "@/lib/types";

export function EmotionList() {
  const [files, setFiles] = useState<EmotionFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setLoading(false); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const names = await client.listFiles("emotion");
        const recent = names
          .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
          .sort()
          .slice(-7);
        const loaded = await Promise.all(
          recent.map(async (name) => {
            const file = await client.readFile(`emotion/${name}`);
            return parseEmotionFile(file?.content || "", name.replace(".md", ""));
          })
        );
        setFiles(loaded.reverse());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">加载中...</p>;

  const tagCount: Record<string, number> = {};
  files.forEach((f) => f.entries.forEach((e) => {
    tagCount[e.tag] = (tagCount[e.tag] || 0) + 1;
  }));

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">最近7天情绪统计</p>
        {Object.keys(tagCount).length === 0 ? (
          <p className="text-sm text-gray-400">暂无记录</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(tagCount).map(([tag, count]) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {tag} ×{count}
              </span>
            ))}
          </div>
        )}
      </div>

      {files.map((file) => (
        <div key={file.date} className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-sm font-medium mb-2">{file.date}</p>
          {file.entries.length === 0 ? (
            <p className="text-xs text-gray-400">无记录</p>
          ) : (
            file.entries.map((entry, i) => {
              const key = `${file.date}-${i}`;
              const isOpen = expanded.has(key);
              return (
                <div
                  key={i}
                  onClick={() => toggle(key)}
                  className="border-l-2 border-gray-200 pl-3 mb-2 last:mb-0 cursor-pointer hover:bg-gray-50 rounded-r transition-colors"
                >
                  <p className="text-sm flex items-center gap-1">
                    <span className="text-gray-400">{entry.time}</span>
                    {entry.emoji} {entry.tag}
                    {entry.dopamine !== "无" && (
                      <span className="ml-1 text-xs bg-red-50 text-red-500 px-1 rounded">
                        {entry.dopamine}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-gray-400">
                      {isOpen ? "收起 ▲" : "详情 ▼"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{entry.trigger}</p>
                  {isOpen && (
                    <div className="mt-2 space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-2">
                      {entry.impact && entry.impact !== "—" && (
                        <p>
                          <span className="text-gray-400 mr-1">影响：</span>
                          {entry.impact}
                        </p>
                      )}
                      {entry.coping && entry.coping !== "—" && (
                        <p>
                          <span className="text-gray-400 mr-1">应对：</span>
                          {entry.coping}
                        </p>
                      )}
                      {entry.dopamine !== "无" && (
                        <p>
                          <span className="text-gray-400 mr-1">多巴胺干扰：</span>
                          <span className="text-red-500">{entry.dopamine}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
}
