"use client";

// app/page.tsx
// 首页叙事化（P4）— 滚动 = 一天的故事
//
// 设计（乔布斯视角）：
//   旧版是仪表盘：三列数字 + 热力图 + 状态卡 + 快捷入口，信息密度高但叙事感为零
//   新版按时间线叙事：
//     1. 顶部：DailyNudge（AI 主动提醒）+ CurrentTaskCard（现在该做什么）
//     2. 中部：今日安排列表（学习/复习任务，按时间排序）
//     3. 情绪区：今日情绪快捷记录 + 历史情绪条目
//     4. 错题区：今日错题回顾卡片
//     5. 底部：打卡状态 + 迷你热力图
//
// 核心变化：错题和情绪不再需要独立页面跳转，首页即可完成两个高频操作

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getItem, listItems } from "@/lib/storage/db";
import { KEY_PREFIXES } from "@/lib/types";
import type {
  LearningPlan,
  ReviewCard,
  LearnLog,
  ScheduleItem,
  DailyStatus,
  PublicProfile,
  MistakeRecord,
  EmotionEntry,
} from "@/lib/types";
import { chinaDateNow, chinaDateShift } from "@/lib/time";
import { getDueCards } from "@/lib/fsrs";
import { getUnresolvedMistakes } from "@/lib/mistake-book";
import { StatusCard } from "@/components/StatusCard";
import { CurrentTaskCard } from "@/components/CurrentTaskCard";
import { DailyNudge } from "@/components/DailyNudge";
import { EmotionRecorder } from "@/components/EmotionRecorder";
import { Icon, type IconName } from "@/components/Icon";

