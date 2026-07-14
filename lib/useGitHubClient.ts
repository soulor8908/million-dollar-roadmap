"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

export interface UseGitHubClientResult {
  client: GitHubClient | null;
  loading: boolean;
  error: string;
}

/**
 * 封装 loadToken + new GitHubClient 样板逻辑。
 * 在组件挂载时加载加密 token 并构造 GitHubClient，返回 { client, loading, error }。
 * client 在 token 加载完成后可用，可在挂载副作用与事件处理函数中直接使用。
 */
export function useGitHubClient(): UseGitHubClientResult {
  const [client, setClient] = useState<GitHubClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await loadToken();
        if (cancelled) return;
        if (!token) {
          setError("未登录");
          setLoading(false);
          return;
        }
        setClient(new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token));
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "加载失败");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { client, loading, error };
}
