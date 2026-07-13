"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { get, keys } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import { chinaDateNow, chinaDateShift } from "@/lib/time";
import { getDueCards } from "@/lib/fsrs";
import { StatusCard } from "@/components/StatusCard";
import type { LearningPlan, ReviewCard, LearnLog, ScheduleItem } from "@/lib/types";

export default function Home() {
  const [dueCount, setDueCount] = useState(0);
  const [todayLearnCount, setTodayLearnCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentLogs, setRecentLogs] = useState<LearnLog[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; minutes: number }[]>([]);

  useEffect(() => {
    (async () => {
      const allKeys = await keys();
      const strKeys = allKeys.filter((k): k is string => typeof k === "string");

      // 读所有卡片，计算今日待复习
      const cardKeys = strKeys.filter((k) => k.startsWith(KEY_PREFIXES.CARD));
      const cards: ReviewCard[] = [];
      for (const k of cardKeys) {
        const c = await get<ReviewCard>(k);
        if (c) cards.push(c);
      }
      const due = getDueCards(cards);
      setDueCount(due.length);

      // 读所有 plan，找今日 schedule
      const planKeys = strKeys.filter((k) => k.startsWith(KEY_PREFIXES.PLAN));
      let todayLearn = 0;
      const todayItems: ScheduleItem[] = [];
      for (const k of planKeys) {
        const plan = await get<LearningPlan>(k);
        if (!plan) continue;
        const today = plan.schedule.filter((s) => s.day === 1 && !s.completed);
        todayItems.push(...today);
        todayLearn += today.filter((s) => s.type === "learn").length;
      }
      setTodayLearnCount(todayLearn);
      setTodaySchedule(todayItems.slice(0, 3));

      // 读学习日志，算连续打卡
      const logKeys = strKeys.filter((k) => k.startsWith(KEY_PREFIXES.LEARN_LOG));
      const logs: LearnLog[] = [];
      for (const k of logKeys) {
        const log = await get<LearnLog>(k);
        if (log) logs.push(log);
      }
      setRecentLogs(logs.slice(-5));

      const logDates = new Set(logs.map((l) => l.date));
      let streakCount = 0;
      let checkDate = chinaDateNow();
      while (logDates.has(checkDate)) {
        streakCount++;
        checkDate = chinaDateShift(checkDate, -1);
      }
      setStreak(streakCount);

      // 迷你热力图（最近 7 天）
      const dayMinutes: { date: string; minutes: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = chinaDateShift(chinaDateNow(), -i);
        const minutes = logs
          .filter((l) => l.date === date)
          .reduce((sum, l) => sum + l.duration, 0);
        dayMinutes.push({ date, minutes });
      }
      setHeatmapData(dayMinutes);
    })();
  }, []);

  const heatColor = (minutes: number) => {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 15) return "bg-green-200";
    if (minutes < 30) return "bg-green-400";
    if (minutes < 60) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-4">今日</h1>

      {/* 待学/待复习 + 打卡 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{todayLearnCount}</p>
          <p className="text-xs text-gray-400">今日待学</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{dueCount}</p>
          <p className="text-xs text-gray-400">今日待复习</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-gray-400">连续打卡</p>
        </div>
      </div>

      {/* 今日状态 */}
      <div className="mb-4">
        <StatusCard />
      </div>

      {/* 今日学习/复习列表 */}
      {todaySchedule.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 mb-2">今日安排</h2>
          <div className="space-y-1">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border rounded-lg p-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  item.type === "learn" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>
                  {item.type === "learn" ? "学" : "复"}
                </span>
                <span className="text-sm flex-1">{item.nodeId}</span>
                <span className="text-xs text-gray-400">{item.estimatedMinutes}min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 迷你热力图（最近 7 天） */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-500 mb-2">最近 7 天</h2>
        <div className="flex gap-1">
          {heatmapData.map((d) => (
            <div key={d.date} className="flex-1 text-center">
              <div className={`h-12 rounded ${heatColor(d.minutes)} flex items-end justify-center pb-1`}>
                {d.minutes > 0 && (
                  <span className="text-xs text-white font-medium">{d.minutes}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {d.date.slice(5)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/learn" className="bg-black text-white rounded-lg p-4 text-center font-medium">
          📚 开始学习
        </Link>
        <Link href="/review" className="bg-white border rounded-lg p-4 text-center font-medium">
          🔁 去复习
        </Link>
      </div>
    </div>
  );
}