export default function Home() {
  const [dueCount, setDueCount] = useState(0);
  const [todayLearnCount, setTodayLearnCount] = useState(0);
  const [streak, setStreak] = useState(0);
  /** 上一次连续天数（昨日或更早结束的连续段）—— 用于断卡视觉 */
  const [lastStreak, setLastStreak] = useState(0);
  const [todaySchedule, setTodaySchedule] = useState<
    Array<ScheduleItem & { planId: string; topic: string }>
  >([]);
  const [heatmapData, setHeatmapData] = useState<
    { date: string; minutes: number }[]
  >([]);
  const [todayEnergy, setTodayEnergy] = useState<number | null>(null);
  const [latestPlan, setLatestPlan] = useState<{ id: string; topic: string } | null>(null);
  const [hasPlans, setHasPlans] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");
  const [shareMsg, setShareMsg] = useState<string>("");

  // 情绪 + 错题（P4 首页叙事化新增）
  const [todayEmotions, setTodayEmotions] = useState<EmotionEntry[]>([]);
  const [recentMistakes, setRecentMistakes] = useState<MistakeRecord[]>([]);
  const [showEmotionRecorder, setShowEmotionRecorder] = useState(false);

  const loadHomeData = useCallback(async () => {
    // P3 性能优化：用 listItems<T>(prefix) 走 prefix 索引批量读取
    // 旧版 listKeys() + 逐个 getItem 是 O(n) 全表 + n 次 get，新版是一次索引查询

    // 读所有卡片，计算今日待复习
    const cards = await listItems<ReviewCard>(KEY_PREFIXES.CARD);
    const due = getDueCards(cards);
    setDueCount(due.length);

    // 读所有 plan，找今日 schedule
    const plans = await listItems<LearningPlan>(KEY_PREFIXES.PLAN);
    let todayLearn = 0;
    const todayItems: Array<ScheduleItem & { planId: string; topic: string }> = [];
    for (const plan of plans) {
      const today = plan.schedule.filter((s) => s.day === 1 && !s.completed);
      for (const s of today) {
        todayItems.push({ ...s, planId: plan.id, topic: plan.topic });
      }
      todayLearn += today.filter((s) => s.type === "learn").length;
    }
    if (plans.length > 0) {
      plans.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestPlan({ id: plans[0].id, topic: plans[0].topic });
      setHasPlans(true);
    } else {
      setHasPlans(false);
    }
    setTodayLearnCount(todayLearn);
    setTodaySchedule(todayItems.slice(0, 5));

    // 读学习日志，算连续打卡
    const logs = await listItems<LearnLog>(KEY_PREFIXES.LEARN_LOG);
    const logDates = new Set(logs.map((l) => l.date));

    let streakCount = 0;
    let checkDate = chinaDateNow();
    while (logDates.has(checkDate)) {
      streakCount++;
      checkDate = chinaDateShift(checkDate, -1);
    }
    setStreak(streakCount);

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

    // 读今日状态
    const todayStatusKey = KEY_PREFIXES.STATUS + chinaDateNow();
    const todayStatus = await getItem<DailyStatus>(todayStatusKey);
    if (todayStatus) setTodayEnergy(todayStatus.energy);

    // 读用户名
    const profile = await getItem<PublicProfile>("my:profile");
    if (profile?.username) setUsername(profile.username);

    // P4 新增：今日情绪（按 date 过滤）
    const today = chinaDateNow();
    const emotions = await listItems<EmotionEntry>(KEY_PREFIXES.EMOTION);
    setTodayEmotions(emotions.filter((e) => e.date === today));

    // P4 新增：未解决错题（取前 3 条最近的）
    const mistakes = await getUnresolvedMistakes();
    setRecentMistakes(mistakes.slice(0, 3));
  }, []);

  useEffect(() => {
    void loadHomeData();
  }, [loadHomeData]);

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

  // 打卡可视化强化
  const streakMeta = (() => {
    if (streak === 0) {
      if (lastStreak >= 3) {
        return {
          color: "bg-red-50 border-red-300 text-red-600",
          emoji: "heart",
          sub: `断卡！上次连续 ${lastStreak} 天`,
          shock: true,
        };
      }
      return {
        color: "bg-gray-50 border-gray-200 text-gray-500",
        emoji: "",
        sub: "今日未打卡",
        shock: false,
      };
    }
    if (streak >= 30)
      return {
        color: "bg-purple-50 border-purple-300 text-purple-700",
        emoji: "flame",
        sub: "满月达成！",
        shock: false,
      };
    if (streak >= 14)
      return {
        color: "bg-orange-50 border-orange-300 text-orange-700",
        emoji: "flame",
        sub: "两周连胜！",
        shock: false,
      };
    if (streak >= 7)
      return {
        color: "bg-orange-50 border-orange-300 text-orange-600",
        emoji: "flame",
        sub: "一周连胜！",
        shock: false,
      };
    if (streak >= 3)
      return {
        color: "bg-yellow-50 border-yellow-300 text-yellow-700",
        emoji: "star",
        sub: "保持节奏",
        shock: false,
      };
    return {
      color: "bg-blue-50 border-blue-300 text-blue-700",
      emoji: "leaf",
      sub: "开始打卡",
      shock: false,
    };
  })();

  const lowEnergy = todayEnergy !== null && todayEnergy <= 2;

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20 dark:bg-gray-900">
      {/* ============ 顶部：标题 + 分享 ============ */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">今日</h1>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          <Icon name="share" className="w-3.5 h-3.5" />
          分享主页
        </button>
      </div>
      {shareMsg && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 p-2 text-sm text-blue-700 dark:text-blue-300 break-all">
          {shareMsg}
        </div>
      )}

      {/* ============ 1. AI 主动提醒 + 现在该做什么 ============ */}
      <section className="mb-4 space-y-3">
        <DailyNudge />
        <CurrentTaskCard />
      </section>

      {/* 新用户引导 */}
      {hasPlans === false && (
        <div className="mb-6 rounded-lg border-2 border-blue-300 bg-blue-50 p-6 text-center">
          <p className="text-lg font-semibold mb-2">欢迎来到 devpath</p>
          <p className="mb-4 text-sm text-gray-600">
            告诉 AI 你想学什么，它帮你拆知识树、排计划、出面试题
          </p>
          <Link
            href="/learn"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            开始第一个学习计划
          </Link>
        </div>
      )}

      {/* ============ 2. 今日安排（学习/复习任务）+ 待学待复习统计 ============ */}
      <section className="mb-4">
        {/* 三宫格统计 */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Link
            href="/learn"
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
          >
            <p className="text-2xl font-bold">{todayLearnCount}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">今日待学</p>
          </Link>
          <Link
            href="/review"
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
          >
            <p className="text-2xl font-bold">{dueCount}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">今日待复习</p>
          </Link>
          <Link
            href="/learn"
            className={`border rounded-lg p-3 text-center hover:shadow-md transition-shadow ${streakMeta.color}`}
          >
            <p className="text-2xl font-bold">
              {streakMeta.emoji ? (
                <Icon
                  name={streakMeta.emoji as IconName}
                  className="w-5 h-5 inline-block align-middle"
                />
              ) : null}{" "}
              {streak}
            </p>
            <p className="text-xs">{streak === 0 ? "去打卡" : streakMeta.sub}</p>
          </Link>
        </div>

        {/* 今日安排列表 */}
        {todaySchedule.length > 0 && (
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-gray-500 mb-2">今日安排</h2>
            {todaySchedule.map((item, i) => (
              <Link
                key={i}
                href={`/learn/${item.planId}`}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 hover:shadow-md transition-shadow"
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    item.type === "learn"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.type === "learn" ? "学" : "复"}
                </span>
                <span className="text-sm flex-1 truncate">{item.topic}</span>
                <span className="text-xs text-gray-400">
                  {item.estimatedMinutes}min
                </span>
                <span className="text-xs text-blue-500">→</span>
              </Link>
            ))}
          </div>
        )}

        {/* 打卡引导 */}
        {streak === 0 && hasPlans && (
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <Icon
                name="lightbulb"
                className="w-4 h-4 inline-block align-middle"
              />{" "}
              完成今日第一个学习/复习任务即可自动打卡。点击上方「今日待学」开始吧！
            </p>
          </div>
        )}

        {/* 低能量休息提示 */}
        {lowEnergy && (
          <Link
            href="/rest"
            className="mt-3 flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
              <Icon name="leaf" className="w-4 h-4" />
              检测到今天能量偏低，去休息一下？
            </span>
            <span className="text-xs text-green-700 dark:text-green-400 flex items-center gap-0.5">
              478 呼吸 <Icon name="chevron-right" className="w-3.5 h-3.5" />
            </span>
          </Link>
        )}

        {/* 今日状态 */}
        <div className="mt-3">
          <StatusCard />
        </div>
      </section>

      {/* ============ 3. 情绪区：今日情绪快捷记录 + 历史条目 ============ */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
            <Icon name="heart" className="w-4 h-4 text-pink-500" />
            今日情绪
          </h2>
          <button
            onClick={() => setShowEmotionRecorder(!showEmotionRecorder)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <Icon name="plus" className="w-3.5 h-3.5" />
            {showEmotionRecorder ? "收起" : "记一次"}
          </button>
        </div>

        {showEmotionRecorder && (
          <div className="mb-3">
            <EmotionRecorder
              compact
              onSaved={() => {
                setShowEmotionRecorder(false);
                void loadHomeData();
              }}
            />
          </div>
        )}

        {/* 今日情绪列表 */}
        {todayEmotions.length > 0 ? (
          <div className="space-y-1.5">
            {todayEmotions.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-2.5 flex items-start gap-2"
              >
                <span className="text-lg">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-gray-700">{entry.tag}</span>
                    <span className="text-gray-400">{entry.time}</span>
                    {entry.dopamine !== "无" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-700">
                        {entry.dopamine}
                      </span>
                    )}
                  </div>
                  {entry.reason && (
                    <p className="text-xs text-gray-600 mt-0.5">{entry.reason}</p>
                  )}
                  {(entry.selectedCoping?.length > 0 || entry.customCoping) && (
                    <p className="text-xs text-green-700 mt-0.5">
                      应对：
                      {[
                        ...(entry.selectedCoping ?? []),
                        ...(entry.customCoping ? [entry.customCoping] : []),
                      ].join("、")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showEmotionRecorder && (
            <p className="text-xs text-gray-400 text-center py-3">
              今天还没记录情绪，点「记一次」开始
            </p>
          )
        )}

        {/* 跳转完整情绪页 */}
        <Link
          href="/emotion"
          className="mt-2 block text-center text-xs text-gray-500 hover:text-blue-500"
        >
          查看全部历史 →
        </Link>
      </section>

      {/* ============ 4. 错题区：今日错题回顾 ============ */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
            <Icon name="x-circle" className="w-4 h-4 text-red-500" />
            错题回顾
          </h2>
          {recentMistakes.length > 0 && (
            <Link
              href="/mistakes"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              全部 →
            </Link>
          )}
        </div>

        {recentMistakes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <Icon
              name="check-circle"
              className="w-8 h-8 mx-auto text-green-500 mb-1"
            />
            <p className="text-xs text-gray-500">
              还没有未解决的错题，继续保持！
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentMistakes.map((m) => (
              <Link
                key={m.id}
                href="/review"
                className="block bg-white dark:bg-gray-800 rounded-lg p-2.5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                    ×{m.wrongCount}
                  </span>
                  <p className="text-xs text-gray-700 flex-1 line-clamp-2">
                    {m.questionText}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ============ 5. 底部：打卡状态 + 迷你热力图 + 继续学习 ============ */}
      <section className="mb-4">
        {/* 迷你热力图（最近 7 天） */}
        <h2 className="text-sm font-medium text-gray-500 mb-2">最近 7 天</h2>
        <div className="flex gap-1">
          {heatmapData.map((d) => (
            <div key={d.date} className="flex-1 text-center">
              <div
                className={`h-12 rounded ${heatColor(d.minutes)} flex items-end justify-center pb-1`}
              >
                {d.minutes > 0 && (
                  <span className="text-xs text-white font-medium">{d.minutes}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{d.date.slice(5)}</p>
            </div>
          ))}
        </div>

        {/* 继续学习入口 */}
        {latestPlan && (
          <Link
            href={`/learn/${latestPlan.id}`}
            className="mt-3 flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
              <Icon name="book" className="w-4 h-4" />
              继续学习：{latestPlan.topic}
            </span>
            <Icon
              name="chevron-right"
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
            />
          </Link>
        )}

        {/* 快捷入口 */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Link
            href="/learn"
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl p-4 text-center font-medium flex flex-col items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Icon name="book" className="w-5 h-5" />
            <span className="text-sm">学习</span>
          </Link>
          <Link
            href="/review"
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 text-center font-medium flex flex-col items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="repeat" className="w-5 h-5" />
            <span className="text-sm">复习</span>
          </Link>
          <Link
            href="/chat"
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 text-center font-medium flex flex-col items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="chat" className="w-5 h-5" />
            <span className="text-sm">AI 聊天</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
