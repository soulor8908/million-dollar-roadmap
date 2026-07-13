"use client";

import { useEffect, useState } from "react";
import type { LeetCodeProblem } from "@/lib/types";
import { chinaDateNow } from "@/lib/time";

interface ProblemSheetProps {
  problem: LeetCodeProblem | null; // null 时不渲染
  onClose: () => void;
  onSave: (fields: {
    date: string;
    independent: "✅" | "⚠️" | "❌";
    cost: string;
    note: string;
  }) => void;
}

const INDEPENDENT_OPTIONS: Array<{ value: "✅" | "⚠️" | "❌"; label: string }> = [
  { value: "✅", label: "独立完成" },
  { value: "⚠️", label: "部分独立" },
  { value: "❌", label: "看题解" },
];

export function ProblemSheet({ problem, onClose, onSave }: ProblemSheetProps) {
  const [date, setDate] = useState(chinaDateNow());
  const [independent, setIndependent] = useState<"✅" | "⚠️" | "❌">("✅");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");
  const [mounted, setMounted] = useState(false);

  // 每次打开新题目时重置表单并触发滑入动画
  useEffect(() => {
    if (!problem) return;
    setDate(chinaDateNow());
    setIndependent("✅");
    setCost("");
    setNote("");
    setMounted(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [problem]);

  if (!problem) return null;

  return (
    <>
      {/* 半透明遮罩 */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[55]"
      />
      {/* bottom sheet，z-index 高于 Nav(z-50) 以避免按钮被遮挡 */}
      <div
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto z-[60]"
        style={{
          transform: mounted ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium truncate">
            {problem.title}
            <span className="text-xs text-gray-400 ml-2">#{problem.number}</span>
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 text-xl leading-none px-2 shrink-0"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">完成日期</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">独立程度</p>
            <div className="flex gap-2">
              {INDEPENDENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setIndependent(opt.value)}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    independent === opt.value
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt.value} {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">耗时（分钟）</p>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="耗时（分钟）"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">备注</p>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="备注（可选）"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onClose}
              className="border border-gray-300 rounded-lg py-2 text-sm"
            >
              取消
            </button>
            <button
              onClick={() => onSave({ date, independent, cost, note })}
              className="bg-black text-white rounded-lg py-2 text-sm font-medium"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
