"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  onFavoriteToggle?: (questionId: string) => void;
  onRegenerate?: (questionId: string) => void;
  regenerating?: boolean;
}

export function QuestionCard({ question, onFavoriteToggle, onRegenerate, regenerating }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isFailed = question.question === "生成失败，点击重试";

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 text-left text-sm font-medium hover:text-blue-600"
        >
          {question.question}
        </button>
        {onFavoriteToggle && (
          <button
            onClick={() => onFavoriteToggle(question.id)}
            className={`text-lg ${question.favorited ? "text-yellow-500" : "text-gray-300"}`}
            aria-label="收藏"
          >
            {question.favorited ? "⭐" : "☆"}
          </button>
        )}
      </div>

      {expanded && question.answer && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {question.answer}
          </div>
          {question.keyPoints.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mt-2">关键点：</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {question.keyPoints.map((kp, i) => (
                  <li key={i}>{kp}</li>
                ))}
              </ul>
            </div>
          )}
          {question.followUps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mt-2">追问：</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {question.followUps.map((fu, i) => (
                  <li key={i}>{fu}</li>
                ))}
              </ul>
            </div>
          )}
          {question.codeSnippet && (
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded mt-2 overflow-x-auto">
              <code>{question.codeSnippet}</code>
            </pre>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        {!expanded && question.answer && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-blue-500"
          >
            展开答案 ▼
          </button>
        )}
        {onRegenerate && (
          <button
            onClick={() => onRegenerate(question.id)}
            disabled={regenerating}
            className={`text-xs ml-auto px-2 py-1 rounded ${
              isFailed
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            } disabled:opacity-50`}
          >
            {regenerating ? "生成中..." : isFailed ? "🔄 重新生成" : "🔄 换一题"}
          </button>
        )}
      </div>
    </div>
  );
}
