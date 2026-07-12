"use client";

import { useState, useEffect, ReactNode } from "react";
import { loadToken, saveToken, clearToken } from "@/lib/storage";

export function TokenGate({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadToken()
      .then(setToken)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    try {
      await saveToken(input.trim());
      setToken(input.trim());
      setInput("");
    } catch {
      setError("保存失败，请重试");
    }
  }

  function handleClear() {
    clearToken();
    setToken(null);
  }

  if (loading) {
    return <div className="p-4 text-gray-500">加载中...</div>;
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10">
        <h1 className="text-xl font-bold mb-4">🔐 输入 GitHub Token</h1>
        <p className="text-sm text-gray-500 mb-4">
          需要带 <code className="bg-gray-100 px-1 rounded">repo</code> 权限的 Personal Access Token。
          Token 加密存在 sessionStorage，关闭浏览器即清除。
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white rounded py-2 text-sm font-medium"
          >
            保存
          </button>
        </form>
        <a
          href="https://github.com/settings/tokens/new?scopes=repo"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-500 text-sm mt-3"
        >
          去 GitHub 创建 Token →
        </a>
      </div>
    );
  }

  return (
    <div>
      {children}
      <button
        onClick={handleClear}
        className="fixed bottom-2 right-2 text-xs text-gray-400"
      >
        退出
      </button>
    </div>
  );
}
