"use client";

import type { FavoriteDeck } from "@/lib/types";

interface FavoriteDeckCardProps {
  deck: FavoriteDeck;
  expanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  onStartReview: () => void;
}

export function FavoriteDeckCard({
  deck,
  expanded,
  onToggleExpand,
  onDelete,
  onStartReview,
}: FavoriteDeckCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium">{deck.topic}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {deck.questionCount} 题 ·{" "}
            {new Date(deck.favoritedAt).toLocaleDateString("zh-CN")}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onStartReview}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
        >
          开始复习
        </button>
        <button
          onClick={onToggleExpand}
          className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200"
        >
          {expanded ? "收起" : "查看题目"}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100"
        >
          删除
        </button>
      </div>
      {expanded && (
        <div className="mt-3 space-y-2">
          {deck.questions.map((q, i) => (
            <div key={q.id} className="text-sm border-l-2 border-gray-200 pl-2">
              <p className="font-medium">
                {i + 1}. {q.question}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {q.answer.slice(0, 80)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
