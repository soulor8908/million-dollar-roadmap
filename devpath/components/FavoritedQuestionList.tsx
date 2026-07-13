"use client";

import type { Question } from "@/lib/types";

interface FavoritedQuestionListProps {
  questions: Question[];
}

export function FavoritedQuestionList({ questions }: FavoritedQuestionListProps) {
  if (questions.length === 0) {
    return <p className="text-center text-gray-400 py-8">还没有收藏的单题</p>;
  }
  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <div key={q.id} className="border rounded-lg p-3">
          <p className="text-sm font-medium">{q.question}</p>
          {q.keyPoints.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {q.keyPoints.map((kp, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {kp}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
