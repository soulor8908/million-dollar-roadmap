"use client";

import { useState } from "react";
import { DailyEditor } from "@/components/DailyEditor";
import { DailyCalendar } from "@/components/DailyCalendar";

export default function DailyPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">📝 日志记录</h1>
      <DailyCalendar onSelect={setSelectedDate} />
      {selectedDate && (
        <p className="text-xs text-gray-500">
          已选择 {selectedDate}，下方编辑器切换中...
        </p>
      )}
      <DailyEditor />
    </main>
  );
}
