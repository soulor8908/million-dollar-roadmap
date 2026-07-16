"use client";

// app/emotion/page.tsx
// 情绪日记：查看历史情绪记录 + 添加新的情绪觉察条目
// 数据存储在 IndexedDB（emotion:<date>_<id>），通过 sync 同步到云端

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import { getItem, setItem, listItems, delItem } from "@/lib/storage/db";
import {
  KEY_PREFIXES,
  type EmotionEntry,
  type EmotionTag,
  type DopamineTrigger,
} from "@/lib/types";
import { chinaDateNow } from "@/lib/time";
import { scheduleAutoSync } from "@/lib/sync";
import { Icon } from "@/components/Icon";

const EMOTION_OPTIONS: Array<{ tag: EmotionTag; emoji: string }> = [
  { tag: "焦虑", emoji: "😰" },
  { tag: "兴奋", emoji: "🤩" },
  { tag: "疲惫", emoji: "😪" },
  { tag: "烦躁", emoji: "😤" },
  { tag: "满足", emoji: "😊" },
  { tag: "冲动", emoji: "冲动" },
  { tag: "平静", emoji: "😌" },
  { tag: "沮丧", emoji: "😞" },
];

const DOPAMINE_OPTIONS: DopamineTrigger[] = ["无", "刷手机", "游戏", "短视频", "甜食", "其他"];

function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getEmojiForTag(tag: EmotionTag): string {
  return EMOTION_OPTIONS.find((o) => o.tag === tag)?.emoji ?? "❓";
}

export default function EmotionPage() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // 表单状态
  const [tag, setTag] = useState<EmotionTag>("平静");
  const [trigger, setTrigger] = useState("");
  const [impact, setImpact] = useState("");
  const [coping, setCoping] = useState("");
  const [dopamine, setDopamine] = useState<DopamineTrigger>("无");
  const [saving, setSaving] = useState(false);

  const loadEntries = useCallback(async () => {
    const all = await listItems<EmotionEntry>(KEY_PREFIXES.EMOTION);
    all.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });
    setEntries(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const resetForm = () => {
    setTag("平静");
    setTrigger("");
    setImpact("");
    setCoping("");
    setDopamine("无");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entry: EmotionEntry = {
        id: nanoid(),
        date: chinaDateNow(),
        time: nowTime(),
        tag,
        emoji: getEmojiForTag(tag),
        trigger: trigger.trim(),
        impact: impact.trim(),
        coping: coping.trim(),
        dopamine,
      };
      await setItem(`${KEY_PREFIXES.EMOTION}${entry.date}_${entry.id}`, entry);
      await loadEntries();
      resetForm();
      setShowForm(false);
      scheduleAutoSync();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: EmotionEntry) => {
    if (!confirm("确定删除这条情绪记录？")) return;
    await delItem(`${KEY_PREFIXES.EMOTION}${entry.date}_${entry.id}`);
    await loadEntries();
    scheduleAutoSync();
  };

  // 按日期分组
  const groupedByDate: Record<string, EmotionEntry[]> = {};
  for (const e of entries) {
    if (!groupedByDate[e.date]) groupedByDate[e.date] = [];
    groupedByDate[e.date].push(e);
  }
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  // 统计
  const tagCounts: Record<string, number> = {};
  for (const e of entries) {
    tagCounts[e.tag] = (tagCounts[e.tag] ?? 0) + 1;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20 flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="heart" className="w-6 h-6 text-red-400" />
          <h1 className="text-2xl font-bold">情绪日记</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Icon name="plus" className="w-4 h-4" />
          {showForm ? "取消" : "记录情绪"}
        </button>
      </div>

      {/* 添加表单 */}
      {showForm && (
        <div className="mb-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              此刻的情绪
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_OPTIONS.map((opt) => (
                <button
                  key={opt.tag}
                  type="button"
                  onClick={() => setTag(opt.tag)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    tag === opt.tag
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                >
                  {opt.emoji} {opt.tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              触发原因（什么事引发了这种情绪？）
            </label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="如：被领导批评了 / 完成了一个难题 / 刷了半小时短视频"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              影响（对身体/行为/状态有什么影响？）
            </label>
            <input
              type="text"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="如：心慌、无法集中注意力"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              应对方式（打算怎么处理？）
            </label>
            <input
              type="text"
              value={coping}
              onChange={(e) => setCoping(e.target.value)}
              placeholder="如：深呼吸 3 次 / 去散步 10 分钟"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              多巴胺干扰来源
            </label>
            <div className="flex flex-wrap gap-2">
              {DOPAMINE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDopamine(opt)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    dopamine === opt
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-orange-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      )}

      {/* 统计概览 */}
      {entries.length > 0 && (
        <div className="mb-6 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Icon name="chart" className="w-4 h-4 inline-block align-middle" /> 情绪分布（共 {entries.length} 条）
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tagCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([t, count]) => (
                <span
                  key={t}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {getEmojiForTag(t as EmotionTag)} {t} {count}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 mx-auto">
            <Icon name="heart" className="w-8 h-8 text-gray-400" />
          </div>
          <p className="mb-2">还没有情绪记录</p>
          <p className="text-sm">点击右上角「记录情绪」开始觉察</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-xs text-gray-400 mb-2 font-medium">{date}</h3>
              <div className="space-y-2">
                {groupedByDate[date].map((entry) => (
                  <div
                    key={entry.id}
                    className="group rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{entry.emoji}</span>
                        <span className="text-sm font-medium">{entry.tag}</span>
                        <span className="text-xs text-gray-400">{entry.time}</span>
                        {entry.dopamine !== "无" && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            {entry.dopamine}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1"
                        aria-label="删除"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                    {(entry.trigger || entry.impact || entry.coping) && (
                      <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        {entry.trigger && <p><Icon name="pin" className="w-4 h-4 inline-block align-middle" /> 触发：{entry.trigger}</p>}
                        {entry.impact && <p><Icon name="zap" className="w-4 h-4 inline-block align-middle" /> 影响：{entry.impact}</p>}
                        {entry.coping && <p><Icon name="check-circle" className="w-4 h-4 inline-block align-middle" /> 应对：{entry.coping}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部快捷入口 */}
      <div className="mt-6 flex gap-2">
        <Link
          href="/daily"
          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Icon name="calendar" className="w-4 h-4 inline-block align-middle" /> 每日日志
        </Link>
        <Link
          href="/"
          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Icon name="home" className="w-4 h-4 inline-block align-middle" /> 首页
        </Link>
      </div>
    </div>
  );
}
