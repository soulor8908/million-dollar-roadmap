"use client";

import { useState } from "react";
import { set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import { chinaDateNow } from "@/lib/time";
import type { DailyStatus } from "@/lib/types";

const QUICK_OPTIONS = [
  { energy: 2 as const, mood: "bad" as const, label: "不太好", emoji: "😕" },
  { energy: 3 as const, mood: "neutral" as const, label: "一般", emoji: "😐" },
  { energy: 4 as const, mood: "good" as const, label: "状态不错", emoji: "🙂" },
];

export function StatusCard() {
  const [selected, setSelected] = useState<DailyStatus | null>(null);

  async function handleClick(energy: 2 | 3 | 4, mood: "bad" | "neutral" | "good") {
    const status: DailyStatus = {
      date: chinaDateNow(),
      energy,
      mood,
      availableMinutes: 30,
      aiAdjustedLoad: 1.0,
      actualMinutes: 0,
    };
    await set(KEY_PREFIXES.STATUS + status.date, status);
    setSelected(status);
  }

  if (selected) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-1">今日状态</p>
        <p className="text-lg font-medium">
          {selected.energy >= 4 ? "🙂" : selected.energy >= 3 ? "😐" : "😕"} 精力 {selected.energy}/5
        </p>
        <p className="text-xs text-gray-400 mt-1">
          可用时间 {selected.availableMinutes}min · 建议负载 {selected.aiAdjustedLoad.toFixed(1)}x
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-sm text-gray-500 mb-3">今天感觉怎么样？</p>
      <div className="flex gap-2">
        {QUICK_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleClick(opt.energy, opt.mood)}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-1">{opt.emoji}</div>
            <div className="text-xs text-gray-600">{opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
