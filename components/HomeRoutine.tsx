"use client";

import { useEffect, useState } from "react";
import { CurrentTask } from "@/components/CurrentTask";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

export function HomeRoutine() {
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

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  if (routine) return <CurrentTask routineMarkdown={routine} />;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-gray-400 text-sm">加载时间表...</p>
    </div>
  );
}
