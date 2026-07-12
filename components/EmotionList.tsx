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
            file.entries.map((entry, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-3 mb-2 last:mb-0">
                <p className="text-sm">
                  <span className="text-gray-400">{entry.time}</span>{" "}
                  {entry.emoji} {entry.tag}
                  {entry.dopamine !== "无" && (
                    <span className="ml-2 text-xs bg-red-50 text-red-500 px-1 rounded">
                      {entry.dopamine}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{entry.trigger}</p>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
