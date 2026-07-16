"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/types";
import { AnswerContent, CodeBlock } from "@/components/CodeBlock";
import { trackAIFeedback } from "@/lib/ai/quality-tracker";
import { Icon } from "@/components/Icon";

interface Props {
  question: Question;
  onFavoriteToggle?: (questionId: string) => void;
  onRegenerate?: (questionId: string) => void;
  regenerating?: boolean;
  onFollowUpClick?: (followUp: string) => void;
}

export function QuestionCard({ question, onFavoriteToggle, onRegenerate, regenerating, onFollowUpClick }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const isFailed = question.question === "生成失败，点击重试";

  // 隐式反馈：记录用户对这道题的行为（仅当有 aiCallId 时触发，老题目静默跳过）
  const trackImplicit = (implicitAction: "expanded" | "followed_up" | "favorited") => {
    if (!question.aiCallId) return;
    void trackAIFeedback({
      callRecordId: question.aiCallId,
      scene: "question_generate",
      implicitAction,
    });
  };

  const handleFollowUpClick = (fu: string) => {
    trackImplicit("followed_up");
    if (onFollowUpClick) {
      onFollowUpClick(fu);
    } else {
      router.push(`/chat?prefill=${encodeURIComponent(fu)}&sourceType=question&sourceId=${question.id}&sourceTitle=${encodeURIComponent(question.question)}`);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start gap-2">
        <button
          onClick={() => {
            if (!expanded) trackImplicit("expanded");
            setExpanded(!expanded);
          }}
          className="flex-1 text-left text-sm font-medium hover:text-blue-600"
        >
          {question.bigTech && (
            <span className="inline-block px-1.5 py-0.5 mr-2 text-[10px] bg-amber-100 text-amber-700 rounded font-medium align-middle">
              <Icon name="building" className="w-3 h-3 inline-block align-middle" /> 大厂
            </span>
          )}
          {question.question}
        </button>
        {onFavoriteToggle && (
          <button
            onClick={() => {
              if (!question.favorited) trackImplicit("favorited");
              onFavoriteToggle(question.id);
            }}
            className={`text-lg ${question.favorited ? "text-yellow-500" : "text-gray-300"}`}
            aria-label="收藏"
          >
            <Icon name="star" className="w-5 h-5" />
          </button>
        )}
      </div>

      {expanded && question.answer && (
        <div className="mt-3 space-y-2">
          <AnswerContent text={question.answer} />
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
              <p className="text-xs font-medium text-gray-500 mt-2">追问（点击向 AI 提问）：</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {question.followUps.map((fu, i) => (
                  <button
                    key={i}
                    onClick={() => handleFollowUpClick(fu)}
                    className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors border border-blue-100"
                    title="点击进入 AI 聊天"
                  >
                    <Icon name="message-circle" className="w-3.5 h-3.5 inline-block align-middle" /> {fu}
                  </button>
                ))}
              </div>
            </div>
          )}
          {question.codeSnippet && (
            <CodeBlock code={question.codeSnippet} language="javascript" />
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
            onClick={() => {
              // 隐式反馈：用户主动换题 = 对当前题目不满意
              if (question.aiCallId && !isFailed) {
                void trackAIFeedback({
                  callRecordId: question.aiCallId,
                  scene: "question_generate",
                  action: "regenerated",
                });
              }
              onRegenerate(question.id);
            }}
            disabled={regenerating}
            className={`text-xs ml-auto px-2 py-1 rounded ${
              isFailed
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            } disabled:opacity-50`}
          >
            {regenerating ? "生成中..." : (<><Icon name="refresh-cw" className="w-3.5 h-3.5 inline-block align-middle" /> {isFailed ? "重新生成" : "换一题"}</>)}
          </button>
        )}
      </div>
    </div>
  );
}
