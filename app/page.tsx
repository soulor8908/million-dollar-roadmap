"use client";

// app/page.tsx
// 首页：当前任务卡 + 待学/待复习/打卡 + 今日状态 + 学习列表 + 热力图
// 打卡可视化强化（按天数变色 + 断卡视觉冲击）+ 低能量休息提示

import { useState, useEffect } from "react";
import Link from "next/link";
import { getItem, listKeys } from "@/lib/storage/db";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan, ReviewCard, LearnLog, ScheduleItem, DailyStatus, PublicProfile } from "@/lib/types";
import { chinaDateNow, chinaDateShift } from "@/lib/time";
import { getDueCards } from "@/lib/fsrs";
import { StatusCard } from "@/components/StatusCard";
import { CurrentTaskCard } from "@/components/CurrentTaskCard";
import { DailyNudge } from "@/components/DailyNudge";

export default function Home() {
  const [dueCount, setDueCount] = useState(0);
  const [todayLearnCount, setTodayLearnCount] = useState(0);
  const [streak, setStreak] = useState(0);
  /** 上一次连续天数（昨日或更早结束的连续段）—— 用于断卡视觉 */
  const [lastStreak, setLastStreak] = useState(0);
  const [recentLogs, setRecentLogs] = useState<LearnLog[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Array<ScheduleItem & { planId: string; topic: string }>>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; minutes: number }[]>([]);
  const [todayEnergy, setTodayEnergy] = useState<number | null>(null);
  const [latestPlan, setLatestPlan] = useState<{ id: string; topic: string } | null>(null);
  const [hasPlans, setHasPlans] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");
  const [shareMsg, setShareMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      const allKeys = await listKeys();
      const strKeys = allKeys.filter((k): k is string => typeof k === "string");

      // 读所有卡片，计算今日待复习
      const cardKeys = strKeys.filter((k) => k.startsWith(KEY_PREFIXES.CARD));
      const cards: ReviewCard[] = [];
      for (const k of cardKeys) {
        const c = await getItem<ReviewCard>(k);
        if (c) cards.push(c);
      }
      const due = getDueCards(cards);
      setDueCount(due.length);

      // 读所有 plan，找今日 schedule
      const planKeys = strKeys.filter((k) => k.startsWith(KEY_PREFIXES.PLAN));
      let todayLearn = 0;
      const todayItems: Array<ScheduleItem & { planId: string; topic: string }> = [];
      const loadedPlans: LearningPlan[] = [];
      for (const k of planKeys) {
        const plan = await getItem<LearningPlan>(k);
        if (!plan) continue;
        loadedPlans.push(plan);
        const today = plan.schedule.filter((s) => s.day === 1 && !s.completed);
        // 附带 planId + topic 以便点击跳转
        for (const s of today) {
          todayItems.push({ ...s, planId: plan.id, topic: plan.topic });
        }
        todayLearn += today.filter((s) => s.type === "learn").length;
      }
      // 跟踪最新计划（用于"继续学习"入口）
      if (loadedPlans.length > 0) {
        loadedPlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLatestPlan({ id: loadedPlans[0].id, topic: loadedPlans[0].topic });
        setHasPlans(true);
      } else {
        setHasPlans(false);
      }
      setTodayLearnCount(todayLearn);
      setTodaySchedule(todayItems.slice(0, 3));

      // 读学习日志，算连续打卡
      const logKeys = strKeys.filter((k) => k.startsWith(KEY_PREFIXES.LEARN_LOG));
      const logs: LearnLog[] = [];
      for (const k of logKeys) {
        const log = await getItem<LearnLog>(k);
        if (log) logs.push(log);
      }
      setRecentLogs(logs.slice(-5));

      const logDates = new Set(logs.map((l) => l.date));

      // 今日连续打卡（含今日）
      let streakCount = 0;
      let checkDate = chinaDateNow();
      while (logDates.has(checkDate)) {
        streakCount++;
        checkDate = chinaDateShift(checkDate, -1);
      }
      setStreak(streakCount);

      // 上一次连续段：从昨日往前数
      if (streakCount === 0) {
        let lastCount = 0;
        let yDate = chinaDateShift(chinaDateNow(), -1);
        while (logDates.has(yDate)) {
          lastCount++;
          yDate = chinaDateShift(yDate, -1);
        }
        setLastStreak(lastCount);
      } else {
        setLastStreak(0);
      }

      // 迷你热力图（最近 7 天）
      const dayMinutes: { date: string; minutes: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = chinaDateShift(chinaDateNow(), -i);
        const minutes = logs
          .filter((l) => l.date === date)
          .reduce((sum, l) => sum + (l.duration ?? 0), 0);
        dayMinutes.push({ date, minutes });
      }
      setHeatmapData(dayMinutes);

      // 读今日状态，用于低能量休息提示
      const todayStatusKey = KEY_PREFIXES.STATUS + chinaDateNow();
      const todayStatus = await getItem<DailyStatus>(todayStatusKey);
      if (todayStatus) setTodayEnergy(todayStatus.energy);

      // 读用户名（用于分享主页）
      const profile = await getItem<PublicProfile>("my:profile");
      if (profile?.username) setUsername(profile.username);
    })();
  }, []);

  // 分享主页地址
  async function handleShare() {
    if (!username) {
      setShareMsg("请先在「我的」设置用户名");
      setTimeout(() => setShareMsg(""), 2500);
      return;
    }
    const shareUrl = `${window.location.origin}/u/${encodeURIComponent(username)}`;
    const shareText = "来看看我的开发者成长主页";
    if (navigator.share) {
      try {
        await navigator.share({ title: "devpath", text: shareText, url: shareUrl });
      } catch {
        // 用户取消分享，静默处理
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareMsg("链接已复制到剪贴板");
        setTimeout(() => setShareMsg(""), 2500);
      } catch {
        setShareMsg(shareUrl);
        setTimeout(() => setShareMsg(""), 5000);
      }
    }
  }

  const heatColor = (minutes: number) => {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 15) return "bg-green-200";
    if (minutes < 30) return "bg-green-400";
    if (minutes < 60) return "bg-green-500";
    return "bg-green-700";
  };

  // 打卡可视化强化：按天数变色 + 火焰 emoji
  const streakMeta = (() => {
    if (streak === 0) {
      // 断卡：上次有连续段 > 0 → 视觉冲击
      if (lastStreak >= 3) {
        return {
          color: "bg-red-50 border-red-300 text-red-600",
          emoji: "💔",
          sub: `断卡！上次连续 ${lastStreak} 天`,
          shock: true,
        };
      }
      return { color: "bg-gray-50 border-gray-200 text-gray-500", emoji: "⚪", sub: "今日未打卡", shock: false };
    }
    if (streak >= 30) return { color: "bg-purple-50 border-purple-300 text-purple-700", emoji: "🔥", sub: "满月达成！", shock: false };
    if (streak >= 14) return { color: "bg-orange-50 border-orange-300 text-orange-700", emoji: "🔥", sub: "两周连胜！", shock: false };
    if (streak >= 7) return { color: "bg-orange-50 border-orange-300 text-orange-600", emoji: "🔥", sub: "一周连胜！", shock: false };
    if (streak >= 3) return { color: "bg-yellow-50 border-yellow-300 text-yellow-700", emoji: "⭐", sub: "保持节奏", shock: false };
    return { color: "bg-blue-50 border-blue-300 text-blue-700", emoji: "🌱", sub: "开始打卡", shock: false };
  })();

  const lowEnergy = todayEnergy !== null && todayEnergy <= 2;

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">今日</h1>
        <button
          type="button"
          onClick={handleShare}
          className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          🔗 分享主页
        </button>
      </div>
      {shareMsg && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 p-2 text-sm text-blue-700 dark:text-blue-300 break-all">
          {shareMsg}
        </div>
      )}

      {/* 每日 AI 主动提醒（主动 UX：用户没问 AI 也开口） */}
      <div className="mb-4">
        <DailyNudge />
      </div>

      {/* 现在该做什么（时间表驱动） */}
      <div className="mb-4">
        <CurrentTaskCard />
      </div>

      {/* 新用户引导（无任何学习计划时） */}
      {hasPlans === false && (
        <div className="mb-6 rounded-lg border-2 border-blue-300 bg-blue-50 p-6 text-center">
          <p className="text-lg font-semibold mb-2">👋 欢迎来到 devpath</p>
          <p className="mb-4 text-sm text-gray-600">告诉 AI 你想学什么，它帮你拆知识树、排计划、出面试题</p>
          <Link
            href="/learn"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            开始第一个学习计划
          </Link>
        </div>
      )}

      {/* 待学/待复习 + 打卡（打卡强化）- 全部可点击跳转 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Link href="/learn" className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold">{todayLearnCount}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">今日待学</p>
        </Link>
        <Link href="/review" className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold">{dueCount}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">今日待复习</p>
        </Link>
        <Link href="/learn" className={`border rounded-lg p-3 text-center hover:shadow-md transition-shadow ${streakMeta.color}`}>
          <p className="text-2xl font-bold">
            {streakMeta.emoji} {streak}
          </p>
          <p className="text-xs">{streak === 0 ? "去打卡" : streakMeta.sub}</p>
        </Link>
      </div>

      {/* 打卡引导：未打卡时告诉用户怎么打卡 */}
      {streak === 0 && hasPlans && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 完成今日第一个学习/复习任务即可自动打卡。点击上方「今日待学」开始吧！
          </p>
        </div>
      )}

      {/* 低能量休息提示（与状态评估联动） */}
      {lowEnergy && (
        <Link
          href="/rest"
          className="mb-4 flex items-center justify-between rounded-lg bg-green-50 border border-green-200 p-3 hover:bg-green-100"
        >
          <span className="text-sm text-green-800">😴 检测到今天能量偏低，去休息一下？</span>
          <span className="text-xs text-green-700">478 呼吸 →</span>
        </Link>
      )}

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
              <Link
                key={i}
                href={`/learn/${item.planId}`}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 hover:shadow-md transition-shadow"
              >
                <span className={`text-xs px-2 py-0.5 rounded ${
                  item.type === "learn" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>
                  {item.type === "learn" ? "学" : "复"}
                </span>
                <span className="text-sm flex-1 truncate">{item.topic}</span>
                <span className="text-xs text-gray-400">{item.estimatedMinutes}min</span>
                <span className="text-xs text-blue-500">→</span>
              </Link>
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

      {/* 继续学习入口 */}
      {latestPlan && (
        <Link
          href={`/learn/${latestPlan.id}`}
          className="mb-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 hover:bg-blue-100"
        >
          <span className="text-sm text-blue-800">📚 继续学习：{latestPlan.topic}</span>
          <span className="text-xs text-blue-600">→</span>
        </Link>
      )}

      {/* 快捷入口 */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/learn" className="bg-black text-white rounded-lg p-4 text-center font-medium">
          📚 学习
        </Link>
        <Link href="/review" className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 text-center font-medium">
          🔁 复习
        </Link>
        <Link href="/emotion" className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 text-center font-medium">
          📝 情绪
        </Link>
      </div>
    </div>
  );
}
