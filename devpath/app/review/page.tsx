"use client";

import { useState, useEffect, useCallback } from "react";
import { get, set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import type { ReviewCard, ReviewLog, Rating } from "@/lib/types";
import { getDueCards } from "@/lib/fsrs";
import { ReviewCardView } from "@/components/ReviewCardView";

export default function ReviewPage() {
  const [dueCards, setDueCards] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ again: number; hard: number; good: number; easy: number }>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [finished, setFinished] = useState(false);

  const loadCards = useCallback(async () => {
    const allKeys = await get<string[]>("all_card_keys").then((k) => k || []);
    // 从 IndexedDB 读所有卡片
    const cards: ReviewCard[] = [];
    for (const key of allKeys) {
      if (key.startsWith(KEY_PREFIXES.CARD)) {
        const card = await get<ReviewCard>(key);
        if (card) cards.push(card);
      }
    }
    const due = getDueCards(cards);
    setDueCards(due);
    setLoading(false);
    if (due.length === 0) {
      setFinished(true);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  async function handleRate(rating: Rating) {
    const card = dueCards[currentIndex];
    if (!card) return;

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, rating }),
      });
      if (!res.ok) return;
      const { card: updatedCard, log } = (await res.json()) as {
        card: ReviewCard;
        log: ReviewLog;
      };

      // 存回 IndexedDB
      await set(KEY_PREFIXES.CARD + updatedCard.id, updatedCard);
      await set(KEY_PREFIXES.REVIEW_LOG + log.id, log);

      // 更新统计
      setStats((prev) => ({
        ...prev,
        again: prev.again + (rating === 1 ? 1 : 0),
        hard: prev.hard + (rating === 2 ? 1 : 0),
        good: prev.good + (rating === 3 ? 1 : 0),
        easy: prev.easy + (rating === 4 ? 1 : 0),
      }));

      // 下一张
      if (currentIndex + 1 >= dueCards.length) {
        setFinished(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch {
      // 静默失败
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">加载复习卡片...</p>
      </div>
    );
  }

  if (finished) {
    const total = stats.again + stats.hard + stats.good + stats.easy;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-xl font-bold mb-2">
          {total === 0 ? "今天没有需要复习的卡片" : "复习完成！"}
        </h1>
        {total > 0 && (
          <div className="mt-4 space-y-1 text-sm">
            <p>😕 Again: {stats.again}</p>
            <p>😐 Hard: {stats.hard}</p>
            <p>🙂 Good: {stats.good}</p>
            <p>😎 Easy: {stats.easy}</p>
            <p className="font-medium mt-2">总计: {total} 张</p>
          </div>
        )}
      </div>
    );
  }

  const card = dueCards[currentIndex];
  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          {currentIndex + 1} / {dueCards.length} 今日待复习
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
          />
        </div>
      </div>
      <ReviewCardView card={card} onRate={handleRate} />
    </div>
  );
}
