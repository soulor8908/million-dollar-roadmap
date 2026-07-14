"use client";

import { useState, useEffect } from "react";
import { BreathTimer } from "@/components/BreathTimer";
import { useGitHubClient } from "@/lib/useGitHubClient";

export default function RestPage() {
  const { client } = useGitHubClient();
  const [methods, setMethods] = useState<string>("");
  const [energy, setEnergy] = useState<number>(3);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    (async () => {
      try {
        const file = await client.readFile("rest/methods.md");
        if (!cancelled && file) setMethods(file.content);
      } catch (e) {
        console.error("加载休息方法库失败", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client]);

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">😴 高效休息</h1>

      <BreathTimer />

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">当前能量</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              className={`flex-1 py-2 rounded-lg font-bold ${
                energy === n ? "bg-black text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">
          {energy <= 2 ? "推荐：NSDR / 478呼吸 / 小睡" :
           energy === 3 ? "推荐：散步 / 渐进式放松" :
           "推荐：远眺 / 走动 / 喝水"}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">休息方法库</p>
        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">
          {methods || "加载中..."}
        </pre>
      </div>
    </main>
  );
}
