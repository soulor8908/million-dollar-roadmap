"use client";

// app/emotion/page.tsx
// P3 情绪简化 — 1 秒觉察 + AI 应对
// 重构自旧版 5 字段（trigger/impact/coping/...）→ 新版 4 步流程
// 旧数据兼容：读取时若旧字段存在，UI 降级展示为单行文本

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { EmotionRecorder } from "@/components/EmotionRecorder";
import { Icon } from "@/components/Icon";
import { listItems, delItem } from "@/lib/storage/db";
import { KEY_PREFIXES, type EmotionEntry } from "@/lib/types";

// 历史条目降级读取：兼容旧数据（trigger/impact/coping 字段）
function getDisplayReason(entry: EmotionEntry): string {
  if (entry.reason) return entry.reason;
  // 旧数据兼容
  const parts: string[] = [];
  if (entry.trigger) parts.push(`原因: ${entry.trigger}`);
  if (entry.impact) parts.push(`影响: ${entry.impact}`);
  return parts.join(" / ");
}

function getDisplayCoping(entry: EmotionEntry): string {
  // 新数据：选中建议 + 自定义
  const parts: string[] = [];
  if (entry.selectedCoping?.length > 0) parts.push(entry.selectedCoping.join("、"));
  if (entry.customCoping) parts.push(entry.customCoping);
  if (parts.length > 0) return parts.join(" + ");

  // 旧数据
  if (entry.coping) return entry.coping;
  return "";
}

// 按日期分组
function groupByDate(entries: EmotionEntry[]): Array<{ date: string; items: EmotionEntry[] }> {
  const groups = new Map<string, EmotionEntry[]>();
  for (const e of entries) {
    if (!groups.has(e.date)) groups.set(e.date, []);
    groups.get(e.date)!.push(e);
  }
  return Array.from(groups.entries())
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function EmotionPage() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    const list = await listItems<EmotionEntry>(KEY_PREFIXES.EMOTION);
    list.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });
    setEntries(list);
  }, []);

  useEffect(() => {
    (async () => {
      await loadEntries();
      setLoading(false);
    })();
  }, [loadEntries]);

  const handleDelete = async (entry: EmotionEntry) => {
    if (!confirm("确定删除这条情绪记录？")) return;
    await delItem(`${KEY_PREFIXES.EMOTION}${entry.date}_${entry.id}`);
    await loadEntries();
  };

  const grouped = groupByDate(entries);

  // 统计 8 种情绪出现次数
  const tagCounts = new Map<string, number>();
  for (const e of entries) {
    tagCounts.set(e.tag, (tagCounts.get(e.tag) ?? 0) + 1);
  }

  return (
    <main className="max-w-2xl mx-auto p-4 pb-20 space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Icon name="heart" className="w-5 h-5 text-pink-500" />
          情绪日记
        </h1>
        <Link href="/" className="text-xs text-gray-500 hover:text-blue-500">
          返回今日
        </Link>
      </div>

      {/* 录入卡片 */}
      <EmotionRecorder onSaved={loadEntries} />

      {/* 统计 */}
      {entries.length > 0 && (
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">情绪分布（{entries.length} 条）</p>
          <div className="flex flex-wrap gap-1.5">
            {Array.from(tagCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([tag, count]) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {tag} {count}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* 历史列表 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">历史记录</h2>
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-8">加载中...</div>
        ) : grouped.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            还没有记录，先用上面的卡片记一次吧
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map((group) => (
              <div key={group.date}>
                <p className="text-xs text-gray-500 mb-1.5">{group.date}</p>
                <div className="space-y-2">
                  {group.items.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-lg p-3 relative group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{entry.emoji}</span>
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
                          {getDisplayReason(entry) && (
                            <p className="text-sm text-gray-600 mt-1">
                              {getDisplayReason(entry)}
                            </p>
                          )}
                          {getDisplayCoping(entry) && (
                            <p className="text-xs text-green-700 mt-1">
                              应对：{getDisplayCoping(entry)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(entry)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="删除"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
