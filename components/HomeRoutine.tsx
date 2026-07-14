"use client";

import { useEffect, useState } from "react";
import { CurrentTask } from "@/components/CurrentTask";
import { useGitHubClient } from "@/lib/useGitHubClient";

export function HomeRoutine() {
  const { client, error: tokenError } = useGitHubClient();
  const [routine, setRoutine] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    (async () => {
      try {
        const file = await client.readFile("schedule/routine.md");
        if (!cancelled && file) setRoutine(file.content);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "加载失败");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client]);

  const displayError = error || tokenError;
  if (displayError) return <p className="text-red-500 text-sm">{displayError}</p>;

  if (routine) return <CurrentTask routineMarkdown={routine} />;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-gray-400 text-sm">加载时间表...</p>
    </div>
  );
}
