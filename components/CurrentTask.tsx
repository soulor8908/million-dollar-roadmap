"use client";

import { useState, useEffect } from "react";
import { parseRoutine, getCurrentTask } from "@/lib/routine";
import type { CurrentTask as CurrentTaskType } from "@/lib/types";

export function CurrentTask({ routineMarkdown }: { routineMarkdown: string }) {
  const [task, setTask] = useState<CurrentTaskType | null>(null);

  useEffect(() => {
    const slots = parseRoutine(routineMarkdown);
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setTask(getCurrentTask(slots, `${hh}:${mm}`));
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, [routineMarkdown]);

  if (!task) return <div className="text-gray-400">加载中...</div>;

  if (!task.current) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-gray-500 text-sm">当前无安排</p>
        {task.next && (
          <p className="text-sm mt-1">
            下一项：<span className="font-medium">{task.next.activity}</span>
            （{task.next.start}）
          </p>
        )}
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    运动: "bg-orange-50 border-orange-200",
    学习: "bg-blue-50 border-blue-200",
    休息: "bg-green-50 border-green-200",
    家庭: "bg-pink-50 border-pink-200",
    睡眠: "bg-purple-50 border-purple-200",
    工作: "bg-gray-50 border-gray-200",
    其他: "bg-white border-gray-200",
  };

  return (
    <div className={`rounded-xl p-4 border-2 ${typeColors[task.current.type] || typeColors.其他}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 mb-1">现在该做什么</p>
          <p className="text-lg font-bold">{task.current.activity}</p>
          <p className="text-sm text-gray-500">
            {task.current.start} - {task.current.end}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{task.minutesLeft}</p>
          <p className="text-xs text-gray-500">分钟剩余</p>
        </div>
      </div>
      {task.next && (
        <p className="text-xs text-gray-400 mt-2">
          下一项：{task.next.activity}（{task.next.start}）
        </p>
      )}
    </div>
  );
}
