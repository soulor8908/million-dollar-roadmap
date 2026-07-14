"use client";

import { useState } from "react";
import type { EnergyLevel } from "@/lib/types";
import { useGitHubClient } from "@/lib/useGitHubClient";
import { chinaDateNow, chinaTimeNow } from "@/lib/time";

export function EnergyMeter() {
  const { client } = useGitHubClient();
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function record(level: EnergyLevel) {
    setEnergy(level);
    if (!client) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    try {
      const date = chinaDateNow();
      const time = chinaTimeNow();
      const path = `energy/${date}.md`;
      const existing = await client.readFile(path);
      const entry = `### ${time} | 能量 ${level}`;
      const base = existing?.content || "";
      const newContent = base.includes("## 能量快记")
        ? base.replace(/## 能量快记\n/, `## 能量快记\n\n${entry}\n`)
        : `# ⚡ ${date} 能量记录\n\n## 能量快记\n\n${entry}\n`;
      await client.writeFile(
        path,
        newContent,
        `energy: ${date} ${time} level ${level}`,
        existing?.sha
      );
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (e) {
      console.error("能量记录保存失败", e);
      setStatus("error");
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-2">能量快记</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => record(n as EnergyLevel)}
            disabled={status === "saving"}
            className={`flex-1 py-3 rounded-lg text-lg font-bold transition disabled:opacity-40 ${
              energy === n
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">
        {status === "saving"
          ? "保存中..."
          : status === "saved"
          ? "✓ 已记录"
          : status === "error"
          ? "保存失败，请重试"
          : "1=濒溃 5=巅峰"}
      </p>
    </div>
  );
}
