"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { chinaTodayParts } from "@/lib/time";

export function DailyCalendar({ onSelect }: { onSelect: (date: string) => void }) {
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setLoading(false); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const names = await client.listFiles("daily");
        const dates = new Set(
          names
            .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
            .map((n) => n.replace(".md", ""))
        );
        setLoggedDates(dates);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-gray-400 text-xs">加载日历...</p>;

  const { year, month, day: todayDay } = chinaTodayParts();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(todayDay).padStart(2, "0")}`;

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(dateStr);
  }

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <p className="text-xs text-gray-500 mb-2">
        {year}年{month + 1}月 · 已记录 {loggedDates.size} 天
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
          <div key={d} className="text-gray-400 py-1">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const day = +date.split("-")[2];
          const logged = loggedDates.has(date);
          const isToday = date === todayStr;
          return (
            <button
              key={i}
              onClick={() => onSelect(date)}
              className={`py-1 rounded ${
                isToday ? "border border-black" : ""
              } ${logged ? "bg-black text-white" : "bg-gray-50 text-gray-500"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
