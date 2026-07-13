"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  onFavoriteToggle?: (questionId: string) => void;
}

export function QuestionCard({ question, onFavoriteToggle }: Props) {
  const [expanded, setExpanded] = useState(false);

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

      {!expanded && question.answer && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-blue-500 mt-1"
        >
          展开答案 ▼
        </button>
      )}
    </div>
  );
}
